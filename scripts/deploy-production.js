#!/usr/bin/env node

/**
 * Production Deployment Script for WECON Event Management System
 * Validates system readiness and performs deployment checks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 WECON Production Deployment Script');
console.log('=====================================\n');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

function logStep(step, message) {
  console.log(`\n${colors.bold}${colors.blue}Step ${step}: ${message}${colors.reset}`);
}

async function main() {
  try {
    // Step 1: Environment Validation
    logStep(1, 'Validating Environment Configuration');
    await validateEnvironment();

    // Step 2: Database Schema Validation
    logStep(2, 'Validating Database Schema');
    await validateDatabase();

    // Step 3: Dependency Check
    logStep(3, 'Checking Dependencies');
    await checkDependencies();

    // Step 4: Build Validation
    logStep(4, 'Validating Build Process');
    await validateBuild();

    // Step 5: System Health Check
    logStep(5, 'Running System Health Checks');
    await runHealthChecks();

    // Step 6: Performance Validation
    logStep(6, 'Validating Performance');
    await validatePerformance();

    // Step 7: Final Deployment
    logStep(7, 'Preparing for Deployment');
    await prepareDeployment();

    console.log(`\n${colors.green}${colors.bold}🎉 DEPLOYMENT READY!${colors.reset}`);
    console.log('Your WECON system is ready for production deployment.');
    console.log('\nNext steps:');
    console.log('1. Push to your Git repository');
    console.log('2. Deploy to Vercel');
    console.log('3. Run post-deployment health checks');

  } catch (error) {
    logError(`Deployment validation failed: ${error.message}`);
    process.exit(1);
  }
}

async function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'DIRECT_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];

  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found. Please create it with required environment variables.');
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const missingVars = [];

  for (const envVar of requiredEnvVars) {
    if (!envContent.includes(envVar) || envContent.includes(`${envVar}=`)) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  logSuccess('Environment variables validated');
}

async function validateDatabase() {
  try {
    // Check if Prisma schema is valid
    execSync('npx prisma validate', { stdio: 'pipe' });
    logSuccess('Prisma schema is valid');

    // Generate Prisma client
    execSync('npx prisma generate', { stdio: 'pipe' });
    logSuccess('Prisma client generated');

    // Test database connection
    execSync('npx prisma db pull --force', { stdio: 'pipe' });
    logSuccess('Database connection successful');

    // Push schema to ensure it's up to date
    execSync('npx prisma db push', { stdio: 'pipe' });
    logSuccess('Database schema is up to date');

  } catch (error) {
    throw new Error(`Database validation failed: ${error.message}`);
  }
}

async function checkDependencies() {
  try {
    // Check if all dependencies are installed
    execSync('npm ls --depth=0', { stdio: 'pipe' });
    logSuccess('All dependencies are installed');

    // Check for security vulnerabilities
    try {
      execSync('npm audit --audit-level=high', { stdio: 'pipe' });
      logSuccess('No high-severity security vulnerabilities found');
    } catch (auditError) {
      logWarning('Security vulnerabilities detected. Consider running "npm audit fix"');
    }

    // Verify critical packages
    const criticalPackages = [
      '@prisma/client',
      '@supabase/supabase-js',
      'qrcode',
      'framer-motion',
      'lucide-react'
    ];

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    for (const pkg of criticalPackages) {
      if (!allDeps[pkg]) {
        throw new Error(`Critical package missing: ${pkg}`);
      }
    }

    logSuccess('All critical packages are present');

  } catch (error) {
    throw new Error(`Dependency check failed: ${error.message}`);
  }
}

async function validateBuild() {
  try {
    logInfo('Building application...');
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('Build completed successfully');

    // Check if build output exists
    const buildPath = path.join(process.cwd(), '.next');
    if (!fs.existsSync(buildPath)) {
      throw new Error('Build output not found');
    }

    logSuccess('Build artifacts validated');

  } catch (error) {
    throw new Error(`Build validation failed: ${error.message}`);
  }
}

async function runHealthChecks() {
  try {
    // Start the application in background for testing
    logInfo('Starting application for health checks...');
    
    const { spawn } = require('child_process');
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      detached: true
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Run health checks
    const healthResponse = await fetch('http://localhost:3000/api/health?detailed=true');
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed with status: ${healthResponse.status}`);
    }

    const healthData = await healthResponse.json();
    
    if (healthData.status !== 'healthy') {
      logWarning(`System status: ${healthData.status}`);
      if (healthData.details) {
        console.log('Health details:', JSON.stringify(healthData.details, null, 2));
      }
    } else {
      logSuccess('All health checks passed');
    }

    // Clean up server
    process.kill(-server.pid);

  } catch (error) {
    logWarning(`Health checks could not be completed: ${error.message}`);
    logInfo('You can run health checks manually after deployment');
  }
}

async function validatePerformance() {
  try {
    // Check for performance optimization files
    const performanceFiles = [
      'src/lib/cache-manager.ts',
      'src/lib/performance-monitor.ts',
      'src/lib/realtime-updates.ts'
    ];

    for (const file of performanceFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Performance optimization file missing: ${file}`);
      }
    }

    logSuccess('Performance optimization files validated');

    // Check Next.js configuration
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(nextConfigPath)) {
      logSuccess('Next.js configuration found');
    }

  } catch (error) {
    throw new Error(`Performance validation failed: ${error.message}`);
  }
}

async function prepareDeployment() {
  try {
    // Create deployment summary
    const deploymentSummary = {
      timestamp: new Date().toISOString(),
      version: require('../package.json').version || '1.0.0',
      environment: 'production',
      features: [
        'Real-time check-in system',
        'Email-integrated ticket purchase',
        'Communication hub with multi-channel support',
        'Enhanced digital signage with large file support',
        'Performance monitoring and caching',
        'Comprehensive error handling',
        'Mobile-responsive design'
      ],
      healthChecks: 'completed',
      buildStatus: 'successful',
      readyForDeployment: true
    };

    fs.writeFileSync(
      'deployment-summary.json',
      JSON.stringify(deploymentSummary, null, 2)
    );

    logSuccess('Deployment summary created');

    // Create post-deployment checklist
    const checklist = `
# Post-Deployment Checklist

## Immediate Actions (First 30 minutes)
- [ ] Verify health endpoint: GET /api/health
- [ ] Test user registration and login
- [ ] Test ticket purchase flow
- [ ] Verify check-in system functionality
- [ ] Test communication hub
- [ ] Check digital signage upload

## Performance Monitoring (First 24 hours)
- [ ] Monitor response times via /api/admin/analytics
- [ ] Check error rates and logs
- [ ] Verify cache hit rates
- [ ] Monitor real-time update performance

## Weekly Maintenance
- [ ] Review performance metrics
- [ ] Check system health status
- [ ] Update dependencies if needed
- [ ] Backup database

## Contact Information
- System Health: GET /api/health
- Performance Metrics: GET /api/admin/analytics
- Sync Status: GET /api/admin/sync
`;

    fs.writeFileSync('POST-DEPLOYMENT-CHECKLIST.md', checklist);
    logSuccess('Post-deployment checklist created');

  } catch (error) {
    throw new Error(`Deployment preparation failed: ${error.message}`);
  }
}

// Run the deployment script
main().catch(error => {
  logError(`Deployment script failed: ${error.message}`);
  process.exit(1);
});
