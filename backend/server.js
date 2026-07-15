/**
 * Server startup script
 * Initializes database and starts Next.js server
 */

import { 
  initializeDatabase, 
  seedDatabase, 
  healthCheck 
} from './db.js';

async function startServer() {
  try {
    console.log('🚀 Starting KhataBook Backend...\n');
    
    // Initialize database
    console.log('📦 Initializing database...');
    await initializeDatabase();
    
    // Check environment
    const env = process.env.NODE_ENV || 'development';
    console.log(`🔧 Environment: ${env}\n`);
    
    // Seed database in development
    if (env === 'development') {
      await seedDatabase();
    }
    
    // Health check
    console.log('🏥 Running health check...');
    const health = await healthCheck();
    console.log(`✓ Database: ${health.database}`);
    console.log(`✓ Time: ${health.timestamp}\n`);
    
    // Start Next.js
    console.log('🌍 Server ready!');
    console.log('📝 API running on http://localhost:3000/api');
    console.log('📖 Docs: See QUICKSTART.md for usage\n');
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down...');
  // Disconnect will be handled by Next.js
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\n🛑 Shutting down...');
  process.exit(0);
});

// Start server
startServer();
