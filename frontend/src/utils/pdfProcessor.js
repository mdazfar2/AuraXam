/**
 * Utility functions for PDF processing and question extraction
 * This simulates AI-based question extraction for frontend-only implementation
 */

// Simulate PDF text extraction (replace with actual OCR in production)
export const extractTextFromPDF = async (file) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('Extracting text from PDF:', file.name);
  
  // Mock extracted text that contains sample questions
  const mockExtractedText = `
    1. What is the capital of France?
    A) London
    B) Paris
    C) Berlin
    D) Madrid
    Answer: B

    2. Which of the following are prime numbers? (Select all that apply)
    A) 2
    B) 4
    C) 7
    D) 9
    Answer: A, C

    3. The value of π (pi) is approximately _______.
    Answer: 3.14159

    4. What is 15 × 12?
    A) 180
    B) 175
    C) 185
    D) 170
    Answer: A

    5. Which programming language is known for web development?
    A) Python
    B) JavaScript
    C) C++
    D) Java
    Answer: B
  `;
  
  console.log('Text extraction completed');
  return mockExtractedText;
};

// Parse extracted text to identify and structure questions
export const parseQuestionsFromText = (text) => {
  console.log('Parsing questions from extracted text');
  
  const questions = [];
  
  // Split text into potential question blocks
  const questionBlocks = text.split(/\d+\.\s+/).filter(block => block.trim().length > 0);
  
  questionBlocks.forEach((block, index) => {
    try {
      const questionNumber = index + 1;
      console.log(`Processing question ${questionNumber}`);
      
      // Extract question text (everything before options or Answer:)
      const questionMatch = block.match(/^([^A-D\n]+?)(?=\n?[A-D]\)|Answer:)/s);
      if (!questionMatch) return;
      
      const questionText = questionMatch[1].trim();
      
      // Determine question type based on content
      let questionType = 'mcq';
      
      if (questionText.includes('_____') || questionText.includes('fill') || questionText.includes('blank')) {
        questionType = 'fillblank';
      } else if (questionText.includes('Select all') || questionText.includes('multiple')) {
        questionType = 'msq';
      } else if (questionText.match(/\d+\s*[×+\-÷]\s*\d+/) || questionText.includes('calculate')) {
        questionType = 'numerical';
      }
      
      // Extract options for MCQ/MSQ questions
      let options = [];
      const optionMatches = block.match(/[A-D]\)\s*([^\n]+)/g);
      
      if (optionMatches) {
        options = optionMatches.map(match => {
          const optionText = match.replace(/^[A-D]\)\s*/, '').trim();
          return optionText;
        });
      }
      
      // Extract correct answer(s)
      const answerMatch = block.match(/Answer:\s*([^\n]+)/);
      let correctAnswers = [];
      
      if (answerMatch) {
        const answerText = answerMatch[1].trim();
        
        if (questionType === 'msq') {
          // Multiple correct answers (A, C)
          correctAnswers = answerText.split(',').map(ans => ans.trim());
        } else if (questionType === 'fillblank' || questionType === 'numerical') {
          // Direct answer
          correctAnswers = [answerText];
        } else {
          // Single correct answer (B)
          correctAnswers = [answerText];
        }
      }
      
      // Determine subject based on question content
      let subject = 'General';
      if (questionText.toLowerCase().includes('math') || questionText.match(/\d+\s*[×+\-÷]/)) {
        subject = 'Mathematics';
      } else if (questionText.toLowerCase().includes('science') || questionText.toLowerCase().includes('physics')) {
        subject = 'Science';
      } else if (questionText.toLowerCase().includes('history') || questionText.toLowerCase().includes('capital')) {
        subject = 'Social Studies';
      } else if (questionText.toLowerCase().includes('programming') || questionText.toLowerCase().includes('code')) {
        subject = 'Computer Science';
      }
      
      // Determine difficulty based on question complexity
      let difficulty = 'medium';
      if (questionText.length < 50 && options.length <= 4) {
        difficulty = 'easy';
      } else if (questionText.length > 150 || questionText.includes('analyze') || questionText.includes('evaluate')) {
        difficulty = 'hard';
      }
      
      // Create question object
      const question = {
        id: `q_${Date.now()}_${questionNumber}`,
        text: questionText,
        type: questionType,
        options: options.length > 0 ? options : undefined,
        correctAnswers,
        subject,
        difficulty,
        marks: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
        negativeMarks: difficulty === 'easy' ? 0.25 : difficulty === 'medium' ? 0.5 : 1
      };
      
      questions.push(question);
      console.log(`Question ${questionNumber} parsed successfully:`, question);
      
    } catch (error) {
      console.error(`Error parsing question ${index + 1}:`, error);
    }
  });
  
  console.log(`Successfully parsed ${questions.length} questions`);
  return questions;
};

// Main function to process PDF and extract questions
export const processPDF = async (file) => {
  try {
    console.log('Starting PDF processing for:', file.name);
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      throw new Error('Please upload a valid PDF file');
    }
    
    // Validate file size (max 10MB for demo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }
    
    // Extract text from PDF
    const extractedText = await extractTextFromPDF(file);
    
    // Parse questions from extracted text
    const questions = parseQuestionsFromText(extractedText);
    
    if (questions.length === 0) {
      throw new Error('No questions found in the PDF. Please ensure the PDF contains properly formatted questions.');
    }
    
    // Calculate estimated page count based on file size
    const estimatedPages = Math.ceil(file.size / (50 * 1024)); // Rough estimate
    
    const result = {
      success: true,
      questions,
      metadata: {
        totalPages: estimatedPages,
        fileName: file.name,
        fileSize: file.size,
        questionsFound: questions.length
      }
    };
    
    console.log('PDF processing completed successfully:', result);
    return result;
    
  } catch (error) {
    console.error('PDF processing failed:', error);
    
    return {
      success: false,
      questions: [],
      metadata: {
        totalPages: 0,
        fileName: file.name,
        fileSize: file.size,
        questionsFound: 0
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Validate question format before adding to exam
export const validateQuestion = (question) => {
  const errors = [];
  
  // Check required fields
  if (!question.text || question.text.trim().length === 0) {
    errors.push('Question text is required');
  }
  
  if (!question.correctAnswers || question.correctAnswers.length === 0) {
    errors.push('At least one correct answer is required');
  }
  
  // Validate MCQ/MSQ questions
  if ((question.type === 'mcq' || question.type === 'msq') && (!question.options || question.options.length < 2)) {
    errors.push('MCQ/MSQ questions must have at least 2 options');
  }
  
  // Validate marks
  if (question.marks <= 0) {
    errors.push('Question marks must be greater than 0');
  }
  
  console.log(`Question validation ${errors.length === 0 ? 'passed' : 'failed'}:`, question.id, errors);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate sample questions for testing
export const generateSampleQuestions = () => {
  console.log('Generating sample questions for testing');
  
  const sampleQuestions = [
    {
      id: 'sample_1',
      text: 'What is the derivative of x² with respect to x?',
      type: 'mcq',
      options: ['x', '2x', 'x²', '2x²'],
      correctAnswers: ['2x'],
      subject: 'Mathematics',
      difficulty: 'medium',
      marks: 2,
      negativeMarks: 0.5
    },
    {
      id: 'sample_2',
      text: 'Which of the following are renewable energy sources? (Select all that apply)',
      type: 'msq',
      options: ['Solar', 'Coal', 'Wind', 'Natural Gas', 'Hydroelectric'],
      correctAnswers: ['Solar', 'Wind', 'Hydroelectric'],
      subject: 'Science',
      difficulty: 'easy',
      marks: 3,
      negativeMarks: 1
    },
    {
      id: 'sample_3',
      text: 'The speed of light in vacuum is approximately _______ m/s.',
      type: 'fillblank',
      correctAnswers: ['3×10⁸', '3*10^8', '300000000'],
      subject: 'Physics',
      difficulty: 'medium',
      marks: 2,
      negativeMarks: 0.5
    },
    {
      id: 'sample_4',
      text: 'Calculate: 15 × 23 = ?',
      type: 'numerical',
      correctAnswers: ['345'],
      subject: 'Mathematics',
      difficulty: 'easy',
      marks: 1,
      negativeMarks: 0.25
    },
    {
      id: 'sample_5',
      text: 'Who wrote the famous novel "Pride and Prejudice"?',
      type: 'mcq',
      options: ['Charlotte Brontë', 'Jane Austen', 'Emily Dickinson', 'Virginia Woolf'],
      correctAnswers: ['Jane Austen'],
      subject: 'Literature',
      difficulty: 'medium',
      marks: 2,
      negativeMarks: 0.5
    }
  ];
  
  console.log(`Generated ${sampleQuestions.length} sample questions`);
  return sampleQuestions;
};