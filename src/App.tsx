import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  StoredResults, 
  ActiveToolId 
} from './types/profile';
import { 
  getStoredProfile, 
  getStoredResults, 
  resetUserData 
} from './utils/storage';

// Layout components
import { Navbar } from './components/layout/Navbar';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Footer } from './components/layout/Footer';
import { WhatsAppFloating } from './components/layout/WhatsAppFloating';

// Profile & Homepage sections
import { HeroSection } from './components/profile/HeroSection';
import { ThreeCuriosityCards } from './components/tools/ThreeCuriosityCards';
import { WhyThisExists } from './components/profile/WhyThisExists';
import { AllToolsGrid } from './components/tools/AllToolsGrid';
import { SavedScoreSummary } from './components/profile/SavedScoreSummary';
import { EducationalArticles } from './components/insights/EducationalArticles';
import { AboutSection } from './components/profile/AboutSection';
import { PersonalConsultationSection } from './components/consultation/PersonalConsultationSection';

// Tool runners
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
  const [currentView, setCurrentView] = useState<'home' | 'tools' | 'score' | 'about'>('home');

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

  const handleNavigation = (view: 'home' | 'tools' | 'score' | 'about') => {
    setCurrentView(view);
    setActiveTool(null);

    if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'tools') {
      const el = document.getElementById('tools');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'about') {
      const el = document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (view === 'score') {
      // open last completed tool or life-readiness
      if (results.lastCompletedTool) {
        setActiveTool(results.lastCompletedTool);
      } else if (results.lifeReadiness) {
        setActiveTool('life-readiness');
      } else {
        setActiveTool('life-readiness');
      }
    }
  };

  const hasScore = !!(
    results.lifeReadiness ||
    results.financialHealth ||
    results.lifestyleAge ||
    results.emergencyRunway ||
    results.familyReadiness ||
    results.wellness
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
      {/* Sticky Personal Branding Navbar */}
      <Navbar onNavigate={handleNavigation} currentView={currentView} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTool ? (
          /* ACTIVE TOOL RUNNER VIEW */
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
          /* HOMEPAGE HIERARCHY (Section 39) */
          <>
            {/* 1 & 2. Hero Section with Primary CTA */}
            <HeroSection
              onStartLifeReadiness={() => handleSelectTool('life-readiness')}
              onExploreTools={() => {
                const el = document.getElementById('tools');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 3. Three Curiosity Cards */}
            <ThreeCuriosityCards
              onSelectTool={handleSelectTool}
              onExploreAll={() => {
                const el = document.getElementById('tools');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 4. Why This Exists */}
            <WhyThisExists />

            {/* 5. All 8 Free Tools Grid */}
            <AllToolsGrid
              onSelectTool={handleSelectTool}
              results={results}
            />

            {/* 6. Saved Score Summary (If Available) */}
            <SavedScoreSummary
              results={results}
              onSelectTool={handleSelectTool}
            />

            {/* 7. Short Educational Insights Articles */}
            <EducationalArticles />

            {/* 8. About Robert */}
            <AboutSection />

            {/* 9. Optional Personal Discussion CTA */}
            <PersonalConsultationSection />
          </>
        )}
      </main>

      {/* Subtle Floating WhatsApp Consultation */}
      <WhatsAppFloating 
        lastCompletedTool={results.lastCompletedTool} 
        isBottomNavVisible={!activeTool}
      />

      {/* Mobile Bottom Navigation - hidden when active tool is running */}
      {!activeTool && (
        <BottomNavigation
          currentView={currentView}
          onNavigate={handleNavigation}
          hasScore={hasScore}
        />
      )}

      {/* Footer with Privacy and Disclaimer */}
      <Footer />
    </div>
  );
}

export default App;
