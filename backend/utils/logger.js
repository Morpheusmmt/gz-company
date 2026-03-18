/**
 * Sistema de Logging - GZ Company
 * Registro de logs de acesso e erro
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const COLORS = {
  ERROR: '\x1b[31m',
  WARN: '\x1b[33m',
  INFO: '\x1b[36m',
  DEBUG: '\x1b[35m',
  RESET: '\x1b[0m'
};

/**
 * Formata timestamp para log
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Formata mensagem de log
 */
const formatLog = (level, message, meta = {}) => {
  const timestamp = getTimestamp();
  const color = COLORS[level] || COLORS.INFO;
  const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
  
  return `${color}[${timestamp}] [${level}]${COLORS.RESET} ${message}${metaStr}`;
};

/**
 * Logger principal
 */
const logger = {
  error: (message, meta = {}) => {
    console.error(formatLog(LOG_LEVELS.ERROR, message, meta));
  },

  warn: (message, meta = {}) => {
    console.warn(formatLog(LOG_LEVELS.WARN, message, meta));
  },

  info: (message, meta = {}) => {
    console.log(formatLog(LOG_LEVELS.INFO, message, meta));
  },

  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog(LOG_LEVELS.DEBUG, message, meta));
    }
  },

  // Log de requisição HTTP
  request: (req) => {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('User-Agent')?.substring(0, 50)
    };
    console.log(formatLog(LOG_LEVELS.INFO, 'HTTP Request', meta));
  },

  // Log de resposta HTTP
  response: (req, res, duration) => {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`
    };
    const level = res.statusCode >= 400 ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO;
    console.log(formatLog(level, 'HTTP Response', meta));
  }
};

/**
 * Middleware de logging para Express
 */
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log da requisição
  logger.request(req);

  // Captura o fim da resposta
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.response(req, res, duration);
  });

  next();
};

module.exports = { logger, requestLogger, LOG_LEVELS };
