$ErrorActionPreference = 'Stop'

Write-Host 'Running backend tests...' -ForegroundColor Cyan
Push-Location (Join-Path $PSScriptRoot 'backend')
try {
  npm test
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}

Write-Host 'Running frontend tests...' -ForegroundColor Cyan
Push-Location (Join-Path $PSScriptRoot 'frontend')
try {
  npm test
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}

Write-Host 'All tests passed.' -ForegroundColor Green
