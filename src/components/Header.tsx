import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  FileCode,
  Layers,
  BookOpen,
  Info,
  CheckCircle2,
  ExternalLink,
  Github,
} from 'lucide-react';

export const Header: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-xs font-bold text-sm">
          ∑
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm text-slate-900 tracking-tight">
              Math Image → LaTeX &amp; TikZ Generator
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80 font-medium">
              <Sparkles className="w-2.5 h-2.5" /> AI Multimodal OCR
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-khmer">
            បម្លែងរូបភាពគណិតវិទ្យា សន្លឹកប្រឡងបាក់ឌុប និងក្រាបទៅជាកូដ XeLaTeX &amp; TikZ
          </p>
        </div>
      </div>

      {/* Right Header Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors font-khmer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">របៀបប្រើប្រាស់</span>
        </button>

        <a
          href="https://www.overleaf.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Overleaf Web</span>
        </a>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="font-bold text-base text-slate-900 font-khmer">
                សេចក្តីណែនាំអំពីការប្រើប្រាស់ (User Guide)
              </div>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed font-khmer">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold font-mono">
                  1
                </span>
                <div>
                  <strong className="text-slate-800">ជ្រើសរើស ឬបញ្ចូលរូបភាព/PDF៖</strong>
                  <p>
                    ទម្លាក់រូបភាពសន្លឹកប្រឡង ថតរូបតាមកាមេរ៉ា ឬជ្រើសរើសពីគំរូទាំង ១០
                    ប្រភេទនៅជួរខាងឆ្វេង។
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold font-mono">
                  2
                </span>
                <div>
                  <strong className="text-slate-800">កំណត់ជម្រើស និងសំណើបន្ថែម៖</strong>
                  <p>
                    ជ្រើសរើស BBT (តារាងអថេរភាព), D.Thi (ក្រាប), H.Vẽ (ធរណីមាត្រ), ឬ TikZ
                    ព្រមទាំងសរសេរបញ្ជាបន្ថែមជាភាសាខ្មែរ។
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 font-bold font-mono">
                  3
                </span>
                <div>
                  <strong className="text-slate-800">ពិនិត្យកូដ និង Compile Preview៖</strong>
                  <p>
                    កូដ LaTeX និង TikZ នឹងត្រូវបានបង្កើតឡើងយ៉ាងស្អាត។ អ្នកអាចចុច Open in
                    Overleaf ឬទាញយកឯកសារ .tex បានភ្លាមៗ!
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold"
              >
                យល់ព្រម (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
