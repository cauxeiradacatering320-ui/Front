'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react';

const HANDLE_SIZE = 10;

const HANDLE_CURSORS: Record<string, string> = {
  'nw': 'nw-resize',
  'n': 'n-resize',
  'ne': 'ne-resize',
  'e': 'e-resize',
  'se': 'se-resize',
  's': 's-resize',
  'sw': 'sw-resize',
  'w': 'w-resize',
};

const HANDLE_POSITIONS: Record<string, { top?: string; right?: string; bottom?: string; left?: string }> = {
  'nw': { top: '0', left: '0' },
  'n': { top: '0', left: '50%' },
  'ne': { top: '0', right: '0' },
  'e': { top: '50%', right: '0' },
  'se': { bottom: '0', right: '0' },
  's': { bottom: '0', left: '50%' },
  'sw': { bottom: '0', left: '0' },
  'w': { top: '50%', left: '0' },
};

export function ResizableImageComponent({ node, updateAttributes, selected, editor }: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeData = useRef<{ startX: number; startY: number; startW: number; startH: number; handle: string } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.preventDefault();
    e.stopPropagation();

    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    resizeData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: rect.width,
      startH: rect.height,
      handle,
    };
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const onMouseMove = (e: MouseEvent) => {
      const data = resizeData.current;
      if (!data) return;

      const dx = e.clientX - data.startX;
      const dy = e.clientY - data.startY;

      let newW = data.startW;
      let newH = data.startH;

      if (data.handle.includes('e')) newW = data.startW + dx;
      if (data.handle.includes('w')) newW = data.startW - dx;
      if (data.handle.includes('s')) newH = data.startH + dy;
      if (data.handle.includes('n')) newH = data.startH - dy;

      const aspect = data.startW / data.startH;
      if (data.handle === 'se' || data.handle === 'nw') {
        const ratio = newW / data.startW;
        newH = data.startH * ratio;
      } else if (data.handle === 'ne' || data.handle === 'sw') {
        const ratio = newH / data.startH;
        newW = data.startW * ratio;
      }

      if (newW < 50) newW = 50;
      if (newH < 30) newH = 30;

      updateAttributes({ width: Math.round(newW) });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      resizeData.current = null;
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, updateAttributes]);

  const src = node.attrs.src as string;
  const width = node.attrs.width as string | undefined;

  return (
    <NodeViewWrapper className="relative inline-block leading-none" style={{ maxWidth: '100%' }}>
      <div
        ref={containerRef}
        className={`relative ${selected ? 'ring-2 ring-blue-500 rounded' : ''}`}
      >
        <img
          ref={imgRef}
          src={src}
          alt=""
          draggable={false}
          style={{
            width: width ? `${width}px` : '100%',
            height: 'auto',
            maxWidth: '100%',
            display: 'block',
          }}
        />

        {selected && !isResizing && (
          <>
            <div className="absolute inset-0 bg-blue-500/10 pointer-events-none rounded" />
            {Object.entries(HANDLE_POSITIONS).map(([pos, styles]) => (
              <div
                key={pos}
                onMouseDown={(e) => onMouseDown(e, pos)}
                style={{
                  position: 'absolute',
                  width: HANDLE_SIZE,
                  height: HANDLE_SIZE,
                  cursor: HANDLE_CURSORS[pos],
                  transform: pos.includes('n') || pos.includes('s')
                    ? 'translateX(-50%)'
                    : pos.includes('w') || pos.includes('e')
                    ? 'translateY(-50%)'
                    : 'translate(-50%, -50%)',
                  ...styles,
                }}
                className="bg-white border-2 border-blue-500 rounded-sm z-10"
              />
            ))}
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
