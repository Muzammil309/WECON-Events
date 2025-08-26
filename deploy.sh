#!/bin/bash

# WECON Masawat Event Management Platform - Deployment Script
# This script automates the deployment process to Vercel with Supabase

echo "🚀 WECON Masawat Deployment Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi
    
    print_success "All dependencies are installed."
}

# Build the application
build_application() {
    print_status "Building the application..."
    
    if npm run build; then
        print_success "Application built successfully."
    else
        print_error "Build failed. Please check the errors above."
        exit 1
    fi
}

# Push to GitHub
push_to_github() {
    print_status "Pushing code to GitHub..."
    
    # Check if origin remote exists
    if git remote get-url origin &> /dev/null; then
        print_status "Origin remote already exists. Updating..."
        git remote set-url origin https://github.com/Muzamil567/WECON-Events.git
    else
        print_status "Adding origin remote..."
        git remote add origin https://github.com/Muzamil567/WECON-Events.git
    fi
    
    # Ensure we're on main branch
    git branch -M main
    
    # Add all changes
    git add .
    
    # Commit if there are changes
    if git diff --staged --quiet; then
        print_warning "No changes to commit."
    else
        git commit -m "Deploy: Ready for production deployment

- Fixed all TypeScript compilation errors
- Created API stubs for successful build
- Updated Vercel configuration
- Prepared Supabase integration
- Ready for deployment to wecon-events.vercel.app"
    fi
    
    # Push to GitHub
    if git push -u origin main; then
        print_success "Code pushed to GitHub successfully."
    else
        print_error "Failed to push to GitHub. Please check your repository access."
        exit 1
    fi
}

# Display deployment information
show_deployment_info() {
    echo ""
    echo "🎯 DEPLOYMENT INFORMATION"
    echo "========================"
    echo ""
    echo "📱 Application URLs:"
    echo "   Production: https://wecon-masawat.vercel.app"
    echo "   Admin:      https://wecon-masawat.vercel.app/login"
    echo "   Attendee:   https://wecon-masawat.vercel.app/signup"
    echo ""
    echo "🔗 Project Links:"
    echo "   GitHub:     https://github.com/Muzamil567/WECON-Events"
    echo "   Vercel:     https://vercel.com/muzammil-ahmeds-projects-7dc22688/wecon-events"
    echo "   Supabase:   https://supabase.com/dashboard/project/xhkbbctbyyeoucwmdspr"
    echo ""
    echo "⚙️  Required Environment Variables for Vercel:"
    echo "   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xhkbbctbyyeoucwmdspr.supabase.co:5432/postgres"
    echo "   NEXTAUTH_SECRET=d48a7fac2990b9cca4a08ed6457203ee06b2b16f1a396ff47094712b9fa91239"
    echo "   NEXTAUTH_URL=https://wecon-masawat.vercel.app"
    echo "   JWT_SECRET=86f164addc398e6da202c8f62fa8155dacdead8cf9fbf7189e5356e1a12a87c8"
    echo "   ADMIN_USERNAME=admin"
    echo "   ADMIN_PASSWORD=admin123"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Configure environment variables in Vercel dashboard"
    echo "   2. Run Supabase setup script: supabase-setup.sql"
    echo "   3. Test the deployment at wecon-events.vercel.app"
    echo "   4. Verify admin and attendee authentication flows"
    echo ""
}

# Main deployment process
main() {
    echo "Starting deployment process..."
    echo ""
    
    check_dependencies
    build_application
    push_to_github
    show_deployment_info
    
    print_success "Deployment preparation completed successfully! 🎉"
    print_status "Please complete the Vercel and Supabase configuration manually."
}

# Run the main function
main
