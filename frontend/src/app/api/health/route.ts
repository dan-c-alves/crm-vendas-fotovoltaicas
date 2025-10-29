import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    // Testar conexão com banco
    const dbConnected = await testConnection();
    
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