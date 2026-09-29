i$ErrorActionPreference = 'Stop'
$project = $PSScriptRoot

# Check prerequisites before installing anything, then give beginner-friendly directions.
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host 'Python was not found. Install Python from https://www.python.org/downloads/ and try again.' -ForegroundColor Red
    Write-Host 'During installation, tick the box that says Add Python to PATH.'
    Read-Host 'Press Enter to close this window'
    exit 1
}
if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host 'Node.js is not installed yet. The React website needs Node.js to run.' -ForegroundColor Yellow
    Write-Host '1. Open https://nodejs.org/ in your browser.'
    Write-Host '2. Download and install the LTS version (choose the recommended download).'
    Write-Host '3. When installation finishes, close this window.'
    Write-Host '4. Double-click start.ps1 again.'
    Read-Host 'Press Enter to close this window'
    exit 1
}

try {
    Write-Host 'Step 1 of 4: Preparing the Python server...'
    if (-not (Test-Path "$project\backend\.venv\Scripts\python.exe")) {
        python -m venv "$project\backend\.venv"
        if ($LASTEXITCODE -ne 0) { throw 'Python could not create its setup folder.' }
    }
    & "$project\backend\.venv\Scripts\python.exe" -m pip install -r "$project\backend\requirements.txt"
    if ($LASTEXITCODE -ne 0) { throw 'Python could not download the server packages. Check your internet connection and try again.' }

    Write-Host 'Step 2 of 4: Preparing the website...'
    Push-Location "$project\frontend"
    try {
        npm install
        if ($LASTEXITCODE -ne 0) { throw 'The website packages could not be downloaded. Check your internet connection and try again.' }
    } finally { Pop-Location }

    Write-Host 'Step 3 of 4: Starting both parts of the app...'
    $apiCommand = "Set-Location -LiteralPath '$project\backend'; & '.\.venv\Scripts\python.exe' -m uvicorn main:app --reload"
    $webCommand = "Set-Location -LiteralPath '$project\frontend'; npm run dev -- --host 127.0.0.1"
    Start-Process powershell -ArgumentList @('-NoExit', '-Command', $apiCommand)
    Start-Process powershell -ArgumentList @('-NoExit', '-Command', $webCommand)
    Start-Sleep -Seconds 4
    Start-Process 'http://localhost:5173'
    Write-Host 'Step 4 of 4: Done! Your todo list should now be open in your browser.' -ForegroundColor Green
    Write-Host 'Keep both server windows open while you use it. Close them when you are finished.'
} catch {
    Write-Host "`nSetup stopped: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host 'Fix the item above, then double-click start.ps1 again.'
    Read-Host 'Press Enter to close this window'
    exit 1
}
