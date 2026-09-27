import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This route is deprecated. The real Social Initiatives page lives at /social.
// Any bookmarks or old links pointing here are transparently redirected.
export default function Initiatives() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/social', { replace: true });
  }, [navigate]);
  return null;
}