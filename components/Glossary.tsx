
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Hash, Loader2 } from 'lucide-react';
import { APP_ACCENT_COLOR, CATEGORIES } from '../constants';
import { TermCategory, Term } from '../types';
import { supabase } from '../supabaseClient';

export const Glossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TermCategory>(TermCategory.ALL);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .eq('status', 'approved')
        .order('term', { ascending: true });

      if (error) throw error;
      setTerms(data as Term[]);
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === TermCategory.ALL || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, terms]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Search and Filter Header */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shadow-sm border-b border-slate-100 dark:border-slate-800 px-4 py-3 space-y-3 transition-colors">
        <div className="max-w-5xl mx-auto w-full space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-[#09BE82] focus:border-transparent transition duration-150 ease-in-out sm:text-sm"
              placeholder="Search acronyms, slang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar md:-mx-0">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors
                  ${selectedCategory === category 
                    ? `bg-[${APP_ACCENT_COLOR}] text-white shadow-md` 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}
                `}
                style={selectedCategory === category ? { backgroundColor: APP_ACCENT_COLOR } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-5xl mx-auto w-full">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : filteredTerms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 dark:text-slate-500">
              <Search className="h-12 w-12 mb-3 opacity-20" />
              <p className="text-lg font-medium">No terms found</p>
              <p className="text-sm">Try adjusting your search or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24 md:pb-8">
              {filteredTerms.map((term) => (
                <div 
                  key={term.id} 
                  onClick={() => toggleExpand(term.id)}
                  className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 h-fit"
                >
                  <div className="flex items-start p-4">
                    <div 
                      className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4"
                      style={{ backgroundColor: APP_ACCENT_COLOR }}
                    >
                      {term.term.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate pr-2">
                          {term.term}
                        </h3>
                        {expandedId === term.id ? (
                          <ChevronUp className="h-5 w-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <p className={`text-sm text-slate-600 dark:text-slate-400 leading-relaxed ${expandedId === term.id ? '' : 'line-clamp-2'}`}>
                        {term.definition}
                      </p>
                      
                      {/* Expanded Content */}
                      {expandedId === term.id && (
                        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-800 animate-fadeIn">
                          {term.example && (
                            <div className="mb-2">
                              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Example Usage</span>
                              <p className="text-sm text-slate-600 dark:text-slate-300 italic mt-1 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border-l-2 border-[#09BE82]" style={{borderColor: APP_ACCENT_COLOR}}>
                                "{term.example}"
                              </p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                              <Hash className="w-3 h-3 mr-1 text-slate-400 dark:text-slate-500" />
                              {term.category}
                            </span>
                            {term.tags?.map(tag => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
