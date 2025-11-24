import React, { useState, useEffect } from 'react';
import { questionAPI } from '../services/api';
import { gradeAnswers } from '../utils/grading';

function Results() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [gradingResults, setGradingResults] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Category and difficulty
  const category = 'DevOps';
  const difficulty = 'Medium';

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      const params = {
        category: category,
        difficulty: difficulty,
        limit: 30 // else limit to 10 questions (set in backend model)
      };

      const response = await questionAPI.getAll(params);
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
    
    console.log('Grading Results:', results);
};

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
        <div>
      <h1>Questions Page: ({category} - {difficulty})</h1>
      
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