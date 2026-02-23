/**
 * Configurações por Ambiente - GZ Company
 * Separação entre desenvolvimento e produção
 */

const environments = {
  development: {
    name: 'development',
    debug: true,
    logLevel: 'DEBUG',
    cors: {
      origin: 'http://localhost:5173',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 1000 // requests por janela
    }
  },
  
  production: {
    name: 'production',
    debug: false,
    logLevel: 'INFO',
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  },
  
  test: {
    name: 'test',
    debug: true,
    logLevel: 'ERROR',
    cors: {
      origin: '*',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 10000
    }
  }
};

const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return environments[env] || environments.development;
};

module.exports = { getConfig, environments };
