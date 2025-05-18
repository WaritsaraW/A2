module.exports = {
  apps: [
    {
      name: 'car-rental-system',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 8080
      },
      // Run build command before starting the application
      setup: 'npm run build'
    }
  ]
}; 