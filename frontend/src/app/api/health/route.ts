import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Pool inline para health check
async function testDatabaseConnection(): Promise<boolean> {
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
      } : false,
      connectionTimeoutMillis: 10000,
      max: 1
    });
    
    await pool.query('SELECT 1 as test');
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Erro de conexão com banco:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com banco
    const dbConnected = await testDatabaseConnection();
    
    // Verificar variáveis de ambiente críticas
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
      NODE_ENV: process.env.NODE_ENV
    };

    const healthStatus = {
      status: dbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
      environment: envCheck,
      version: '1.0.0'
    };

    return NextResponse.json(healthStatus, {
      status: dbConnected ? 200 : 503
    });

  } catch (error) {
    console.error('Erro no health check:', error);
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 500 });
  }
}