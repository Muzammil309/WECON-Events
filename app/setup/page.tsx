'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/supabase'

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCreateSuperAdmin = async () => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.createSuperAdmin()
      setSuccess('Super admin account created successfully! You can now login with: admin@weconmasawat.com / SuperAdmin123!')
    } catch (error: any) {
      console.error('Super admin creation error:', error)
      if (error.message?.includes('already exists')) {
        setError('Super admin account already exists. Please use the login page.')
      } else {
        setError(error.message || 'Failed to create super admin account.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#101435] flex items-center justify-center px-4 py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/wecon-logo.svg"
            alt="WECON Movement"
            width={150}
            height={60}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold text-white mb-2">WECON Setup</h1>
          <p className="text-gray-400">Initialize your WECON platform</p>
        </div>

        {/* Setup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10"
        >
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
                {success}
              </div>
            )}

            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Create Super Admin Account</h3>
              <p className="text-gray-400 text-sm mb-6">
                This will create the initial super administrator account for your WECON platform. 
                The super admin can create additional admin accounts and manage the entire system.
              </p>

              <button
                onClick={handleCreateSuperAdmin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Super Admin...' : 'Create Super Admin Account'}
              </button>
            </div>

            {/* Credentials Info */}
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Super Admin Credentials:</h4>
              <div className="text-xs text-gray-400 space-y-1">
                <p><strong>Email:</strong> admin@weconmasawat.com</p>
                <p><strong>Password:</strong> SuperAdmin123!</p>
                <p className="text-yellow-400 mt-2">⚠️ Please change the password after first login</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-4 mt-6">
              <Link 
                href="/login" 
                className="flex-1 text-center px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Go to Login
              </Link>
              <Link 
                href="/" 
                className="flex-1 text-center px-4 py-2 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>This setup page will be automatically disabled after super admin creation</p>
        </div>
      </div>
    </div>
  )
}
