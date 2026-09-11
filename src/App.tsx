import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  StoredResults, 
  ActiveToolId 
} from './types/profile';
import { 
  getStoredProfile, 
  getStoredResults, 
  updateStoredProfile,
  resetUserData
} from './utils/storage';
import { analytics } from './utils/analytics';

// Minimal layout components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { SimplifiedHome } from './components/home/SimplifiedHome';
import { ToolsCatalogPage } from './components/pages/ToolsCatalogPage';
import { AboutRobertPage } from './components/pages/AboutRobertPage';
import { FinancialProtectionPage } from './components/pages/FinancialProtectionPage';
import { AdminAnalyticsPage } from './components/pages/AdminAnalyticsPage';
import { AmanBerapaBulanPage } from './components/pages/AmanBerapaBulanPage';
import { LegalModal } from './components/pages/LegalModal';

// Rich Tool Runners (100% Preserved + Protection Gap)
import { LifeReadinessRunner } from './components/tools/runners/LifeReadinessRunner';
import { LifestyleAgeRunner } from './components/tools/runners/LifestyleAgeRunner';
import { WellnessRunner } from './components/tools/runners/WellnessRunner';
import { FinancialHealthRunner } from './components/tools/runners/FinancialHealthRunner';
import { EmergencyCheckerRunner } from './components/tools/runners/EmergencyCheckerRunner';
import { MedicalSimulatorRunner } from './components/tools/runners/MedicalSimulatorRunner';
import { FamilyReadinessRunner } from './components/tools/runners/FamilyReadinessRunner';
import { HealthChecklistRunner } from './components/tools/runners/HealthChecklistRunner';
import { ProtectionGapRunner } from './components/tools/runners/ProtectionGapRunner';

export type AppViewMode = 'home' | 'tools' | 'about' | 'education' | 'admin' | 'runway';

function getInitialRoute(): { view: AppViewMode; tool: ActiveToolId | null } {
  if (typeof window === 'undefined') return { view: 'home', tool: null };
  try {
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');
    const toolParam = params.get('tool');
    const eduParam = params.get('edu');
    const viewParam = params.get('view') || params.get('landing') || params.get('page');
    const path = window.location.pathname.toLowerCase();

    if (adminParam === 'analytics' || path === '/admin' || path === '/admin/analytics') {
      return { view: 'admin', tool: null };
    }
    if (path === '/aman-berapa-bulan' || path.startsWith('/aman-berapa-bulan') || viewParam === 'runway' || viewParam === 'aman-berapa-bulan') {
      return { view: 'runway', tool: null };
    }
    if (toolParam) {
      return { view: 'home', tool: toolParam as ActiveToolId };
    }
    if (eduParam === 'financial-protection') {
      return { view: 'education', tool: null };
    }
  } catch (err) {
    console.warn('[App] Route resolution error:', err);
  }
  return { view: 'home', tool: null };
}

export function App() {
  const [initialRoute] = useState(() => getInitialRoute());
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [results, setResults] = useState<StoredResults>(getStoredResults());
  const [activeTool, setActiveTool] = useState<ActiveToolId | null>(initialRoute.tool);
  const [currentView, setCurrentView] = useState<AppViewMode>(initialRoute.view);
  const [legalModal, setLegalModal] = useState<'privacy' | 'disclaimer' | null>(null);

  // Sync profile & results updates
  useEffect(() => {
    const handleProfileUpdate = () => setProfile(getStoredProfile());
    const handleResultsUpdate = () => setResults(getStoredResults());

    window.addEventListener('profile_updated', handleProfileUpdate);
    window.addEventListener('results_updated', handleResultsUpdate);

    return () => {
      window.removeEventListener('profile_updated', handleProfileUpdate);
      window.removeEventListener('results_updated', handleResultsUpdate);
    };
  }, []);

  // Auto-clear test evaluation data if visitor enters fresh via campaign/Instagram link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hasCampaignParams =
        params.has('utm_source') ||
        params.has('utm_medium') ||
        params.has('utm_campaign') ||
        params.has('igshid') ||
        params.has('fbclid') ||
        params.has('ref');
      const isExternalReferrer =
        document.referrer && !document.referrer.includes(window.location.hostname);

      if (hasCampaignParams || isExternalReferrer) {
        resetUserData();
      }
    } catch (err) {
      console.warn('[App] Session auto-reset error:', err);
    }
  }, []);

  // Global event listeners for cross-component navigation bridges
  useEffect(() => {
    const handleViewChange = (e: any) => {
      if (e.detail) {
        setActiveTool(null);
        setCurrentView(e.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleToolChange = (e: any) => {
      if (e.detail) {
        setActiveTool(e.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('agy_navigate_view', handleViewChange);
    window.addEventListener('agy_navigate_tool', handleToolChange);

    const handlePopState = () => {
      const route = getInitialRoute();
      setCurrentView(route.view);
      setActiveTool(route.tool);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('agy_navigate_view', handleViewChange);
      window.removeEventListener('agy_navigate_tool', handleToolChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSelectTool = (toolId: ActiveToolId) => {
    setActiveTool(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseTool = () => {
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (view: AppViewMode) => {
    setCurrentView(view);
    setActiveTool(null);
    if (typeof window !== 'undefined' && window.history) {
      const currentQuery = window.location.search;
      if (view === 'runway') {
        window.history.pushState({}, '', '/aman-berapa-bulan' + currentQuery);
      } else if (view === 'home') {
        window.history.pushState({}, '', '/' + currentQuery);
      } else if (view === 'admin') {
        window.history.pushState({}, '', '/admin' + currentQuery);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
      {/* Minimal Top Header (Hidden on runway page to maintain ad scent) */}
      {currentView !== 'runway' && (
        <Navbar onNavigate={handleNavigation} currentView={currentView} />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTool ? (
          /* ACTIVE INTERACTIVE TOOL VIEW */
          <div className="py-2">
            {activeTool === 'life-readiness' && (
              <LifeReadinessRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'lifestyle-age' && (
              <LifestyleAgeRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'wellness-score' && (
              <WellnessRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'financial-health' && (
              <FinancialHealthRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'emergency-checker' && (
              <EmergencyCheckerRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'medical-simulator' && (
              <MedicalSimulatorRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'family-readiness' && (
              <FamilyReadinessRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'health-checklist' && (
              <HealthChecklistRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'protection-gap' && (
              <ProtectionGapRunner
                initialProfile={profile}
                onNavigateToTool={handleSelectTool}
                onNavigateToEducation={() => {
                  setActiveTool(null);
                  setCurrentView('education');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onClose={handleCloseTool}
              />
            )}
          </div>
        ) : (
          /* DEDICATED VIEWS */
          <>
            {currentView === 'home' && (
              <SimplifiedHome
                onStartLifeScore={() => handleSelectTool('life-readiness')}
                onSelectTool={handleSelectTool}
                onNavigateToTools={() => handleNavigation('tools')}
                onNavigateToAbout={() => handleNavigation('about')}
                onNavigateToRunway={() => handleNavigation('runway')}
                savedLifeScore={results.lifeReadiness}
                onRetakeLifeScore={() => handleSelectTool('life-readiness')}
                results={results}
              />
            )}

            {currentView === 'tools' && (
              <ToolsCatalogPage
                onSelectTool={handleSelectTool}
                onBackToHome={() => handleNavigation('home')}
                onNavigateToEducation={() => {
                  setCurrentView('education');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                results={results}
              />
            )}

            {currentView === 'about' && (
              <AboutRobertPage
                onBackToHome={() => handleNavigation('home')}
              />
            )}

            {currentView === 'education' && (
              <FinancialProtectionPage
                onBack={() => {
                  setCurrentView('tools');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onStartProtectionGap={() => handleSelectTool('protection-gap')}
              />
            )}

            {currentView === 'admin' && (
              <AdminAnalyticsPage
                onBackToHome={() => {
                  handleNavigation('home');
                }}
              />
            )}

            {currentView === 'runway' && (
              <AmanBerapaBulanPage
                onNavigateToHome={() => handleNavigation('home')}
                onNavigateToTool={handleSelectTool}
              />
            )}
          </>
        )}
      </main>

      {/* Minimal Clean Footer */}
      {!activeTool && currentView !== 'admin' && currentView !== 'runway' && (
        <Footer 
          onOpenLegal={(type) => setLegalModal(type)}
          onOpenAdmin={() => {
            handleNavigation('admin');
          }}
        />
      )}

      {/* Privacy / Disclaimer Modal */}
      {legalModal && (
        <LegalModal
          type={legalModal}
          onClose={() => setLegalModal(null)}
        />
      )}
    </div>
  );
}

export default App;
