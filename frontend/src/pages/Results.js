import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { questionAPI } from '../services/api';
import { gradeAnswers } from '../utils/grading';
import { addCompletedQuestion } from '../utils/localStorage';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [gradingResults, setGradingResults] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get category and difficulty fro form page
  const selectedCategories = location.state?.selectedSubs || [];
  const selectedDifficulty = location.state?.selectedDifficulty || [];

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      const params = {
        category: selectedCategories.join(','), // Configure route
        difficulty: selectedDifficulty.join(','), // Configure route
        limit: 30 // else limit to 10 questions (set in backend model)
      };

      const response = await questionAPI.search(params);
      setQuestions(response.data.questions);
      setError(null);
    } catch (err) {
      setError('Failed to load questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if at least one question is answered
    const answeredQuestions = Object.values(answers).filter(answer => answer.trim() !== '');
    
    if (answeredQuestions.length === 0) {
        alert('Please answer at least one question before submitting.');
        return;
  }

  // Grade the answers
    const results = gradeAnswers(answers, questions);
    setGradingResults(results);
    setIsSubmitted(true);
    
    // Save completed questions to localStorage
    Object.keys(results.questionResults).forEach(questionId => {
      const question = questions.find(q => q._id === questionId);
      const result = results.questionResults[questionId];
      
      if (question) {
        addCompletedQuestion({
          id: questionId,
          main: question.main || 'Uncategorized',
          category: question.Category,
          difficulty: question.Difficulty,
          percentage: result.percentage
        });
      }
    });
    
    console.log('Grading Results:', results);
};

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/search')}>Search</button>
      </div>
      <h1>Questions Page: {selectedCategories.join(', ')} ({selectedDifficulty.join(', ')})</h1>
      
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <p>Found {questions.length} questions</p>
          {questions.map((question, index) => {
            const result = gradingResults?.questionResults[question._id];
            
            return (
              <div key={question._id}>
                <h3>{index + 1}. {question.Question}</h3>
                <input
                  type="text"
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  placeholder="Your answer..."
                  disabled={isSubmitted}
                />
                
                {result && (
                  <div>
                    <p>Score: {result.percentage}%</p>
                    <details>
                      <summary>View Correct Answer</summary>
                      <p>{result.correctAnswer}</p>
                    </details>
                  </div>
                )}
                <hr />
              </div>
            );
          })}
          
          {!isSubmitted && (
            <button type="submit">Submit</button>
          )}
        </form>
      )}
    </div>
  );
}

export default Results;