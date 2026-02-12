import React, { useState } from 'react';
import Home from './components/Home';
import LoadingScreen from './components/LoadingScreen';
import WordHunt from './components/WordHunt';
import CodeDebugging from './components/CodeDebugging';
import CodeRush from './components/CodeRush';
import TechPicto from './components/TechPicto';
import EventSelection from './components/EventSelection';

import AdminDashboard from './components/AdminDashboard';

function App() {
  const [gameState, setGameState] = useState('home'); // 'home', 'loading', 'event-selection', 'word-hunt', 'admin'

  // Secret Hotkey for Admin Dashboard
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        setGameState('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStart = (target) => {
    if (target === 'admin-login') {
      setGameState('admin-login');
    } else {
      setGameState('loading');
    }
  };

  const handleLoadingComplete = () => {
    setGameState('event-selection');
  };

  const handleSelectEvent = (eventId) => {
    if (eventId === 'word-hunt') {
      setGameState('word-hunt');
    } else if (eventId === 'code-debugging') {
      setGameState('code-debugging');
    } else if (eventId === 'code-rush') {
      setGameState('code-rush');
    } else if (eventId === 'tech-picto') {
      setGameState('tech-picto');
    }
  };

  const handleBack = () => {
    setGameState('event-selection');
  };

  const handleFinishEvent = () => {
    setGameState('event-selection');
  };

  return (
    <div className="App overflow-x-hidden">
      {gameState === 'home' && <Home onStart={handleStart} />}
      {gameState === 'loading' && <LoadingScreen onComplete={handleLoadingComplete} />}
      {gameState === 'event-selection' && <EventSelection onSelect={handleSelectEvent} />}
      {gameState === 'word-hunt' && <WordHunt onBack={handleBack} onFinish={handleFinishEvent} />}
      {gameState === 'code-debugging' && <CodeDebugging onBack={handleBack} onFinish={handleFinishEvent} />}
      {gameState === 'code-rush' && <CodeRush onBack={handleBack} onFinish={handleFinishEvent} />}
      {gameState === 'tech-picto' && <TechPicto onBack={handleBack} onFinish={handleFinishEvent} />}
      {gameState === 'admin-login' && (
        <React.Suspense fallback={null}>
          {React.createElement(React.lazy(() => import('./components/AdminLogin')), {
            onLogin: () => setGameState('admin'),
            onCancel: () => setGameState('home')
          })}
        </React.Suspense>
      )}
      {gameState === 'admin' && <AdminDashboard onBack={() => setGameState('home')} />}
    </div>
  );
}

export default App;

