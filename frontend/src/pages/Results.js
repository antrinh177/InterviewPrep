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
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Get category and difficulty fro form page
  const selectedCategories = location.state?.selectedSubs || [];
  const selectedDifficulty = location.state?.selectedDifficulty || [];

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const fetchQuestions = async (currentPage) => {
    try {
      setLoading(true);
      
      const params = {
        category: selectedCategories.join(','), // Configure route
        difficulty: selectedDifficulty.join(','), // Configure route
        limit: 5, // else limit to 10 questions (set in backend model)
        page: currentPage
      };

      const response = await questionAPI.search(params);
      setQuestions(response.data.questions);
      setPagination(response.data.pagination);
      setError(null);

      // Reset answers and grading when changing pages
      setAnswers({});
      setGradingResults(null);
      setIsSubmitted(false);
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

const handlePreviousPage = () => {
  if (page > 1) {
    
    const hasAnswers = Object.keys(answers).length > 0;
    // Check if user has answered any questions but hasn't submitted
    if (hasAnswers && !isSubmitted) {
      const confirmed = window.confirm(
        'You have unsubmitted answers. Your answers will be reset if you navigate to another page. Continue?'
      );
      if (!confirmed) return;
    }
    setPage(page - 1);
    window.scrollTo(0, 0);
  }
};

const handleNextPage = () => {
  if (pagination && page < pagination.total_pages) {
    
    const hasAnswers = Object.keys(answers).length > 0;
    // Check if user has answered any questions but hasn't submitted
    if (hasAnswers && !isSubmitted) {
      const confirmed = window.confirm(
        'You have unsubmitted answers. Your answers will be reset if you navigate to another page. Continue?'
      );
      if (!confirmed) return;
    }
    setPage(page + 1);
    window.scrollTo(0, 0);
  }
};

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/search')}>Search</button>
      </div>
      <h1>Questions Page: {selectedCategories.join(', ')} ({selectedDifficulty.join(', ')})</h1>

      {pagination && (
        <div style={{ marginBottom: '20px' }}>
          <p>Page {pagination.current_page} of {pagination.total_pages} ({pagination.total_questions} total questions)</p>
          <button onClick={handlePreviousPage} disabled={page === 1}>← Previous</button>
          <span style={{ margin: '0 10px' }}>Page {page}</span>
          <button onClick={handleNextPage} disabled={!pagination || page === pagination.total_pages}>Next →</button>
        </div>
      )}
      
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

      {pagination && questions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={handlePreviousPage} disabled={page === 1}>← Previous</button>
          <span style={{ margin: '0 10px' }}>Page {page} of {pagination.total_pages}</span>
          <button onClick={handleNextPage} disabled={page === pagination.total_pages}>Next →</button>
        </div>
      )}
    </div>
  );
}

export default Results;