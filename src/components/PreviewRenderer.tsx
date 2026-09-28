import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { ZoomIn, ZoomOut, RotateCcw, Eye, Sparkles, Layers, Maximize2, Copy, Check, Download } from 'lucide-react';
import { renderTikzToSvg } from '../utils/tikzParser';
import { useToast } from './Toast';

interface PreviewRendererProps {
  latexCode: string;
  tikzCode?: string;
  mathContent?: string;
}

export const PreviewRenderer: React.FC<PreviewRendererProps> = ({
  latexCode,
  tikzCode,
  mathContent,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [activeView, setActiveView] = useState<'visual' | 'paper' | 'diagram'>('visual');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const { copyCodeWithToast } = useToast();

  const handleCopyText = async (text: string, label: string) => {
    if (!text) return;
    const readableLabel = label === 'tikz' ? 'កូដ TikZ (TikZ Code)' : 'កូដពេញលេញ LaTeX (LaTeX Code)';
    const ok = await copyCodeWithToast(text, readableLabel);
    if (ok) {
      setCopiedType(label);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(2.0, +(prev + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, +(prev - 0.15).toFixed(2)));
  const handleZoomReset = () => setZoom(1);

  // Extract pure math blocks for KaTeX
  const renderedMathHtml = useMemo(() => {
    const textToRender = mathContent || latexCode;
    if (!textToRender) return null;

    try {
      // Split by display math \[ ... \] or $$ ... $$
      const lines = textToRender.split('\n');
      const htmlParts: string[] = [];

      let currentDisplayMath = '';
      let inDisplayMath = false;

      for (const line of lines) {
        const trimmed = line.trim();

        // Skip document wrappers
        if (
          trimmed.startsWith('\\documentclass') ||
          trimmed.startsWith('\\usepackage') ||
          trimmed.startsWith('\\begin{document}') ||
          trimmed.startsWith('\\end{document}') ||
          trimmed.startsWith('\\setmainlanguage')
        ) {
          continue;
        }

        // Check for start of display math
        if (trimmed.includes('\\[') && trimmed.includes('\\]')) {
          const match = trimmed.match(/\\\[(.*?)\\\]/);
          if (match) {
            try {
              const rendered = katex.renderToString(match[1], {
                displayMode: true,
                throwOnError: false,
              });
              htmlParts.push(`<div class="my-3 overflow-x-auto text-center">${rendered}</div>`);
            } catch {
              htmlParts.push(`<pre class="text-xs text-rose-500">${match[1]}</pre>`);
            }
          }
          continue;
        }

        if (trimmed.startsWith('\\[')) {
          inDisplayMath = true;
          currentDisplayMath = trimmed.replace('\\[', '');
          continue;
        }

        if (inDisplayMath) {
          if (trimmed.endsWith('\\]')) {
            inDisplayMath = false;
            currentDisplayMath += ' ' + trimmed.replace('\\]', '');
            try {
              const rendered = katex.renderToString(currentDisplayMath, {
                displayMode: true,
                throwOnError: false,
              });
              htmlParts.push(`<div class="my-3 overflow-x-auto text-center">${rendered}</div>`);
            } catch {
              htmlParts.push(`<pre class="text-xs text-rose-500">${currentDisplayMath}</pre>`);
            }
            currentDisplayMath = '';
          } else {
            currentDisplayMath += ' ' + trimmed;
          }
          continue;
        }

        // Inline math parsing in text: replace $...$ with KaTeX
        let processedLine = trimmed;
        if (processedLine.includes('$')) {
          processedLine = processedLine.replace(/\$([^\$]+)\$/g, (_, math) => {
            try {
              return katex.renderToString(math, { displayMode: false, throwOnError: false });
            } catch {
              return `$${math}$`;
            }
          });
        }

        // Format sections and text
        if (processedLine.startsWith('\\section*{') || processedLine.startsWith('\\section{')) {
          const title = processedLine.replace(/\\section\*?\{|\}/g, '');
          htmlParts.push(`<h2 class="text-lg font-bold text-sky-900 border-b border-sky-100 pb-1 mt-4 mb-2 font-khmer">${title}</h2>`);
        } else if (processedLine.startsWith('\\textbf{')) {
          const boldText = processedLine.replace(/\\textbf\{|\}/g, '');
          htmlParts.push(`<p class="font-semibold text-slate-800 my-1 font-khmer">${boldText}</p>`);
        } else if (processedLine.startsWith('\\item')) {
          const itemText = processedLine.replace('\\item', '').trim();
          htmlParts.push(`<li class="ml-4 list-decimal my-1 text-slate-700 font-khmer">${itemText}</li>`);
        } else if (processedLine.length > 0 && !processedLine.startsWith('\\') && !processedLine.startsWith('%')) {
          htmlParts.push(`<p class="my-1.5 text-slate-700 font-khmer leading-relaxed">${processedLine}</p>`);
        }
      }

      return htmlParts.join('\n');
    } catch (e) {
      console.warn('KaTeX rendering error:', e);
      return null;
    }
  }, [latexCode, mathContent]);

  // Render TikZ diagram if code contains tikzpicture
  const tikzDiagram = useMemo(() => {
    const code = tikzCode || latexCode;
    return renderTikzToSvg(code, zoom);
  }, [tikzCode, latexCode, zoom]);

  return (
    <div className="flex flex-col h-full bg-slate-50 border-t border-slate-200">
      {/* Control bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-100/90 border-b border-slate-200 text-xs text-slate-600 select-none">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            Compile Preview
          </span>

          <div className="h-3.5 w-px bg-slate-300 mx-1" />

          {/* View Toggles */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60">
            <button
              onClick={() => setActiveView('visual')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeView === 'visual'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Math & Diagram
            </button>
            <button
              onClick={() => setActiveView('paper')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                activeView === 'paper'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              XeLaTeX A4
            </button>
            {tikzDiagram.hasDiagram && (
              <button
                onClick={() => setActiveView('diagram')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  activeView === 'diagram'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                TikZ Only
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & Zoom */}
        <div className="flex items-center gap-1.5">
          {/* Quick Copy Buttons in Preview */}
          {tikzCode && (
            <button
              onClick={() => handleCopyText(tikzCode, 'tikz')}
              className={`px-2 py-0.5 rounded font-medium text-[11px] flex items-center gap-1 transition-colors ${
                copiedType === 'tikz'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
              title="Copy TikZ code only"
            >
              {copiedType === 'tikz' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedType === 'tikz' ? 'TikZ Copied' : 'Copy TikZ'}</span>
            </button>
          )}

          {latexCode && (
            <>
              <button
                onClick={() => handleCopyText(latexCode, 'latex')}
                className={`px-2 py-0.5 rounded font-medium text-[11px] flex items-center gap-1 transition-colors ${
                  copiedType === 'latex'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-sky-600 hover:bg-sky-500 text-white'
                }`}
                title="Copy Full LaTeX code"
              >
                {copiedType === 'latex' ? <Check className="w-3 h-3 stroke-[3]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedType === 'latex' ? 'LaTeX Copied' : 'Copy LaTeX'}</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([latexCode], { type: 'text/x-tex;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `math-latex-${new Date().toISOString().slice(0, 10)}-${Date.now()}.tex`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
                className="px-2 py-0.5 rounded font-medium text-[11px] flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                title="Download .tex file directly"
              >
                <Download className="w-3 h-3" />
                <span>.tex</span>
              </button>
            </>
          )}

          <div className="h-3.5 w-px bg-slate-300 mx-0.5" />

          {/* Zoom Controls */}
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1 rounded hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[11px] w-11 text-center font-medium text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1 rounded hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomReset}
            title="Reset Zoom (100%)"
            className="p-1 rounded hover:bg-slate-200 text-slate-600 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-slate-100/50">
        {activeView === 'visual' && (
          <div
            className="w-full max-w-3xl bg-white rounded-xl shadow-xs border border-slate-200/80 p-6 transition-transform origin-top"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Diagram first if available */}
            {tikzDiagram.hasDiagram && (
              <div className="mb-6 border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col items-center">
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-[11px] text-slate-500 font-mono">
                  <span className="flex items-center gap-1 font-semibold text-sky-700">
                    <Sparkles className="w-3 h-3" /> TikZ Vector Graphics
                  </span>
                  <span>Interactive Coordinate Render</span>
                </div>
                <div
                  className="w-full flex justify-center"
                  dangerouslySetInnerHTML={{ __html: tikzDiagram.svgContent }}
                />
              </div>
            )}

            {/* Rendered Math Content */}
            {renderedMathHtml ? (
              <div
                className="prose prose-slate max-w-none text-slate-800"
                dangerouslySetInnerHTML={{ __html: renderedMathHtml }}
              />
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                {latexCode
                  ? 'Mathematical content ready for XeLaTeX compilation'
                  : 'No LaTeX output generated yet. Upload an image or select a sample.'}
              </div>
            )}
          </div>
        )}

        {activeView === 'paper' && (
          <div
            className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-slate-300 p-8 min-h-[500px] transition-transform origin-top font-serif"
            style={{ transform: `scale(${zoom})` }}
          >
            <div className="border-b border-slate-300 pb-3 mb-4 text-center">
              <div className="text-xs uppercase tracking-wider text-slate-500 font-sans">
                XeLaTeX Document Preview
              </div>
              <h1 className="text-base font-bold text-slate-900 mt-1 font-khmer">
                វិញ្ញាសាគណិតវិទ្យា / Mathematics Paper
              </h1>
            </div>

            {renderedMathHtml && (
              <div
                className="text-slate-800 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderedMathHtml }}
              />
            )}

            {tikzDiagram.hasDiagram && (
              <div
                className="my-4 flex justify-center"
                dangerouslySetInnerHTML={{ __html: tikzDiagram.svgContent }}
              />
            )}
          </div>
        )}

        {activeView === 'diagram' && tikzDiagram.hasDiagram && (
          <div
            className="w-full max-w-3xl bg-white rounded-xl shadow-xs border border-slate-200 p-4 transition-transform origin-top flex flex-col items-center"
            style={{ transform: `scale(${zoom})` }}
          >
            <div
              className="w-full flex justify-center"
              dangerouslySetInnerHTML={{ __html: tikzDiagram.svgContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
