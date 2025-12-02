import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ResumeBuilder } from './components/ResumeBuilder';
import { JobSearch } from './components/JobSearch';
import { InterviewPrep } from './components/InterviewPrep';
import { ApplicationTracker } from './components/ApplicationTracker';
import { Dashboard } from './components/Dashboard';
import { AppView, UserProfile, JobApplication } from './types';

// Default initial state
const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex.j@example.com',
  phone: '(555) 123-4567',
  summary: 'Passionate software engineer with 3 years of experience...',
  skills: ['React', 'TypeScript', 'Node.js'],
  experience: [],
  education: [],
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  // State persistence logic could be extracted to a custom hook
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (app: JobApplication) => {
    setApplications([...applications, app]);
  };

  const handleUpdateApplication = (updatedApp: JobApplication) => {
    setApplications(applications.map(app => app.id === updatedApp.id ? updatedApp : app));
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter(app => app.id !== id));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard profile={userProfile} applications={applications} />;
      case AppView.RESUME:
        return <ResumeBuilder profile={userProfile} onUpdateProfile={setUserProfile} />;
      case AppView.JOBS:
        return <JobSearch userProfile={userProfile} />;
      case AppView.INTERVIEW:
        return <InterviewPrep />;
      case AppView.TRACKER:
        return (
          <ApplicationTracker 
            applications={applications} 
            onAddApplication={handleAddApplication}
            onUpdateApplication={handleUpdateApplication}
            onDeleteApplication={handleDeleteApplication}
          />
        );
      default:
        return <Dashboard profile={userProfile} applications={applications} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen scrollbar-thin">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
