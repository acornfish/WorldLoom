if (!(Test-Path node_modules)) {
    Write-Host "Installing dependencies..."
    npm install
} 

npm start