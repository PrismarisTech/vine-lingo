
import React, { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { APP_ACCENT_COLOR, CATEGORIES } from '../constants';
import { TermCategory } from '../types';
import { supabase } from '../supabaseClient';

export const SubmitTerm: React.FC = () => {
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    category: TermCategory.GENERAL,
    example: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.definition) return;

    setStatus('submitting');
    setErrorMessage('');
    
    try {
      const { error } = await supabase
        .from('terms')
        .insert([
          {
            term: formData.term,
            definition: formData.definition,
            category: formData.category,
            example: formData.example || null,
            tags: [], // Could add tag input later
            status: 'pending'
          }
        ]);

      if (error) throw error;

      setStatus('success');
      setFormData({
        term: '',
        definition: '',
        category: TermCategory.GENERAL,
        example: ''
      });
    } catch (error: any) {
      console.error('Error submitting term:', error);
      setStatus('error');
      setErrorMessage(error.message || 'Failed to submit term. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fadeIn bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Submission Received!</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
            Thank you for contributing to the community glossary. Your term will be reviewed shortly.
            </p>
            <button 
            onClick={() => setStatus('idle')}
            className="px-6 py-2.5 rounded-xl text-white font-medium shadow-md transition-transform active:scale-95"
            style={{ backgroundColor: APP_ACCENT_COLOR }}
            >
            Submit Another Term
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto transition-colors">
      <div className="p-6 space-y-6 pb-24 md:pb-8 w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Contribute a Term</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Help the community grow by adding missing slang, acronyms, or definitions.
          </p>

          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Term or Acronym <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:border-transparent outline-none transition-all placeholder-slate-300 dark:placeholder-slate-600"
                style={{ '--tw-ring-color': APP_ACCENT_COLOR } as React.CSSProperties}
                placeholder="e.g. ETV"
                value={formData.term}
                onChange={e => setFormData({...formData, term: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <div className="relative">
                <select
                  className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:border-transparent outline-none transition-all appearance-none"
                  style={{ '--tw-ring-color': APP_ACCENT_COLOR } as React.CSSProperties}
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value as TermCategory})}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Definition <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:border-transparent outline-none transition-all resize-none placeholder-slate-300 dark:placeholder-slate-600"
                style={{ '--tw-ring-color': APP_ACCENT_COLOR } as React.CSSProperties}
                placeholder="Explain what it means..."
                value={formData.definition}
                onChange={e => setFormData({...formData, definition: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Example Usage / Notes (Optional)
              </label>
              <textarea
                rows={2}
                className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:border-transparent outline-none transition-all resize-none placeholder-slate-300 dark:placeholder-slate-600"
                style={{ '--tw-ring-color': APP_ACCENT_COLOR } as React.CSSProperties}
                placeholder="Contextual example..."
                value={formData.example}
                onChange={e => setFormData({...formData, example: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              style={{ backgroundColor: APP_ACCENT_COLOR }}
            >
              {status === 'submitting' ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Term
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
