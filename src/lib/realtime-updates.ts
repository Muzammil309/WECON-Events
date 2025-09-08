// Real-time update system for WECON
// This provides a centralized way to broadcast updates across the system

interface UpdateEvent {
  type: string;
  module: string;
  data: any;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

interface Subscriber {
  id: string;
  callback: (event: UpdateEvent) => void;
  filters?: {
    types?: string[];
    modules?: string[];
    userId?: string;
  };
}

class RealTimeUpdateManager {
  private subscribers: Map<string, Subscriber> = new Map();
  private eventHistory: UpdateEvent[] = [];
  private maxHistorySize = 1000;

  // Subscribe to real-time updates
  subscribe(
    id: string, 
    callback: (event: UpdateEvent) => void, 
    filters?: Subscriber['filters']
  ): () => void {
    const subscriber: Subscriber = {
      id,
      callback,
      filters
    };

    this.subscribers.set(id, subscriber);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(id);
    };
  }

  // Broadcast an update to all relevant subscribers
  broadcast(event: Omit<UpdateEvent, 'timestamp'>): void {
    const fullEvent: UpdateEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    // Add to history
    this.eventHistory.push(fullEvent);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify subscribers
    this.subscribers.forEach(subscriber => {
      if (this.shouldNotifySubscriber(subscriber, fullEvent)) {
        try {
          subscriber.callback(fullEvent);
        } catch (error) {
          console.error(`Error notifying subscriber ${subscriber.id}:`, error);
        }
      }
    });

    // Log for debugging
    console.log('Broadcast update:', fullEvent);
  }

  // Check if a subscriber should receive this event
  private shouldNotifySubscriber(subscriber: Subscriber, event: UpdateEvent): boolean {
    const { filters } = subscriber;
    
    if (!filters) return true;

    // Filter by event types
    if (filters.types && !filters.types.includes(event.type)) {
      return false;
    }

    // Filter by modules
    if (filters.modules && !filters.modules.includes(event.module)) {
      return false;
    }

    // Filter by user ID
    if (filters.userId && event.userId !== filters.userId) {
      return false;
    }

    return true;
  }

  // Get recent events (for catching up new subscribers)
  getRecentEvents(filters?: {
    types?: string[];
    modules?: string[];
    since?: string;
    limit?: number;
  }): UpdateEvent[] {
    let events = this.eventHistory;

    if (filters) {
      events = events.filter(event => {
        if (filters.types && !filters.types.includes(event.type)) return false;
        if (filters.modules && !filters.modules.includes(event.module)) return false;
        if (filters.since && event.timestamp <= filters.since) return false;
        return true;
      });

      if (filters.limit) {
        events = events.slice(-filters.limit);
      }
    }

    return events;
  }

  // Get subscriber count
  getSubscriberCount(): number {
    return this.subscribers.size;
  }

  // Get active modules
  getActiveModules(): string[] {
    const modules = new Set<string>();
    this.eventHistory.forEach(event => modules.add(event.module));
    return Array.from(modules);
  }
}

// Global instance
export const realTimeUpdates = new RealTimeUpdateManager();

// Predefined event types
export const UPDATE_TYPES = {
  // User events
  USER_REGISTERED: 'USER_REGISTERED',
  USER_UPDATED: 'USER_UPDATED',
  USER_CHECKED_IN: 'USER_CHECKED_IN',

  // Order events
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  ORDER_CANCELLED: 'ORDER_CANCELLED',

  // Ticket events
  TICKET_PURCHASED: 'TICKET_PURCHASED',
  TICKET_SCANNED: 'TICKET_SCANNED',

  // Check-in events
  CHECK_IN_CREATED: 'CHECK_IN_CREATED',
  CHECK_IN_UPDATED: 'CHECK_IN_UPDATED',

  // Communication events
  MESSAGE_SENT: 'MESSAGE_SENT',
  NOTIFICATION_DELIVERED: 'NOTIFICATION_DELIVERED',

  // Digital signage events
  CONTENT_UPLOADED: 'CONTENT_UPLOADED',
  DISPLAY_UPDATED: 'DISPLAY_UPDATED',

  // Networking events
  CONNECTION_REQUEST_SENT: 'CONNECTION_REQUEST_SENT',
  CONNECTION_ACCEPTED: 'CONNECTION_ACCEPTED',
  MEETING_SCHEDULED: 'MEETING_SCHEDULED',
  BUSINESS_CARD_EXCHANGED: 'BUSINESS_CARD_EXCHANGED',

  // Session events
  SESSION_REGISTRATION: 'SESSION_REGISTRATION',
  SESSION_CANCELLED: 'SESSION_CANCELLED',
  WAITLIST_JOINED: 'WAITLIST_JOINED',
  WAITLIST_PROMOTED: 'WAITLIST_PROMOTED',

  // Analytics events
  ANALYTICS_UPDATED: 'ANALYTICS_UPDATED',
  REPORT_GENERATED: 'REPORT_GENERATED',

  // Integration events
  INTEGRATION_SYNC_STARTED: 'INTEGRATION_SYNC_STARTED',
  INTEGRATION_SYNC_COMPLETED: 'INTEGRATION_SYNC_COMPLETED',
  INTEGRATION_ERROR: 'INTEGRATION_ERROR',

  // Security events
  SECURITY_INCIDENT: 'SECURITY_INCIDENT',
  COMPLIANCE_ALERT: 'COMPLIANCE_ALERT',
  AUDIT_LOG_CREATED: 'AUDIT_LOG_CREATED',

  // White-label events
  BRANDING_UPDATED: 'BRANDING_UPDATED',
  THEME_CHANGED: 'THEME_CHANGED',

  // System events
  SYNC_COMPLETED: 'SYNC_COMPLETED',
  ERROR_OCCURRED: 'ERROR_OCCURRED',
  SYSTEM_MAINTENANCE: 'SYSTEM_MAINTENANCE'
} as const;

// Module names
export const MODULES = {
  USERS: 'users',
  ORDERS: 'orders',
  TICKETS: 'tickets',
  CHECKIN: 'checkin',
  COMMUNICATIONS: 'communications',
  DIGITAL_SIGNAGE: 'digital_signage',
  NETWORKING: 'networking',
  SESSIONS: 'sessions',
  ANALYTICS: 'analytics',
  INTEGRATIONS: 'integrations',
  SECURITY: 'security',
  WHITE_LABEL: 'white_label',
  SYSTEM: 'system'
} as const;

// Helper functions for common broadcasts
export const broadcastUserUpdate = (userId: string, userData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.USER_UPDATED,
    module: MODULES.USERS,
    data: userData,
    userId
  });
};

export const broadcastCheckIn = (checkInData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.CHECK_IN_CREATED,
    module: MODULES.CHECKIN,
    data: checkInData,
    userId: checkInData.userId
  });
};

export const broadcastOrderComplete = (orderData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.ORDER_COMPLETED,
    module: MODULES.ORDERS,
    data: orderData,
    userId: orderData.userId
  });
};

export const broadcastMessageSent = (messageData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.MESSAGE_SENT,
    module: MODULES.COMMUNICATIONS,
    data: messageData
  });
};

export const broadcastContentUpload = (contentData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.CONTENT_UPLOADED,
    module: MODULES.DIGITAL_SIGNAGE,
    data: contentData
  });
};

// Networking broadcast functions
export const broadcastConnectionRequest = (connectionData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.CONNECTION_REQUEST_SENT,
    module: MODULES.NETWORKING,
    data: connectionData,
    userId: connectionData.recipientId
  });
};

export const broadcastConnectionAccepted = (connectionData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.CONNECTION_ACCEPTED,
    module: MODULES.NETWORKING,
    data: connectionData,
    userId: connectionData.requesterId
  });
};

export const broadcastMeetingScheduled = (meetingData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.MEETING_SCHEDULED,
    module: MODULES.NETWORKING,
    data: meetingData,
    userId: meetingData.attendeeId
  });
};

export const broadcastBusinessCardExchange = (exchangeData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.BUSINESS_CARD_EXCHANGED,
    module: MODULES.NETWORKING,
    data: exchangeData,
    userId: exchangeData.recipientId
  });
};

// Session broadcast functions
export const broadcastSessionRegistration = (sessionData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.SESSION_REGISTRATION,
    module: MODULES.SESSIONS,
    data: sessionData
  });
};

export const broadcastWaitlistJoined = (waitlistData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.WAITLIST_JOINED,
    module: MODULES.SESSIONS,
    data: waitlistData
  });
};

export const broadcastWaitlistPromoted = (promotionData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.WAITLIST_PROMOTED,
    module: MODULES.SESSIONS,
    data: promotionData,
    userId: promotionData.userId
  });
};

// Analytics broadcast functions
export const broadcastAnalyticsUpdate = (analyticsData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.ANALYTICS_UPDATED,
    module: MODULES.ANALYTICS,
    data: analyticsData
  });
};

export const broadcastReportGenerated = (reportData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.REPORT_GENERATED,
    module: MODULES.ANALYTICS,
    data: reportData
  });
};

// Integration broadcast functions
export const broadcastIntegrationSync = (syncData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.INTEGRATION_SYNC_STARTED,
    module: MODULES.INTEGRATIONS,
    data: syncData
  });
};

export const broadcastIntegrationComplete = (syncData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.INTEGRATION_SYNC_COMPLETED,
    module: MODULES.INTEGRATIONS,
    data: syncData
  });
};

export const broadcastIntegrationError = (errorData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.INTEGRATION_ERROR,
    module: MODULES.INTEGRATIONS,
    data: errorData
  });
};

// Security broadcast functions
export const broadcastSecurityIncident = (incidentData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.SECURITY_INCIDENT,
    module: MODULES.SECURITY,
    data: incidentData
  });
};

export const broadcastComplianceAlert = (alertData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.COMPLIANCE_ALERT,
    module: MODULES.SECURITY,
    data: alertData
  });
};

export const broadcastAuditLog = (auditData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.AUDIT_LOG_CREATED,
    module: MODULES.SECURITY,
    data: auditData
  });
};

// White-label broadcast functions
export const broadcastBrandingUpdate = (brandingData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.BRANDING_UPDATED,
    module: MODULES.WHITE_LABEL,
    data: brandingData
  });
};

export const broadcastThemeChange = (themeData: any) => {
  realTimeUpdates.broadcast({
    type: UPDATE_TYPES.THEME_CHANGED,
    module: MODULES.WHITE_LABEL,
    data: themeData
  });
};

// React hook for using real-time updates in components
export const useRealTimeUpdates = (
  filters?: {
    types?: string[];
    modules?: string[];
    userId?: string;
  },
  onUpdate?: (event: UpdateEvent) => void
) => {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return {
      subscribe: () => () => {},
      getRecentEvents: () => [],
      isConnected: false
    };
  }

  const subscribe = (callback: (event: UpdateEvent) => void) => {
    const subscriberId = `subscriber_${Date.now()}_${Math.random()}`;
    return realTimeUpdates.subscribe(subscriberId, callback, filters);
  };

  const getRecentEvents = (eventFilters?: any) => {
    return realTimeUpdates.getRecentEvents(eventFilters);
  };

  return {
    subscribe,
    getRecentEvents,
    isConnected: true
  };
};

// Server-Sent Events endpoint helper
export const createSSEResponse = (request: Request) => {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({
        type: 'connection',
        message: 'Connected to real-time updates',
        timestamp: new Date().toISOString()
      })}\n\n`;
      
      controller.enqueue(encoder.encode(data));

      // Subscribe to updates
      const unsubscribe = realTimeUpdates.subscribe(
        `sse_${Date.now()}`,
        (event) => {
          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
      );

      // Handle client disconnect
      request.signal?.addEventListener('abort', () => {
        unsubscribe();
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
};
