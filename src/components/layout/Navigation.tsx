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
  label: string;
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
      label: 'Intake & Validation',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />,
      badge: 'AI TEST',
      badgeColor: 'flame' as const,
      relatedModules: ['evidence' as BentoModuleId]
    },
    { 
      id: 'profile',       
      label: 'Evidence Dossier',      
      icon: <FileText className="w-3.5 h-3.5" />, 
      relatedModules: ['evidence']
    },
    { 
      id: 'career_detail', 
      label: 'Career Readiness',   
      icon: <Layers className="w-3.5 h-3.5" />, 
      badge: `${selectedRoleMatch.overallScore}%`, 
      badgeColor: 'green',
      relatedModules: ['career', 'blockers']
    },
  ] : [
    { 
      id: 'landing',       
      label: 'Overview',      
      icon: <Home className="w-4 h-4" />,
      relatedModules: ['readiness']
    },
    { 
      id: 'profile',       
      label: 'Evidence',      
      icon: <FileText className="w-4 h-4" />, 
      relatedModules: ['evidence']
    },
    { 
      id: 'skills',        
      label: 'Skills',        
      icon: <Cpu className="w-4 h-4" />,
      relatedModules: ['skills']
    },
    { 
      id: 'careers',       
      label: 'Careers',       
      icon: <Target className="w-4 h-4" />,
      relatedModules: ['career', 'career-reachable']
    },
    { 
      id: 'career_detail', 
      label: 'Role Matrix',   
      icon: <Layers className="w-4 h-4" />, 
      badge: `${selectedRoleMatch.overallScore}%`, 
      badgeColor: 'green',
      relatedModules: ['career', 'blockers']
    },
    { 
      id: 'gap_dag',       
      label: 'Gap DAG',       
      icon: <GitBranch className="w-4 h-4" />,
      relatedModules: ['gap', 'blockers']
    },
    { 
      id: 'learning',      
      label: 'Learning',      
      icon: <BookOpen className="w-4 h-4" />,
      relatedModules: ['learning']
    },
    { 
      id: 'assessment',    
      label: 'Validation',    
      icon: <CheckSquare className="w-4 h-4" />, 
      badge: 'LIVE', 
      badgeColor: 'flame',
      relatedModules: ['validation']
    },
    { 
      id: 'trajectory',    
      label: 'Trajectory',    
      icon: <TrendingUp className="w-4 h-4" />,
      relatedModules: ['trajectory']
    },
  ];

  return (
    <nav 
      className="nav-rail sticky z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#EAE6DF]"
      style={{ top: '56px' }}
      aria-label="Platform Navigation"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center overflow-x-auto no-scrollbar py-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max mx-auto">
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
                  className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive 
                      ? 'bg-[#14171A] text-white shadow-xs font-semibold' 
                      : 'text-[#525B67] hover:text-[#14171A] hover:bg-black/[0.04]'
                  }`}
                >
                  {/* Icon */}
                  <span className={`transition-colors ${isActive ? 'text-white' : 'text-[#7D8895] group-hover:text-[#14171A]'}`}>
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span className="tracking-tight">{item.label}</span>

                  {/* Optional dynamic badge (restrained & quiet) */}
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor === 'flame'
                          ? 'bg-[#FFF5F0] text-[#FF5A1F] border border-[#FFD5C4]'
                          : 'bg-[#F0FDF4] text-[#059669] border border-[#BBF7D0]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Bento focus active beacon */}
                  {hasFocusSignal && !isActive && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-ping ml-0.5" 
                      title={`Bento focus: ${bentoFocus.activeModule}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
