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
import { BrandLogo } from './components/common/BrandLogo';
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

      {/* Main Content Viewport with Generous Spacing */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-12" style={{ maxWidth: '1400px' }}>
        {renderActiveScreen()}
      </main>

      {/* Mathematical Explainability Side Drawer */}
      <ExplainabilityDrawer />

      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-in-right">
          <div className="editorial-card p-4 max-w-md bg-white border border-[#E8E4DA] shadow-xl flex items-start space-x-3.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold font-mono text-[#14171A]">{toast.title}</div>
              <div className="text-xs text-[#52525B] mt-0.5 leading-relaxed">{toast.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Instrument Footer */}
      <footer
        className="py-8 text-xs font-mono"
        style={{ borderTop: '1px solid var(--border-0)', background: 'var(--canvas)', color: 'var(--ink-4)' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <BrandLogo className="w-4 h-4" />
            <span className="font-bold tracking-tight text-[#14171A]">CAREER BUDDY</span>
            <span className="text-[#DDD8CE]">/</span>
            <span className="text-[11px] text-[#6E7A8A]">Evidence-Aware Technical Career Intelligence</span>
          </div>
          <div className="text-[11px] text-[#6E7A8A]">
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
