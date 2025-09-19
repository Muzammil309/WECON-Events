'use client'

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { updateSessionAttendance } from '@/lib/realtime'

interface QRCheckInSystemProps {
  eventId: number
  sessionId?: number
  onCheckIn?: (result: CheckInResult) => void
}

interface CheckInResult {
  success: boolean
  message: string
  user?: any
  registration?: any
}

interface QRScanResult {
  text: string
  timestamp: number
}

export default function QRCheckInSystem({ eventId, sessionId, onCheckIn }: QRCheckInSystemProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<QRScanResult | null>(null)
  const [checkInHistory, setCheckInHistory] = useState<CheckInResult[]>([])
  const [manualCode, setManualCode] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState({
    totalCheckIns: 0,
    successfulCheckIns: 0,
    failedCheckIns: 0
  })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Load check-in stats
  useEffect(() => {
    loadCheckInStats()
  }, [eventId, sessionId])

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const loadCheckInStats = async () => {
    try {
      let query = supabase
        .from('event_registrations')
        .select('status')
        .eq('event_id', eventId)

      const { data, error } = await query

      if (error) throw error

      const total = data?.length || 0
      const successful = data?.filter(r => r.status === 'CHECKED_IN').length || 0
      const failed = total - successful

      setStats({
        totalCheckIns: total,
        successfulCheckIns: successful,
        failedCheckIns: failed
      })
    } catch (error) {
      console.error('Error loading check-in stats:', error)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsScanning(true)
        
        // Start scanning loop
        scanQRCode()
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsScanning(false)
  }

  const scanQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (video.readyState === video.HAVE_ENOUGH_DATA && context) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      
      // Here you would integrate with a QR code scanning library like jsQR
      // For now, we'll simulate QR detection
      // const code = jsQR(imageData.data, imageData.width, imageData.height)
      
      // if (code) {
      //   handleQRDetected(code.data)
      // }
    }

    // Continue scanning
    if (isScanning) {
      requestAnimationFrame(scanQRCode)
    }
  }

  const handleQRDetected = async (qrData: string) => {
    // Prevent duplicate scans within 2 seconds
    if (lastScan && Date.now() - lastScan.timestamp < 2000) {
      return
    }

    setLastScan({ text: qrData, timestamp: Date.now() })
    await processCheckIn(qrData)
  }

  const processCheckIn = async (qrCode: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    
    try {
      // Find registration by QR code
      const { data: registration, error: regError } = await supabase
        .from('event_registrations')
        .select(`
          *,
          users (
            id,
            email,
            first_name,
            last_name,
            display_name
          )
        `)
        .eq('qr_code', qrCode)
        .eq('event_id', eventId)
        .single()

      if (regError || !registration) {
        const result: CheckInResult = {
          success: false,
          message: 'Invalid QR code or registration not found'
        }
        addToHistory(result)
        onCheckIn?.(result)
        return
      }

      // Check if already checked in
      if (registration.status === 'CHECKED_IN') {
        const result: CheckInResult = {
          success: false,
          message: `${registration.users.display_name || registration.users.email} is already checked in`,
          user: registration.users,
          registration
        }
        addToHistory(result)
        onCheckIn?.(result)
        return
      }

      // Perform check-in
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({
          status: 'CHECKED_IN',
          check_in_time: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', registration.id)

      if (updateError) throw updateError

      // If checking into a specific session, also register for session
      if (sessionId) {
        const { error: sessionError } = await supabase
          .from('session_registrations')
          .upsert({
            session_id: sessionId,
            user_id: registration.user_id,
            status: 'ATTENDED',
            attended_at: new Date().toISOString()
          })

        if (!sessionError) {
          // Update session attendance count
          await updateSessionAttendance(sessionId, true)
        }
      }

      const result: CheckInResult = {
        success: true,
        message: `✅ ${registration.users.display_name || registration.users.email} checked in successfully`,
        user: registration.users,
        registration
      }

      addToHistory(result)
      onCheckIn?.(result)
      loadCheckInStats() // Refresh stats

      // Play success sound (optional)
      playSuccessSound()

    } catch (error) {
      console.error('Check-in error:', error)
      const result: CheckInResult = {
        success: false,
        message: 'Check-in failed. Please try again.'
      }
      addToHistory(result)
      onCheckIn?.(result)
    } finally {
      setIsProcessing(false)
    }
  }

  const addToHistory = (result: CheckInResult) => {
    setCheckInHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  const playSuccessSound = () => {
    // Create a simple success beep
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const handleManualCheckIn = async () => {
    if (!manualCode.trim()) return
    await processCheckIn(manualCode.trim())
    setManualCode('')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">QR Check-in System</h2>
        <div className="flex space-x-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.successfulCheckIns}</div>
            <div className="text-gray-500">Checked In</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{stats.failedCheckIns}</div>
            <div className="text-gray-500">Failed</div>
          </div>
        </div>
      </div>

      {/* Camera Section */}
      <div className="mb-6">
        <div className="relative">
          {!isScanning ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v1a1 1 0 000 2h1v2a1 1 0 002 0V8h2a1 1 0 100-2H7V5a2 2 0 00-2-2H4zm11 2a1 1 0 011 1v1a1 1 0 11-2 0V6a1 1 0 011-1zm-1 7a1 1 0 100 2h1a2 2 0 002-2v-1a1 1 0 10-2 0v1h-1zm-7 2a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                onClick={startCamera}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start QR Scanner
              </button>
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
                style={{ maxHeight: '400px' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-500"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-500"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-500"></div>
              </div>

              <button
                onClick={stopCamera}
                className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Stop Scanner
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Manual Entry */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Manual QR Code Entry
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter QR code manually"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === 'Enter' && handleManualCheckIn()}
          />
          <button
            onClick={handleManualCheckIn}
            disabled={!manualCode.trim() || isProcessing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? 'Processing...' : 'Check In'}
          </button>
        </div>
      </div>

      {/* Recent Check-ins */}
      {checkInHistory.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Check-ins</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {checkInHistory.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="text-sm font-medium">{result.message}</div>
                {result.user && (
                  <div className="text-xs mt-1">
                    {result.user.display_name || `${result.user.first_name} ${result.user.last_name}`} 
                    ({result.user.email})
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
