if (!(Test-Path node_modules)) {
    Write-Host "Installing dependencies..."
    npm install --silent --production
} 

npm run --silent start
