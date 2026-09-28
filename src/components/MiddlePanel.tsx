import React, { useRef, useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Clipboard,
  Camera,
  Trash2,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  CheckSquare,
  Square,
  HelpCircle,
  FileCheck,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { UploadedFileItem, FilterOptions, OutputMode } from '../types';
import { extractPagesFromPdf } from '../utils/pdfHelper';

interface MiddlePanelProps {
  files: UploadedFileItem[];
  onAddFiles: (newFiles: UploadedFileItem[]) => void;
  onRemoveFile: (id: string) => void;
  onClearFiles: () => void;
  options: FilterOptions;
  onOptionsChange: (opts: FilterOptions) => void;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
  onGenerate: () => void;
  onReset: () => void;
  isGenerating: boolean;
  onOpenCamera: () => void;
  errorMessage?: string | null;
}

export const MiddlePanel: React.FC<MiddlePanelProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  onClearFiles,
  options,
  onOptionsChange,
  prompt,
  onPromptChange,
  mode,
  onModeChange,
  onGenerate,
  onReset,
  isGenerating,
  onOpenCamera,
  errorMessage,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState<{ current: number; total: number } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Parse countdown from errorMessage if present (e.g. "រង់ចាំប្រហែល 16 វិនាទី")
  useEffect(() => {
    if (!errorMessage) {
      setCountdown(null);
      return;
    }
    const match = errorMessage.match(/(\d+)\s*វិនាទី/);
    if (match) {
      const secs = parseInt(match[1], 10);
      setCountdown(secs);
    } else {
      setCountdown(null);
    }
  }, [errorMessage]);

  // Countdown timer effect
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Global paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            readImageFile(file, 'paste');
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const readImageFile = (file: File, source: 'upload' | 'paste' | 'camera') => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newItem: UploadedFileItem = {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: file.name || `Pasted Image ${new Date().toLocaleTimeString()}`,
        size: file.size,
        dataUrl,
        mimeType: file.type || 'image/png',
        source,
      };
      onAddFiles([newItem]);
    };
    reader.readAsDataURL(file);
  };

  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    for (let i = 0; i < selected.length; i++) {
      readImageFile(selected[i], 'upload');
    }
    e.target.value = '';
  };

  const handlePdfInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    const file = selected[0];
    setIsProcessingPdf(true);
    setPdfProgress({ current: 0, total: 1 });

    try {
      const pages = await extractPagesFromPdf(file, 10, (curr, total) => {
        setPdfProgress({ current: curr, total });
      });

      const newItems: UploadedFileItem[] = pages.map((p) => ({
        id: `pdf-page-${Date.now()}-${p.pageNumber}`,
        name: `${file.name} (Page ${p.pageNumber})`,
        size: Math.round(p.dataUrl.length * 0.75),
        dataUrl: p.dataUrl,
        mimeType: 'image/png',
        source: 'pdf',
        pageNumber: p.pageNumber,
        totalPages: pages.length,
      }));

      onAddFiles(newItems);
    } catch (err) {
      console.error('PDF parsing error:', err);
    } finally {
      setIsProcessingPdf(false);
      setPdfProgress(null);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;

    for (let i = 0; i < droppedFiles.length; i++) {
      const file = droppedFiles[i];
      if (file.type.startsWith('image/')) {
        readImageFile(file, 'upload');
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        // Process PDF
        handlePdfFile(file);
      }
    }
  };

  const handlePdfFile = async (file: File) => {
    setIsProcessingPdf(true);
    try {
      const pages = await extractPagesFromPdf(file, 10);
      const newItems: UploadedFileItem[] = pages.map((p) => ({
        id: `pdf-page-${Date.now()}-${p.pageNumber}`,
        name: `${file.name} (P.${p.pageNumber})`,
        size: Math.round(p.dataUrl.length * 0.75),
        dataUrl: p.dataUrl,
        mimeType: 'image/png',
        source: 'pdf',
        pageNumber: p.pageNumber,
        totalPages: pages.length,
      }));
      onAddFiles(newItems);
    } catch (err) {
      console.error('PDF extraction failed:', err);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleClipboardPasteClick = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            const file = new File([blob], 'clipboard-math.png', { type });
            readImageFile(file, 'paste');
            return;
          }
        }
      }
    } catch (err) {
      alert('សូមចុច Ctrl+V (ឬ Command+V) ដើម្បីបិទភ្ជាប់រូបភាពដោយផ្ទាល់។');
    }
  };

  const toggleOption = (key: keyof FilterOptions) => {
    onOptionsChange({
      ...options,
      [key]: !options[key],
    });
  };

  const quickPrompts = [
    'បម្លែងឱ្យដូចដើម ១០០% គ្មានបាត់រូបមន្ត',
    'បម្លែងរូបធរណីមាត្រជា TikZ យ៉ាងស្រស់ស្អាត',
    'រក្សាទីតាំងចំណុច ស្លាក និងបន្ទាត់ទាំងអស់',
    'កុំបកប្រែ រក្សាអក្សរខ្មែរដើម',
    'បង្កើត Full Document XeLaTeX',
    'បង្កើតតារាងអថេរភាព (BBT)',
    'សង់ក្រាបអនុគមន៍ Oxy',
  ];

  const handleAddPromptText = (text: string) => {
    if (!prompt.includes(text)) {
      onPromptChange(prompt ? `${prompt}, ${text}` : text);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 overflow-y-auto select-none">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageInputChange}
      />
      <input
        ref={pdfInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handlePdfInputChange}
      />

      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-200 bg-white flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800 text-sm font-khmer flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            ទទួលរូបភាព / PDF
          </h2>
          <p className="text-[11px] text-slate-500">
            Upload exam papers, math formulas, or diagrams
          </p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {files.length > 0 && (
            <button
              onClick={onClearFiles}
              className="text-[11px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded transition-colors font-khmer"
            >
              សម្អាតទាំងអស់ ({files.length})
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Error notification with instant Retry */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 text-rose-800 text-xs flex flex-col gap-2 shadow-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-khmer leading-relaxed">{errorMessage}</div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1 border-t border-rose-200/60">
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
              >
                <RotateCcw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {countdown && countdown > 0
                    ? `ព្យាយាមម្តងទៀត (${countdown}s)`
                    : 'ព្យាយាមម្តងទៀត (Retry)'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
            isDragging
              ? 'border-sky-500 bg-sky-50/80 scale-[0.99]'
              : 'border-slate-300 bg-white hover:border-sky-400'
          }`}
        >
          <div className="w-10 h-10 mx-auto rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-2 shadow-xs">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold text-slate-800 font-khmer">
            ទម្លាក់រូបភាព ឬឯកសារ PDF នៅទីនេះ (ដំណើរការ &amp; Copy ភ្លាមៗ)
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-khmer">
            គាំទ្រ PNG, JPG, WEBP, PDF — បម្លែងជា LaTeX &amp; TikZ ស្វ័យប្រវត្តិ
          </p>

          {/* Upload Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Upload Image</span>
            </button>

            <button
              onClick={() => pdfInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Upload PDF</span>
            </button>

            <button
              onClick={handleClipboardPasteClick}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span>Paste Image</span>
            </button>

            <button
              onClick={onOpenCamera}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* PDF Progress Indicator */}
        {isProcessingPdf && (
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-sky-600 border-t-transparent rounded-full animate-spin shrink-0" />
            <span className="font-khmer">
              កំពុងដំណើរការទំព័រ PDF {pdfProgress?.current || 0} នៃ {pdfProgress?.total || '...' }...
            </span>
          </div>
        )}

        {/* Uploaded Thumbnails Grid */}
        {files.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 font-khmer">
                រូបភាពដែលបានបញ្ចូល ({files.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {(files.reduce((a, b) => a + b.size, 0) / 1024).toFixed(1)} KB
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-square flex items-center justify-center shadow-2xs"
                >
                  <img
                    src={file.dataUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                    <button
                      onClick={() => onRemoveFile(file.id)}
                      className="p-1 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {file.pageNumber && (
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                      P.{file.pageNumber}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Option Checkboxes */}
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 mb-2 uppercase tracking-wider">
            ជម្រើសវិភាគ (Detection Focus)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              onClick={() => toggleOption('bbt')}
              className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                options.bbt
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {options.bbt ? (
                <CheckSquare className="w-4 h-4 text-sky-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>BBT (Variation)</span>
            </button>

            <button
              onClick={() => toggleOption('dthi')}
              className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                options.dthi
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {options.dthi ? (
                <CheckSquare className="w-4 h-4 text-sky-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>D.Thi (Graph)</span>
            </button>

            <button
              onClick={() => toggleOption('hve')}
              className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                options.hve
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {options.hve ? (
                <CheckSquare className="w-4 h-4 text-sky-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>H.Vẽ (Diagram)</span>
            </button>

            <button
              onClick={() => toggleOption('tikz')}
              className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-all ${
                options.tikz
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-medium'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {options.tikz ? (
                <CheckSquare className="w-4 h-4 text-sky-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>TikZ (Accurate)</span>
            </button>
          </div>
        </div>

        {/* Output Mode Selector */}
        <div className="bg-white p-3 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-600 mb-2 uppercase tracking-wider flex items-center justify-between">
            <span>ទម្រង់លទ្ធផល (Output Mode)</span>
            <span className="text-[10px] text-slate-400">Compile Ready</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              onClick={() => onModeChange('full')}
              className={`p-2 rounded-lg border text-center transition-all ${
                mode === 'full'
                  ? 'border-sky-600 bg-sky-500 text-white font-medium shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-semibold">Full code</div>
              <div className={`text-[10px] ${mode === 'full' ? 'text-sky-100' : 'text-slate-400'}`}>
                XeLaTeX Doc
              </div>
            </button>

            <button
              onClick={() => onModeChange('tikz')}
              className={`p-2 rounded-lg border text-center transition-all ${
                mode === 'tikz'
                  ? 'border-sky-600 bg-sky-500 text-white font-medium shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-semibold">TikZ Only</div>
              <div className={`text-[10px] ${mode === 'tikz' ? 'text-sky-100' : 'text-slate-400'}`}>
                tikzpicture
              </div>
            </button>

            <button
              onClick={() => onModeChange('math')}
              className={`p-2 rounded-lg border text-center transition-all ${
                mode === 'math'
                  ? 'border-sky-600 bg-sky-500 text-white font-medium shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-semibold">Math Only</div>
              <div className={`text-[10px] ${mode === 'math' ? 'text-sky-100' : 'text-slate-400'}`}>
                Pure Formulas
              </div>
            </button>
          </div>
        </div>

        {/* Large Text Box Prompt */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 font-khmer">
              បញ្ចូលសំណើ ឬពិពណ៌នាអំពីអ្វីដែលអ្នកចង់បង្កើត...
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              Custom AI Prompt
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            rows={3}
            placeholder="ឧទាហរណ៍៖ បម្លែងរូបនេះទៅជា TikZ ដោយរក្សាទីតាំងចំណុច និងស្លាកឱ្យដូចរូបដើម..."
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:bg-white transition-all font-khmer resize-none leading-relaxed"
          />

          {/* Quick Prompt Suggestions Chips */}
          <div className="flex flex-wrap gap-1 pt-1">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleAddPromptText(chip)}
                className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 hover:bg-sky-100 text-slate-600 hover:text-sky-800 transition-colors font-khmer border border-slate-200/60"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Generate, Gemini, Reset */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={onGenerate}
            disabled={isGenerating || files.length === 0}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
              isGenerating || files.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/25 active:scale-98'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-khmer">កំពុងបម្លែងជា LaTeX &amp; TikZ...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Generate (បម្លែងកូដ)</span>
              </>
            )}
          </button>

          {/* Gemini Badge */}
          <div
            title="Powered by Gemini Multimodal Vision"
            className="px-3 py-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-1.5 text-xs font-semibold text-slate-700"
          >
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span>Gemini</span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            disabled={isGenerating}
            title="Reset Everything"
            className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
