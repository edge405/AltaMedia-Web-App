/**
 * Simple logger utility for the application
 */
class Logger {
  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`, error ? error.stack || error : '');
  }

  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }

  static debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[DEBUG] ${timestamp} - ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
}

module.exports = Logger; 