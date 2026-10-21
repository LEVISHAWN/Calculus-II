import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        trust: true,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="text-rose-400 font-mono text-sm">${math}</span>`;
    }
  }, [math, block]);

  return (
    <span
      className={`${block ? 'block text-center my-2 overflow-x-auto py-1' : 'inline-block align-middle'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
