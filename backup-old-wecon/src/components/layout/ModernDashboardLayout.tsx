'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernNavigation from './ModernNavigation';

interface ModernDashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout?: () => void;
  pageTitle?: string;
  pageDescription?: string;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  actions?: React.ReactNode;
}

export default function ModernDashboardLayout({
  children,
  user,
  onLogout,
  pageTitle,
  pageDescription,
  breadcrumbs,
  actions
}: ModernDashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-primary-bg">
      {/* Navigation */}
      <ModernNavigation user={user} onLogout={onLogout} />

      {/* Main Content */}
      <main className="pt-20">
        {/* Page Header */}
        {(pageTitle || breadcrumbs || actions) && (
          <div className="bg-surface-primary border-b border-border-primary">
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  {/* Breadcrumbs */}
                  {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="flex items-center space-x-2 text-sm text-text-muted mb-4">
                      {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                          {index > 0 && <span>/</span>}
                          {crumb.href ? (
                            <a
                              href={crumb.href}
                              className="hover:text-text-secondary transition-colors duration-200"
                            >
                              {crumb.label}
                            </a>
                          ) : (
                            <span className="text-text-secondary">{crumb.label}</span>
                          )}
                        </React.Fragment>
                      ))}
                    </nav>
                  )}

                  {/* Page Title */}
                  {pageTitle && (
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl md:text-4xl font-bold text-text-primary mb-2"
                    >
                      {pageTitle}
                    </motion.h1>
                  )}

                  {/* Page Description */}
                  {pageDescription && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-lg text-text-secondary max-w-2xl"
                    >
                      {pageDescription}
                    </motion.p>
                  )}
                </div>

                {/* Actions */}
                {actions && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    {actions}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="container mx-auto px-4 py-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

// Modern Card Components for Dashboard
export function DashboardCard({
  title,
  description,
  children,
  className = '',
  actions,
  loading = false
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`card ${className}`}
    >
      {(title || description || actions) && (
        <div className="flex items-start justify-between mb-6">
          <div>
            {title && (
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-text-secondary">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </motion.div>
  );
}

export function StatsGrid({
  stats
}: {
  stats: Array<{
    label: string;
    value: string | number;
    change?: {
      value: number;
      type: 'increase' | 'decrease';
    };
    icon?: React.ReactNode;
    color?: string;
  }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
              {stat.change && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${
                  stat.change.type === 'increase' ? 'text-success' : 'text-error'
                }`}>
                  <span>
                    {stat.change.type === 'increase' ? '↗' : '↘'}
                  </span>
                  <span>{Math.abs(stat.change.value)}%</span>
                </div>
              )}
            </div>
            {stat.icon && (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color || 'bg-surface-secondary'
              }`}>
                {stat.icon}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function QuickActions({
  actions
}: {
  actions: Array<{
    label: string;
    description?: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: string;
  }>;
}) {
  return (
    <DashboardCard title="Quick Actions" className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="p-4 bg-surface-secondary border border-border-primary rounded-xl hover:bg-surface-tertiary transition-all duration-200 text-left group"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
              action.color || 'bg-gradient-primary'
            }`}>
              <div className="text-white">
                {action.icon}
              </div>
            </div>
            <h4 className="font-medium text-text-primary group-hover:text-accent-blue transition-colors duration-200">
              {action.label}
            </h4>
            {action.description && (
              <p className="text-sm text-text-muted mt-1">
                {action.description}
              </p>
            )}
          </motion.button>
        ))}
      </div>
    </DashboardCard>
  );
}

export function RecentActivity({
  activities
}: {
  activities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: Date;
    user?: {
      name: string;
      avatar?: string;
    };
    status?: 'success' | 'warning' | 'error' | 'info';
  }>;
}) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'error': return 'bg-error';
      case 'info': return 'bg-info';
      default: return 'bg-accent-blue';
    }
  };

  return (
    <DashboardCard title="Recent Activity">
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 bg-surface-secondary rounded-lg hover:bg-surface-tertiary transition-colors duration-200"
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(activity.status)}`} />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-text-primary truncate">
                {activity.title}
              </h4>
              <p className="text-sm text-text-secondary mt-1">
                {activity.description}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                <span>{activity.timestamp.toLocaleTimeString()}</span>
                {activity.user && (
                  <>
                    <span>•</span>
                    <span>{activity.user.name}</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardCard>
  );
}
