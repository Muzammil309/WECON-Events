'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface VenueLocation {
  id: string
  name: string
  type: 'ROOM' | 'BOOTH' | 'AMENITY' | 'EXIT' | 'ENTRANCE' | 'RESTROOM' | 'FOOD' | 'INFO'
  floor: number
  coordinates: { x: number; y: number }
  capacity?: number
  currentOccupancy?: number
  description?: string
  amenities?: string[]
  isAccessible?: boolean
}

interface NavigationRoute {
  from: VenueLocation
  to: VenueLocation
  path: { x: number; y: number }[]
  distance: number
  estimatedTime: number
  instructions: string[]
}

interface InteractiveVenueMapProps {
  eventId: number
  userLocation?: { x: number; y: number }
  showRealTimeOccupancy?: boolean
}

export default function InteractiveVenueMap({ 
  eventId, 
  userLocation, 
  showRealTimeOccupancy = false 
}: InteractiveVenueMapProps) {
  const [locations, setLocations] = useState<VenueLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<VenueLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentFloor, setCurrentFloor] = useState(1)
  const [navigationRoute, setNavigationRoute] = useState<NavigationRoute | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    loadVenueData()
    if (showRealTimeOccupancy) {
      subscribeToOccupancyUpdates()
    }
  }, [eventId, showRealTimeOccupancy])

  const loadVenueData = async () => {
    try {
      // Mock venue data - in production, this would come from a venue management system
      const mockLocations: VenueLocation[] = [
        {
          id: 'main-hall',
          name: 'Main Hall',
          type: 'ROOM',
          floor: 1,
          coordinates: { x: 400, y: 300 },
          capacity: 500,
          currentOccupancy: 347,
          description: 'Main keynote and presentation hall',
          amenities: ['AV Equipment', 'Live Streaming', 'Accessibility'],
          isAccessible: true
        },
        {
          id: 'workshop-a',
          name: 'Workshop Room A',
          type: 'ROOM',
          floor: 1,
          coordinates: { x: 200, y: 150 },
          capacity: 50,
          currentOccupancy: 23,
          description: 'Interactive workshop space',
          amenities: ['Whiteboards', 'Projector', 'Round Tables'],
          isAccessible: true
        },
        {
          id: 'exhibition-hall',
          name: 'Exhibition Hall',
          type: 'ROOM',
          floor: 1,
          coordinates: { x: 600, y: 400 },
          capacity: 200,
          currentOccupancy: 156,
          description: 'Sponsor booths and exhibitions',
          amenities: ['Power Outlets', 'WiFi', 'Storage'],
          isAccessible: true
        },
        {
          id: 'networking-lounge',
          name: 'Networking Lounge',
          type: 'AMENITY',
          floor: 1,
          coordinates: { x: 300, y: 500 },
          capacity: 100,
          currentOccupancy: 67,
          description: 'Casual networking and refreshments',
          amenities: ['Seating', 'Refreshments', 'Charging Stations'],
          isAccessible: true
        },
        {
          id: 'registration',
          name: 'Registration Desk',
          type: 'INFO',
          floor: 1,
          coordinates: { x: 100, y: 100 },
          description: 'Check-in and information desk',
          amenities: ['Staff Support', 'Badge Printing'],
          isAccessible: true
        },
        {
          id: 'food-court',
          name: 'Food Court',
          type: 'FOOD',
          floor: 1,
          coordinates: { x: 500, y: 150 },
          description: 'Dining and refreshment area',
          amenities: ['Multiple Vendors', 'Seating', 'Dietary Options'],
          isAccessible: true
        },
        {
          id: 'restroom-1',
          name: 'Restrooms',
          type: 'RESTROOM',
          floor: 1,
          coordinates: { x: 150, y: 400 },
          isAccessible: true
        },
        {
          id: 'main-entrance',
          name: 'Main Entrance',
          type: 'ENTRANCE',
          floor: 1,
          coordinates: { x: 50, y: 250 },
          isAccessible: true
        },
        {
          id: 'emergency-exit-1',
          name: 'Emergency Exit',
          type: 'EXIT',
          floor: 1,
          coordinates: { x: 750, y: 200 },
          isAccessible: true
        }
      ]

      setLocations(mockLocations)
    } catch (error) {
      console.error('Error loading venue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToOccupancyUpdates = () => {
    // Subscribe to real-time occupancy updates
    // This would integrate with IoT sensors, WiFi analytics, or manual check-ins
    const interval = setInterval(() => {
      setLocations(prev => prev.map(location => ({
        ...location,
        currentOccupancy: location.capacity ? 
          Math.floor(Math.random() * location.capacity) : 
          location.currentOccupancy
      })))
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }

  const searchLocations = (query: string) => {
    return locations.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.description?.toLowerCase().includes(query.toLowerCase())
    )
  }

  const filterLocations = (locations: VenueLocation[]) => {
    if (activeFilters.length === 0) return locations
    return locations.filter(location => activeFilters.includes(location.type))
  }

  const calculateRoute = (from: VenueLocation, to: VenueLocation): NavigationRoute => {
    // Simple pathfinding - in production, use A* algorithm with venue layout
    const distance = Math.sqrt(
      Math.pow(to.coordinates.x - from.coordinates.x, 2) +
      Math.pow(to.coordinates.y - from.coordinates.y, 2)
    )

    const estimatedTime = Math.ceil(distance / 50) // Rough estimate: 50 pixels per minute

    return {
      from,
      to,
      path: [from.coordinates, to.coordinates], // Simplified straight line
      distance: Math.round(distance),
      estimatedTime,
      instructions: [
        `Start at ${from.name}`,
        `Head ${getDirection(from.coordinates, to.coordinates)}`,
        `Arrive at ${to.name}`
      ]
    }
  }

  const getDirection = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'east' : 'west'
    } else {
      return dy > 0 ? 'south' : 'north'
    }
  }

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'ROOM': return '🏛️'
      case 'BOOTH': return '🏪'
      case 'AMENITY': return '☕'
      case 'EXIT': return '🚪'
      case 'ENTRANCE': return '🚪'
      case 'RESTROOM': return '🚻'
      case 'FOOD': return '🍽️'
      case 'INFO': return 'ℹ️'
      default: return '📍'
    }
  }

  const getOccupancyColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const handleLocationClick = (location: VenueLocation) => {
    setSelectedLocation(location)
    if (userLocation) {
      const userLoc: VenueLocation = {
        id: 'user',
        name: 'Your Location',
        type: 'INFO',
        floor: currentFloor,
        coordinates: userLocation
      }
      setNavigationRoute(calculateRoute(userLoc, location))
    }
  }

  const filteredLocations = filterLocations(
    searchQuery ? searchLocations(searchQuery) : locations
  ).filter(loc => loc.floor === currentFloor)

  const locationTypes = [
    { type: 'ROOM', label: 'Rooms', icon: '🏛️' },
    { type: 'BOOTH', label: 'Booths', icon: '🏪' },
    { type: 'AMENITY', label: 'Amenities', icon: '☕' },
    { type: 'FOOD', label: 'Food', icon: '🍽️' },
    { type: 'RESTROOM', label: 'Restrooms', icon: '🚻' },
    { type: 'INFO', label: 'Information', icon: 'ℹ️' }
  ]

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Interactive Venue Map</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              🔍 Filters
            </button>
            <select
              value={currentFloor}
              onChange={(e) => setCurrentFloor(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value={1}>Floor 1</option>
              <option value={2}>Floor 2</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {locationTypes.map(({ type, label, icon }) => (
                <button
                  key={type}
                  onClick={() => {
                    setActiveFilters(prev =>
                      prev.includes(type)
                        ? prev.filter(f => f !== type)
                        : [...prev, type]
                    )
                  }}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    activeFilters.includes(type)
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="relative bg-gray-100 overflow-hidden"
          style={{ height: '500px', width: '100%' }}
        >
          {/* Venue Layout Background */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            className="absolute inset-0"
          >
            {/* Floor plan outline */}
            <rect x="20" y="20" width="760" height="560" fill="white" stroke="#e5e7eb" strokeWidth="2" />
            
            {/* Room outlines */}
            <rect x="150" y="100" width="200" height="150" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
            <rect x="450" y="100" width="200" height="150" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
            <rect x="350" y="280" width="250" height="200" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />
            <rect x="550" y="350" width="200" height="150" fill="#f9fafb" stroke="#d1d5db" strokeWidth="1" />

            {/* Navigation route */}
            {navigationRoute && (
              <path
                d={`M ${navigationRoute.path[0].x} ${navigationRoute.path[0].y} L ${navigationRoute.path[1].x} ${navigationRoute.path[1].y}`}
                stroke="#3b82f6"
                strokeWidth="3"
                strokeDasharray="5,5"
                fill="none"
              />
            )}

            {/* Location markers */}
            {filteredLocations.map((location) => (
              <g key={location.id}>
                <circle
                  cx={location.coordinates.x}
                  cy={location.coordinates.y}
                  r="12"
                  fill={selectedLocation?.id === location.id ? '#3b82f6' : '#6b7280'}
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer hover:fill-blue-500"
                  onClick={() => handleLocationClick(location)}
                />
                
                {/* Occupancy indicator */}
                {showRealTimeOccupancy && location.capacity && location.currentOccupancy && (
                  <circle
                    cx={location.coordinates.x + 15}
                    cy={location.coordinates.y - 15}
                    r="6"
                    className={getOccupancyColor(location.currentOccupancy, location.capacity)}
                  />
                )}
              </g>
            ))}

            {/* User location */}
            {userLocation && (
              <circle
                cx={userLocation.x}
                cy={userLocation.y}
                r="8"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
              />
            )}
          </svg>

          {/* Location labels */}
          {filteredLocations.map((location) => (
            <div
              key={`label-${location.id}`}
              className="absolute pointer-events-none"
              style={{
                left: `${(location.coordinates.x / 800) * 100}%`,
                top: `${(location.coordinates.y / 600) * 100 + 3}%`,
                transform: 'translate(-50%, 0)'
              }}
            >
              <div className="bg-white px-2 py-1 rounded shadow text-xs font-medium text-gray-700 border">
                {getLocationIcon(location.type)} {location.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Details Panel */}
      {selectedLocation && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {getLocationIcon(selectedLocation.type)} {selectedLocation.name}
              </h4>
              {selectedLocation.description && (
                <p className="text-gray-600 mb-3">{selectedLocation.description}</p>
              )}
              
              {/* Occupancy info */}
              {selectedLocation.capacity && selectedLocation.currentOccupancy && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Current Occupancy</span>
                    <span className="font-medium">
                      {selectedLocation.currentOccupancy} / {selectedLocation.capacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${getOccupancyColor(selectedLocation.currentOccupancy, selectedLocation.capacity)}`}
                      style={{
                        width: `${(selectedLocation.currentOccupancy / selectedLocation.capacity) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Amenities */}
              {selectedLocation.amenities && selectedLocation.amenities.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Amenities:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation info */}
              {navigationRoute && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="text-sm font-medium text-blue-900 mb-1">
                    Navigation ({navigationRoute.estimatedTime} min walk)
                  </div>
                  <div className="text-sm text-blue-700">
                    {navigationRoute.instructions.join(' → ')}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setSelectedLocation(null)}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
