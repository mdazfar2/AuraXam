/**
 * Utility functions for exam scoring and analytics calculation
 */

/**
 * Calculate the score for a single question
 */
export const calculateQuestionScore = (
  question,
  userAnswer,
  negativeMarkingEnabled,
  negativeMarkingRatio
) => {
  
  // If user didn't attempt the question
  if (!userAnswer || userAnswer.selectedOptions.length === 0) {
    console.log(`Question ${question.id}: Not attempted`);
    return {
      questionId: question.id,
      isCorrect: false,
      marksAwarded: 0,
      userAnswers: [],
      correctAnswers: question.correctAnswers,
      timeSpent: userAnswer?.timeSpent || 0
    };
  }

  // Check if user's answers match correct answers
  let isCorrect = false;
  
  if (question.type === 'msq') {
    // For MSQ, all correct answers must be selected and no wrong answers
    const userSet = new Set(userAnswer.selectedOptions);
    const correctSet = new Set(question.correctAnswers);
    
    isCorrect = userSet.size === correctSet.size && 
                [...userSet].every(answer => correctSet.has(answer));
  } else {
    // For MCQ, fillblank, numerical - check if any user answer matches any correct answer
    isCorrect = userAnswer.selectedOptions.some(userAns => 
      question.correctAnswers.some(correctAns => 
        normalizeAnswer(userAns) === normalizeAnswer(correctAns)
      )
    );
  }

  // Calculate marks awarded
  let marksAwarded = 0;
  if (isCorrect) {
    marksAwarded = question.marks;
  } else if (negativeMarkingEnabled && question.negativeMarks) {
    marksAwarded = -Math.abs(question.negativeMarks * negativeMarkingRatio);
  }

  console.log(`Question ${question.id}: ${isCorrect ? 'Correct' : 'Incorrect'}, Marks: ${marksAwarded}`);

  return {
    questionId: question.id,
    isCorrect,
    marksAwarded,
    userAnswers: userAnswer.selectedOptions,
    correctAnswers: question.correctAnswers,
    timeSpent: userAnswer.timeSpent
  };
};

/**
 * Normalize answer text for comparison (remove extra spaces, convert to lowercase)
 */
const normalizeAnswer = (answer) => {
  return typeof answer === 'string' 
    ? answer.trim().toLowerCase().replace(/\s+/g, ' ') 
    : String(answer);
};

/**
 * Calculate complete exam score and generate detailed results
 */
export const calculateExamScore = (
  questions,
  userAnswers,
  negativeMarkingEnabled,
  negativeMarkingRatio
) => {
  
  console.log('Starting exam scoring calculation');

  // Create a map for quick lookup of user answers
  const userAnswerMap = new Map();
  userAnswers.forEach(answer => {
    userAnswerMap.set(answer.questionId, answer);
  });

  // Calculate score for each question
  const questionWiseScores = questions.map(question => {
    const userAnswer = userAnswerMap.get(question.id);
    return calculateQuestionScore(question, userAnswer, negativeMarkingEnabled, negativeMarkingRatio);
  });

  // Calculate summary statistics
  const totalScore = questionWiseScores.reduce((sum, score) => sum + score.marksAwarded, 0);
  const maxScore = questions.reduce((sum, question) => sum + question.marks, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100 * 100) / 100 : 0;
  
  const correctAnswers = questionWiseScores.filter(score => score.isCorrect).length;
  const incorrectAnswers = questionWiseScores.filter(score => 
    !score.isCorrect && score.userAnswers.length > 0
  ).length;
  const unattemptedQuestions = questionWiseScores.filter(score => 
    score.userAnswers.length === 0
  ).length;
  
  const negativeMarksDeducted = Math.abs(
    questionWiseScores
      .filter(score => score.marksAwarded < 0)
      .reduce((sum, score) => sum + score.marksAwarded, 0)
  );

  const result = {
    totalScore: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
    maxScore,
    percentage,
    correctAnswers,
    incorrectAnswers,
    unattemptedQuestions,
    negativeMarksDeducted,
    questionWiseScores
  };

  console.log('Exam scoring completed:', result);
  return result;
};

/**
 * Generate performance analytics from exam attempt
 */
export const generatePerformanceAnalytics = (
  questions,
  scoringResult,
  timeTaken
) => {
  
  console.log('Generating performance analytics');

  // Subject-wise performance analysis
  const subjectWiseScore = {};
  
  questions.forEach(question => {
    const subject = question.subject;
    const questionScore = scoringResult.questionWiseScores.find(score => score.questionId === question.id);
    
    if (!subjectWiseScore[subject]) {
      subjectWiseScore[subject] = { correct: 0, total: 0, percentage: 0 };
    }
    
    subjectWiseScore[subject].total++;
    if (questionScore?.isCorrect) {
      subjectWiseScore[subject].correct++;
    }
  });

  // Calculate percentages for each subject
  Object.keys(subjectWiseScore).forEach(subject => {
    const data = subjectWiseScore[subject];
    data.percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  });

  // Difficulty-wise performance analysis
  const difficultyWiseScore = {};
  
  questions.forEach(question => {
    const difficulty = question.difficulty;
    const questionScore = scoringResult.questionWiseScores.find(score => score.questionId === question.id);
    
    if (!difficultyWiseScore[difficulty]) {
      difficultyWiseScore[difficulty] = { correct: 0, total: 0, percentage: 0 };
    }
    
    difficultyWiseScore[difficulty].total++;
    if (questionScore?.isCorrect) {
      difficultyWiseScore[difficulty].correct++;
    }
  });

  // Calculate percentages for each difficulty
  Object.keys(difficultyWiseScore).forEach(difficulty => {
    const data = difficultyWiseScore[difficulty];
    data.percentage = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
  });

  // Time distribution analysis
  const timeDistribution = {};
  scoringResult.questionWiseScores.forEach(score => {
    timeDistribution[score.questionId] = score.timeSpent;
  });

  // Calculate average time per question
  const totalTimeSpent = scoringResult.questionWiseScores.reduce((sum, score) => sum + score.timeSpent, 0);
  const averageTimePerQuestion = questions.length > 0 ? Math.round(totalTimeSpent / questions.length) : 0;

  // Identify strong and weak areas
  const strongAreas = [];
  const weakAreas = [];
  
  Object.entries(subjectWiseScore).forEach(([subject, data]) => {
    if (data.percentage >= 80) {
      strongAreas.push(subject);
    } else if (data.percentage < 50) {
      weakAreas.push(subject);
    }
  });

  // Generate improvement suggestions
  const improvementSuggestions = [];
  
  if (scoringResult.percentage < 60) {
    improvementSuggestions.push("Focus on understanding fundamental concepts before attempting complex problems");
  }
  
  if (scoringResult.unattemptedQuestions > questions.length * 0.2) {
    improvementSuggestions.push("Work on time management - too many questions left unattempted");
  }
  
  if (scoringResult.negativeMarksDeducted > scoringResult.totalScore * 0.3) {
    improvementSuggestions.push("Be more careful with answer selection to avoid excessive negative marking");
  }
  
  if (averageTimePerQuestion > 120) { // More than 2 minutes per question
    improvementSuggestions.push("Practice solving questions faster to improve time efficiency");
  }
  
  weakAreas.forEach(area => {
    improvementSuggestions.push(`Strengthen your knowledge in ${area} - current performance is below average`);
  });

  if (difficultyWiseScore.easy && difficultyWiseScore.easy.percentage < 90) {
    improvementSuggestions.push("Focus on mastering easy questions first - they should be your strong foundation");
  }

  return {
    subjectWiseScore,
    difficultyWiseScore,
    timeDistribution,
    averageTimePerQuestion,
    strongAreas,
    weakAreas,
    improvementSuggestions
  };
};

/**
 * Calculate grade based on percentage score
 */
export const calculateGrade = (percentage) => {
  if (percentage >= 90) {
    return { grade: 'A+', description: 'Outstanding', color: 'text-green-600' };
  } else if (percentage >= 80) {
    return { grade: 'A', description: 'Excellent', color: 'text-green-500' };
  } else if (percentage >= 70) {
    return { grade: 'B+', description: 'Very Good', color: 'text-blue-500' };
  } else if (percentage >= 60) {
    return { grade: 'B', description: 'Good', color: 'text-blue-400' };
  } else if (percentage >= 50) {
    return { grade: 'C', description: 'Average', color: 'text-yellow-500' };
  } else if (percentage >= 40) {
    return { grade: 'D', description: 'Below Average', color: 'text-orange-500' };
  } else {
    return { grade: 'F', description: 'Needs Improvement', color: 'text-red-500' };
  }
};

/**
 * Generate exam insights and recommendations
 */
export const generateExamInsights = (
  scoringResult,
  analytics,
  examDuration
) => {
  
  const insights = [];
  
  // Performance insights
  if (scoringResult.percentage > 85) {
    insights.push("🎉 Excellent performance! You've demonstrated strong command over the subject.");
  } else if (scoringResult.percentage > 70) {
    insights.push("👍 Good job! You're on the right track with solid understanding.");
  } else if (scoringResult.percentage > 50) {
    insights.push("📚 Decent attempt, but there's room for improvement with focused study.");
  } else {
    insights.push("💪 Don't get discouraged! Use this as a learning opportunity to identify areas for improvement.");
  }

  // Time management insights
  const timeEfficiency = (examDuration * 60) / analytics.averageTimePerQuestion;
  if (timeEfficiency < 0.7) {
    insights.push("⏰ Time management needs attention - practice solving questions under time pressure.");
  } else if (timeEfficiency > 1.5) {
    insights.push("⚡ Great time management! You completed questions efficiently.");
  }

  // Accuracy insights
  const totalAttempted = scoringResult.correctAnswers + scoringResult.incorrectAnswers;
  const accuracy = totalAttempted > 0 ? (scoringResult.correctAnswers / totalAttempted) * 100 : 0;
  
  if (accuracy > 90) {
    insights.push("🎯 Impressive accuracy! Your preparation shows in your precise answers.");
  } else if (accuracy < 60 && totalAttempted > 0) {
    insights.push("🤔 Focus on accuracy over speed - make sure you understand questions before answering.");
  }

  // Strategy insights
  if (scoringResult.negativeMarksDeducted > scoringResult.totalScore * 0.2) {
    insights.push("⚠️ Consider being more selective with your answers to minimize negative marking impact.");
  }

  if (scoringResult.unattemptedQuestions === 0) {
    insights.push("✅ Great job attempting all questions! Shows good time management and confidence.");
  }

  console.log('Generated exam insights:', insights);
  return insights;
};