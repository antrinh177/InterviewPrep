/**
 * Extract keywords from a reference answer
 * @param {string} answer - The reference answer from database
 * @returns {Array} - Array of keywords
 */
export const extractKeywords = (answer) => {
  if (!answer) return [];
  
  // Common words to exclude (stop words)
  const stopWords = ['the', 'is', 'are', 'was', 'were', 'a', 'an', 'and', 'or', 'but', 
                     'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as',
                     'it', 'that', 'this', 'be', 'can', 'has', 'have', 'had', 'do', 'does'];
  
  // Convert to lowercase, remove punctuation, split into words
  const words = answer
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  return [...new Set(words)]; // Remove duplicates
};

/**
 * Calculate the percentage match between user answer and correct answer
 * @param {string} userAnswer - User's submitted answer
 * @param {string} correctAnswer - Correct answer from database
 * @returns {number} - Percentage match (0-100)
 */
export const calculateMatchPercentage = (userAnswer, correctAnswer) => {
  if (!userAnswer || !userAnswer.trim()) return 0;
  if (!correctAnswer) return 0;
  
  const userWords = extractKeywords(userAnswer);
  const correctKeywords = extractKeywords(correctAnswer);
  
  if (correctKeywords.length === 0) return 0;
  
  // Count how many keywords from correct answer appear in user answer
  const matchedKeywords = correctKeywords.filter(keyword => 
    userWords.includes(keyword)
  );
  
  const percentage = (matchedKeywords.length / correctKeywords.length) * 100;
  return Math.round(percentage);
};

/**
 * Grade all answers and return results
 * @param {Object} userAnswers - Object with questionId as key and user answer as value
 * @param {Array} questions - Array of question objects from database
 * @returns {Object} - Grading results with percentages for each answered question
 */
export const gradeAnswers = (userAnswers, questions) => {
  const results = {};
  
  questions.forEach(question => {
    const userAnswer = userAnswers[question._id];
    
    // Only grade if user provided an answer
    if (userAnswer && userAnswer.trim()) {
      const percentage = calculateMatchPercentage(userAnswer, question.Answer);
      results[question._id] = {
        percentage,
        userAnswer,
        correctAnswer: question.Answer,
        passed: percentage >= 50 // Consider 50% or higher as passing
      };
    }
    // Don't include unanswered questions in results
  });
  
  return {
    questionResults: results
  };
};