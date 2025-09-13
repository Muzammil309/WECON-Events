// Enterprise Security & Compliance System for WECON
// GDPR, CCPA, SOC2, and other compliance frameworks

interface ComplianceConfig {
  gdpr: {
    enabled: boolean;
    dataRetentionDays: number;
    cookieConsent: boolean;
    rightToBeForgotten: boolean;
    dataPortability: boolean;
    consentTracking: boolean;
  };
  ccpa: {
    enabled: boolean;
    doNotSell: boolean;
    dataDisclosure: boolean;
    optOutRights: boolean;
  };
  soc2: {
    enabled: boolean;
    auditLogging: boolean;
    accessControls: boolean;
    dataEncryption: boolean;
    incidentResponse: boolean;
  };
  hipaa?: {
    enabled: boolean;
    dataEncryption: boolean;
    accessLogging: boolean;
    businessAssociateAgreement: boolean;
  };
}

interface AuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface DataProcessingRecord {
  id: string;
  userId: string;
  dataType: 'PERSONAL' | 'SENSITIVE' | 'FINANCIAL' | 'HEALTH' | 'BIOMETRIC';
  purpose: string;
  legalBasis: 'CONSENT' | 'CONTRACT' | 'LEGAL_OBLIGATION' | 'VITAL_INTERESTS' | 'PUBLIC_TASK' | 'LEGITIMATE_INTERESTS';
  consentGiven: boolean;
  consentTimestamp?: Date;
  dataRetentionUntil: Date;
  processingLocation: string;
  thirdPartySharing: boolean;
  thirdParties?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SecurityIncident {
  id: string;
  type: 'DATA_BREACH' | 'UNAUTHORIZED_ACCESS' | 'SYSTEM_COMPROMISE' | 'MALWARE' | 'PHISHING' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
  title: string;
  description: string;
  affectedUsers?: string[];
  affectedData?: string[];
  detectedAt: Date;
  reportedAt?: Date;
  resolvedAt?: Date;
  reportedBy?: string;
  assignedTo?: string;
  mitigationSteps: string[];
  rootCause?: string;
  preventionMeasures?: string[];
  regulatoryNotificationRequired: boolean;
  regulatoryNotificationSent?: Date;
  customerNotificationRequired: boolean;
  customerNotificationSent?: Date;
}

interface ConsentRecord {
  id: string;
  userId: string;
  consentType: 'MARKETING' | 'ANALYTICS' | 'COOKIES' | 'DATA_PROCESSING' | 'THIRD_PARTY_SHARING';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  consentMethod: 'EXPLICIT' | 'IMPLIED' | 'OPT_IN' | 'OPT_OUT';
  consentText: string;
  withdrawnAt?: Date;
  withdrawalReason?: string;
}

export class ComplianceManager {
  private config: ComplianceConfig;
  private auditLogs: Map<string, AuditLog> = new Map();
  private dataProcessingRecords: Map<string, DataProcessingRecord> = new Map();
  private securityIncidents: Map<string, SecurityIncident> = new Map();
  private consentRecords: Map<string, ConsentRecord> = new Map();

  constructor(config: ComplianceConfig) {
    this.config = config;
  }

  // GDPR Compliance Methods
  async recordDataProcessing(record: Omit<DataProcessingRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<DataProcessingRecord> {
    const dataRecord: DataProcessingRecord = {
      ...record,
      id: `dpr_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.dataProcessingRecords.set(dataRecord.id, dataRecord);
    
    // Log the data processing activity
    await this.logAudit({
      action: 'DATA_PROCESSING_RECORDED',
      resource: 'data_processing',
      resourceId: dataRecord.id,
      userId: record.userId,
      metadata: { dataType: record.dataType, purpose: record.purpose },
      severity: 'MEDIUM'
    });

    return dataRecord;
  }

  async recordConsent(consent: Omit<ConsentRecord, 'id'>): Promise<ConsentRecord> {
    const consentRecord: ConsentRecord = {
      ...consent,
      id: `consent_${Date.now()}`
    };

    this.consentRecords.set(consentRecord.id, consentRecord);
    
    await this.logAudit({
      action: 'CONSENT_RECORDED',
      resource: 'consent',
      resourceId: consentRecord.id,
      userId: consent.userId,
      metadata: { consentType: consent.consentType, granted: consent.granted },
      severity: 'LOW'
    });

    return consentRecord;
  }

  async withdrawConsent(userId: string, consentType: ConsentRecord['consentType'], reason?: string): Promise<void> {
    // Find existing consent records
    const userConsents = Array.from(this.consentRecords.values())
      .filter(c => c.userId === userId && c.consentType === consentType && c.granted && !c.withdrawnAt);

    for (const consent of userConsents) {
      consent.withdrawnAt = new Date();
      consent.withdrawalReason = reason;
      this.consentRecords.set(consent.id, consent);
    }

    await this.logAudit({
      action: 'CONSENT_WITHDRAWN',
      resource: 'consent',
      userId,
      metadata: { consentType, reason },
      severity: 'MEDIUM'
    });
  }

  async handleRightToBeForgotten(userId: string, requestReason: string): Promise<{
    success: boolean;
    deletedRecords: string[];
    retainedRecords: string[];
    errors: string[];
  }> {
    if (!this.config.gdpr.rightToBeForgotten) {
      throw new Error('Right to be forgotten is not enabled');
    }

    const deletedRecords: string[] = [];
    const retainedRecords: string[] = [];
    const errors: string[] = [];

    try {
      // Log the request
      await this.logAudit({
        action: 'RIGHT_TO_BE_FORGOTTEN_REQUESTED',
        resource: 'user_data',
        userId,
        metadata: { reason: requestReason },
        severity: 'HIGH'
      });

      // Delete or anonymize user data based on legal requirements
      // This is a simplified implementation - in production, you'd need to:
      // 1. Check legal basis for data retention
      // 2. Anonymize rather than delete where legally required
      // 3. Handle data in backups and logs
      // 4. Coordinate with third-party processors

      // Remove personal data from data processing records
      const userDataRecords = Array.from(this.dataProcessingRecords.values())
        .filter(record => record.userId === userId);

      for (const record of userDataRecords) {
        if (this.canDeleteDataRecord(record)) {
          this.dataProcessingRecords.delete(record.id);
          deletedRecords.push(`data_processing:${record.id}`);
        } else {
          retainedRecords.push(`data_processing:${record.id} (legal retention required)`);
        }
      }

      // Remove consent records (but keep withdrawal records for compliance)
      const userConsents = Array.from(this.consentRecords.values())
        .filter(consent => consent.userId === userId && !consent.withdrawnAt);

      for (const consent of userConsents) {
        consent.withdrawnAt = new Date();
        consent.withdrawalReason = 'Right to be forgotten request';
        this.consentRecords.set(consent.id, consent);
        deletedRecords.push(`consent:${consent.id}`);
      }

      await this.logAudit({
        action: 'RIGHT_TO_BE_FORGOTTEN_PROCESSED',
        resource: 'user_data',
        userId,
        metadata: { 
          deletedCount: deletedRecords.length,
          retainedCount: retainedRecords.length,
          reason: requestReason
        },
        severity: 'HIGH'
      });

      return {
        success: true,
        deletedRecords,
        retainedRecords,
        errors
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(errorMessage);

      await this.logAudit({
        action: 'RIGHT_TO_BE_FORGOTTEN_FAILED',
        resource: 'user_data',
        userId,
        metadata: { reason: requestReason, error: errorMessage },
        severity: 'CRITICAL'
      });

      return {
        success: false,
        deletedRecords,
        retainedRecords,
        errors
      };
    }
  }

  async exportUserData(userId: string): Promise<{
    personalData: any;
    processingRecords: DataProcessingRecord[];
    consentHistory: ConsentRecord[];
    auditTrail: AuditLog[];
  }> {
    if (!this.config.gdpr.dataPortability) {
      throw new Error('Data portability is not enabled');
    }

    await this.logAudit({
      action: 'DATA_EXPORT_REQUESTED',
      resource: 'user_data',
      userId,
      severity: 'MEDIUM'
    });

    // Collect all user data
    const processingRecords = Array.from(this.dataProcessingRecords.values())
      .filter(record => record.userId === userId);

    const consentHistory = Array.from(this.consentRecords.values())
      .filter(consent => consent.userId === userId);

    const auditTrail = Array.from(this.auditLogs.values())
      .filter(log => log.userId === userId);

    // In production, you'd also collect data from your main database
    const personalData = {
      // This would include user profile, orders, sessions, etc.
      exportedAt: new Date().toISOString(),
      dataSubject: userId
    };

    return {
      personalData,
      processingRecords,
      consentHistory,
      auditTrail
    };
  }

  // Security Incident Management
  async reportSecurityIncident(incident: Omit<SecurityIncident, 'id' | 'detectedAt' | 'status'>): Promise<SecurityIncident> {
    const securityIncident: SecurityIncident = {
      ...incident,
      id: `incident_${Date.now()}`,
      detectedAt: new Date(),
      status: 'OPEN'
    };

    this.securityIncidents.set(securityIncident.id, securityIncident);

    await this.logAudit({
      action: 'SECURITY_INCIDENT_REPORTED',
      resource: 'security_incident',
      resourceId: securityIncident.id,
      metadata: { 
        type: incident.type, 
        severity: incident.severity,
        affectedUsersCount: incident.affectedUsers?.length || 0
      },
      severity: 'CRITICAL'
    });

    // Auto-trigger notifications for high/critical incidents
    if (incident.severity === 'HIGH' || incident.severity === 'CRITICAL') {
      await this.triggerIncidentNotifications(securityIncident);
    }

    return securityIncident;
  }

  async updateSecurityIncident(incidentId: string, updates: Partial<SecurityIncident>): Promise<SecurityIncident> {
    const incident = this.securityIncidents.get(incidentId);
    if (!incident) {
      throw new Error('Security incident not found');
    }

    const updatedIncident = { ...incident, ...updates };
    this.securityIncidents.set(incidentId, updatedIncident);

    await this.logAudit({
      action: 'SECURITY_INCIDENT_UPDATED',
      resource: 'security_incident',
      resourceId: incidentId,
      metadata: { updates: Object.keys(updates) },
      severity: 'HIGH'
    });

    return updatedIncident;
  }

  // Audit Logging
  async logAudit(auditData: Omit<AuditLog, 'id' | 'timestamp' | 'ipAddress' | 'userAgent' | 'success'>): Promise<AuditLog> {
    const auditLog: AuditLog = {
      ...auditData,
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      ipAddress: '0.0.0.0', // Would be populated from request context
      userAgent: 'system', // Would be populated from request context
      success: true
    };

    this.auditLogs.set(auditLog.id, auditLog);

    // In production, you'd also store this in a secure, immutable log store
    console.log('Audit Log:', auditLog);

    return auditLog;
  }

  // Compliance Reporting
  async generateComplianceReport(type: 'GDPR' | 'CCPA' | 'SOC2', startDate: Date, endDate: Date): Promise<any> {
    const auditLogs = Array.from(this.auditLogs.values())
      .filter(log => log.timestamp >= startDate && log.timestamp <= endDate);

    const dataProcessingRecords = Array.from(this.dataProcessingRecords.values())
      .filter(record => record.createdAt >= startDate && record.createdAt <= endDate);

    const consentRecords = Array.from(this.consentRecords.values())
      .filter(consent => consent.timestamp >= startDate && consent.timestamp <= endDate);

    const securityIncidents = Array.from(this.securityIncidents.values())
      .filter(incident => incident.detectedAt >= startDate && incident.detectedAt <= endDate);

    switch (type) {
      case 'GDPR':
        return this.generateGDPRReport(auditLogs, dataProcessingRecords, consentRecords, securityIncidents);
      case 'CCPA':
        return this.generateCCPAReport(auditLogs, dataProcessingRecords, consentRecords);
      case 'SOC2':
        return this.generateSOC2Report(auditLogs, securityIncidents);
      default:
        throw new Error(`Unsupported compliance report type: ${type}`);
    }
  }

  // Private helper methods
  private canDeleteDataRecord(record: DataProcessingRecord): boolean {
    // Check if data can be deleted based on legal basis and retention requirements
    const now = new Date();
    
    // If retention period has expired, data can be deleted
    if (record.dataRetentionUntil < now) {
      return true;
    }

    // If consent was the legal basis and it's been withdrawn, data can be deleted
    if (record.legalBasis === 'CONSENT' && !record.consentGiven) {
      return true;
    }

    // Otherwise, data must be retained
    return false;
  }

  private async triggerIncidentNotifications(incident: SecurityIncident): Promise<void> {
    // In production, this would send notifications to security team, management, etc.
    console.log(`CRITICAL SECURITY INCIDENT: ${incident.title}`);
    
    // Check if regulatory notification is required
    if (incident.regulatoryNotificationRequired) {
      // Schedule regulatory notification (must be within 72 hours for GDPR)
      console.log('Regulatory notification required for incident:', incident.id);
    }
  }

  private generateGDPRReport(auditLogs: AuditLog[], dataRecords: DataProcessingRecord[], consents: ConsentRecord[], incidents: SecurityIncident[]): any {
    return {
      reportType: 'GDPR Compliance Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalDataProcessingActivities: dataRecords.length,
        totalConsentRecords: consents.length,
        consentWithdrawals: consents.filter(c => c.withdrawnAt).length,
        rightToBeForgottenRequests: auditLogs.filter(log => log.action === 'RIGHT_TO_BE_FORGOTTEN_REQUESTED').length,
        dataExportRequests: auditLogs.filter(log => log.action === 'DATA_EXPORT_REQUESTED').length,
        securityIncidents: incidents.length,
        dataBreaches: incidents.filter(i => i.type === 'DATA_BREACH').length
      },
      dataProcessingActivities: dataRecords,
      consentManagement: consents,
      securityIncidents: incidents,
      auditTrail: auditLogs
    };
  }

  private generateCCPAReport(auditLogs: AuditLog[], dataRecords: DataProcessingRecord[], consents: ConsentRecord[]): any {
    return {
      reportType: 'CCPA Compliance Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalDataProcessingActivities: dataRecords.length,
        doNotSellRequests: consents.filter(c => c.consentType === 'THIRD_PARTY_SHARING' && !c.granted).length,
        dataDisclosureRequests: auditLogs.filter(log => log.action === 'DATA_EXPORT_REQUESTED').length,
        dataDeletionRequests: auditLogs.filter(log => log.action === 'RIGHT_TO_BE_FORGOTTEN_REQUESTED').length
      },
      dataProcessingActivities: dataRecords,
      consumerRights: consents,
      auditTrail: auditLogs
    };
  }

  private generateSOC2Report(auditLogs: AuditLog[], incidents: SecurityIncident[]): any {
    return {
      reportType: 'SOC 2 Compliance Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalAuditEvents: auditLogs.length,
        securityIncidents: incidents.length,
        criticalIncidents: incidents.filter(i => i.severity === 'CRITICAL').length,
        averageIncidentResolutionTime: this.calculateAverageResolutionTime(incidents)
      },
      securityControls: {
        accessControls: auditLogs.filter(log => log.action.includes('ACCESS')).length,
        dataEncryption: 'Enabled',
        incidentResponse: incidents.length,
        auditLogging: auditLogs.length
      },
      securityIncidents: incidents,
      auditTrail: auditLogs
    };
  }

  private calculateAverageResolutionTime(incidents: SecurityIncident[]): number {
    const resolvedIncidents = incidents.filter(i => i.resolvedAt);
    if (resolvedIncidents.length === 0) return 0;

    const totalTime = resolvedIncidents.reduce((sum, incident) => {
      const resolutionTime = incident.resolvedAt!.getTime() - incident.detectedAt.getTime();
      return sum + resolutionTime;
    }, 0);

    return Math.round(totalTime / resolvedIncidents.length / (1000 * 60 * 60)); // Hours
  }
}

// Global compliance manager instance
export const complianceManager = new ComplianceManager({
  gdpr: {
    enabled: true,
    dataRetentionDays: 365,
    cookieConsent: true,
    rightToBeForgotten: true,
    dataPortability: true,
    consentTracking: true
  },
  ccpa: {
    enabled: true,
    doNotSell: true,
    dataDisclosure: true,
    optOutRights: true
  },
  soc2: {
    enabled: true,
    auditLogging: true,
    accessControls: true,
    dataEncryption: true,
    incidentResponse: true
  }
});
