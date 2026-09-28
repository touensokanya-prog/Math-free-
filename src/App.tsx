import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { MiddlePanel } from './components/MiddlePanel';
import { CodeEditor } from './components/CodeEditor';
import { PreviewRenderer } from './components/PreviewRenderer';
import { CameraModal } from './components/CameraModal';
import {
  CategoryId,
  SampleItem,
  UploadedFileItem,
  FilterOptions,
  OutputMode,
  GenerationResult,
} from './types';
import { SAMPLES } from './data/samples';
import { Code2, Eye, Columns, Copy } from 'lucide-react';
import { useToast } from './components/Toast';

export default function App() {
  // Left Panel state
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | 'all'>('all');
  const [savedItems, setSavedItems] = useState<SampleItem[]>(() => {
    try {
      const stored = localStorage.getItem('math_latex_saved_items');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Middle Panel state
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [options, setOptions] = useState<FilterOptions>({
    bbt: false,
    dthi: false,
    hve: false,
    tikz: false,
  });
  const [prompt, setPrompt] = useState<string>('');
  const [mode, setMode] = useState<OutputMode>('full');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Right Panel state
  const [activeTab, setActiveTab] = useState<'full' | 'note' | 'normalize'>('full');
  const [code, setCode] = useState<string>(SAMPLES[0].latexCode);
  const [noteContent, setNoteContent] = useState<string>(
    SAMPLES[0].note ||
      '• System initialized.\n• Ready to reconstruct mathematical formulas, exam papers, and diagrams.\n• XeLaTeX & TikZ enabled with Khmer polyglossia fontspec.'
  );
  const [normalizedContent, setNormalizedContent] = useState<string>(
    SAMPLES[0].mathContent || SAMPLES[0].latexCode
  );
  const [tikzCode, setTikzCode] = useState<string>(SAMPLES[0].tikzCode || '');
  const [mathContent, setMathContent] = useState<string>(SAMPLES[0].mathContent || '');

  // Right Panel split view (Code vs Preview)
  const [rightViewMode, setRightViewMode] = useState<'split' | 'code' | 'preview'>('split');

  // Camera modal
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  // Toast notification for copying code
  const { copyCodeWithToast } = useToast();

  // Mobile screen active panel tab
  const [mobileTab, setMobileTab] = useState<'upload' | 'code' | 'preview'>('upload');

  // Load a sample item
  const handleSelectSample = (sample: SampleItem) => {
    setCode(sample.latexCode);
    setMathContent(sample.mathContent || '');
    setTikzCode(sample.tikzCode || '');
    setNormalizedContent(sample.mathContent || sample.latexCode);
    setNoteContent(
      sample.note ||
        `• Sample: ${sample.titleKh} (${sample.titleEn})\n• Category: ${sample.categoryId.toUpperCase()}\n• Type: ${sample.typeBadge}`
    );
    if (sample.promptSuggestion) {
      setPrompt(sample.promptSuggestion);
    }

    // Set filter options based on sample
    if (sample.categoryId === 'graphs') {
      setOptions((prev) => ({ ...prev, dthi: true, tikz: true }));
    } else if (sample.categoryId === 'geometry') {
      setOptions((prev) => ({ ...prev, hve: true, tikz: true }));
    } else if (sample.categoryId === 'tables') {
      setOptions((prev) => ({ ...prev, bbt: true }));
    }
    setMobileTab('code');
  };

  // Add files & auto-trigger LaTeX/TikZ generation immediately
  const handleAddFiles = (newFiles: UploadedFileItem[], autoGenerate: boolean = true) => {
    const updated = [...files, ...newFiles];
    setFiles(updated);
    setErrorMessage(null);
    if (autoGenerate && newFiles.length > 0) {
      triggerGeneration(updated);
    }
  };

  // Remove single file
  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Clear all files
  const handleClearFiles = () => {
    setFiles([]);
    setErrorMessage(null);
  };

  // Save current snippet to local library
  const handleSaveItem = () => {
    const newItem: SampleItem = {
      id: `saved-${Date.now()}`,
      categoryId: 'latex',
      titleKh: `រូបមន្តរក្សាទុក (${new Date().toLocaleDateString()})`,
      titleEn: `Saved Formula ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      description: code.slice(0, 100),
      latexCode: code,
      tikzCode: tikzCode,
      mathContent: mathContent,
      note: noteContent,
      typeBadge: 'User Saved',
    };

    const updated = [newItem, ...savedItems.filter((i) => i.id !== newItem.id)];
    setSavedItems(updated);
    try {
      localStorage.setItem('math_latex_saved_items', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  };

  // Reset everything
  const handleReset = () => {
    setFiles([]);
    setPrompt('');
    setErrorMessage(null);
    setOptions({ bbt: false, dthi: false, hve: false, tikz: false });
    setCode(SAMPLES[0].latexCode);
    setMathContent(SAMPLES[0].mathContent || '');
    setTikzCode('');
    setNoteContent(SAMPLES[0].note || '');
    setNormalizedContent(SAMPLES[0].mathContent || SAMPLES[0].latexCode);
  };

  // Call backend API for Gemini OCR & LaTeX reconstruction
  const triggerGeneration = async (filesToProcess: UploadedFileItem[] = files) => {
    if (filesToProcess.length === 0) {
      setErrorMessage('សូមបញ្ចូលរូបភាព ឬឯកសារ PDF ជាមុនសិន។');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const payload = {
        images: filesToProcess.map((f) => ({
          data: f.dataUrl,
          mimeType: f.mimeType,
        })),
        prompt: prompt,
        mode: mode,
        options: options,
      };

      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process mathematical image.');
      }

      // Update state with generated outputs
      const finalCode = data.latexCode || data.fullDocument || '';
      setCode(finalCode);
      setMathContent(data.mathContent || '');
      setTikzCode(data.tikzOnly || '');
      setNoteContent(data.note || 'OCR Analysis completed successfully.');
      setNormalizedContent(data.normalized || data.mathContent || finalCode);
      setActiveTab('full');
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage(err.message || 'Error occurred during generation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = () => {
    triggerGeneration(files);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900">
      {/* Top Application Header */}
      <Header />

      {/* Main 3-Column Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Categories & Samples (260px - 280px) */}
        <section className="w-64 md:w-72 lg:w-80 shrink-0 h-full hidden md:block">
          <LeftPanel
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            onSelectSample={handleSelectSample}
            savedItems={savedItems}
          />
        </section>

        {/* MIDDLE PANEL: Image / PDF Upload & Prompt (340px - 400px) */}
        <section
          className={`w-full md:w-96 lg:w-[420px] shrink-0 h-full border-r border-slate-200 ${
            mobileTab === 'upload' ? 'block' : 'hidden md:block'
          }`}
        >
          <MiddlePanel
            files={files}
            onAddFiles={handleAddFiles}
            onRemoveFile={handleRemoveFile}
            onClearFiles={handleClearFiles}
            options={options}
            onOptionsChange={setOptions}
            prompt={prompt}
            onPromptChange={setPrompt}
            mode={mode}
            onModeChange={setMode}
            onGenerate={handleGenerate}
            onReset={handleReset}
            isGenerating={isGenerating}
            onOpenCamera={() => setIsCameraOpen(true)}
            errorMessage={errorMessage}
          />
        </section>

        {/* RIGHT PANEL: Code Editor & Live Preview */}
        <section
          className={`flex-1 flex flex-col h-full overflow-hidden bg-slate-900 ${
            mobileTab === 'upload' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* View Mode Switcher Header */}
          <div className="h-9 bg-slate-950 border-b border-slate-800 px-3 flex items-center justify-between text-xs text-slate-400 select-none shrink-0">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5 font-mono text-[11px]">
              <Code2 className="w-3.5 h-3.5" />
              LaTeX &amp; TikZ Workspace
            </span>

            {/* View Mode Buttons & Quick Copy */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyCodeWithToast(code, 'កូដ LaTeX/TikZ')}
                className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-medium text-[11px] flex items-center gap-1.5 transition-all shadow-xs active:scale-95"
                title="ចម្លងកូដ LaTeX/TikZ ទៅកាន់ Clipboard"
              >
                <Copy className="w-3 h-3" />
                <span className="font-khmer">ចម្លងកូដ (Copy)</span>
              </button>

              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => setRightViewMode('split')}
                  title="Split Editor & Preview"
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    rightViewMode === 'split'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Columns className="w-3 h-3" />
                  <span className="hidden sm:inline">Split</span>
                </button>
                <button
                  onClick={() => setRightViewMode('code')}
                  title="Code Only"
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    rightViewMode === 'code'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Code</span>
                </button>
                <button
                  onClick={() => setRightViewMode('preview')}
                  title="Preview Only"
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    rightViewMode === 'preview'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">Preview</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel Main Area */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Code Editor Part */}
            {((rightViewMode === 'split' || rightViewMode === 'code') && (mobileTab !== 'preview' || rightViewMode === 'code')) && (
              <div
                className={`h-full ${
                  rightViewMode === 'split' ? 'w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-slate-800' : 'w-full'
                }`}
              >
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  noteContent={noteContent}
                  normalizedContent={normalizedContent}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  onSaveItem={handleSaveItem}
                />
              </div>
            )}

            {/* Live Compile Preview Part */}
            {((rightViewMode === 'split' || rightViewMode === 'preview') && (mobileTab !== 'code' || rightViewMode === 'preview')) && (
              <div
                className={`h-full ${
                  rightViewMode === 'split' ? 'w-full lg:w-1/2' : 'w-full'
                }`}
              >
                <PreviewRenderer
                  latexCode={code}
                  tikzCode={tikzCode}
                  mathContent={mathContent}
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <nav className="md:hidden h-12 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-20 shrink-0">
        <button
          onClick={() => setMobileTab('upload')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[11px] font-khmer font-medium transition-colors ${
            mobileTab === 'upload' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <span className="text-xs">📤</span>
          <span>បញ្ចូលរូប (Upload)</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('code');
            setRightViewMode('code');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[11px] font-khmer font-medium transition-colors ${
            mobileTab === 'code' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <span className="text-xs">📄</span>
          <span>កូដ LaTeX/TikZ</span>
        </button>

        <button
          onClick={() => {
            setMobileTab('preview');
            setRightViewMode('preview');
          }}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 text-[11px] font-khmer font-medium transition-colors ${
            mobileTab === 'preview' ? 'text-sky-600' : 'text-slate-500'
          }`}
        >
          <span className="text-xs">👁️</span>
          <span>Preview មើលរូប</span>
        </button>
      </nav>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          const newItem: UploadedFileItem = {
            id: `cam-${Date.now()}`,
            name: `Camera Snapshot ${new Date().toLocaleTimeString()}`,
            size: Math.round(dataUrl.length * 0.75),
            dataUrl,
            mimeType: 'image/jpeg',
            source: 'camera',
          };
          handleAddFiles([newItem]);
        }}
      />
    </div>
  );
}
