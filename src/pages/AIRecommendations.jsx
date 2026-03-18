import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Settings,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react'

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const generateRecommendations = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          setRecommendations([
            {
              id: 1,
              title: 'Optimize Express Train Scheduling',
              priority: 'high',
              impact: 'high',
              effort: 'medium',
              description: 'Optimize Express 101-107 scheduling to reduce conflicts with Local and Freight trains',
              benefits: ['Reduce average delay by 0.7 minutes', 'Increase throughput by 12%', 'Save $18,000/month in operational costs'],
              implementation: 'Update Express train departure times and track assignments using AI algorithms',
              timeline: '2-3 weeks',
              confidence: 94
            },
            {
              id: 2,
              title: 'Implement VIP Train Management',
              priority: 'high',
              impact: 'high',
              effort: 'high',
              description: 'Deploy AI-powered VIP train priority system to minimize disruption to regular operations',
              benefits: ['Reduce VIP impact by 40%', 'Maintain 85% on-time performance during VIP operations', 'Better track utilization'],
              implementation: 'Integrate VIP train detection with dynamic routing system',
              timeline: '4-6 weeks',
              confidence: 87
            },
            {
              id: 3,
              title: 'Track Washout Response System',
              priority: 'medium',
              impact: 'medium',
              effort: 'low',
              description: 'Implement automated speed reduction system for trains entering washout zones',
              benefits: ['Prevent accidents in washout areas', 'Reduce maintenance costs by 25%', 'Improve safety compliance'],
              implementation: 'Deploy speed monitoring sensors and automated speed control',
              timeline: '1-2 weeks',
              confidence: 91
            },
            {
              id: 4,
              title: 'Bad Weather Track Closure Protocol',
              priority: 'medium',
              impact: 'high',
              effort: 'medium',
              description: 'Automate track closure and train redistribution during severe weather conditions',
              benefits: ['Reduce weather-related delays by 60%', 'Improve passenger safety', 'Better resource allocation'],
              implementation: 'Deploy weather monitoring and automated track switching system',
              timeline: '3-4 weeks',
              confidence: 89
            },
            {
              id: 5,
              title: 'Collision Avoidance Enhancement',
              priority: 'low',
              impact: 'high',
              effort: 'medium',
              description: 'Improve collision avoidance system for better train spacing on all 5 tracks',
              benefits: ['Eliminate train overlaps completely', 'Increase safety margin by 30%', 'Improve system reliability'],
              implementation: 'Update collision detection algorithms and minimum distance requirements',
              timeline: '2-3 weeks',
              confidence: 85
            }
          ])
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  useEffect(() => {
    generateRecommendations()
  }, [])

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getEffortColor = (effort) => {
    switch (effort) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const RecommendationCard = ({ recommendation }) => (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 border border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            {recommendation.title}
          </h3>
          <p className="text-slate-300 mb-4">{recommendation.description}</p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
            {recommendation.priority} priority
          </span>
          <span className="text-sm text-slate-400">
            {recommendation.confidence}% confidence
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-300">Impact:</span>
          <span className={`text-sm font-medium ${getImpactColor(recommendation.impact)}`}>
            {recommendation.impact}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-300">Effort:</span>
          <span className={`text-sm font-medium ${getEffortColor(recommendation.effort)}`}>
            {recommendation.effort}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-300">Timeline:</span>
          <span className="text-sm font-medium text-white">{recommendation.timeline}</span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Expected Benefits:</h4>
        <ul className="list-disc list-inside space-y-1">
          {recommendation.benefits.map((benefit, index) => (
            <li key={index} className="text-sm text-slate-300">{benefit}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-white mb-2">Implementation:</h4>
        <p className="text-sm text-slate-300">{recommendation.implementation}</p>
      </div>

      <div className="flex items-center justify-between">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Implement
        </button>
        <button className="px-4 py-2 bg-slate-600 text-slate-200 rounded-md hover:bg-slate-700 transition-colors">
          Schedule for Later
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            AI Recommendations
          </h1>
          <button
            onClick={generateRecommendations}
            disabled={isAnalyzing}
            className="px-6 py-3 bg-railway-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </button>
        </div>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-8 border border-slate-700">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-blue-400 animate-pulse" />
              <div className="flex-1">
                <h3 className="text-lg font-medium text-white mb-2">
                  AI Analysis in Progress
                </h3>
                <p className="text-slate-300 mb-4">
                  Analyzing traffic patterns, delays, and optimization opportunities...
                </p>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 mt-2">{analysisProgress}% complete</p>
              </div>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">Total Recommendations</p>
                  <p className="text-2xl font-semibold text-white">{recommendations.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-500">
                  <AlertTriangle className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">High Priority</p>
                  <p className="text-2xl font-semibold text-white">
                    {recommendations.filter(r => r.priority === 'high').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">High Impact</p>
                  <p className="text-2xl font-semibold text-white">
                    {recommendations.filter(r => r.impact === 'high').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-500">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-300">Quick Wins</p>
                  <p className="text-2xl font-semibold text-white">
                    {recommendations.filter(r => r.effort === 'low').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations List */}
        <div className="space-y-6">
          {recommendations.length === 0 && !isAnalyzing ? (
            <div className="bg-slate-800 rounded-lg shadow-lg p-12 text-center border border-slate-700">
              <Brain className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Recommendations Available</h3>
              <p className="text-slate-300">Click "Refresh Analysis" to generate AI recommendations</p>
            </div>
          ) : (
            recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AIRecommendations
