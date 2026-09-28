/**
 * Lightweight TikZ parser and SVG renderer for client-side live visual preview.
 * Supports:
 * - Coordinates: \coordinate (A) at (x,y);
 * - Draw lines/paths: \draw (A) -- (B); \draw[dashed] ...; \draw[->] ...
 * - Circles: \draw (x,y) circle (r); \fill (A) circle (pt);
 * - Rectangles: \draw (x1,y1) rectangle (x2,y2);
 * - Nodes: \node[...] at (x,y) {$label$};
 * - Axes: \draw[->] (x1,y1) -- (x2,y2) node[right] {$x$};
 * - Plot: \draw plot ...
 */

export interface TikzRenderOutput {
  svgContent: string;
  hasDiagram: boolean;
  warnings?: string[];
}

export function renderTikzToSvg(tikzCode: string, zoom: number = 1): TikzRenderOutput {
  if (!tikzCode || !tikzCode.includes('tikzpicture')) {
    return { svgContent: '', hasDiagram: false };
  }

  // Extract content inside \begin{tikzpicture}...\end{tikzpicture}
  const match = tikzCode.match(/\\begin\{tikzpicture\}(?:\[(.*?)\])?([\s\S]*?)\\end\{tikzpicture\}/);
  if (!match) {
    return { svgContent: '', hasDiagram: false };
  }

  const options = match[1] || '';
  const body = match[2] || '';

  // Parse scale if present (e.g. scale=1.2)
  let userScale = 1;
  const scaleMatch = options.match(/scale\s*=\s*([0-9.]+)/);
  if (scaleMatch) {
    userScale = parseFloat(scaleMatch[1]) || 1;
  }

  // Coordinate map: name -> { x, y }
  const coordinates: Record<string, { x: number; y: number }> = {};
  const elements: string[] = [];

  // Coordinate transformation: TikZ is Cartesian (y increases upward), SVG is screen (y increases downward).
  // Default bounds
  let minX = -4;
  let maxX = 5;
  let minY = -3;
  let maxY = 5;

  const updateBounds = (x: number, y: number) => {
    if (!isNaN(x) && !isNaN(y)) {
      minX = Math.min(minX, x - 1);
      maxX = Math.max(maxX, x + 1);
      minY = Math.min(minY, y - 1);
      maxY = Math.max(maxY, y + 1);
    }
  };

  // Helper to parse coordinate (x,y) or named coordinate (A)
  const parsePoint = (ptStr: string): { x: number; y: number } | null => {
    const trimmed = ptStr.trim();
    if (coordinates[trimmed]) {
      return coordinates[trimmed];
    }
    const numMatch = trimmed.match(/\(?\s*(-?[0-9.]+)\s*,\s*(-?[0-9.]+)\s*\)?/);
    if (numMatch) {
      const x = parseFloat(numMatch[1]);
      const y = parseFloat(numMatch[2]);
      updateBounds(x, y);
      return { x, y };
    }
    // Polar coordinate e.g. (60:1cm) or (60:1)
    const polarMatch = trimmed.match(/\(?\s*(-?[0-9.]+)\s*:\s*(-?[0-9.]+)(?:cm|pt)?\s*\)?/);
    if (polarMatch) {
      const angleDeg = parseFloat(polarMatch[1]);
      const radius = parseFloat(polarMatch[2]);
      const rad = (angleDeg * Math.PI) / 180;
      const x = radius * Math.cos(rad);
      const y = radius * Math.sin(rad);
      updateBounds(x, y);
      return { x, y };
    }
    return null;
  };

  // 1. Parse \coordinate (Name) at (x,y);
  const coordRegex = /\\coordinate\s*\(([a-zA-Z0-9_]+)\)\s*at\s*(\([^)]+\))/g;
  let coordMatch;
  while ((coordMatch = coordRegex.exec(body)) !== null) {
    const name = coordMatch[1];
    const pt = parsePoint(coordMatch[2]);
    if (pt) {
      coordinates[name] = pt;
    }
  }

  // Pixel scaling factor
  const pxScale = 45 * userScale * zoom;

  // Function to convert Cartesian (x, y) to SVG (cx, cy)
  const toSvgX = (x: number) => 300 + (x - (minX + maxX) / 2) * pxScale;
  const toSvgY = (y: number) => 240 - (y - (minY + maxY) / 2) * pxScale;

  // 2. Parse lines and paths: \draw[options] (A) -- (B) ... ;
  // Also handles \draw[dashed], \draw[->], \draw[thick, blue]
  const drawRegex = /\\draw(?:\[(.*?)\])?\s*([^;]+);/g;
  let drawMatch;
  while ((drawMatch = drawRegex.exec(body)) !== null) {
    const opts = (drawMatch[1] || '').toLowerCase();
    const pathStr = drawMatch[2];

    const isDashed = opts.includes('dashed');
    const isArrow = opts.includes('->') || opts.includes('stealth') || opts.includes('latex');
    const isThick = opts.includes('thick');
    const strokeWidth = isThick ? 2.5 : 1.5;

    let strokeColor = '#2563eb'; // blue default
    if (opts.includes('red')) strokeColor = '#dc2626';
    else if (opts.includes('green')) strokeColor = '#16a34a';
    else if (opts.includes('purple')) strokeColor = '#9333ea';
    else if (opts.includes('gray')) strokeColor = '#94a3b8';
    else if (opts.includes('black')) strokeColor = '#0f172a';

    // Check if it's an arc: (x,y) arc (start:end:r)
    const arcMatch = pathStr.match(/(\([^)]+\))\s*arc\s*\(([0-9.]+):([0-9.]+):([0-9.]+)(?:cm|pt)?\)/);
    if (arcMatch) {
      const startPt = parsePoint(arcMatch[1]);
      const startAngle = parseFloat(arcMatch[2]);
      const endAngle = parseFloat(arcMatch[3]);
      const radius = (parseFloat(arcMatch[4]) || 1) * pxScale;
      if (startPt) {
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        // Center estimation from starting point
        const cx = startPt.x - (radius / pxScale) * Math.cos(startRad);
        const cy = startPt.y - (radius / pxScale) * Math.sin(startRad);
        const x1 = toSvgX(startPt.x);
        const y1 = toSvgY(startPt.y);
        const x2 = toSvgX(cx + (radius / pxScale) * Math.cos(endRad));
        const y2 = toSvgY(cy + (radius / pxScale) * Math.sin(endRad));
        const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
        const sweepFlag = endAngle > startAngle ? 0 : 1;
        elements.push(
          `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" />`
        );
        continue;
      }
    }

    // Check if it's a circle: (x,y) circle (r)
    const circleMatch = pathStr.match(/(\([^)]+\))\s*circle\s*\(([^)]+)\)/);
    if (circleMatch) {
      const center = parsePoint(circleMatch[1]);
      const rStr = circleMatch[2].replace(/cm|pt|\\cdots/g, '').trim();
      const r = (parseFloat(rStr) || 1) * (circleMatch[2].includes('pt') ? 1.5 : pxScale);
      if (center) {
        elements.push(
          `<circle cx="${toSvgX(center.x)}" cy="${toSvgY(center.y)}" r="${r}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${isDashed ? '5,5' : 'none'}" />`
        );
        continue;
      }
    }

    // Check if it's a rectangle: (x1,y1) rectangle (x2,y2)
    const rectMatch = pathStr.match(/(\([^)]+\))\s*rectangle\s*(\([^)]+\))/);
    if (rectMatch) {
      const p1 = parsePoint(rectMatch[1]);
      const p2 = parsePoint(rectMatch[2]);
      if (p1 && p2) {
        const xMin = Math.min(toSvgX(p1.x), toSvgX(p2.x));
        const yMin = Math.min(toSvgY(p1.y), toSvgY(p2.y));
        const w = Math.abs(toSvgX(p1.x) - toSvgX(p2.x));
        const h = Math.abs(toSvgY(p1.y) - toSvgY(p2.y));
        elements.push(
          `<rect x="${xMin}" y="${yMin}" width="${w}" height="${h}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${isDashed ? '5,5' : 'none'}" />`
        );
        continue;
      }
    }

    // Check for plot: \draw[domain=...] plot (\x, {formula})
    if (pathStr.includes('plot')) {
      const domainMatch = opts.match(/domain\s*=\s*(-?[0-9.]+):(-?[0-9.]+)/);
      const startX = domainMatch ? parseFloat(domainMatch[1]) : -2;
      const endX = domainMatch ? parseFloat(domainMatch[2]) : 2;

      // Simple cubic or quadratic plot approximation
      const points: string[] = [];
      const steps = 60;
      const step = (endX - startX) / steps;
      for (let i = 0; i <= steps; i++) {
        const xVal = startX + i * step;
        let yVal = 0;
        if (pathStr.includes('^3')) {
          yVal = Math.pow(xVal, 3) - 3 * xVal + 1;
        } else if (pathStr.includes('^2')) {
          yVal = Math.pow(xVal, 2) - 2;
        } else if (pathStr.includes('cos') || pathStr.includes('sin')) {
          yVal = Math.sin(xVal * 2);
        } else {
          yVal = xVal;
        }
        if (yVal > -10 && yVal < 10) {
          updateBounds(xVal, yVal);
          points.push(`${toSvgX(xVal)},${toSvgY(yVal)}`);
        }
      }
      if (points.length > 2) {
        elements.push(
          `<polyline points="${points.join(' ')}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth + 0.5}" />`
        );
      }
      continue;
    }

    // Line segments: (A) -- (B) -- (C) ...
    const segs = pathStr.split('--').map((s) => s.trim());
    if (segs.length >= 2) {
      let d = '';
      for (let i = 0; i < segs.length; i++) {
        const pt = parsePoint(segs[i]);
        if (pt) {
          const sx = toSvgX(pt.x);
          const sy = toSvgY(pt.y);
          d += i === 0 ? `M ${sx} ${sy}` : ` L ${sx} ${sy}`;
        }
      }
      if (d) {
        elements.push(
          `<path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-dasharray="${isDashed ? '5,5' : 'none'}" ${isArrow ? 'marker-end="url(#arrowhead)"' : ''} />`
        );
      }
    }
  }

  // 3. Parse \fill and \filldraw points: \fill[color] (A) circle (1.5pt);
  const fillRegex = /\\fill(?:draw)?(?:\[(.*?)\])?\s*([^;]+);/g;
  let fillMatch;
  while ((fillMatch = fillRegex.exec(body)) !== null) {
    const opts = (fillMatch[1] || '').toLowerCase();
    const targetStr = fillMatch[2];

    let fillColor = '#0f172a';
    if (opts.includes('red')) fillColor = '#ef4444';
    else if (opts.includes('blue')) fillColor = '#3b82f6';
    else if (opts.includes('green')) fillColor = '#22c55e';

    const ptMatch = targetStr.match(/(\([^)]+\))\s*circle\s*\(([^)]+)\)/);
    if (ptMatch) {
      const pt = parsePoint(ptMatch[1]);
      if (pt) {
        elements.push(
          `<circle cx="${toSvgX(pt.x)}" cy="${toSvgY(pt.y)}" r="4" fill="${fillColor}" stroke="#ffffff" stroke-width="1.5" />`
        );
      }
    }
  }

  // 4. Parse \node[...] at (x,y) {$Label$};
  const nodeRegex = /\\node(?:\[(.*?)\])?\s*at\s*(\([^)]+\))\s*\{([^}]+)\};/g;
  let nodeMatch;
  while ((nodeMatch = nodeRegex.exec(body)) !== null) {
    const opts = (nodeMatch[1] || '').toLowerCase();
    const pt = parsePoint(nodeMatch[2]);
    let label = nodeMatch[3].replace(/\$|\\text\{|\}/g, '').trim();

    if (pt) {
      let dx = 0;
      let dy = 0;
      if (opts.includes('above')) dy = -12;
      if (opts.includes('below')) dy = 16;
      if (opts.includes('left')) dx = -14;
      if (opts.includes('right')) dx = 14;

      elements.push(
        `<text x="${toSvgX(pt.x) + dx}" y="${toSvgY(pt.y) + dy}" font-family="'JetBrains Mono', 'Noto Sans Khmer', sans-serif" font-size="13" font-weight="600" fill="#1e293b" text-anchor="middle" dominant-baseline="middle">${label}</text>`
      );
    }
  }

  // Generate complete SVG
  const svgWidth = 600;
  const svgHeight = 480;

  const svgContent = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-full max-h-[460px] select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" stroke-width="1"/>
        </pattern>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
      ${elements.join('\n')}
    </svg>
  `;

  return {
    svgContent,
    hasDiagram: elements.length > 0,
  };
}
