import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, AlertTriangle, Train, Clock } from 'lucide-react'

const LiveSimulation = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [scenario, setScenario] = useState('normal')
  const [time, setTime] = useState(0)
  const [trains, setTrains] = useState([])
  const [alerts, setAlerts] = useState([])
  const [disappearedTrains, setDisappearedTrains] = useState(new Set())
  const [vipTrain, setVipTrain] = useState(null)
  const [vipTrack, setVipTrack] = useState(null)
  const [washoutTrack, setWashoutTrack] = useState(null)
  const [washoutStart, setWashoutStart] = useState(null)
  const [washoutEnd, setWashoutEnd] = useState(null)
  const [badWeatherTrack, setBadWeatherTrack] = useState(null)

  // Initialize trains for 5 tracks with proper spacing
  useEffect(() => {
    const initialTrains = [
      // Track 1 - spaced every 25%
      { id: 1, name: 'Express 101', position: 0, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 1 },
      { id: 2, name: 'Local 201', position: 25, speed: 1, originalSpeed: 1, status: 'delayed', color: 'bg-railway-green', track: 1 },
      { id: 3, name: 'Express 102', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 1 },
      
      // Track 2 - spaced every 25%
      { id: 4, name: 'Freight 301', position: 0, speed: 1.5, originalSpeed: 1.5, status: 'on-time', color: 'bg-railway-yellow', track: 2 },
      { id: 5, name: 'Local 202', position: 25, speed: 1, originalSpeed: 1, status: 'on-time', color: 'bg-railway-green', track: 2 },
      { id: 6, name: 'Express 103', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 2 },
      
      // Track 3 - spaced every 25%
      { id: 8, name: 'Local 203', position: 0, speed: 1, originalSpeed: 1, status: 'delayed', color: 'bg-railway-green', track: 3 },
      { id: 9, name: 'Freight 302', position: 25, speed: 1.5, originalSpeed: 1.5, status: 'on-time', color: 'bg-railway-yellow', track: 3 },
      { id: 16, name: 'Express 107', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 3 },
      
      // Track 4 - spaced every 25%
      { id: 10, name: 'Express 104', position: 0, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 4 },
      { id: 11, name: 'Local 204', position: 25, speed: 1, originalSpeed: 1, status: 'on-time', color: 'bg-railway-green', track: 4 },
      { id: 12, name: 'Express 105', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 4 },
      
      // Track 5 - spaced every 25%
      { id: 13, name: 'Freight 303', position: 0, speed: 1.5, originalSpeed: 1.5, status: 'on-time', color: 'bg-railway-yellow', track: 5 },
      { id: 14, name: 'Local 205', position: 25, speed: 1, originalSpeed: 1, status: 'delayed', color: 'bg-railway-green', track: 5 },
      { id: 15, name: 'Express 106', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 5 }
    ]
    setTrains(initialTrains)
  }, [])

  // Simulation loop
  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
        setTrains(prev => {
          // Group trains by track for collision detection
          const trainsByTrack = {}
          prev.forEach(train => {
            if (!trainsByTrack[train.track]) {
              trainsByTrack[train.track] = []
            }
            trainsByTrack[train.track].push(train)
          })

          // Update each train with collision avoidance
          return prev.map(train => {
            let newPosition = train.position + train.speed
            let newSpeed = train.speed
            let newStatus = train.status

            // Handle scenarios
            if (scenario === 'vip' && vipTrain && train.id === vipTrain.id) {
              newSpeed = 3
              newStatus = 'priority'
            } else if (scenario === 'vip' && vipTrack && train.track === vipTrack) {
              // Other trains on VIP track should move to different tracks
              const availableTracks = [1, 2, 3, 4, 5].filter(t => t !== vipTrack)
              const newTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)]
              
              // Find a safe position on the new track
              const newTrackTrains = trainsByTrack[newTrack] || []
              let safePosition = 0
              const minDistance = 20 // Increased minimum distance
              
              if (newTrackTrains.length > 0) {
                // Get all positions on the new track
                const positions = newTrackTrains.map(t => t.position).sort((a, b) => a - b)
                let bestGap = 0
                let bestPosition = 0
                
                // Check gaps between consecutive trains
                for (let i = 0; i < positions.length; i++) {
                  const currentPos = positions[i]
                  const nextPos = positions[(i + 1) % positions.length]
                  
                  let gap
                  if (i === positions.length - 1) {
                    // Last train to first train (wrapping around)
                    gap = (nextPos + 100 - currentPos) % 100
                  } else {
                    gap = nextPos - currentPos
                  }
                  
                  if (gap >= minDistance * 2) {
                    // Found a good gap, place train in the middle
                    safePosition = (currentPos + gap / 2) % 100
                    break
                  } else if (gap > bestGap) {
                    bestGap = gap
                    bestPosition = (currentPos + gap / 2) % 100
                  }
                }
                
                if (bestGap < minDistance) {
                  // If no good gap found, place at a random position away from all trains
                  let attempts = 0
                  do {
                    safePosition = Math.random() * 100
                    let tooClose = false
                    for (const pos of positions) {
                      const distance = Math.min(Math.abs(safePosition - pos), 100 - Math.abs(safePosition - pos))
                      if (distance < minDistance) {
                        tooClose = true
                        break
                      }
                    }
                    if (!tooClose) break
                    attempts++
                  } while (attempts < 10)
                  
                  if (attempts >= 10) {
                    // Fallback: place at a position with maximum distance from all trains
                    safePosition = bestPosition
                  }
                }
              }
              
              train.track = newTrack
              newPosition = safePosition
              newSpeed = train.originalSpeed
              newStatus = 'delayed'
            } else if (scenario === 'washout' && washoutTrack && train.track === washoutTrack) {
              // Check if train is in washout area
              if (train.position >= washoutStart && train.position <= washoutEnd) {
                newSpeed = Math.max(0.2, train.originalSpeed * 0.2) // Slow down by 80% from original speed
                newStatus = 'delayed'
              } else {
                // Train is outside washout area, return to original speed
                newSpeed = train.originalSpeed
                newStatus = 'on-time'
              }
            } else if (scenario === 'badweather' && badWeatherTrack && train.track === badWeatherTrack) {
              // Train is on the affected track, move to a different track
              const availableTracks = [1, 2, 3, 4, 5].filter(t => t !== badWeatherTrack)
              const newTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)]
              
              // Find a safe position on the new track
              const newTrackTrains = trainsByTrack[newTrack] || []
              let safePosition = 0
              const minDistance = 20 // Increased minimum distance
              
              if (newTrackTrains.length > 0) {
                // Get all positions on the new track
                const positions = newTrackTrains.map(t => t.position).sort((a, b) => a - b)
                let bestGap = 0
                let bestPosition = 0
                
                // Check gaps between consecutive trains
                for (let i = 0; i < positions.length; i++) {
                  const currentPos = positions[i]
                  const nextPos = positions[(i + 1) % positions.length]
                  
                  let gap
                  if (i === positions.length - 1) {
                    // Last train to first train (wrapping around)
                    gap = (nextPos + 100 - currentPos) % 100
                  } else {
                    gap = nextPos - currentPos
                  }
                  
                  if (gap >= minDistance * 2) {
                    // Found a good gap, place train in the middle
                    safePosition = (currentPos + gap / 2) % 100
                    break
                  } else if (gap > bestGap) {
                    bestGap = gap
                    bestPosition = (currentPos + gap / 2) % 100
                  }
                }
                
                if (bestGap < minDistance) {
                  // If no good gap found, place at a random position away from all trains
                  let attempts = 0
                  do {
                    safePosition = Math.random() * 100
                    let tooClose = false
                    for (const pos of positions) {
                      const distance = Math.min(Math.abs(safePosition - pos), 100 - Math.abs(safePosition - pos))
                      if (distance < minDistance) {
                        tooClose = true
                        break
                      }
                    }
                    if (!tooClose) break
                    attempts++
                  } while (attempts < 10)
                  
                  if (attempts >= 10) {
                    // Fallback: place at a position with maximum distance from all trains
                    safePosition = bestPosition
                  }
                }
              }
              
              train.track = newTrack
              newPosition = safePosition
              newSpeed = train.originalSpeed
              newStatus = 'delayed'
            }

            // Collision avoidance - check for trains ahead on the same track
            // Skip collision detection for trains in washout area to prevent glitching
            if (!(scenario === 'washout' && washoutTrack && train.track === washoutTrack && 
                  train.position >= washoutStart && train.position <= washoutEnd)) {
              const trackTrains = trainsByTrack[train.track].filter(t => t.id !== train.id)
              const minDistance = 20 // Increased minimum distance between trains (20% of track)

              for (const otherTrain of trackTrains) {
                let distance = otherTrain.position - train.position
                
                // Handle wrapping around the track
                if (distance < 0) {
                  distance += 100
                }
                
                // If too close to the train ahead, adjust position or speed
                if (distance < minDistance && distance > 0) {
                  if (distance < 5) {
                    // If very close, move the train slightly behind the other train
                    newPosition = (otherTrain.position - minDistance + 100) % 100
                    newSpeed = train.originalSpeed
                    newStatus = 'delayed'
                  } else {
                    newSpeed = Math.min(newSpeed, 0.5) // Slow down
                    newStatus = 'delayed'
                  }
                }
              }
            }

            // Handle train disappearing and reappearing
            if (newPosition >= 100) {
              // Mark train as disappeared and reset position
              setDisappearedTrains(prev => new Set([...prev, train.id]))
              newPosition = 0 // Reset to start position
              newStatus = 'on-time' // Reset status
            }

            return { ...train, position: newPosition, speed: newSpeed, status: newStatus }
          })
        })

        // Generate alerts based on scenario
        if (scenario === 'washout' && Math.random() < 0.1) {
          setAlerts(prev => [...prev, {
            id: Date.now(),
            message: 'Track washout detected at section 3',
            type: 'critical',
            timestamp: time
          }])
        }
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isRunning, scenario, time])

  // Handle train reappearing after disappearing
  useEffect(() => {
    if (disappearedTrains.size > 0) {
      const timer = setTimeout(() => {
        setDisappearedTrains(new Set())
      }, 1000) // 1 second delay before reappearing

      return () => clearTimeout(timer)
    }
  }, [disappearedTrains])

  const scenarios = [
    { id: 'normal', name: 'Normal Operation', description: 'Regular train operations' },
    { id: 'vip', name: 'VIP Train', description: 'High-priority VIP train incoming' },
    { id: 'washout', name: 'Track Washout', description: 'Track damage blocking section 3' },
    { id: 'badweather', name: 'Bad Weather', description: 'Severe weather makes track inoperable' }
  ]

  // Handle VIP train scenario
  const handleVipScenario = () => {
    if (scenario === 'vip') {
      // Create VIP train on a random track
      const randomTrack = Math.floor(Math.random() * 5) + 1
      const newVipTrain = {
        id: 99,
        name: 'VIP 001',
        position: 0,
        speed: 3,
        originalSpeed: 3,
        status: 'priority',
        color: 'bg-railway-red',
        track: randomTrack
      }
      
      setVipTrain(newVipTrain)
      setVipTrack(randomTrack)
      
      // Move other trains from VIP track to different tracks sequentially
      setTrains(prev => {
        const affectedTrains = prev.filter(train => train.track === randomTrack)
        const otherTrains = prev.filter(train => train.track !== randomTrack)
        const availableTracks = [1, 2, 3, 4, 5].filter(t => t !== randomTrack)
        
        // Group other trains by track for position tracking
        const trackPositions = {}
        otherTrains.forEach(train => {
          if (!trackPositions[train.track]) {
            trackPositions[train.track] = []
          }
          trackPositions[train.track].push(train.position)
        })
        
        // Move each affected train to a safe position
        const movedTrains = affectedTrains.map(train => {
          const newTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)]
          const existingPositions = trackPositions[newTrack] || []
          const minDistance = 20
          
          let safePosition = 0
          
          if (existingPositions.length > 0) {
            // Find a safe position on the new track
            const positions = [...existingPositions].sort((a, b) => a - b)
            let bestGap = 0
            let bestPosition = 0
            
            // Check gaps between consecutive trains
            for (let i = 0; i < positions.length; i++) {
              const currentPos = positions[i]
              const nextPos = positions[(i + 1) % positions.length]
              
              let gap
              if (i === positions.length - 1) {
                gap = (nextPos + 100 - currentPos) % 100
              } else {
                gap = nextPos - currentPos
              }
              
              if (gap >= minDistance * 2) {
                safePosition = (currentPos + gap / 2) % 100
                break
              } else if (gap > bestGap) {
                bestGap = gap
                bestPosition = (currentPos + gap / 2) % 100
              }
            }
            
            if (bestGap < minDistance) {
              // Try random positions
              let attempts = 0
              do {
                safePosition = Math.random() * 100
                let tooClose = false
                for (const pos of positions) {
                  const distance = Math.min(Math.abs(safePosition - pos), 100 - Math.abs(safePosition - pos))
                  if (distance < minDistance) {
                    tooClose = true
                    break
                  }
                }
                if (!tooClose) break
                attempts++
              } while (attempts < 10)
              
              if (attempts >= 10) {
                safePosition = bestPosition
              }
            }
          }
          
          // Update track positions for next train
          if (!trackPositions[newTrack]) {
            trackPositions[newTrack] = []
          }
          trackPositions[newTrack].push(safePosition)
          
          return { 
            ...train, 
            track: newTrack, 
            position: safePosition,
            speed: train.originalSpeed,
            status: 'delayed' 
          }
        })
        
        return [...otherTrains, ...movedTrains, newVipTrain]
      })
    } else {
      // Remove VIP train when switching away from VIP scenario
      if (vipTrain) {
        setTrains(prev => prev.filter(train => train.id !== 99))
        setVipTrain(null)
        setVipTrack(null)
      }
    }
  }

  // Handle washout scenario
  const handleWashoutScenario = () => {
    if (scenario === 'washout') {
      // Select a random track and random position for washout
      const randomTrack = Math.floor(Math.random() * 5) + 1
      const washoutLength = 20 // 20% of track length
      const startPosition = Math.random() * (100 - washoutLength)
      const endPosition = startPosition + washoutLength
      
      setWashoutTrack(randomTrack)
      setWashoutStart(startPosition)
      setWashoutEnd(endPosition)
      
      // Add washout alert
      setAlerts(prev => [...prev, {
        id: Date.now(),
        message: `Track washout detected on Track ${randomTrack} at ${startPosition.toFixed(1)}% - ${endPosition.toFixed(1)}%`,
        type: 'critical',
        timestamp: time
      }])
    } else {
      // Clear washout when switching away
      setWashoutTrack(null)
      setWashoutStart(null)
      setWashoutEnd(null)
    }
  }

  // Handle bad weather scenario
  const handleBadWeatherScenario = () => {
    if (scenario === 'badweather') {
      // Select a random track to be affected by bad weather
      const randomTrack = Math.floor(Math.random() * 5) + 1
      setBadWeatherTrack(randomTrack)
      
      // Move all trains from the affected track to other tracks sequentially
      setTrains(prev => {
        const affectedTrains = prev.filter(train => train.track === randomTrack)
        const otherTrains = prev.filter(train => train.track !== randomTrack)
        const availableTracks = [1, 2, 3, 4, 5].filter(t => t !== randomTrack)
        
        // Group other trains by track for position tracking
        const trackPositions = {}
        otherTrains.forEach(train => {
          if (!trackPositions[train.track]) {
            trackPositions[train.track] = []
          }
          trackPositions[train.track].push(train.position)
        })
        
        // Move each affected train to a safe position
        const movedTrains = affectedTrains.map(train => {
          const newTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)]
          const existingPositions = trackPositions[newTrack] || []
          const minDistance = 20
          
          let safePosition = 0
          
          if (existingPositions.length > 0) {
            // Find a safe position on the new track
            const positions = [...existingPositions].sort((a, b) => a - b)
            let bestGap = 0
            let bestPosition = 0
            
            // Check gaps between consecutive trains
            for (let i = 0; i < positions.length; i++) {
              const currentPos = positions[i]
              const nextPos = positions[(i + 1) % positions.length]
              
              let gap
              if (i === positions.length - 1) {
                gap = (nextPos + 100 - currentPos) % 100
              } else {
                gap = nextPos - currentPos
              }
              
              if (gap >= minDistance * 2) {
                safePosition = (currentPos + gap / 2) % 100
                break
              } else if (gap > bestGap) {
                bestGap = gap
                bestPosition = (currentPos + gap / 2) % 100
              }
            }
            
            if (bestGap < minDistance) {
              // Try random positions
              let attempts = 0
              do {
                safePosition = Math.random() * 100
                let tooClose = false
                for (const pos of positions) {
                  const distance = Math.min(Math.abs(safePosition - pos), 100 - Math.abs(safePosition - pos))
                  if (distance < minDistance) {
                    tooClose = true
                    break
                  }
                }
                if (!tooClose) break
                attempts++
              } while (attempts < 10)
              
              if (attempts >= 10) {
                safePosition = bestPosition
              }
            }
          }
          
          // Update track positions for next train
          if (!trackPositions[newTrack]) {
            trackPositions[newTrack] = []
          }
          trackPositions[newTrack].push(safePosition)
          
          return { 
            ...train, 
            track: newTrack, 
            position: safePosition,
            speed: train.originalSpeed,
            status: 'delayed' 
          }
        })
        
        return [...otherTrains, ...movedTrains]
      })
      
      // Add bad weather alert
      setAlerts(prev => [...prev, {
        id: Date.now(),
        message: `Severe weather conditions detected on Track ${randomTrack} - Track closed for safety`,
        type: 'critical',
        timestamp: time
      }])
    } else {
      // Clear bad weather when switching away
      setBadWeatherTrack(null)
    }
  }

  // Handle scenario change
  const handleScenarioChange = (newScenario) => {
    setScenario(newScenario)
    if (newScenario === 'vip') {
      handleVipScenario()
    } else if (newScenario === 'washout') {
      handleWashoutScenario()
    } else if (newScenario === 'badweather') {
      handleBadWeatherScenario()
    } else {
      // Clear special scenarios when switching away
      if (vipTrain) {
        setTrains(prev => prev.filter(train => train.id !== 99))
        setVipTrain(null)
        setVipTrack(null)
      }
      if (washoutTrack) {
        setWashoutTrack(null)
        setWashoutStart(null)
        setWashoutEnd(null)
      }
      if (badWeatherTrack) {
        setBadWeatherTrack(null)
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time': return 'text-green-600 bg-green-100'
      case 'delayed': return 'text-yellow-600 bg-yellow-100'
      case 'priority': return 'text-red-600 bg-red-100'
      case 'blocked': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700'
      case 'warning': return 'bg-yellow-100 border-yellow-500 text-yellow-700'
      default: return 'bg-blue-100 border-blue-500 text-blue-700'
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-white mb-8">
          Live Railway Simulation
        </h1>

        {/* Controls */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Simulation Controls</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-300">Time: {time}s</span>
              </div>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded-md font-medium ${
                  isRunning 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isRunning ? <><Pause className="h-4 w-4 mr-2 inline" />Pause</> : <><Play className="h-4 w-4 mr-2 inline" />Play</>}
              </button>
              <button
                onClick={() => {
                  setIsRunning(false)
                  setTime(0)
                  setAlerts([])
                  setScenario('normal')
                  setVipTrain(null)
                  setVipTrack(null)
                  setWashoutTrack(null)
                  setWashoutStart(null)
                  setWashoutEnd(null)
                  setBadWeatherTrack(null)
                  setDisappearedTrains(new Set())
                  
                  // Reset trains to initial state
                  const initialTrains = [
                    // Track 1 - spaced every 25%
                    { id: 1, name: 'Express 101', position: 0, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 1 },
                    { id: 2, name: 'Local 201', position: 25, speed: 1, originalSpeed: 1, status: 'delayed', color: 'bg-railway-green', track: 1 },
                    { id: 3, name: 'Express 102', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 1 },
                    
                    // Track 2 - spaced every 25%
                    { id: 4, name: 'Freight 301', position: 0, speed: 1.5, originalSpeed: 1.5, status: 'on-time', color: 'bg-railway-yellow', track: 2 },
                    { id: 5, name: 'Local 202', position: 25, speed: 1, originalSpeed: 1, status: 'on-time', color: 'bg-railway-green', track: 2 },
                    { id: 6, name: 'Express 103', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 2 },
                    
                    // Track 3 - spaced every 25%
                    { id: 8, name: 'Local 203', position: 0, speed: 1, originalSpeed: 1, status: 'delayed', color: 'bg-railway-green', track: 3 },
                    { id: 9, name: 'Freight 302', position: 25, speed: 1.5, originalSpeed: 1.5, status: 'on-time', color: 'bg-railway-yellow', track: 3 },
                    { id: 16, name: 'Express 107', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 3 },
                    
                    // Track 4 - spaced every 25%
                    { id: 10, name: 'Express 104', position: 0, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 4 },
                    { id: 11, name: 'Local 204', position: 25, speed: 1, originalSpeed: 1, status: 'on-time', color: 'bg-railway-green', track: 4 },
                    { id: 12, name: 'Express 105', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 4 },
                    
                    // Track 5 - spaced every 25%
                    { id: 13, name: 'Freight 303', position: 0, speed: 1.5, originalSpeed: 1.5, status: 'on-time', color: 'bg-railway-yellow', track: 5 },
                    { id: 14, name: 'Local 205', position: 25, speed: 1, originalSpeed: 1, status: 'delayed', color: 'bg-railway-green', track: 5 },
                    { id: 15, name: 'Express 106', position: 50, speed: 2, originalSpeed: 2, status: 'on-time', color: 'bg-railway-blue', track: 5 }
                  ]
                  setTrains(initialTrains)
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4 mr-2 inline" />Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {scenarios.map((sc) => (
              <button
                key={sc.id}
                onClick={() => handleScenarioChange(sc.id)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  scenario === sc.id
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                }`}
              >
                <h3 className="font-medium text-white">{sc.name}</h3>
                <p className="text-sm text-slate-300">{sc.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Railway Track */}
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Railway Network - 5 Tracks</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((trackNumber) => (
              <div key={trackNumber} className="relative">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium text-slate-300 mr-2">Track {trackNumber}:</span>
                  <div className="flex space-x-2">
                    {trains.filter(train => train.track === trackNumber).map(train => (
                      <span key={train.id} className={`px-2 py-1 rounded text-xs font-medium ${train.color} text-white`}>
                        {train.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative h-16 bg-slate-700 rounded-lg overflow-hidden border border-slate-600">
                  {/* Track */}
                  <div className="absolute inset-0 railway-track"></div>
                  
                  {/* Start/End markers */}
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">START</div>
                  <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded">END</div>
                  
                  {/* Direction arrow */}
                  <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                    <div className="text-slate-400 text-lg">→</div>
                  </div>
                  
                  {/* Trains on this track */}
                  {trains
                    .filter(train => train.track === trackNumber && !disappearedTrains.has(train.id))
                    .map((train) => {
                      const isNearEnd = train.position > 90
                      return (
                        <div
                          key={train.id}
                          className={`absolute top-1/2 transform -translate-y-1/2 train ${train.color} rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold shadow-lg transition-all duration-300 ${
                            isNearEnd ? 'animate-pulse' : ''
                          }`}
                          style={{ left: `${train.position}%` }}
                          title={`${train.name} - Speed: ${train.speed}x - Status: ${train.status}`}
                        >
                          <Train className="h-3 w-3" />
                        </div>
                      )
                    })}

                  {/* Track sections */}
                  {[0, 25, 50, 75, 100].map((position, index) => (
                    <div
                      key={index}
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-500"
                      style={{ left: `${position}%` }}
                    >
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-slate-500 rounded-full"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-slate-500 rounded-full"></div>
                    </div>
                  ))}

                  {/* Scenario indicators */}
                  {scenario === 'washout' && washoutTrack === trackNumber && (
                    <div 
                      className="absolute top-0 bottom-0 bg-red-500 opacity-50 border-2 border-red-700" 
                      style={{ 
                        left: `${washoutStart}%`, 
                        width: `${washoutEnd - washoutStart}%` 
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <AlertTriangle className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute top-1 left-1 text-white text-xs font-bold bg-red-700 px-1 rounded">
                        WASHOUT
                      </div>
                    </div>
                  )}
                  
                  {/* VIP track indicator */}
                  {scenario === 'vip' && vipTrack === trackNumber && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-yellow-500 opacity-80"></div>
                  )}
                  
                  {/* Bad weather track indicator */}
                  {scenario === 'badweather' && badWeatherTrack === trackNumber && (
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gray-400 opacity-60 border-2 border-gray-600">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-white text-lg font-bold">⚠️</div>
                        <div className="text-white text-xs font-bold bg-gray-700 px-2 py-1 rounded mt-1">
                          TRACK CLOSED
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Train Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Train Status by Track</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((trackNumber) => (
                <div key={trackNumber} className="border border-slate-600 rounded-lg p-4 bg-slate-700/50">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Track {trackNumber}</h3>
                  <div className="space-y-2">
                    {trains
                      .filter(train => train.track === trackNumber)
                      .map((train) => (
                        <div key={train.id} className="flex items-center justify-between p-2 bg-slate-600 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${train.color.replace('bg-', 'bg-')}`}></div>
                            <span className="font-medium text-white text-sm">{train.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-slate-300">Speed: {train.speed}x</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(train.status)}`}>
                              {train.status.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">System Alerts</h2>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No active alerts</p>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <p className="text-sm mt-1">Time: {alert.timestamp}s</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveSimulation
