import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Calendar,
  Target,
  Zap,
  Award,
  Activity,
  PlusCircle,
  History,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useExamStorage } from '../hooks/useLocalStorage';

// Main dashboard component showing user overview and recent activity
export const Dashboard = ({ onRouteChange }) => {
  // Get current user from auth context
  const { user } = useAuth();
  
  // Get exam storage functions
  const { examHistory, userProgress } = useExamStorage();
  
  // Dashboard statistics state
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    bestScore: 0,
    recentActivity: []
  });

  // Loading state for statistics
  const [isLoading, setIsLoading] = useState(true);

  // Calculate dashboard statistics from user data
  useEffect(() => {
    const calculateStats = () => {
      console.log('Calculating dashboard statistics');
      
      try {
        // Calculate exam statistics from history
        const totalExams = examHistory.length;
        const scores = examHistory.map((exam) => exam.percentage || 0);
        const averageScore = scores.length > 0 ? 
          Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
        
        // Calculate total time spent (sum of all exam durations)
        const totalTimeSpent = examHistory.reduce((total, exam) => 
          total + (exam.timeTaken || 0), 0);
        
        // Get current streak from user data
        const currentStreak = user?.streak || 0;
        
        // Generate recent activity from exam history and user achievements
        const recentActivity = [];
        
        // Add recent exam completions
        examHistory.slice(0, 5).forEach((exam, index) => {
          recentActivity.push({
            id: `exam_${index}`,
            type: 'exam_completed',
            description: `Completed "${exam.title || 'Practice Exam'}"`,
            date: exam.completedDate || new Date().toISOString(),
            score: exam.percentage,
            examTitle: exam.title
          });
        });
        
        // Add badge achievements
        user?.badges?.slice(0, 3).forEach((badge, index) => {
          recentActivity.push({
            id: `badge_${index}`,
            type: 'badge_earned',
            description: `Earned "${badge.name}" badge`,
            date: badge.earnedDate
          });
        });
        
        // Add streak milestones
        if (currentStreak > 0 && currentStreak % 7 === 0) {
          recentActivity.push({
            id: 'streak_milestone',
            type: 'streak_milestone',
            description: `Reached ${currentStreak} day study streak!`,
            date: new Date().toISOString()
          });
        }
        
        // Sort activity by date (most recent first)
        recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        const calculatedStats = {
          totalExams,
          averageScore,
          totalTimeSpent,
          currentStreak,
          bestScore,
          recentActivity: recentActivity.slice(0, 8) // Keep last 8 activities
        };
        
        setStats(calculatedStats);
        console.log('Dashboard statistics calculated:', calculatedStats);
        
      } catch (error) {
        console.error('Error calculating dashboard statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateStats();
  }, [examHistory, userProgress, user]);

  // Format time duration for display
  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Get activity icon based on type
  const getActivityIcon = (type) => {
    switch (type) {
      case 'exam_completed':
        return <BookOpen className="w-4 h-4" />;
      case 'badge_earned':
        return <Award className="w-4 h-4" />;
      case 'streak_milestone':
        return <Zap className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  // Get activity color based on type
  const getActivityColor = (type) => {
    switch (type) {
      case 'exam_completed':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      case 'badge_earned':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'streak_milestone':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to continue your learning journey? Let's see how you're progressing.
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Total Exams Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalExams}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total Exams</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">Keep practicing!</p>
          </div>

          {/* Average Score Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageScore}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Average Score</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {stats.averageScore >= 80 ? 'Excellent!' : stats.averageScore >= 60 ? 'Good progress' : 'Keep improving'}
            </p>
          </div>

          {/* Study Streak Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.currentStreak}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Day Streak</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">Stay consistent!</p>
          </div>

          {/* Time Spent Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(stats.totalTimeSpent)}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Time Studied</h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">Total practice time</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Quick Actions & Performance */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => onRouteChange('exam-config')}
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800/30 dark:hover:to-blue-700/30 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center mb-2">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">Start New Exam</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload a PDF or create a custom exam to begin practicing
                  </p>
                </button>

                <button
                  onClick={() => onRouteChange('analytics')}
                  className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800/30 dark:hover:to-purple-700/30 transition-all duration-200 text-left"
                >
                  <div className="flex items-center mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="font-medium text-gray-900 dark:text-white">View Analytics</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Analyze your performance and track improvement areas
                  </p>
                </button>
              </div>
            </div>

            {/* Performance Overview */}
            {stats.bestScore > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Performance Highlights
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.bestScore}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Best Score</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageScore}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Average</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalExams}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-6">
            
            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                Recent Activity
              </h2>
              
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.description}
                        </p>
                        {activity.score && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Score: {activity.score}%
                          </p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Start taking exams to see your progress here
                  </p>
                </div>
              )}
            </div>

            {/* User Badges */}
            {user?.badges && user.badges.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Recent Badges
                </h2>
                
                <div className="grid grid-cols-2 gap-3">
                  {user.badges.slice(0, 4).map((badge) => (
                    <div key={badge.id} className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-800/50 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{badge.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(badge.earnedDate)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};