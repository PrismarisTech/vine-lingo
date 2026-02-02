
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import { Term as TermType } from '../types';
import { Loader2, Check, X, LogOut, ShieldAlert } from 'lucide-react';
import { APP_ACCENT_COLOR } from '../constants';

export const Admin: React.FC = () => {
  const { session, isAdmin, loading, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingTerms, setPendingTerms] = useState<TermType[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingTerms();
    }
  }, [isAdmin]);

  const fetchPendingTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('terms')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingTerms(data as TermType[]);
    } catch (error) {
      console.error('Error fetching pending terms:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('terms')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setPendingTerms(pendingTerms.filter(t => t.id !== id));
      setMessage({ type: 'success', text: `Term ${status} successfully` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error(`Error updating term status:`, error);
      setMessage({ type: 'error', text: `Failed to update status: ${error.message}` });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Admin Login</h2>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                required
                className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#09BE82]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                className="block w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-[#09BE82]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 px-4 rounded-xl text-white font-semibold shadow-md active:scale-[0.98] transition-all flex items-center justify-center"
              style={{ backgroundColor: APP_ACCENT_COLOR }}
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Access Denied</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">You do not have permission to view this area.</p>
        <button
          onClick={signOut}
          className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Review Submissions</h2>
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {message && (
            <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-medium animate-fadeIn ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {message.text}
            </div>
          )}

          {pendingTerms.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No pending submissions to review.</p>
            </div>
          ) : (
            pendingTerms.map((term) => (
              <div key={term.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                        {term.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{term.term}</h3>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Definition</h4>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{term.definition}</p>
                    </div>

                    {term.example && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Example</h4>
                        <p className="text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border-l-2 border-slate-200 dark:border-slate-700">
                          "{term.example}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex md:flex-col gap-2 justify-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                    <button
                      onClick={() => handleUpdateStatus(term.id, 'approved')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(term.id, 'rejected')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
