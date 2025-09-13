// Enterprise Integration System for WECON
// Supports CRM, Marketing, Calendar, and other business tool integrations

interface IntegrationConfig {
  id: string;
  name: string;
  type: 'CRM' | 'MARKETING' | 'CALENDAR' | 'COMMUNICATION' | 'ANALYTICS' | 'PAYMENT';
  description: string;
  icon: string;
  enabled: boolean;
  requiresAuth: boolean;
  authType: 'oauth2' | 'api_key' | 'basic' | 'custom';
  webhookSupport: boolean;
  syncCapabilities: string[];
  fields: IntegrationField[];
}

interface IntegrationField {
  key: string;
  label: string;
  type: 'text' | 'password' | 'url' | 'select' | 'boolean';
  required: boolean;
  description?: string;
  options?: { value: string; label: string }[];
}

interface IntegrationInstance {
  id: string;
  integrationId: string;
  name: string;
  config: Record<string, any>;
  status: 'active' | 'inactive' | 'error' | 'pending';
  lastSync?: Date;
  errorMessage?: string;
  syncStats?: {
    totalSynced: number;
    lastSyncDuration: number;
    errors: number;
  };
}

interface SyncOperation {
  id: string;
  integrationId: string;
  type: 'import' | 'export' | 'bidirectional';
  entity: 'attendees' | 'events' | 'sessions' | 'orders' | 'contacts';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  recordsProcessed: number;
  recordsTotal: number;
  errors: string[];
}

// Available integrations configuration
export const AVAILABLE_INTEGRATIONS: Record<string, IntegrationConfig> = {
  salesforce: {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'CRM',
    description: 'Sync attendees and leads with Salesforce CRM',
    icon: '/integrations/salesforce.svg',
    enabled: true,
    requiresAuth: true,
    authType: 'oauth2',
    webhookSupport: true,
    syncCapabilities: ['attendees', 'leads', 'contacts', 'campaigns'],
    fields: [
      {
        key: 'instance_url',
        label: 'Salesforce Instance URL',
        type: 'url',
        required: true,
        description: 'Your Salesforce instance URL (e.g., https://yourcompany.salesforce.com)'
      },
      {
        key: 'client_id',
        label: 'Client ID',
        type: 'text',
        required: true,
        description: 'OAuth2 Client ID from your Salesforce Connected App'
      },
      {
        key: 'client_secret',
        label: 'Client Secret',
        type: 'password',
        required: true,
        description: 'OAuth2 Client Secret from your Salesforce Connected App'
      },
      {
        key: 'lead_source',
        label: 'Lead Source',
        type: 'text',
        required: false,
        description: 'Default lead source for event attendees'
      }
    ]
  },
  hubspot: {
    id: 'hubspot',
    name: 'HubSpot',
    type: 'CRM',
    description: 'Sync contacts and deals with HubSpot CRM',
    icon: '/integrations/hubspot.svg',
    enabled: true,
    requiresAuth: true,
    authType: 'oauth2',
    webhookSupport: true,
    syncCapabilities: ['contacts', 'companies', 'deals', 'events'],
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        description: 'Your HubSpot API key'
      },
      {
        key: 'portal_id',
        label: 'Portal ID',
        type: 'text',
        required: true,
        description: 'Your HubSpot Portal ID'
      }
    ]
  },
  mailchimp: {
    id: 'mailchimp',
    name: 'Mailchimp',
    type: 'MARKETING',
    description: 'Sync attendees with Mailchimp email lists',
    icon: '/integrations/mailchimp.svg',
    enabled: true,
    requiresAuth: true,
    authType: 'api_key',
    webhookSupport: true,
    syncCapabilities: ['email_lists', 'campaigns', 'subscribers'],
    fields: [
      {
        key: 'api_key',
        label: 'API Key',
        type: 'password',
        required: true,
        description: 'Your Mailchimp API key'
      },
      {
        key: 'default_list_id',
        label: 'Default List ID',
        type: 'text',
        required: false,
        description: 'Default list to add event attendees'
      }
    ]
  },
  google_calendar: {
    id: 'google_calendar',
    name: 'Google Calendar',
    type: 'CALENDAR',
    description: 'Sync events and sessions with Google Calendar',
    icon: '/integrations/google-calendar.svg',
    enabled: true,
    requiresAuth: true,
    authType: 'oauth2',
    webhookSupport: true,
    syncCapabilities: ['events', 'sessions', 'reminders'],
    fields: [
      {
        key: 'calendar_id',
        label: 'Calendar ID',
        type: 'text',
        required: false,
        description: 'Specific calendar ID (leave empty for primary calendar)'
      },
      {
        key: 'sync_sessions',
        label: 'Sync Sessions',
        type: 'boolean',
        required: false,
        description: 'Automatically sync event sessions to calendar'
      }
    ]
  },
  slack: {
    id: 'slack',
    name: 'Slack',
    type: 'COMMUNICATION',
    description: 'Send notifications and updates to Slack channels',
    icon: '/integrations/slack.svg',
    enabled: true,
    requiresAuth: true,
    authType: 'oauth2',
    webhookSupport: true,
    syncCapabilities: ['notifications', 'alerts', 'reports'],
    fields: [
      {
        key: 'webhook_url',
        label: 'Webhook URL',
        type: 'url',
        required: true,
        description: 'Slack webhook URL for sending messages'
      },
      {
        key: 'default_channel',
        label: 'Default Channel',
        type: 'text',
        required: false,
        description: 'Default channel for notifications (e.g., #events)'
      }
    ]
  },
  zapier: {
    id: 'zapier',
    name: 'Zapier',
    type: 'ANALYTICS',
    description: 'Connect with 5000+ apps through Zapier automation',
    icon: '/integrations/zapier.svg',
    enabled: true,
    requiresAuth: true,
    authType: 'api_key',
    webhookSupport: true,
    syncCapabilities: ['webhooks', 'triggers', 'actions'],
    fields: [
      {
        key: 'webhook_url',
        label: 'Zapier Webhook URL',
        type: 'url',
        required: true,
        description: 'Your Zapier webhook URL for triggering automations'
      }
    ]
  }
};

// Integration Manager Class
export class IntegrationManager {
  private instances: Map<string, IntegrationInstance> = new Map();
  private syncOperations: Map<string, SyncOperation> = new Map();

  // Get all available integrations
  getAvailableIntegrations(): IntegrationConfig[] {
    return Object.values(AVAILABLE_INTEGRATIONS);
  }

  // Get integrations by type
  getIntegrationsByType(type: IntegrationConfig['type']): IntegrationConfig[] {
    return Object.values(AVAILABLE_INTEGRATIONS).filter(integration => integration.type === type);
  }

  // Create integration instance
  async createInstance(integrationId: string, name: string, config: Record<string, any>): Promise<IntegrationInstance> {
    const integration = AVAILABLE_INTEGRATIONS[integrationId];
    if (!integration) {
      throw new Error(`Integration ${integrationId} not found`);
    }

    // Validate required fields
    const missingFields = integration.fields
      .filter(field => field.required && !config[field.key])
      .map(field => field.label);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const instance: IntegrationInstance = {
      id: `${integrationId}_${Date.now()}`,
      integrationId,
      name,
      config,
      status: 'pending'
    };

    // Test connection
    try {
      await this.testConnection(instance);
      instance.status = 'active';
    } catch (error) {
      instance.status = 'error';
      instance.errorMessage = error instanceof Error ? error.message : 'Connection failed';
    }

    this.instances.set(instance.id, instance);
    return instance;
  }

  // Test integration connection
  async testConnection(instance: IntegrationInstance): Promise<boolean> {
    const integration = AVAILABLE_INTEGRATIONS[instance.integrationId];
    
    switch (integration.id) {
      case 'salesforce':
        return this.testSalesforceConnection(instance);
      case 'hubspot':
        return this.testHubSpotConnection(instance);
      case 'mailchimp':
        return this.testMailchimpConnection(instance);
      case 'google_calendar':
        return this.testGoogleCalendarConnection(instance);
      case 'slack':
        return this.testSlackConnection(instance);
      case 'zapier':
        return this.testZapierConnection(instance);
      default:
        throw new Error(`Connection test not implemented for ${integration.id}`);
    }
  }

  // Sync data with integration
  async syncData(instanceId: string, entity: SyncOperation['entity'], type: SyncOperation['type'] = 'export'): Promise<SyncOperation> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error('Integration instance not found');
    }

    const operation: SyncOperation = {
      id: `sync_${Date.now()}`,
      integrationId: instance.integrationId,
      type,
      entity,
      status: 'pending',
      progress: 0,
      startedAt: new Date(),
      recordsProcessed: 0,
      recordsTotal: 0,
      errors: []
    };

    this.syncOperations.set(operation.id, operation);

    // Start sync operation
    this.performSync(operation, instance);

    return operation;
  }

  // Get sync operation status
  getSyncOperation(operationId: string): SyncOperation | undefined {
    return this.syncOperations.get(operationId);
  }

  // Get all instances
  getInstances(): IntegrationInstance[] {
    return Array.from(this.instances.values());
  }

  // Get instance by ID
  getInstance(instanceId: string): IntegrationInstance | undefined {
    return this.instances.get(instanceId);
  }

  // Update instance
  async updateInstance(instanceId: string, updates: Partial<IntegrationInstance>): Promise<IntegrationInstance> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      throw new Error('Integration instance not found');
    }

    const updatedInstance = { ...instance, ...updates };
    this.instances.set(instanceId, updatedInstance);
    return updatedInstance;
  }

  // Delete instance
  deleteInstance(instanceId: string): boolean {
    return this.instances.delete(instanceId);
  }

  // Private methods for testing connections
  private async testSalesforceConnection(instance: IntegrationInstance): Promise<boolean> {
    // Mock Salesforce connection test
    const { instance_url, client_id, client_secret } = instance.config;
    
    if (!instance_url || !client_id || !client_secret) {
      throw new Error('Missing Salesforce credentials');
    }

    // In production, this would make actual API calls
    console.log('Testing Salesforce connection...');
    return true;
  }

  private async testHubSpotConnection(instance: IntegrationInstance): Promise<boolean> {
    // Mock HubSpot connection test
    const { api_key, portal_id } = instance.config;
    
    if (!api_key || !portal_id) {
      throw new Error('Missing HubSpot credentials');
    }

    console.log('Testing HubSpot connection...');
    return true;
  }

  private async testMailchimpConnection(instance: IntegrationInstance): Promise<boolean> {
    // Mock Mailchimp connection test
    const { api_key } = instance.config;
    
    if (!api_key) {
      throw new Error('Missing Mailchimp API key');
    }

    console.log('Testing Mailchimp connection...');
    return true;
  }

  private async testGoogleCalendarConnection(instance: IntegrationInstance): Promise<boolean> {
    // Mock Google Calendar connection test
    console.log('Testing Google Calendar connection...');
    return true;
  }

  private async testSlackConnection(instance: IntegrationInstance): Promise<boolean> {
    // Mock Slack connection test
    const { webhook_url } = instance.config;
    
    if (!webhook_url) {
      throw new Error('Missing Slack webhook URL');
    }

    console.log('Testing Slack connection...');
    return true;
  }

  private async testZapierConnection(instance: IntegrationInstance): Promise<boolean> {
    // Mock Zapier connection test
    const { webhook_url } = instance.config;
    
    if (!webhook_url) {
      throw new Error('Missing Zapier webhook URL');
    }

    console.log('Testing Zapier connection...');
    return true;
  }

  // Private method to perform sync
  private async performSync(operation: SyncOperation, instance: IntegrationInstance): Promise<void> {
    try {
      operation.status = 'running';
      
      // Mock sync operation
      const totalRecords = 100; // This would be actual data count
      operation.recordsTotal = totalRecords;

      for (let i = 0; i < totalRecords; i++) {
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 10));
        
        operation.recordsProcessed = i + 1;
        operation.progress = Math.round((operation.recordsProcessed / operation.recordsTotal) * 100);
        
        // Update operation in map
        this.syncOperations.set(operation.id, { ...operation });
      }

      operation.status = 'completed';
      operation.completedAt = new Date();
      
      // Update instance stats
      instance.lastSync = new Date();
      instance.syncStats = {
        totalSynced: operation.recordsProcessed,
        lastSyncDuration: operation.completedAt.getTime() - operation.startedAt.getTime(),
        errors: operation.errors.length
      };

    } catch (error) {
      operation.status = 'failed';
      operation.errors.push(error instanceof Error ? error.message : 'Unknown error');
      
      instance.status = 'error';
      instance.errorMessage = operation.errors[operation.errors.length - 1];
    }

    this.syncOperations.set(operation.id, operation);
    this.instances.set(instance.id, instance);
  }
}

// Global integration manager instance
export const integrationManager = new IntegrationManager();

// Webhook handler for incoming integration data
export async function handleIntegrationWebhook(integrationId: string, payload: any): Promise<void> {
  console.log(`Received webhook from ${integrationId}:`, payload);
  
  // Process webhook based on integration type
  switch (integrationId) {
    case 'salesforce':
      await handleSalesforceWebhook(payload);
      break;
    case 'hubspot':
      await handleHubSpotWebhook(payload);
      break;
    case 'mailchimp':
      await handleMailchimpWebhook(payload);
      break;
    default:
      console.warn(`Webhook handler not implemented for ${integrationId}`);
  }
}

// Specific webhook handlers
async function handleSalesforceWebhook(payload: any): Promise<void> {
  // Handle Salesforce webhook data
  console.log('Processing Salesforce webhook:', payload);
}

async function handleHubSpotWebhook(payload: any): Promise<void> {
  // Handle HubSpot webhook data
  console.log('Processing HubSpot webhook:', payload);
}

async function handleMailchimpWebhook(payload: any): Promise<void> {
  // Handle Mailchimp webhook data
  console.log('Processing Mailchimp webhook:', payload);
}

// Export utility functions
export const IntegrationUtils = {
  // Format data for specific integrations
  formatForSalesforce: (attendee: any) => ({
    FirstName: attendee.name?.split(' ')[0] || '',
    LastName: attendee.name?.split(' ').slice(1).join(' ') || '',
    Email: attendee.email,
    Company: attendee.company || '',
    Title: attendee.jobTitle || '',
    LeadSource: 'WECON Event',
    Status: 'Open - Not Contacted'
  }),

  formatForHubSpot: (attendee: any) => ({
    email: attendee.email,
    firstname: attendee.name?.split(' ')[0] || '',
    lastname: attendee.name?.split(' ').slice(1).join(' ') || '',
    company: attendee.company || '',
    jobtitle: attendee.jobTitle || '',
    hs_lead_status: 'NEW'
  }),

  formatForMailchimp: (attendee: any) => ({
    email_address: attendee.email,
    status: 'subscribed',
    merge_fields: {
      FNAME: attendee.name?.split(' ')[0] || '',
      LNAME: attendee.name?.split(' ').slice(1).join(' ') || '',
      COMPANY: attendee.company || '',
      JOBTITLE: attendee.jobTitle || ''
    }
  })
};
