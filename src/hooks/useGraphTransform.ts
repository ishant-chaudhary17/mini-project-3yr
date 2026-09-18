import { useState, useCallback, useRef, useEffect } from 'react';

type Transform = {
  x: number;
  y: number;
  k: number;
};

export function useGraphTransform(svgRef: React.RefObject<SVGSVGElement>) {
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, k: 1 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());

    const scaleAdjust = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(t => {
      const newK = Math.max(0.1, Math.min(4, t.k * scaleAdjust));
      // Zoom towards mouse
      const newX = svgP.x - (svgP.x - t.x) * (newK / t.k);
      const newY = svgP.y - (svgP.y - t.y) * (newK / t.k);
      return { x: newX, y: newY, k: newK };
    });
  }, [svgRef]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.target instanceof SVGElement && e.target.tagName !== 'svg') {
       // if clicking on a node, don't start pan
       // actually, just check if it's the background
       const classList = e.target.classList;
       if (!classList.contains('graph-bg')) return;
    }
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    setTransform(t => ({
      ...t,
      x: t.x + dx / t.k,
      y: t.y + dy / t.k
    }));
  }, []);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg) {
      svg.addEventListener('wheel', handleWheel, { passive: false });
      return () => svg.removeEventListener('wheel', handleWheel);
    }
  }, [svgRef, handleWheel]);

  const zoomIn = useCallback(() => setTransform(t => ({ ...t, k: Math.min(4, t.k * 1.2) })), []);
  const zoomOut = useCallback(() => setTransform(t => ({ ...t, k: Math.max(0.1, t.k / 1.2) })), []);
  const reset = useCallback(() => setTransform({ x: 0, y: 0, k: 1 }), []);
  
  // Fit is a bit complex without knowing bounds, we just reset for now or slightly scale down
  const fit = useCallback(() => setTransform({ x: 0, y: 0, k: 0.8 }), []);

  return {
    transform,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
    },
    zoomIn,
    zoomOut,
    reset,
    fit
  };
}
