# Push to GitHub - reads token from clipboard (no paste into terminal needed)
# 1. Copy token in browser (Ctrl+C)
# 2. Run this script
# 3. Press Enter when asked

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot\..

Write-Host ''
Write-Host '=== Push to GitHub ==='
Write-Host 'Repo: CZ-dotcom/bong-portfolio'
Write-Host ''
Write-Host 'Step 1: In browser, copy your classic token (repo scope checked)'
Write-Host 'Step 2: Come back here and press Enter'
Write-Host ''

$null = Read-Host 'Press Enter after token is copied to clipboard'

$token = (Get-Clipboard -Raw).Trim()
if ([string]::IsNullOrWhiteSpace($token)) {
  Write-Host ''
  Write-Host 'Clipboard is empty. Copy token first, then run again.'
  exit 1
}

if ($token -notmatch '^ghp_') {
  Write-Host ''
  Write-Host 'Warning: token usually starts with ghp_ - please check you copied the right text.'
}

$remote = 'https://github.com/CZ-dotcom/bong-portfolio.git'
$pushUrl = "https://CZ-dotcom:$token@github.com/CZ-dotcom/bong-portfolio.git"

Write-Host ''
Write-Host 'Pushing...'

git push $pushUrl main:main
if ($LASTEXITCODE -ne 0) {
  Write-Host ''
  Write-Host 'Push failed. Check:'
  Write-Host '  - Classic token with repo scope'
  Write-Host '  - Token not expired or revoked'
  Write-Host '  - Username is CZ-dotcom'
  exit 1
}

git remote set-url origin $remote
git fetch origin 2>&1 | Out-Null
git branch --set-upstream-to=origin/main main 2>&1 | Out-Null

# Clear clipboard token (optional safety)
Set-Clipboard -Value ''

Write-Host ''
Write-Host 'Success! https://github.com/CZ-dotcom/bong-portfolio'
Write-Host ''
