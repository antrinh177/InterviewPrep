import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { questionAPI } from "../services/api";
import { gradeAnswers } from "../utils/grading";
import { addCompletedQuestion } from "../utils/localStorage";
import "../styles/Results.css";

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

  const selectedCategories = location.state?.selectedSubs || [];
  const selectedDifficulty = location.state?.selectedDifficulty || [];

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const fetchQuestions = async (currentPage) => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategories.join(","),
        difficulty: selectedDifficulty.join(","),
        limit: 5,
        page: currentPage,
      };
      const response = await questionAPI.search(params);
      setQuestions(response.data.questions);
      setPagination(response.data.pagination);
      setError(null);
      setAnswers({});
      setGradingResults(null);
      setIsSubmitted(false);
    } catch (err) {
      setError("Failed to load questions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const answeredQuestions = Object.values(answers).filter(
      (a) => a.trim() !== ""
    );
    if (answeredQuestions.length === 0) {
      alert("Please answer at least one question before submitting.");
      return;
    }

    const results = gradeAnswers(answers, questions);
    setGradingResults(results);
    setIsSubmitted(true);

    Object.keys(results.questionResults).forEach((questionId) => {
      const question = questions.find((q) => q._id === questionId);
      const result = results.questionResults[questionId];
      if (question) {
        addCompletedQuestion({
          id: questionId,
          main: question.main || "Uncategorized",
          category: question.Category,
          difficulty: question.Difficulty,
          percentage: result.percentage,
        });
      }
    });
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      if (Object.keys(answers).length > 0 && !isSubmitted) {
        const confirmed = window.confirm(
          "You have unsubmitted answers. Your answers will be reset if you navigate to another page. Continue?"
        );
        if (!confirmed) return;
      }
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.total_pages) {
      if (Object.keys(answers).length > 0 && !isSubmitted) {
        const confirmed = window.confirm(
          "You have unsubmitted answers. Your answers will be reset if you navigate to another page. Continue?"
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
    <div className="results-container">
      <h1>
        Questions: {selectedCategories.join(", ")} (
        {selectedDifficulty.join(", ")})
      </h1>

      {pagination && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={page === 1}>
            ← Previous
          </button>
          <span>
            Page {page} of {pagination.total_pages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === pagination.total_pages}
          >
            Next →
          </button>
        </div>
      )}

      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => {
            const result = gradingResults?.questionResults[question._id];
            return (
              <div key={question._id} className="question-card">
                <h3>
                  {index + 1}. {question.Question}
                </h3>
                <input
                  type="text"
                  value={answers[question._id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(question._id, e.target.value)
                  }
                  placeholder="Your answer..."
                  disabled={isSubmitted}
                />
                {result && (
                  <div className="grading-result">
                    <p>Score: {result.percentage}%</p>
                    <details>
                      <summary>View Correct Answer</summary>
                      <p>{result.correctAnswer}</p>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
          {!isSubmitted && (
            <button type="submit" className="submit-button">
              Submit Answers
            </button>
          )}
        </form>
      )}

      {pagination && questions.length > 0 && (
        <div className="pagination">
          <button onClick={handlePreviousPage} disabled={page === 1}>
            ← Previous
          </button>
          <span>
            Page {page} of {pagination.total_pages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={page === pagination.total_pages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default Results;
