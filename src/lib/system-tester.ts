// Comprehensive system testing for WECON
// Tests all critical functionality end-to-end

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'SKIP';
  duration: number;
  error?: string;
  details?: any;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  totalDuration: number;
  passCount: number;
  failCount: number;
  skipCount: number;
}

class SystemTester {
  private baseUrl: string;
  private testData: any = {};

  constructor(baseUrl: string = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
  }

  // Run all system tests
  async runAllTests(): Promise<{
    suites: TestSuite[];
    overall: {
      totalTests: number;
      passed: number;
      failed: number;
      skipped: number;
      duration: number;
      status: 'PASS' | 'FAIL';
    };
  }> {
    console.log('🧪 Starting comprehensive system tests...');
    
    const suites: TestSuite[] = [];
    const startTime = Date.now();

    // Run test suites in order
    suites.push(await this.testDatabaseConnectivity());
    suites.push(await this.testUserManagement());
    suites.push(await this.testTicketPurchaseFlow());
    suites.push(await this.testCheckInSystem());
    suites.push(await this.testCommunicationHub());
    suites.push(await this.testDigitalSignage());
    suites.push(await this.testRealTimeUpdates());
    suites.push(await this.testPerformanceMetrics());

    const totalDuration = Date.now() - startTime;
    
    // Calculate overall results
    const totalTests = suites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const passed = suites.reduce((sum, suite) => sum + suite.passCount, 0);
    const failed = suites.reduce((sum, suite) => sum + suite.failCount, 0);
    const skipped = suites.reduce((sum, suite) => sum + suite.skipCount, 0);

    const overall = {
      totalTests,
      passed,
      failed,
      skipped,
      duration: totalDuration,
      status: failed === 0 ? 'PASS' : 'FAIL' as 'PASS' | 'FAIL'
    };

    console.log(`✅ Tests completed: ${passed}/${totalTests} passed in ${totalDuration}ms`);
    
    return { suites, overall };
  }

  // Test database connectivity
  private async testDatabaseConnectivity(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Database Connectivity',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test basic database connection
    suite.tests.push(await this.runTest('Database Connection', async () => {
      const response = await fetch(`${this.baseUrl}/api/admin/analytics`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { connected: true, data: !!data };
    }));

    // Test user creation
    suite.tests.push(await this.runTest('User Creation', async () => {
      const testUser = {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
        password: 'testpassword123'
      };
      
      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.testData.testUser = { ...testUser, id: data.user?.id };
      return data;
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Test user management functionality
  private async testUserManagement(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'User Management',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test user login
    suite.tests.push(await this.runTest('User Login', async () => {
      if (!this.testData.testUser) throw new Error('No test user available');
      
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.testData.testUser.email,
          password: this.testData.testUser.password
        })
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.testData.authToken = data.token;
      return data;
    }));

    // Test user profile update
    suite.tests.push(await this.runTest('User Profile Update', async () => {
      if (!this.testData.testUser) throw new Error('No test user available');
      
      const updateData = {
        name: 'Updated Test User',
        company: 'Test Company'
      };
      
      const response = await fetch(`${this.baseUrl}/api/users/${this.testData.testUser.id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.testData.authToken}`
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Test ticket purchase flow
  private async testTicketPurchaseFlow(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Ticket Purchase Flow',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test event creation (admin)
    suite.tests.push(await this.runTest('Event Creation', async () => {
      const eventData = {
        name: `Test Event ${Date.now()}`,
        description: 'Test event for system testing',
        startAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endAt: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        venue: 'Test Venue'
      };
      
      const response = await fetch(`${this.baseUrl}/api/admin/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.testData.testEvent = data.event;
      return data;
    }));

    // Test ticket type creation
    suite.tests.push(await this.runTest('Ticket Type Creation', async () => {
      if (!this.testData.testEvent) throw new Error('No test event available');
      
      const ticketData = {
        name: 'General Admission',
        description: 'Standard ticket for test event',
        price: '50.00',
        totalQuantity: '100',
        eventId: this.testData.testEvent.id
      };
      
      const response = await fetch(`${this.baseUrl}/api/admin/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.testData.testTicketType = data.ticket;
      return data;
    }));

    // Test ticket purchase
    suite.tests.push(await this.runTest('Ticket Purchase', async () => {
      if (!this.testData.testTicketType) throw new Error('No test ticket type available');
      
      const purchaseData = {
        ticketTypeId: this.testData.testTicketType.id,
        quantity: 1,
        customerInfo: {
          name: 'Test Customer',
          email: `customer-${Date.now()}@example.com`,
          phone: '+1234567890'
        },
        paymentInfo: {
          method: 'STRIPE',
          paymentIntentId: `test_payment_${Date.now()}`
        }
      };
      
      const response = await fetch(`${this.baseUrl}/api/tickets/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.testData.testOrder = data.order;
      return data;
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Test check-in system
  private async testCheckInSystem(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Check-in System',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test check-in creation
    suite.tests.push(await this.runTest('Check-in Creation', async () => {
      if (!this.testData.testUser) throw new Error('No test user available');
      
      const checkInData = {
        userId: this.testData.testUser.id,
        method: 'MANUAL',
        location: 'Main Entrance'
      };
      
      const response = await fetch(`${this.baseUrl}/api/admin/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkInData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.testData.testCheckIn = data.checkIn;
      return data;
    }));

    // Test check-in retrieval
    suite.tests.push(await this.runTest('Check-in Retrieval', async () => {
      const response = await fetch(`${this.baseUrl}/api/admin/checkin?timeRange=24h`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { checkInsFound: data.checkIns?.length > 0 };
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Test communication hub
  private async testCommunicationHub(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Communication Hub',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test notification creation
    suite.tests.push(await this.runTest('Notification Creation', async () => {
      const notificationData = {
        type: 'EMAIL',
        title: 'Test Notification',
        message: 'This is a test notification',
        recipients: 'all',
        priority: 'NORMAL'
      };
      
      const response = await fetch(`${this.baseUrl}/api/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    }));

    // Test user count API
    suite.tests.push(await this.runTest('User Count API', async () => {
      const response = await fetch(`${this.baseUrl}/api/admin/users/count?group=all`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { count: data.count };
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Test digital signage
  private async testDigitalSignage(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Digital Signage',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test signage content retrieval
    suite.tests.push(await this.runTest('Signage Content Retrieval', async () => {
      const response = await fetch(`${this.baseUrl}/api/admin/digital-signage`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { hasContent: Array.isArray(data.content) };
    }));

    // Test display management
    suite.tests.push(await this.runTest('Display Management', async () => {
      const displayData = {
        name: `Test Display ${Date.now()}`,
        location: 'Test Location',
        type: 'SCREEN',
        isActive: true
      };
      
      const response = await fetch(`${this.baseUrl}/api/admin/digital-signage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CREATE_DISPLAY', ...displayData })
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Test real-time updates
  private async testRealTimeUpdates(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Real-time Updates',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test sync status
    suite.tests.push(await this.runTest('Sync Status Check', async () => {
      const response = await fetch(`${this.baseUrl}/api/admin/sync`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      return { 
        status: data.overall,
        modules: Object.keys(data.modules || {}).length
      };
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Test performance metrics
  private async testPerformanceMetrics(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Performance Metrics',
      tests: [],
      totalDuration: 0,
      passCount: 0,
      failCount: 0,
      skipCount: 0
    };

    const startTime = Date.now();

    // Test analytics endpoint performance
    suite.tests.push(await this.runTest('Analytics Performance', async () => {
      const start = Date.now();
      const response = await fetch(`${this.baseUrl}/api/admin/analytics`);
      const duration = Date.now() - start;
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      return { 
        responseTime: duration,
        acceptable: duration < 2000 // Should respond within 2 seconds
      };
    }));

    suite.totalDuration = Date.now() - startTime;
    this.calculateSuiteStats(suite);
    return suite;
  }

  // Helper method to run individual tests
  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    const start = Date.now();
    
    try {
      const result = await testFn();
      const duration = Date.now() - start;
      
      return {
        name,
        status: 'PASS',
        duration,
        details: result
      };
    } catch (error) {
      const duration = Date.now() - start;
      
      return {
        name,
        status: 'FAIL',
        duration,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Calculate suite statistics
  private calculateSuiteStats(suite: TestSuite): void {
    suite.passCount = suite.tests.filter(t => t.status === 'PASS').length;
    suite.failCount = suite.tests.filter(t => t.status === 'FAIL').length;
    suite.skipCount = suite.tests.filter(t => t.status === 'SKIP').length;
  }
}

// Export for use in testing scripts
export { SystemTester, TestResult, TestSuite };
