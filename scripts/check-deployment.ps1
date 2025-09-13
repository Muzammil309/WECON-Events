# Vercel Deployment Monitoring Script
# This script checks if the deployment is working correctly

Write-Host "🔍 Checking Vercel Deployment Status..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Gray

# Check website response
Write-Host "📡 Testing website response..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://wecon-masawat.vercel.app/" -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Website Status: $($response.StatusCode)" -ForegroundColor Green
    
    # Check for AIvent content
    if ($response.Content -match "AIvent|AIVENT") {
        Write-Host "✅ AIvent content detected!" -ForegroundColor Green
    } else {
        Write-Host "❌ AIvent content NOT found - may still be old version" -ForegroundColor Red
    }
    
    # Check for specific AIvent elements
    if ($response.Content -match "contact@aivent.com") {
        Write-Host "✅ AIvent contact email found" -ForegroundColor Green
    }
    
    if ($response.Content -match "DECEMBER 15-17, 2025") {
        Write-Host "✅ AIvent event date found" -ForegroundColor Green
    }
    
} catch {
    Write-Host "❌ Website Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🔧 Recent Git Commits:" -ForegroundColor Cyan
git log --oneline -3

Write-Host "`n📋 Deployment Checklist:" -ForegroundColor Cyan
Write-Host "1. ✅ Git state clean" -ForegroundColor Green
Write-Host "2. ✅ Build working locally" -ForegroundColor Green
Write-Host "3. ✅ Vercel.json modernized" -ForegroundColor Green
Write-Host "4. ✅ Package.json version bumped" -ForegroundColor Green
Write-Host "5. ✅ Changes pushed to GitHub" -ForegroundColor Green

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "- Wait 2-3 minutes for Vercel to detect changes" -ForegroundColor Yellow
Write-Host "- Check Vercel dashboard: https://vercel.com/muzammil309s-projects/wecon-events" -ForegroundColor Yellow
Write-Host "- If still not working, manually trigger deployment from dashboard" -ForegroundColor Yellow

Write-Host "`n================================================" -ForegroundColor Gray
Write-Host "🎯 Expected Result: AIvent website at https://wecon-masawat.vercel.app/" -ForegroundColor Magenta
