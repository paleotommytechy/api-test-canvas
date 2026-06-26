import React from 'react';
import { Sidebar } from './components/playground/Sidebar';
import { TopBar } from './components/playground/TopBar';
import { MainContent } from './components/playground/MainContent';
import { useApiStore } from './store/useApiStore';
import { WelcomeHero } from './components/playground/WelcomeHero';
import { Toaster } from './components/ui/sonner';

function App() {
  const currentDoc = useApiStore((state) => state.currentDoc);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Toaster position="top-center" />
      
      {!currentDoc ? (
        <WelcomeHero />
      ) : (
        <>
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <TopBar />
            <main className="flex-1 overflow-auto p-6">
              <MainContent />
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
