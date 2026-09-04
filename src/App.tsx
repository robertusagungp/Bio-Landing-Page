import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  StoredResults, 
  ActiveToolId 
} from './types/profile';
import { 
  getStoredProfile, 
  getStoredResults, 
  updateStoredProfile 
} from './utils/storage';

// Minimal layout components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { SimplifiedHome } from './components/home/SimplifiedHome';
import { ToolsCatalogPage } from './components/pages/ToolsCatalogPage';
import { AboutRobertPage } from './components/pages/AboutRobertPage';
import { LegalModal } from './components/pages/LegalModal';

// Rich Tool Runners (100% Preserved)
import { LifeReadinessRunner } from './components/tools/runners/LifeReadinessRunner';
import { LifestyleAgeRunner } from './components/tools/runners/LifestyleAgeRunner';
import { WellnessRunner } from './components/tools/runners/WellnessRunner';
import { FinancialHealthRunner } from './components/tools/runners/FinancialHealthRunner';
import { EmergencyCheckerRunner } from './components/tools/runners/EmergencyCheckerRunner';
import { MedicalSimulatorRunner } from './components/tools/runners/MedicalSimulatorRunner';
import { FamilyReadinessRunner } from './components/tools/runners/FamilyReadinessRunner';
import { HealthChecklistRunner } from './components/tools/runners/HealthChecklistRunner';

export function App() {
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile());
  const [results, setResults] = useState<StoredResults>(getStoredResults());
  const [activeTool, setActiveTool] = useState<ActiveToolId | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'tools' | 'about'>('home');
  const [legalModal, setLegalModal] = useState<'privacy' | 'disclaimer' | null>(null);

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

  const handleSelectTool = (toolId: ActiveToolId) => {
    setActiveTool(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseTool = () => {
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (view: 'home' | 'tools' | 'about') => {
    setCurrentView(view);
    setActiveTool(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
      {/* Minimal Top Header */}
      <Navbar onNavigate={handleNavigation} currentView={currentView} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTool ? (
          /* ACTIVE INTERACTIVE TOOL VIEW (Full depth & calculation intact) */
          <div className="py-2">
            {activeTool === 'life-readiness' && (
              <LifeReadinessRunner
                initialProfile={profile}
                savedResult={results.lifeReadiness}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'lifestyle-age' && (
              <LifestyleAgeRunner
                initialProfile={profile}
                savedResult={results.lifestyleAge}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'wellness-score' && (
              <WellnessRunner
                initialProfile={profile}
                savedResult={results.wellness}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'financial-health' && (
              <FinancialHealthRunner
                initialProfile={profile}
                savedResult={results.financialHealth}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'emergency-checker' && (
              <EmergencyCheckerRunner
                initialProfile={profile}
                savedResult={results.emergencyRunway}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'medical-simulator' && (
              <MedicalSimulatorRunner
                initialProfile={profile}
                savedResult={results.medicalScenario}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'family-readiness' && (
              <FamilyReadinessRunner
                initialProfile={profile}
                savedResult={results.familyReadiness}
                onNavigateToTool={handleSelectTool}
                onClose={handleCloseTool}
              />
            )}
            {activeTool === 'health-checklist' && (
              <HealthChecklistRunner
                initialProfile={profile}
                savedResult={results.healthChecklist}
                onNavigateToTool={handleSelectTool}
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
                savedLifeScore={results.lifeReadiness}
                onRetakeLifeScore={() => handleSelectTool('life-readiness')}
              />
            )}

            {currentView === 'tools' && (
              <ToolsCatalogPage
                onSelectTool={handleSelectTool}
                onBackToHome={() => handleNavigation('home')}
                results={results}
              />
            )}

            {currentView === 'about' && (
              <AboutRobertPage
                onBackToHome={() => handleNavigation('home')}
              />
            )}
          </>
        )}
      </main>

      {/* Minimal Clean Footer */}
      {!activeTool && (
        <Footer onOpenLegal={(type) => setLegalModal(type)} />
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
