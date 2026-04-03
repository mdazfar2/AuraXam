/**
 * @file types.js
 * JSDoc definitions for AuraXam entities.
 * These serve as documentation and provide IDE intellisense.
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} email
 * @property {string} name
 * @property {string} [avatar]
 * @property {string} joinDate - ISO String
 * @property {number} streak
 * @property {number} totalXP
 * @property {Badge[]} badges
 */

/**
 * @typedef {Object} Badge
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon - Lucide icon name string
 * @property {string} earnedDate - ISO String
 * @property {'common'|'rare'|'epic'|'legendary'} rarity
 */

/**
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 * @property {'mcq'|'msq'|'fillblank'|'numerical'} type
 * @property {string[]} [options] - Required for MCQ/MSQ
 * @property {string[]} correctAnswers
 * @property {string} [explanation]
 * @property {string} subject
 * @property {'easy'|'medium'|'hard'} difficulty
 * @property {number} marks
 * @property {number} [negativeMarks]
 */

/**
 * @typedef {Object} Exam
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {Question[]} questions
 * @property {number} timeLimit - In minutes
 * @property {boolean} negativeMarking
 * @property {number} negativeMarkingRatio - e.g. 0.33
 * @property {string[]} tags
 * @property {string} createdBy - User ID
 * @property {string} createdDate
 * @property {'easy'|'medium'|'hard'} difficulty
 * @property {number} totalMarks
 */

/**
 * @typedef {Object} UserAnswer
 * @property {string} questionId
 * @property {string[]} selectedOptions
 * @property {number} timeSpent - In seconds
 * @property {boolean} isMarkedForReview
 */

/**
 * @typedef {Object} ExamAttempt
 * @property {string} id
 * @property {string} examId
 * @property {string} userId
 * @property {string} startTime
 * @property {string} [endTime]
 * @property {UserAnswer[]} answers
 * @property {number} score
 * @property {number} totalMarks
 * @property {number} percentage
 * @property {number} timeTaken - In minutes
 * @property {'ongoing'|'completed'|'abandoned'} status
 */

/**
 * @typedef {Object} PerformanceAnalytics
 * @property {Object.<string, {correct: number, total: number, percentage: number}>} subjectWiseScore
 * @property {Object.<string, {correct: number, total: number, percentage: number}>} difficultyWiseScore
 * @property {Object.<string, number>} timeDistribution
 * @property {number} averageTimePerQuestion
 * @property {string[]} strongAreas
 * @property {string[]} weakAreas
 * @property {string[]} improvementSuggestions
 */

/**
 * @typedef {Object} ThemeConfig
 * @property {'light'|'dark'} mode
 * @property {string} primaryColor - Hex/HSL
 * @property {string} accentColor - Hex/HSL
 */

/**
 * @typedef {Object} PDFUploadStatus
 * @property {File|null} file
 * @property {'idle'|'uploading'|'processing'|'completed'|'error'} status
 * @property {number} progress - 0 to 100
 * @property {Question[]} extractedQuestions
 * @property {string} [error]
 */

/**
 * Runtime Constants for Route Management
 * @type {string[]}
 */
export const ROUTES = [
  'dashboard', 'exam-config', 'exam', 'results', 
  'analytics', 'profile', 'login', 'register'
];

/**
 * Difficulty Levels for reuse in components
 */
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};