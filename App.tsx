
import React, { useState, useEffect, useRef } from 'react';
import { Book, MessageCircle, Info, PlusCircle, ChevronLeft, ChevronRight, Moon, Sun, Shield } from 'lucide-react';
import { Glossary } from './components/Glossary';
import { Assistant } from './components/Assistant';
import { SubmitTerm } from './components/SubmitTerm';
import { Admin } from './components/Admin';
import { APP_ACCENT_COLOR } from './constants';

enum Tab {
  GLOSSARY = 'glossary',
  ASSISTANT = 'assistant',
  SUBMIT = 'submit',
  ABOUT = 'about',
  ADMIN = 'admin'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GLOSSARY);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileHeader, setShowMobileHeader] = useState(true);
  const [showMobileNav, setShowMobileNav] = useState(true);
  const lastScrollY = useRef(0);
  
  // Initialize theme from localStorage or system preference
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const handleGlobalScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Only apply to tabs other than Glossary, because Glossary handles its own 
    // internal scrolling and reports back via the onScroll prop.
    if (activeTab === Tab.GLOSSARY) return;

    const currentScrollY = e.currentTarget.scrollTop;
    const scrollingDown = currentScrollY > lastScrollY.current;
    
    if (scrollingDown && currentScrollY > 50) {
      setShowMobileHeader(false);
      setShowMobileNav(false);
    } else {
      setShowMobileNav(true);
      if (currentScrollY <= 10) {
        setShowMobileHeader(true);
      }
    }
    lastScrollY.current = currentScrollY;
  };

  const handleGlossaryScroll = (scrollingDown: boolean, currentScrollY: number) => {
    if (scrollingDown && currentScrollY > 50) {
      setShowMobileHeader(false);
      setShowMobileNav(false);
    } else {
      setShowMobileNav(true);
      if (currentScrollY <= 10) {
        setShowMobileHeader(true);
      }
    }
  };

  // Common Nav Button logic
  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`
        group flex items-center relative
        /* Mobile Styles */
        flex-col gap-1 p-2 min-w-[64px] transition-colors duration-200
        /* Desktop Styles (applied via md:) */
        md:flex-row md:w-full md:py-3 md:rounded-xl md:hover:bg-slate-50 dark:md:hover:bg-slate-800
        ${isSidebarCollapsed ? 'md:justify-center md:px-2 md:gap-0' : 'md:px-4 md:gap-3'}
      `}
      title={isSidebarCollapsed ? label : undefined}
    >
      <Icon 
        className={`
          transition-transform duration-200
          h-6 w-6
          md:h-5 md:w-5
          ${activeTab === tab ? 'scale-110 md:scale-100' : 'scale-100 group-hover:scale-110 md:group-hover:scale-100'}
        `} 
        style={{ color: activeTab === tab ? APP_ACCENT_COLOR : isDark ? '#94a3b8' : '#94a3b8' }} 
        strokeWidth={activeTab === tab ? 2.5 : 2}
      />
      <span 
        className={`
          font-medium tracking-wide transition-all duration-200 whitespace-nowrap overflow-hidden
          text-[10px] md:text-sm
          ${isSidebarCollapsed ? 'md:w-0 md:opacity-0' : 'md:w-auto md:opacity-100'}
        `}
        style={{ color: activeTab === tab ? APP_ACCENT_COLOR : isDark ? '#94a3b8' : '#64748b' }}
      >
        {label}
      </span>
      
      {/* Active Indicator for Desktop Sidebar */}
      {activeTab === tab && (
        <div 
          className={`
            hidden md:block w-1.5 h-1.5 rounded-full transition-all duration-200
            ${isSidebarCollapsed ? 'absolute right-2 top-2' : 'ml-auto'}
          `} 
          style={{ backgroundColor: APP_ACCENT_COLOR }} 
        />
      )}
    </button>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside 
        className={`
          hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full flex-shrink-0 z-20 
          transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div 
            className={`
                flex flex-col transition-all duration-300
                ${isSidebarCollapsed ? 'p-4 items-center' : 'p-6'}
            `}
        >
            <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm flex-shrink-0" style={{ backgroundColor: APP_ACCENT_COLOR }}>
                    V
                </div>
                <h1 
                  className={`
                    text-xl font-bold text-slate-800 dark:text-white tracking-tight whitespace-nowrap overflow-hidden transition-all duration-300
                    ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                  `}
                >
                  Vine Lingo
                </h1>
            </div>
            {!isSidebarCollapsed && (
                <p className="mt-1 text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-fadeIn">
                    The Unofficial Vine Dictionary
                </p>
            )}
        </div>

        <nav className={`flex-1 space-y-2 transition-all duration-300 ${isSidebarCollapsed ? 'px-2' : 'px-4'}`}>
           <NavButton tab={Tab.GLOSSARY} icon={Book} label="Glossary" />
           <NavButton tab={Tab.ASSISTANT} icon={MessageCircle} label="Assistant" />
           <NavButton tab={Tab.SUBMIT} icon={PlusCircle} label="Submit Term" />
           <NavButton tab={Tab.ABOUT} icon={Info} label="About" />
           
           <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
             <NavButton tab={Tab.ADMIN} icon={Shield} label="Admin" />
           </div>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex flex-col items-center gap-2">
           <div 
             className={`
               text-center transition-all duration-300 overflow-hidden
               ${isSidebarCollapsed ? 'h-0 opacity-0 mb-0' : 'h-auto opacity-100 mb-2'}
             `}
           >
             Community Resource<br/>Not affiliated with Amazon
           </div>
           
           <div className={`flex items-center gap-2 ${isSidebarCollapsed ? 'flex-col' : 'flex-row'}`}>
             <button
               onClick={toggleTheme}
               className="p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
               title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
               {isDark ? <Sun size={20} /> : <Moon size={20} />}
             </button>
             
             <button
               onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
               className="p-2 rounded-lg hover:bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700"
             >
               {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Mobile Header */}
        <header className={`md:hidden absolute top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-30 transition-transform duration-300 ${showMobileHeader ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col">
              <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ backgroundColor: APP_ACCENT_COLOR }}>
                      V
                  </div>
                  <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Vine Lingo</h1>
              </div>
              <p className="mt-0.5 text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  The Unofficial Vine Dictionary
              </p>
          </div>
          <button
             onClick={toggleTheme}
             className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
           >
             {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden relative flex flex-col bg-slate-50 dark:bg-slate-950">
          <div className="flex-1 overflow-y-auto pt-16 md:pt-0" onScroll={handleGlobalScroll}>
            {activeTab === Tab.GLOSSARY && <Glossary onScroll={handleGlossaryScroll} />}
            {activeTab === Tab.ASSISTANT && <Assistant />}
            {activeTab === Tab.SUBMIT && <SubmitTerm />}
            {activeTab === Tab.ADMIN && <Admin />}
            {activeTab === Tab.ABOUT && (
              <div className="flex-1 bg-slate-50 dark:bg-slate-950">
                <div className="p-6 space-y-4 max-w-2xl mx-auto w-full">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">About Vine Lingo</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-lg">
                      This app is a quick-reference guide for Amazon Vine Voices. It helps demystify the acronyms and slang used in community forums and Discord servers.
                    </p>
                    
                    <div className="flex items-start gap-4 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <Info className="w-6 h-6 flex-shrink-0" style={{ color: APP_ACCENT_COLOR }} />
                      <span className="leading-relaxed">We are not affiliated with Amazon. This is an independent community resource created to help new and existing Vine Voices navigate the program.</span>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Credits</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Built with React, Tailwind, and Google Gemini.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className={`md:hidden absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-safe pt-2 px-2 pb-4 z-30 transition-all duration-300 ${showMobileNav ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          <div className="flex justify-around items-center">
            <NavButton tab={Tab.GLOSSARY} icon={Book} label="Glossary" />
            <NavButton tab={Tab.ASSISTANT} icon={MessageCircle} label="Assistant" />
            <NavButton tab={Tab.SUBMIT} icon={PlusCircle} label="Submit" />
            <NavButton tab={Tab.ABOUT} icon={Info} label="About" />
            <NavButton tab={Tab.ADMIN} icon={Shield} label="Admin" />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default App;
