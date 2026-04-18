import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function NavigationTracker() {
  const location = useLocation();

  useEffect(() => {
    const name = location.pathname.replace('/', '') || 'Home';
    document.title = `SocietyOne | ${name}`;
  }, [location.pathname]);

  return null;
}
