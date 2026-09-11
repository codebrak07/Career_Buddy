import React from 'react';
import { useApp } from '../../context/AppContext';
import type { ScreenTab } from '../../context/AppContext';
import type { BentoModuleId } from '../../hooks/useBentoFocus';
import { 
  Home, 
  FileText, 
  Cpu, 
  Target, 
  GitBranch, 
  BookOpen, 
  CheckSquare, 
  TrendingUp,
  Layers,
  Sparkles
} from 'lucide-react';

interface NavItem {
  id: ScreenTab;
  index: string;
  label: string;
  engine: 'DET' | 'AI' | 'HYBRID';
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: 'flame' | 'green' | 'sky' | 'ghost';
  relatedModules: BentoModuleId[];
}

export const Navigation: React.FC = () => {
  const { activeScreen, setActiveScreen, selectedRoleMatch, bentoFocus, appMode, candidateUser } = useApp();

  // In candidate mode, do not display navigation tabs if user is on the sign-in / registration gate
  if (appMode === 'candidate' && !candidateUser) {
    return null;
  }

  const navItems: NavItem[] = appMode === 'candidate' ? [
    {
      id: 'candidate_portal' as ScreenTab,
      index: '00',
      label: 'Intake & Validation',
      engine: 'AI' as const,
      icon: <Sparkles className="w-3.5 h-3.5 text-[#FF4F00]" />,
      badge: 'AI TEST',
      badgeColor: 'flame' as const,
      relatedModules: ['evidence' as BentoModuleId]
    },
    { 
      id: 'profile',       
      index: '01', 
      label: 'My Evidence Dossier',      
      engine: 'AI',     
      icon: <FileText className="w-3.5 h-3.5" />, 
      badge: 'VERIFIED', 
      badgeColor: 'ghost',
      relatedModules: ['evidence']
    },
    { 
      id: 'career_detail', 
      index: '02', 
      label: 'Career Readiness',   
      engine: 'DET',    
      icon: <Layers className="w-3.5 h-3.5" />, 
      badge: `${selectedRoleMatch.overallScore}%`, 
      badgeColor: 'green',
      relatedModules: ['career', 'blockers']
    },
  ] : [
    { 
      id: 'landing',       
      index: '00', 
      label: 'Overview',      
      engine: 'HYBRID', 
      icon: <Home className="w-3.5 h-3.5" />,
      relatedModules: ['readiness']
    },
    { 
      id: 'profile',       
      index: '01', 
      label: 'Evidence',      
      engine: 'AI',     
      icon: <FileText className="w-3.5 h-3.5" />, 
      badge: 'DOSSIER', 
      badgeColor: 'ghost',
      relatedModules: ['evidence']
    },
    { 
      id: 'skills',        
      index: '02', 
      label: 'Skills',        
      engine: 'DET',    
      icon: <Cpu className="w-3.5 h-3.5" />,
      relatedModules: ['skills']
    },
    { 
      id: 'careers',       
      index: '03', 
      label: 'Careers',       
      engine: 'DET',    
      icon: <Target className="w-3.5 h-3.5" />,
      relatedModules: ['career', 'career-reachable']
    },
    { 
      id: 'career_detail', 
      index: '04', 
      label: 'Role Matrix',   
      engine: 'DET',    
      icon: <Layers className="w-3.5 h-3.5" />, 
      badge: `${selectedRoleMatch.overallScore}%`, 
      badgeColor: 'green',
      relatedModules: ['career', 'blockers']
    },
    { 
      id: 'gap_dag',       
      index: '05', 
      label: 'Gap DAG',       
      engine: 'DET',    
      icon: <GitBranch className="w-3.5 h-3.5" />,
      relatedModules: ['gap', 'blockers']
    },
    { 
      id: 'learning',      
      index: '06', 
      label: 'Learning',      
      engine: 'HYBRID', 
      icon: <BookOpen className="w-3.5 h-3.5" />,
      relatedModules: ['learning']
    },
    { 
      id: 'assessment',    
      index: '07', 
      label: 'Validation',    
      engine: 'DET',    
      icon: <CheckSquare className="w-3.5 h-3.5" />, 
      badge: 'LIVE', 
      badgeColor: 'flame',
      relatedModules: ['validation']
    },
    { 
      id: 'trajectory',    
      index: '08', 
      label: 'Trajectory',    
      engine: 'DET',    
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      relatedModules: ['trajectory']
    },
  ];

  const badgeBg = {
    flame: 'var(--flame-bg)',
    green: 'var(--emerald-bg)',
    sky:   'var(--sky-bg)',
    ghost: 'var(--canvas-warm)',
  };
  const badgeColor = {
    flame: 'var(--flame-dark)',
    green: 'var(--emerald)',
    sky:   'var(--sky)',
    ghost: 'var(--ink-4)',
  };
  const badgeBorder = {
    flame: 'var(--flame-border)',
    green: 'var(--emerald-border)',
    sky:   'var(--sky-border)',
    ghost: 'var(--border-1)',
  };

  return (
    <nav 
      className="nav-rail sticky z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E7E2D6]"
      style={{ top: '80px' }}
      aria-label="Instrument Navigation"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar py-1 gap-1">
          <div className="flex items-center gap-1 min-w-max">
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              const hasFocusSignal = bentoFocus && item.relatedModules.includes(bentoFocus.activeModule);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveScreen(item.id);
                    bentoFocus?.pauseFocus();
                  }}
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono transition-all duration-150 ${
                    isActive 
                      ? 'bg-[#18181B] text-white shadow-sm font-semibold' 
                      : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F2EFE8]'
                  }`}
                >
                  {/* Section index */}
                  <span className={`text-[10px] font-mono tracking-tighter ${
                    isActive ? 'text-[#FF4F00]' : 'text-[#A1A1AA] group-hover:text-[#71717A]'
                  }`}>
                    {item.index}
                  </span>

                  {/* Icon */}
                  <span className={isActive ? 'text-white' : 'text-[#71717A] group-hover:text-[#18181B]'}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="tracking-tight">{item.label}</span>

                  {/* Engine tag */}
                  <span 
                    className={`text-[8px] font-mono px-1 py-0.2 rounded uppercase ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.engine === 'DET'
                        ? 'bg-emerald-100/70 text-emerald-800'
                        : item.engine === 'AI'
                        ? 'bg-indigo-100/70 text-indigo-800'
                        : 'bg-stone-200/60 text-stone-700'
                    }`}
                  >
                    {item.engine}
                  </span>

                  {/* Optional dynamic badge */}
                  {item.badge && (
                    <span
                      className="text-[9px] font-mono font-bold px-1.5 py-px rounded border"
                      style={{
                        background: isActive ? 'rgba(255, 79, 0, 0.2)' : badgeBg[item.badgeColor || 'ghost'],
                        color: isActive ? '#FFA07A' : badgeColor[item.badgeColor || 'ghost'],
                        borderColor: isActive ? '#FF4F00' : badgeBorder[item.badgeColor || 'ghost'],
                      }}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Bento focus active beacon */}
                  {hasFocusSignal && !isActive && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full bg-[#FF4F00] animate-ping ml-0.5" 
                      title={`Bento focus: ${bentoFocus.activeModule}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick status on the right */}
          <div className="hidden md:flex items-center gap-2 pl-4 text-[10px] font-mono text-[#71717A] shrink-0">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>DAG: SYNCED</span>
            <span className="text-[#D4D4D8]">|</span>
            <span>AUDIT: 100% EXPLAINABLE</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
