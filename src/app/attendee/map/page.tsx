'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, Clock, Users, Coffee, Utensils, Car, Wifi, Phone, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapLocation {
  id: string;
  name: string;
  type: 'auditorium' | 'conference_room' | 'workshop' | 'exhibition' | 'food' | 'restroom' | 'parking' | 'entrance' | 'info';
  floor: number;
  coordinates: { x: number; y: number };
  capacity?: number;
  amenities: string[];
  description: string;
  currentOccupancy?: number;
  nextEvent?: {
    title: string;
    time: string;
  };
}

interface Floor {
  id: number;
  name: string;
  locations: MapLocation[];
}

export default function EventMapPage() {
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockFloors: Floor[] = [
        {
          id: 1,
          name: 'Ground Floor',
          locations: [
            {
              id: 'main-entrance',
              name: 'Main Entrance',
              type: 'entrance',
              floor: 1,
              coordinates: { x: 50, y: 90 },
              amenities: ['Registration Desk', 'Information', 'Security'],
              description: 'Main entrance with registration and welcome desk'
            },
            {
              id: 'main-auditorium',
              name: 'Main Auditorium',
              type: 'auditorium',
              floor: 1,
              coordinates: { x: 50, y: 40 },
              capacity: 1500,
              amenities: ['Audio/Visual', 'Live Streaming', 'Accessibility'],
              description: 'Primary venue for keynotes and major presentations',
              currentOccupancy: 1247,
              nextEvent: {
                title: 'Opening Keynote',
                time: '09:00 AM'
              }
            },
            {
              id: 'exhibition-hall',
              name: 'Exhibition Hall',
              type: 'exhibition',
              floor: 1,
              coordinates: { x: 20, y: 60 },
              amenities: ['Power Outlets', 'Wifi', 'Storage'],
              description: 'Sponsor booths and technology demonstrations'
            },
            {
              id: 'food-court',
              name: 'Food Court',
              type: 'food',
              floor: 1,
              coordinates: { x: 80, y: 60 },
              amenities: ['Multiple Vendors', 'Seating Area', 'Dietary Options'],
              description: 'Various food and beverage options'
            },
            {
              id: 'parking-area',
              name: 'Parking Area',
              type: 'parking',
              floor: 1,
              coordinates: { x: 10, y: 90 },
              amenities: ['Valet Service', 'EV Charging', 'Security'],
              description: 'Main parking facility with 500+ spaces'
            }
          ]
        },
        {
          id: 2,
          name: 'Second Floor',
          locations: [
            {
              id: 'conf-room-a',
              name: 'Conference Room A',
              type: 'conference_room',
              floor: 2,
              coordinates: { x: 30, y: 30 },
              capacity: 200,
              amenities: ['Projector', 'Whiteboard', 'Video Conferencing'],
              description: 'Medium-sized conference room for panels and discussions',
              currentOccupancy: 156,
              nextEvent: {
                title: 'Panel Discussion',
                time: '10:30 AM'
              }
            },
            {
              id: 'conf-room-b',
              name: 'Conference Room B',
              type: 'conference_room',
              floor: 2,
              coordinates: { x: 70, y: 30 },
              capacity: 150,
              amenities: ['Projector', 'Sound System', 'Recording'],
              description: 'Flexible space for presentations and workshops',
              currentOccupancy: 89,
              nextEvent: {
                title: 'Tech Workshop',
                time: '02:00 PM'
              }
            },
            {
              id: 'workshop-1',
              name: 'Workshop Room 1',
              type: 'workshop',
              floor: 2,
              coordinates: { x: 30, y: 70 },
              capacity: 50,
              amenities: ['Interactive Displays', 'Breakout Areas', 'Materials'],
              description: 'Hands-on workshop space with interactive equipment'
            },
            {
              id: 'workshop-2',
              name: 'Workshop Room 2',
              type: 'workshop',
              floor: 2,
              coordinates: { x: 70, y: 70 },
              capacity: 50,
              amenities: ['Computers', 'Software', 'Technical Support'],
              description: 'Technology workshop with computer stations'
            },
            {
              id: 'networking-lounge',
              name: 'Networking Lounge',
              type: 'food',
              floor: 2,
              coordinates: { x: 50, y: 50 },
              amenities: ['Comfortable Seating', 'Coffee Bar', 'Quiet Zone'],
              description: 'Relaxed space for networking and informal meetings'
            }
          ]
        }
      ];

      setFloors(mockFloors);
    } catch (error) {
      console.error('Failed to fetch map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (type: MapLocation['type']) => {
    switch (type) {
      case 'auditorium':
      case 'conference_room':
        return Users;
      case 'workshop':
        return Coffee;
      case 'exhibition':
        return Info;
      case 'food':
        return Utensils;
      case 'parking':
        return Car;
      case 'entrance':
        return MapPin;
      case 'info':
        return Info;
      default:
        return MapPin;
    }
  };

  const getLocationColor = (type: MapLocation['type']) => {
    switch (type) {
      case 'auditorium':
        return 'bg-blue-500';
      case 'conference_room':
        return 'bg-green-500';
      case 'workshop':
        return 'bg-purple-500';
      case 'exhibition':
        return 'bg-orange-500';
      case 'food':
        return 'bg-red-500';
      case 'parking':
        return 'bg-gray-500';
      case 'entrance':
        return 'bg-indigo-500';
      case 'info':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const currentFloor = floors.find(floor => floor.id === selectedFloor);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Event Map</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Navigate the venue and find your way around
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedFloor.toString()} onValueChange={(value) => setSelectedFloor(parseInt(value))}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {floors.map((floor) => (
                <SelectItem key={floor.id} value={floor.id.toString()}>
                  {floor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {currentFloor?.name} Layout
              </CardTitle>
              <CardDescription>Click on any location for more details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg h-96 overflow-hidden">
                {/* Floor Plan Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                  {/* Grid lines for visual reference */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Location Markers */}
                {currentFloor?.locations.map((location) => {
                  const Icon = getLocationIcon(location.type);
                  return (
                    <motion.button
                      key={location.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedLocation(location)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full ${getLocationColor(location.type)} text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all`}
                      style={{
                        left: `${location.coordinates.x}%`,
                        top: `${location.coordinates.y}%`
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </motion.button>
                  );
                })}

                {/* Selected Location Highlight */}
                {selectedLocation && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-4 border-blue-500 rounded-full pointer-events-none"
                    style={{
                      left: `${selectedLocation.coordinates.x}%`,
                      top: `${selectedLocation.coordinates.y}%`
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details */}
        <div className="space-y-4">
          {selectedLocation ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const Icon = getLocationIcon(selectedLocation.type);
                    return <Icon className="h-5 w-5" />;
                  })()}
                  {selectedLocation.name}
                </CardTitle>
                <CardDescription>{selectedLocation.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLocation.capacity && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Capacity</span>
                    <Badge variant="outline">{selectedLocation.capacity} people</Badge>
                  </div>
                )}

                {selectedLocation.currentOccupancy && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Occupancy</span>
                    <Badge variant="secondary">{selectedLocation.currentOccupancy} people</Badge>
                  </div>
                )}

                {selectedLocation.nextEvent && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">Next Event</span>
                    </div>
                    <p className="text-sm">{selectedLocation.nextEvent.title}</p>
                    <p className="text-xs text-gray-500">{selectedLocation.nextEvent.time}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedLocation.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Location
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Click on any marker on the map to view details and get directions
                </p>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { type: 'auditorium', label: 'Auditoriums' },
                { type: 'conference_room', label: 'Conference Rooms' },
                { type: 'workshop', label: 'Workshop Rooms' },
                { type: 'exhibition', label: 'Exhibition Areas' },
                { type: 'food', label: 'Food & Beverage' },
                { type: 'parking', label: 'Parking' },
                { type: 'entrance', label: 'Entrances' },
                { type: 'info', label: 'Information' }
              ].map((item) => {
                const Icon = getLocationIcon(item.type as MapLocation['type']);
                return (
                  <div key={item.type} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getLocationColor(item.type as MapLocation['type'])} flex items-center justify-center`}>
                      <Icon className="h-2.5 w-2.5 text-white" />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
