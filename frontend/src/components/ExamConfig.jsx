import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Settings, 
  Clock, 
  Zap,
  CheckCircle,
  AlertCircle,
  Play,
  Trash2,
  Plus,
  Loader
} from 'lucide-react';
import { processPDF, generateSampleQuestions } from '../utils/pdfProcessor';

// Main exam configuration component for setting up new exams
export const ExamConfig = ({ onExamStart, onRouteChange }) => {
  // PDF upload state management
  const [pdfStatus, setPdfStatus] = useState({
    file: null,
    status: 'idle',
    progress: 0,
    extractedQuestions: [],
    error: undefined
  });

  // Exam configuration state with custom time options
  const [examConfig, setExamConfig] = useState({
    title: '',
    description: '',
    timeLimit: 60, // in minutes
    customTimeEnabled: false, // Toggle for custom time input
    customHours: 1, // Custom hours input
    customMinutes: 0, // Custom minutes input
    negativeMarking: false,
    negativeMarkingRatio: 0.33, // 1/3 negative marking
    customNegativeEnabled: false, // Toggle for custom negative marking
    customNegativeValue: 0.25, // Custom negative marking value
    tags: [],
    difficulty: 'medium'
  });

  // New tag input state
  const [newTag, setNewTag] = useState('');

  // File input reference
  const fileInputRef = useRef(null);

  // Handle PDF file selection
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('PDF file selected:', file.name);

    // Reset previous status
    setPdfStatus({
      file,
      status: 'uploading',
      progress: 0,
      extractedQuestions: [],
      error: undefined
    });

    // Simulate upload progress
    let progress = 0;
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        
        // Start processing after upload completes
        processPDFFile(file);
      }
      
      setPdfStatus(prev => ({ ...prev, progress: Math.min(progress, 100) }));
    }, 500);
  };

  // Process the uploaded PDF file
  const processPDFFile = async (file) => {
    try {
      console.log('Starting PDF processing:', file.name);
      
      setPdfStatus(prev => ({ ...prev, status: 'processing' }));

      // Process PDF and extract questions
      const result = await processPDF(file);

      if (result.success) {
        console.log('PDF processing successful:', result);
        
        setPdfStatus(prev => ({
          ...prev,
          status: 'completed',
          extractedQuestions: result.questions
        }));

        // Auto-fill exam title from filename if not set
        if (!examConfig.title) {
          const titleFromFile = file.name.replace('.pdf', '').replace(/[_-]/g, ' ');
          setExamConfig(prev => ({ ...prev, title: titleFromFile }));
        }

      } else {
        throw new Error(result.error || 'Failed to process PDF');
      }

    } catch (error) {
      console.error('PDF processing error:', error);
      
      setPdfStatus(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }));
    }
  };

  // Handle drag and drop for PDF upload
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Simulate file input selection
        const input = fileInputRef.current;
        if (input) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          input.files = dataTransfer.files;
          handleFileSelect({ target: input });
        }
      }
    }
  };

  // Add a new tag to exam configuration
  const addTag = () => {
    if (newTag.trim() && !examConfig.tags.includes(newTag.trim())) {
      setExamConfig(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
      console.log('Tag added:', newTag.trim());
    }
  };

  // Remove a tag from exam configuration
  const removeTag = (tagToRemove) => {
    setExamConfig(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    console.log('Tag removed:', tagToRemove);
  };

  // Generate sample exam for testing
  const generateSampleExam = () => {
    console.log('Generating sample exam');
    
    const sampleQuestions = generateSampleQuestions();
    
    setPdfStatus({
      file: null,
      status: 'completed',
      progress: 100,
      extractedQuestions: sampleQuestions
    });

    setExamConfig(prev => ({
      ...prev,
      title: 'Sample Practice Exam',
      description: 'A sample exam with various question types for testing'
    }));
  };

  // Calculate final time limit based on custom or preset values
  const getFinalTimeLimit = () => {
    if (examConfig.customTimeEnabled) {
      return (examConfig.customHours * 60) + examConfig.customMinutes;
    }
    return examConfig.timeLimit;
  };

  // Calculate final negative marking ratio
  const getFinalNegativeMarkingRatio = () => {
    if (examConfig.customNegativeEnabled) {
      return examConfig.customNegativeValue;
    }
    return examConfig.negativeMarkingRatio;
  };

  // Start the configured exam
  const startExam = () => {
    if (pdfStatus.extractedQuestions.length === 0) {
      console.warn('Cannot start exam: No questions available');
      return;
    }

    const finalTimeLimit = getFinalTimeLimit();
    const finalNegativeRatio = getFinalNegativeMarkingRatio();

    console.log('Starting exam with configuration:', {
      ...examConfig,
      finalTimeLimit,
      finalNegativeRatio
    });

    // Create exam object
    const exam = {
      id: `exam_${Date.now()}`,
      title: examConfig.title || 'Untitled Exam',
      description: examConfig.description,
      questions: pdfStatus.extractedQuestions,
      timeLimit: finalTimeLimit,
      negativeMarking: examConfig.negativeMarking,
      negativeMarkingRatio: finalNegativeRatio,
      tags: examConfig.tags,
      createdBy: 'current_user', // Replace with actual user ID
      createdDate: new Date().toISOString(),
      difficulty: examConfig.difficulty,
      totalMarks: pdfStatus.extractedQuestions.reduce((sum, q) => sum + q.marks, 0)
    };

    // Start the exam
    onExamStart(exam);
  };

  // Clear all configuration and start over
  const clearConfiguration = () => {
    setPdfStatus({
      file: null,
      status: 'idle',
      progress: 0,
      extractedQuestions: [],
      error: undefined
    });

    setExamConfig({
      title: '',
      description: '',
      timeLimit: 60,
      customTimeEnabled: false,
      customHours: 1,
      customMinutes: 0,
      negativeMarking: false,
      negativeMarkingRatio: 0.33,
      customNegativeEnabled: false,
      customNegativeValue: 0.25,
      tags: [],
      difficulty: 'medium'
    });

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    console.log('Configuration cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Configure New Exam
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload a PDF or generate sample questions to create your practice exam
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Column - PDF Upload */}
          <div className="space-y-6">
            
            {/* PDF Upload Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Upload Question Paper
              </h2>

              {pdfStatus.status === 'idle' && (
                <div>
                  {/* Drag and Drop Area */}
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Supports PDF files up to 10MB
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Choose PDF File
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {/* Sample Exam Option */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={generateSampleExam}
                      className="w-full p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 transition-colors"
                    >
                      <Zap className="w-4 h-4 inline mr-2" />
                      Generate Sample Exam Instead
                    </button>
                  </div>
                </div>
              )}

              {pdfStatus.status === 'uploading' && (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium mb-2">Uploading PDF...</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pdfStatus.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(pdfStatus.progress)}%</p>
                </div>
              )}

              {pdfStatus.status === 'processing' && (
                <div className="text-center py-8">
                  <Loader className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium mb-2">Processing PDF...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Extracting questions using AI analysis
                  </p>
                </div>
              )}

              {pdfStatus.status === 'completed' && (
                <div className="text-center py-6">
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium mb-2">Processing Complete!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Found {pdfStatus.extractedQuestions.length} questions
                  </p>
                  <div className="flex space-x-2 justify-center">
                    <button
                      onClick={clearConfiguration}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 inline mr-2" />
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {pdfStatus.status === 'error' && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium mb-2">Processing Failed</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                    {pdfStatus.error}
                  </p>
                  <button
                    onClick={clearConfiguration}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Exam Configuration */}
          <div className="space-y-6">
            
            {/* Basic Configuration */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                Exam Settings
              </h2>

              <div className="space-y-4">
                {/* Exam Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Exam Title *
                  </label>
                  <input
                    type="text"
                    value={examConfig.title}
                    onChange={(e) => setExamConfig(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., JEE Main 2024 Mock Test"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Exam Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={examConfig.description}
                    onChange={(e) => setExamConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the exam content"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Time Limit Configuration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Limit
                  </label>
                  
                  {/* Toggle for custom time */}
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="customTime"
                      checked={examConfig.customTimeEnabled}
                      onChange={(e) => setExamConfig(prev => ({ ...prev, customTimeEnabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="customTime" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Set Custom Time
                    </label>
                  </div>

                  {examConfig.customTimeEnabled ? (
                    // Custom time inputs
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Hours</label>
                        <input
                          type="number"
                          min="0"
                          max="12"
                          value={examConfig.customHours}
                          onChange={(e) => setExamConfig(prev => ({ ...prev, customHours: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Minutes</label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          value={examConfig.customMinutes}
                          onChange={(e) => setExamConfig(prev => ({ ...prev, customMinutes: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    // Preset time options
                    <select
                      value={examConfig.timeLimit}
                      onChange={(e) => setExamConfig(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                      <option value={180}>3 hours</option>
                    </select>
                  )}
                  
                  {/* Display final time */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Total time: {Math.floor(getFinalTimeLimit() / 60)}h {getFinalTimeLimit() % 60}m
                  </p>
                </div>

                {/* Negative Marking Configuration */}
                <div className="space-y-3">
                  {/* Enable negative marking toggle */}
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="negativeMarking"
                      checked={examConfig.negativeMarking}
                      onChange={(e) => setExamConfig(prev => ({ ...prev, negativeMarking: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="negativeMarking" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enable Negative Marking
                    </label>
                  </div>

                  {examConfig.negativeMarking && (
                    <div className="ml-7 space-y-3">
                      {/* Toggle for custom negative marking */}
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="customNegative"
                          checked={examConfig.customNegativeEnabled}
                          onChange={(e) => setExamConfig(prev => ({ ...prev, customNegativeEnabled: e.target.checked }))}
                          className="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="customNegative" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Custom Negative Marking
                        </label>
                      </div>

                      {examConfig.customNegativeEnabled ? (
                        // Custom negative marking input
                        <div>
                          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Negative marks per wrong answer
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="5"
                            step="0.01"
                            value={examConfig.customNegativeValue}
                            onChange={(e) => setExamConfig(prev => ({ ...prev, customNegativeValue: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 0.25"
                          />
                        </div>
                      ) : (
                        // Preset negative marking options
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Negative Marking Ratio
                          </label>
                          <select
                            value={examConfig.negativeMarkingRatio}
                            onChange={(e) => setExamConfig(prev => ({ ...prev, negativeMarkingRatio: parseFloat(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={0.25}>-0.25 marks</option>
                            <option value={0.33}>-1/3 marks</option>
                            <option value={0.5}>-0.5 marks</option>
                            <option value={1}>-1 mark</option>
                          </select>
                        </div>
                      )}
                      
                      {/* Display final negative marking */}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Negative marks: -{getFinalNegativeMarkingRatio()} per wrong answer
                      </p>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add a tag"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {examConfig.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {examConfig.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Start Exam Button */}
            {pdfStatus.status === 'completed' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Start!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {pdfStatus.extractedQuestions.length} questions • {Math.floor(getFinalTimeLimit() / 60)}h {getFinalTimeLimit() % 60}m
                    {examConfig.negativeMarking && ` • Negative: -${getFinalNegativeMarkingRatio()}`}
                  </p>
                  <button
                    onClick={startExam}
                    disabled={!examConfig.title.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Play className="w-5 h-5 inline mr-2" />
                    Start Exam
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};