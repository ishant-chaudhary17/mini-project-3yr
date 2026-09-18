import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/landing/LandingPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPath(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (hash: string) => {
    window.location.hash = hash;
  };

  return (
    <>
      {currentPath === '#/app' ? (
        <Dashboard />
      ) : (
        <LandingPage onLaunch={() => navigate('#/app')} />
      )}
    </>
  );
}
