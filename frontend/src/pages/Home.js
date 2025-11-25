import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionAPI } from '../services/api';
import { getCompletionStats, clearCompletedQuestions } from '../utils/localStorage';

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await questionAPI.getAll({ limit: 200 });
      const allQuestions = response.data.questions || [];
      
      const completionStats = getCompletionStats(allQuestions);
      setStats(completionStats);
      setError(null);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearProgress = () => {
    if (window.confirm('Are you sure you want to clear all your progress? This cannot be undone.')) {
      clearCompletedQuestions(); // Clear local storage
      fetchStats(); 
    }
  };

  if (loading) return <div>Loading statistics...</div>;
  if (error) return <div>Error: {error}</div>;

  const mainCategories = Object.keys(stats);

  return (
    <div>
      <h1>Interview Prep Dashboard</h1>

      <h2>Progress by Category</h2>
      {mainCategories.length === 0 ? (
        <p>No questions available. Please check your backend connection.</p>
      ) : (
        <div>
          {mainCategories.map(category => (
            <div key={category}>
              <h3>{category}</h3>
              <p>
                {stats[category].answered} / {stats[category].total} answered - {stats[category].percentage}%
              </p>
              <progress value={stats[category].percentage} max={100}></progress>
              <hr />
            </div>
          ))}
        </div>
      )}

      <div>
        <button onClick={() => navigate('/search')}>
          Start Practicing
        </button>
        
        <button onClick={handleClearProgress}>
          Clear Progress
        </button>
      </div>
    </div>
  );
}

export default Home;