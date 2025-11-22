module.exports = {
  apps: [{
    name: 'andreia-molina-exclusive',
    script: 'server/_core/index.ts',
    interpreter: 'node',
    interpreterArgs: '--import tsx',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
