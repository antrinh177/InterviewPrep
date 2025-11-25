// LocalStorage utility for tracking completed questions and grades
const STORAGE_KEY = 'interviewPrep_completedQuestions';

/**
 * Get all completed questions from localStorage
 * @returns {Array} Array of completed question objects
 */
export const getCompletedQuestions = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
};

/**
 * Add a completed question to localStorage
 * @param {Object} questionData - Question data with id, main, category, difficulty, percentage
 */
export const addCompletedQuestion = (questionData) => {
  try {
    const completed = getCompletedQuestions();
    
    // Check if question already exists
    const existingIndex = completed.findIndex(q => q.id === questionData.id);
    
    if (existingIndex >= 0) {
      // Update existing question (keep the latest score)
      completed[existingIndex] = {
        ...questionData,
        completedAt: new Date().toISOString()
      };
    } else {
      // Add new question
      completed.push({
        ...questionData,
        completedAt: new Date().toISOString()
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};

/**
 * Get completion statistics by main category
 * @param {Array} allQuestions - All available questions from backend
 * @returns {Object} Statistics by main category
 */
export const getCompletionStats = (allQuestions) => {
  const completed = getCompletedQuestions();
  const stats = {};
  
  // Group all questions by main category
  allQuestions.forEach(q => {
    const main = q.main || 'Uncategorized';
    if (!stats[main]) {
      stats[main] = {
        total: 0,
        answered: 0,
        totalGrade: 0,
        percentage: 0
      };
    }
    stats[main].total++;
  });
  
  // Sum up grades for answered questions by main category
  completed.forEach(c => {
    const main = c.main || 'Uncategorized';
    if (stats[main]) {
      stats[main].answered++;
      stats[main].totalGrade += c.percentage;
    }
  });
  
  // Calculate percentage based on total possible score
  Object.keys(stats).forEach(main => {
    // Percentage = ((sum of grades) / (total questions * 100)) * 100%
    // Example: 1 question with 50% out of 10 total = (50 / (10 * 100)) * 100% = 5%
    stats[main].percentage = stats[main].total > 0
      ? Math.round((stats[main].totalGrade / (stats[main].total * 100)) * 100)
      : 0;
  });
  
  return stats;
};

/**
 * Clear all completed questions
 */
export const clearCompletedQuestions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};
