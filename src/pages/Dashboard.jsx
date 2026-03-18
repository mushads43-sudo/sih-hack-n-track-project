import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { 
  TrendingUp, 
  Clock, 
  Train, 
  AlertTriangle, 
  CheckCircle,
  Activity
} from 'lucide-react'

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    throughput: 45,
    averageDelay: 1.8,
    utilization: 82,
    onTimePercentage: 87,
    activeTrains: 15,
    alerts: 0
  })

  // Simulate real-time data updates based on actual simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        throughput: Math.max(35, Math.min(55, prev.throughput + (Math.random() - 0.5) * 3)),
        averageDelay: Math.max(0.5, Math.min(4.0, prev.averageDelay + (Math.random() - 0.5) * 0.3)),
        utilization: Math.min(95, Math.max(60, prev.utilization + (Math.random() - 0.5) * 2)),
        onTimePercentage: Math.min(95, Math.max(75, prev.onTimePercentage + (Math.random() - 0.5) * 1)),
        activeTrains: 15, // Fixed at 15 trains as per simulation
        alerts: Math.max(0, prev.alerts + Math.floor((Math.random() - 0.8) * 0.5))
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const throughputData = [
    { time: '00:00', trains: 8 },
    { time: '04:00', trains: 5 },
    { time: '08:00', trains: 42 },
    { time: '12:00', trains: 48 },
    { time: '16:00', trains: 45 },
    { time: '20:00', trains: 32 },
    { time: '24:00', trains: 12 }
  ]

  const delayData = [
    { route: 'Express Trains', delay: 1.2 },
    { route: 'Local Trains', delay: 2.8 },
    { route: 'Freight Trains', delay: 2.1 },
    { route: 'VIP Trains', delay: 0.5 },
    { route: 'Delayed Trains', delay: 4.5 }
  ]

  const utilizationData = [
    { name: 'Track 1', value: 85, color: '#16a34a' },
    { name: 'Track 2', value: 88, color: '#16a34a' },
    { name: 'Track 3', value: 82, color: '#16a34a' },
    { name: 'Track 4', value: 90, color: '#eab308' },
    { name: 'Track 5', value: 86, color: '#16a34a' }
  ]

  const MetricCard = ({ title, value, icon: Icon, color, suffix = '' }) => (
    <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-slate-300">{title}</p>
          <p className="text-2xl font-semibold text-white">
            {value}{suffix}
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-white mb-8">
          Railway Traffic Control Dashboard
        </h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Throughput (trains/hour)"
            value={metrics.throughput.toFixed(1)}
            icon={TrendingUp}
            color="bg-railway-green"
          />
          <MetricCard
            title="Average Delay (min)"
            value={metrics.averageDelay.toFixed(1)}
            icon={Clock}
            color="bg-railway-yellow"
          />
          <MetricCard
            title="Track Utilization"
            value={metrics.utilization.toFixed(1)}
            icon={Activity}
            color="bg-railway-blue"
            suffix="%"
          />
          <MetricCard
            title="On-Time Performance"
            value={metrics.onTimePercentage.toFixed(1)}
            icon={CheckCircle}
            color="bg-railway-green"
            suffix="%"
          />
          <MetricCard
            title="Active Trains"
            value={metrics.activeTrains}
            icon={Train}
            color="bg-railway-blue"
          />
          <MetricCard
            title="Active Alerts"
            value={metrics.alerts}
            icon={AlertTriangle}
            color="bg-railway-red"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-4">
              Throughput Over Time
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={throughputData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fill: '#cbd5e1', fontSize: 12 }} 
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fill: '#cbd5e1', fontSize: 12 }} 
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    color: '#f1f5f9',
                    fontSize: '12px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="trains" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h3 className="text-lg font-medium text-white mb-4">
              Average Delays by Route
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={delayData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="route" 
                  tick={{ fill: '#cbd5e1', fontSize: 12 }} 
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fill: '#cbd5e1', fontSize: 12 }} 
                  width={40}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    color: '#f1f5f9',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="delay" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
