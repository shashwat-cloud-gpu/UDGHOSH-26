import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This route is deprecated. Redirects to the Vision & Impact page.
export default function Impacts() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/vision', { replace: true });
  }, [navigate]);
  return null;
}