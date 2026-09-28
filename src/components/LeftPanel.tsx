import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Variable,
  TrendingUp,
  LineChart,
  Shapes,
  TableProperties,
  BarChart2,
  Percent,
  PenTool,
  FileCode2,
  Search,
  BookOpen,
  Bookmark,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, SAMPLES } from '../data/samples';
import { CategoryId, SampleItem } from '../types';

interface LeftPanelProps {
  selectedCategoryId: CategoryId | 'all';
  onSelectCategory: (id: CategoryId | 'all') => void;
  onSelectSample: (sample: SampleItem) => void;
  savedItems?: SampleItem[];
}

// Icon mapping helper
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Calculator':
      return <Calculator className="w-4 h-4" />;
    case 'Variable':
      return <Variable className="w-4 h-4" />;
    case 'TrendingUp':
      return <TrendingUp className="w-4 h-4" />;
    case 'LineChart':
      return <LineChart className="w-4 h-4" />;
    case 'Shapes':
      return <Shapes className="w-4 h-4" />;
    case 'TableProperties':
      return <TableProperties className="w-4 h-4" />;
    case 'BarChart2':
      return <BarChart2 className="w-4 h-4" />;
    case 'Percent':
      return <Percent className="w-4 h-4" />;
    case 'PenTool':
      return <PenTool className="w-4 h-4" />;
    case 'FileCode2':
      return <FileCode2 className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export const LeftPanel: React.FC<LeftPanelProps> = ({
  selectedCategoryId,
  onSelectCategory,
  onSelectSample,
  savedItems = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'saved'>('categories');

  // Filtered samples based on search or category
  const filteredSamples = useMemo(() => {
    let list = SAMPLES;
    if (selectedCategoryId !== 'all') {
      list = list.filter((s) => s.categoryId === selectedCategoryId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.titleKh.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.typeBadge.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedCategoryId, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-xs">
              M
            </div>
            <div>
              <h2 className="font-semibold text-slate-800 text-xs tracking-tight font-khmer">
                ជ្រើសរើសប្រភេទ
              </h2>
              <p className="text-[10px] text-slate-500">Select Mathematical Type</p>
            </div>
          </div>

          {/* Saved count badge */}
          {savedItems.length > 0 && (
            <button
              onClick={() => setActiveTab(activeTab === 'saved' ? 'categories' : 'saved')}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              <Bookmark className="w-3 h-3 text-amber-600" />
              <span>{savedItems.length}</span>
            </button>
          )}
        </div>

        {/* Search input: ស្វែងរកគំរូ */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ស្វែងរកគំរូ (Search templates)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition-all font-khmer"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'saved' ? (
          <div className="p-3 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
              រូបមន្តបានរក្សាទុក (Saved Library)
            </div>
            {savedItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                មិនទាន់មានរូបមន្តរក្សាទុកនៅឡើយទេ។
              </div>
            ) : (
              savedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectSample(item)}
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-all"
                >
                  <div className="font-medium text-xs text-slate-800 font-khmer">
                    {item.titleKh}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.titleEn}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-2 space-y-3">
            {/* 10 Categories List */}
            <div>
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <span>ប្រភេទទូទៅ (Categories)</span>
                {selectedCategoryId !== 'all' && (
                  <button
                    onClick={() => onSelectCategory('all')}
                    className="text-sky-600 hover:underline capitalize text-[10px]"
                  >
                    បង្ហាញទាំងអស់
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-0.5 mt-1">
                {CATEGORIES.map((cat, idx) => {
                  const isSelected = selectedCategoryId === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
                      className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-left transition-all group ${
                        isSelected
                          ? 'bg-sky-50 border border-sky-200 text-sky-800 shadow-xs'
                          : 'hover:bg-slate-100 text-slate-700 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`p-1 rounded-md transition-colors ${
                            isSelected
                              ? 'bg-sky-500 text-white'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-800'
                          }`}
                        >
                          {getCategoryIcon(cat.iconName)}
                        </span>
                        <div className="truncate">
                          <div className="text-xs font-medium font-khmer flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {idx + 1}.
                            </span>
                            <span>{cat.nameKh}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {cat.nameEn}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-sky-600 rotate-90' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Matching Templates / Examples */}
            <div className="pt-2 border-t border-slate-200">
              <div className="px-2 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>គំរូអនុវត្ត (Examples &amp; Exams)</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {filteredSamples.length}
                </span>
              </div>

              <div className="space-y-1.5 mt-1">
                {filteredSamples.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-sky-300 hover:shadow-xs cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <span className="text-xs font-semibold text-slate-800 font-khmer group-hover:text-sky-700 transition-colors">
                        {sample.titleKh}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-100/70 text-sky-800 font-medium">
                        {sample.typeBadge}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                      {sample.description}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-sky-600 group-hover:underline flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> សាកល្បងគំរូនេះ
                      </span>
                      <span className="font-mono text-[9px]">LaTeX / TikZ</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
        <span className="font-khmer">គាំទ្រ XeLaTeX &amp; TikZ</span>
        <span className="font-mono text-[9px] text-slate-400">v2.4.0</span>
      </div>
    </div>
  );
};
