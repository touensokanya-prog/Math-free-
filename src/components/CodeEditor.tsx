import React, { useState, useEffect, useRef } from 'react';
import {
  Copy,
  Check,
  Download,
  ExternalLink,
  Trash2,
  Bookmark,
  Maximize2,
  Minimize2,
  Search,
  Undo2,
  Redo2,
  FileText,
  AlignLeft,
  Sparkles,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';
import { useToast } from './Toast';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  noteContent: string;
  normalizedContent: string;
  activeTab: 'full' | 'note' | 'normalize';
  onTabChange: (tab: 'full' | 'note' | 'normalize') => void;
  onSaveItem?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  noteContent,
  normalizedContent,
  activeTab,
  onTabChange,
  onSaveItem,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [history, setHistory] = useState<string[]>([code]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const { copyCodeWithToast } = useToast();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overleafFormRef = useRef<HTMLFormElement>(null);

  // Sync history when external code changes
  useEffect(() => {
    if (code !== history[historyIndex]) {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), code]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [code]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      onChange(history[newIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      onChange(history[newIdx]);
    }
  };

  const handleCopy = async () => {
    const textToCopy =
      activeTab === 'full' ? code : activeTab === 'note' ? noteContent : normalizedContent;
    
    if (!textToCopy) return;

    const label =
      activeTab === 'full'
        ? 'កូដពេញលេញ LaTeX (Full Code)'
        : activeTab === 'note'
        ? 'កំណត់សម្គាល់ (Note)'
        : 'កូដគណិតវិទ្យា (Math Code)';

    const ok = await copyCodeWithToast(textToCopy, label);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  };

  // Explicitly creates a Blob from current `code` state and triggers a browser download with a .tex file extension
  const handleDownloadTex = () => {
    if (!code) return;
    const blob = new Blob([code], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `math-latex-${new Date().toISOString().slice(0, 10)}-${Date.now()}.tex`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleDownload = (ext: '.tex' | '.txt') => {
    if (ext === '.tex') {
      handleDownloadTex();
      return;
    }
    const content =
      activeTab === 'full' ? code : activeTab === 'note' ? noteContent : normalizedContent;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `math-document-${Date.now()}${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleOpenOverleaf = () => {
    if (overleafFormRef.current) {
      overleafFormRef.current.submit();
    }
  };

  const handleSearchReplace = (replaceAll: boolean = false) => {
    if (!searchQuery) return;
    if (replaceAll) {
      const newCode = code.replaceAll(searchQuery, replaceQuery);
      onChange(newCode);
    } else {
      const newCode = code.replace(searchQuery, replaceQuery);
      onChange(newCode);
    }
  };

  // Generate line numbers
  const lines = (code || '').split('\n');
  const lineCount = Math.max(lines.length, 1);

  return (
    <div
      className={`flex flex-col h-full bg-slate-900 text-slate-100 ${
        isFullscreen ? 'fixed inset-0 z-50 p-6 bg-slate-950/95 backdrop-blur-md' : ''
      }`}
    >
      {/* Hidden Overleaf form */}
      <form
        ref={overleafFormRef}
        action="https://www.overleaf.com/docs"
        method="POST"
        target="_blank"
        className="hidden"
      >
        <input type="hidden" name="snip" value={code} />
      </form>

      {/* Header with Tabs & Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-2 gap-2 text-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onTabChange('full')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'full'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Full code
          </button>
          <button
            onClick={() => onTabChange('note')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'note'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Note
          </button>
          <button
            onClick={() => onTabChange('normalize')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === 'normalize'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            Normalize
          </button>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1 flex-wrap">
          {/* Undo / Redo */}
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1" />

          {/* Search Toggle */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            title="Search & Replace"
            className={`p-1.5 rounded transition-colors ${
              showSearch
                ? 'bg-sky-500/20 text-sky-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Select all */}
          <button
            onClick={handleSelectAll}
            title="Select All"
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded font-medium transition-all ${
              copied
                ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          {/* Download .tex */}
          <button
            onClick={() => handleDownload('.tex')}
            title="Download .tex"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .tex
          </button>

          {/* Download .txt */}
          <button
            onClick={() => handleDownload('.txt')}
            title="Download .txt"
            className="px-2 py-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors text-[11px]"
          >
            .txt
          </button>

          {/* Save to History */}
          {onSaveItem && (
            <button
              onClick={onSaveItem}
              title="Save to local library"
              className="p-1.5 rounded text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Clear */}
          <button
            onClick={() => onChange('')}
            title="Clear Code"
            className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Overleaf Button */}
          <button
            onClick={handleOpenOverleaf}
            title="Open in Overleaf"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Overleaf
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Editor'}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Search & Replace Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 flex-1 max-w-xs">
            <Search className="w-3 h-3 text-slate-500" />
            <input
              type="text"
              placeholder="Find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-slate-200 outline-none w-full text-xs font-mono"
            />
          </div>
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800 flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Replace with..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="bg-transparent border-none text-slate-200 outline-none w-full text-xs font-mono"
            />
          </div>
          <button
            onClick={() => handleSearchReplace(false)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
          >
            Replace
          </button>
          <button
            onClick={() => handleSearchReplace(true)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
          >
            All
          </button>
        </div>
      )}

      {/* Editor Content Area */}
      <div className="flex-1 relative flex overflow-hidden font-mono text-xs">
        {activeTab === 'full' ? (
          <>
            {/* Line Numbers */}
            <div className="w-11 py-3 bg-slate-950/80 border-r border-slate-800/80 text-right pr-2 text-slate-600 select-none font-mono text-[11px] leading-relaxed overflow-hidden">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable Text Area */}
            <div className="relative flex-1 w-full h-full">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleTextChange}
                spellCheck={false}
                placeholder="Compile-ready LaTeX and TikZ code will be generated here..."
                className="w-full h-full p-3 bg-transparent text-sky-100 placeholder-slate-600 resize-none outline-none leading-relaxed font-mono text-[12px] whitespace-pre selection:bg-sky-500/30 overflow-auto"
              />

              {/* Prominent Quick-Copy Floating Button */}
              {code && (
                <button
                  onClick={handleCopy}
                  title="Copy LaTeX & TikZ Code (ចុចចម្លងកូដ)"
                  className={`absolute top-3 right-4 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20 scale-105'
                      : 'bg-sky-600/90 hover:bg-sky-500 text-white shadow-sky-950/50 hover:scale-102 active:scale-95'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'បានចម្លងរួច (Copied!)' : 'ចម្លងកូដ (Copy Code)'}</span>
                </button>
              )}
            </div>
          </>
        ) : activeTab === 'note' ? (
          <div className="flex-1 p-4 overflow-auto text-slate-300 font-sans text-xs leading-relaxed space-y-3">
            <div className="font-semibold text-sky-400 flex items-center gap-1.5 text-sm">
              <Sparkles className="w-4 h-4" /> OCR Verification &amp; Math Notes
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {noteContent || 'No analysis notes available yet.'}
            </pre>
          </div>
        ) : (
          <div className="flex-1 p-4 overflow-auto text-slate-300 font-mono text-xs leading-relaxed">
            <div className="font-semibold text-emerald-400 mb-2 font-sans flex items-center gap-1.5 text-sm">
              <AlignLeft className="w-4 h-4" /> Normalized Mathematical Expressions
            </div>
            <textarea
              readOnly
              value={normalizedContent || code}
              className="w-full h-full p-3 bg-slate-950 rounded-xl border border-slate-800 text-emerald-300 resize-none outline-none font-mono text-xs"
            />
          </div>
        )}
      </div>

      {/* Editor Footer Status */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 select-none">
        <div className="flex items-center gap-3">
          <span>Lines: <strong className="text-slate-300 font-mono">{lineCount}</strong></span>
          <span>Characters: <strong className="text-slate-300 font-mono">{code.length}</strong></span>
          <span className="hidden sm:inline text-sky-400 font-medium">XeLaTeX Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <span>UTF-8</span>
          <span>TeX / TikZ</span>
        </div>
      </div>
    </div>
  );
};
