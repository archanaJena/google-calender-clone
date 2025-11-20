import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/calendar?view=month');
  }, [navigate]);

  return null;
};

export default Index;
