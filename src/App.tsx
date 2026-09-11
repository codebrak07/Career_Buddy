import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { ExplainabilityDrawer } from './components/common/ExplainabilityDrawer';
import { LandingScreen } from './components/screens/LandingScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { SkillIntelligenceScreen } from './components/screens/SkillIntelligenceScreen';
import { CareerIntelligenceScreen } from './components/screens/CareerIntelligenceScreen';
import { CareerDetailScreen } from './components/screens/CareerDetailScreen';
import { GapIntelligenceScreen } from './components/screens/GapIntelligenceScreen';
import { LearningJourneyScreen } from './components/screens/LearningJourneyScreen';
import { AssessmentScreen } from './components/screens/AssessmentScreen';
import { ProgressTrajectoryScreen } from './components/screens/ProgressTrajectoryScreen';
import { CandidatePortalScreen } from './components/screens/CandidatePortalScreen';
import { GroqAssistantBot } from './components/common/GroqAssistantBot';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeScreen, toast } = useApp();

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'landing': return <LandingScreen />;
      case 'candidate_portal': return <CandidatePortalScreen />;
      case 'profile': return <ProfileScreen />;
      case 'skills': return <SkillIntelligenceScreen />;
      case 'careers': return <CareerIntelligenceScreen />;
      case 'career_detail': return <CareerDetailScreen />;
      case 'gap_dag': return <GapIntelligenceScreen />;
      case 'learning': return <LearningJourneyScreen />;
      case 'assessment': return <AssessmentScreen />;
      case 'trajectory': return <ProgressTrajectoryScreen />;
      default: return <LandingScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--canvas)', color: 'var(--ink-1)' }}>
      {/* Telemetry Header */}
      <Header />

      {/* 9-Screen Navigation Tab Bar */}
      <Navigation />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-10 py-6" style={{ maxWidth: '1400px' }}>
        {renderActiveScreen()}
      </main>

      {/* Mathematical Explainability Side Drawer */}
      <ExplainabilityDrawer />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
          <div className="paper-card p-4 max-w-md border-stone-300 shadow-xl bg-white flex items-start space-x-3">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold font-mono text-slate-900">{toast.title}</div>
              <div className="text-xs text-stone-600 mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Instrument Footer */}
      <footer
        className="py-5 text-center text-xs font-mono"
        style={{ borderTop: '1px solid var(--border-0)', background: 'var(--canvas-warm)', color: 'var(--ink-5)' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span style={{ color: 'var(--ink-4)' }}>CAREER BUDDY</span>
          </div>
          <div style={{ color: 'var(--ink-5)', fontSize: '10px' }}>
            Curated ref dataset · Deterministic 6-Factor Scorer · Evidence ≠ Certification
          </div>
        </div>
      </footer>

      {/* Floating Groq Assistant Chatbot */}
      <GroqAssistantBot />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
