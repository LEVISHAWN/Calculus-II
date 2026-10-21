import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Radio,
  Sparkles,
  AlertCircle,
  Square,
  Activity,
  Terminal,
} from 'lucide-react';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTopicTitle?: string;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  currentTopicTitle,
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Helper: Convert Float32Array PCM (-1.0 to 1.0) to 16-bit PCM base64 string
  const pcmFloat32ToBase64 = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Helper: Playback 24kHz PCM chunk received from model
  const playAudioChunk = (base64Data: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const audioCtx = outputAudioCtxRef.current;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const binary = atob(base64Data);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const buffer = audioCtx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      const startTime = Math.max(now, nextPlayTimeRef.current);
      source.start(startTime);
      nextPlayTimeRef.current = startTime + buffer.duration;

      setIsModelSpeaking(true);
      source.onended = () => {
        if (audioCtx.currentTime >= nextPlayTimeRef.current - 0.05) {
          setIsModelSpeaking(false);
        }
      };
    } catch (err) {
      console.error('Audio chunk playback error:', err);
    }
  };

  const startSession = async () => {
    setErrorMessage(null);
    setTranscript(['Connecting to Gemini 3.8 Live API...']);

    try {
      // Connect to WebSocket
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log('Connected to Live audio bridge');
        setIsConnected(true);
        setTranscript((prev) => [...prev, 'Connected! Initializing microphone...']);

        // Request microphone access
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
            },
          });
          micStreamRef.current = stream;

          const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
          inputAudioCtxRef.current = inputAudioCtx;

          const source = inputAudioCtx.createMediaStreamSource(stream);
          const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
          scriptProcessorRef.current = processor;

          source.connect(processor);
          processor.connect(inputAudioCtx.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN && isMicActive) {
              const inputData = e.inputBuffer.getChannelData(0);
              const base64 = pcmFloat32ToBase64(inputData);
              ws.send(JSON.stringify({ audio: base64 }));
            }
          };

          setIsMicActive(true);
          setTranscript((prev) => [
            ...prev,
            'Live voice session ready! Speak freely to discuss Calculus 2 & CS.',
          ]);

          // Send initial greeting prompt context
          ws.send(
            JSON.stringify({
              text: `Hello! I am a BSc Computer Science student currently learning ${
                currentTopicTitle || 'Calculus 2 integration'
              }. Please introduce yourself briefly as my voice mentor and ask what integration problem or concept I'd like to talk through.`,
            })
          );
        } catch (micErr: any) {
          console.error('Mic access error:', micErr);
          setErrorMessage('Microphone access denied or unavailable: ' + micErr.message);
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            playAudioChunk(msg.audio);
          }
          if (msg.text) {
            setTranscript((prev) => [...prev, `Ada (Live): ${msg.text}`]);
          }
          if (msg.interrupted) {
            console.log('Model speech interrupted by user speech');
            setIsModelSpeaking(false);
            nextPlayTimeRef.current = outputAudioCtxRef.current?.currentTime || 0;
          }
          if (msg.error) {
            setErrorMessage(msg.error);
          }
        } catch (parseErr) {
          console.error('Error parsing live WS message:', parseErr);
        }
      };

      ws.onerror = (e) => {
        console.error('Live WS error:', e);
        setErrorMessage('WebSocket connection error. Please ensure dev server is running.');
      };

      ws.onclose = () => {
        console.log('Live WS closed');
        setIsConnected(false);
        setIsMicActive(false);
        setIsModelSpeaking(false);
      };
    } catch (err: any) {
      console.error('Failed to start Live session:', err);
      setErrorMessage(err.message || 'Failed to start Live voice session');
    }
  };

  const stopSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    setIsConnected(false);
    setIsMicActive(false);
    setIsModelSpeaking(false);
    nextPlayTimeRef.current = 0;
  };

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => {
      stopSession();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white rounded-xl shadow-lg shadow-cyan-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">Gemini 3.8 Live Voice Session</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                  gemini-3.8-live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time bi-directional voice audio • Low latency
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visualizer Area */}
        <div className="p-8 flex flex-col items-center justify-center text-center bg-slate-950/40 relative overflow-hidden">
          {/* Animated Glow Rings */}
          <div className="relative flex items-center justify-center my-6">
            <div
              className={`absolute w-36 h-36 rounded-full transition-all duration-300 ${
                isModelSpeaking
                  ? 'bg-cyan-500/30 scale-125 blur-xl animate-pulse'
                  : isMicActive
                  ? 'bg-indigo-500/20 scale-110 blur-lg animate-pulse'
                  : 'bg-slate-800/40 scale-95 blur-md'
              }`}
            />
            <div
              className={`absolute w-28 h-28 rounded-full border border-dashed transition-all duration-500 ${
                isModelSpeaking
                  ? 'border-cyan-400 animate-spin'
                  : isMicActive
                  ? 'border-indigo-400/80 animate-spin'
                  : 'border-slate-700'
              }`}
              style={{ animationDuration: '8s' }}
            />

            <button
              onClick={() => setIsMicActive(!isMicActive)}
              className={`w-20 h-20 rounded-full flex items-center justify-center z-10 transition-all duration-300 shadow-xl ${
                isModelSpeaking
                  ? 'bg-gradient-to-tr from-cyan-500 to-sky-400 text-slate-950 shadow-cyan-500/40 scale-105'
                  : isMicActive
                  ? 'bg-indigo-600 text-white shadow-indigo-500/40 ring-4 ring-indigo-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {isModelSpeaking ? (
                <Volume2 className="w-8 h-8 animate-bounce" />
              ) : isMicActive ? (
                <Mic className="w-8 h-8 animate-pulse" />
              ) : (
                <MicOff className="w-8 h-8" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="mt-2 text-center">
            <div className="flex items-center justify-center gap-2 text-sm font-semibold">
              {isModelSpeaking ? (
                <span className="text-cyan-300 flex items-center gap-1.5 font-mono">
                  <Activity className="w-4 h-4 animate-pulse" /> Ada is speaking...
                </span>
              ) : isMicActive ? (
                <span className="text-indigo-300 flex items-center gap-1.5 font-mono">
                  <Mic className="w-4 h-4 text-emerald-400" /> Listening to you... (Speak now)
                </span>
              ) : (
                <span className="text-slate-500 font-mono">Microphone Muted</span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              You can speak naturally at any time. Start talking to interrupt the model just like a
              real conversation.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-start gap-2 max-w-sm text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Live Audio Transcript Stream */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 max-h-40 overflow-y-auto space-y-1.5 font-mono text-xs">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" /> Live Stream Log
          </div>
          {transcript.map((line, idx) => (
            <div key={idx} className="text-slate-300 text-[11px] leading-relaxed">
              {line}
            </div>
          ))}
        </div>

        {/* Controls Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            onClick={() => setIsMicActive(!isMicActive)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isMicActive
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isMicActive ? (
              <>
                <MicOff className="w-4 h-4" /> Mute Microphone
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" /> Unmute Microphone
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600/20 text-rose-300 border border-rose-500/40 hover:bg-rose-600/30 transition-colors flex items-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> End Call
          </button>
        </div>
      </div>
    </div>
  );
};
