import mongoose from 'mongoose';
import dns from 'dns';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    // Set Google DNS for reliable DNS resolution
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 15000,
      retryWrites: true,
      w: 'majority',
      family: 4, // Force IPv4
    });

    isConnected = conn.connections[0].readyState === 1;
    console.log('✅ MongoDB connected successfully');
    console.log(`   Connected to: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`   Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Provide helpful debugging info
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.log('\n⚠️  Connection troubleshooting:');
      console.log('   1. Check MongoDB Atlas network access (IP whitelist)');
      console.log('   2. Verify your current IP is whitelisted: https://cloud.mongodb.com/v2');
      console.log('   3. Ensure credentials are correct in .env file');
      console.log('   4. Check cluster status in MongoDB Atlas dashboard\n');
    }
    
    throw error;
  }
};

export const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ MongoDB disconnected');
  }
};

export default mongoose;

