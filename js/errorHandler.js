/**
 * Centralized error handling and logging system
 * Provides consistent error handling across the application
 */

import { GAME_CONSTANTS } from './config.js';

export class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = GAME_CONSTANTS.LIMITS.MAX_ERROR_LOG_SIZE || 100;
        this.setupGlobalErrorHandling();
    }

    /**
     * Set up global error handlers
     */
    setupGlobalErrorHandling() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            this.logError('Uncaught Error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error
            });
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', {
                reason: event.reason,
                promise: event.promise
            });
        });
    }

    /**
     * Log an error with context
     * @param {string} type - Error type/category
     * @param {Object} details - Error details
     * @param {string} severity - Error severity (low, medium, high, critical)
     */
    logError(type, details, severity = 'medium') {
        const errorEntry = {
            timestamp: new Date().toISOString(),
            type,
            details,
            severity,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Add to error log
        this.errorLog.push(errorEntry);

        // Maintain log size limit
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }

        // Console logging based on severity
        switch (severity) {
            case 'critical':
                console.error(`[CRITICAL] ${type}:`, details);
                break;
            case 'high':
                console.error(`[HIGH] ${type}:`, details);
                break;
            case 'medium':
                console.warn(`[MEDIUM] ${type}:`, details);
                break;
            case 'low':
                console.info(`[LOW] ${type}:`, details);
                break;
            default:
                console.log(`[${severity.toUpperCase()}] ${type}:`, details);
        }

        // Store in localStorage for debugging (only critical and high errors)
        if (severity === 'critical' || severity === 'high') {
            this.persistError(errorEntry);
        }
    }

    /**
     * Persist critical errors to localStorage
     * @param {Object} errorEntry - Error entry to persist
     */
    persistError(errorEntry) {
        try {
            const persistedErrors = JSON.parse(localStorage.getItem('game_errors') || '[]');
            persistedErrors.push(errorEntry);
            
            // Keep only last 20 critical errors
            if (persistedErrors.length > 20) {
                persistedErrors.splice(0, persistedErrors.length - 20);
            }
            
            localStorage.setItem('game_errors', JSON.stringify(persistedErrors));
        } catch (e) {
            console.error('Failed to persist error to localStorage:', e);
        }
    }

    /**
     * Wrap a function with error handling
     * @param {Function} fn - Function to wrap
     * @param {string} context - Context description for error logging
     * @param {string} severity - Default severity for errors in this context
     * @returns {Function} Wrapped function
     */
    wrapFunction(fn, context, severity = 'medium') {
        return (...args) => {
            try {
                return fn.apply(this, args);
            } catch (error) {
                this.logError(`Error in ${context}`, {
                    error: error.message,
                    stack: error.stack,
                    args: args
                }, severity);
                
                // Re-throw critical errors
                if (severity === 'critical') {
                    throw error;
                }
                
                return null;
            }
        };
    }

    /**
     * Wrap an async function with error handling
     * @param {Function} fn - Async function to wrap
     * @param {string} context - Context description for error logging
     * @param {string} severity - Default severity for errors in this context
     * @returns {Function} Wrapped async function
     */
    wrapAsyncFunction(fn, context, severity = 'medium') {
        return async (...args) => {
            try {
                return await fn.apply(this, args);
            } catch (error) {
                this.logError(`Async error in ${context}`, {
                    error: error.message,
                    stack: error.stack,
                    args: args
                }, severity);
                
                // Re-throw critical errors
                if (severity === 'critical') {
                    throw error;
                }
                
                return null;
            }
        };
    }

    /**
     * Validate input parameters
     * @param {Object} params - Parameters to validate
     * @param {Object} schema - Validation schema
     * @param {string} context - Context for error reporting
     * @returns {boolean} True if valid, false otherwise
     */
    validateInput(params, schema, context) {
        try {
            for (const [key, rules] of Object.entries(schema)) {
                const value = params[key];
                
                // Check required fields
                if (rules.required && (value === undefined || value === null)) {
                    this.logError('Validation Error', {
                        context,
                        field: key,
                        error: 'Required field missing',
                        value
                    }, 'medium');
                    return false;
                }
                
                // Skip validation for optional undefined fields
                if (value === undefined || value === null) {
                    continue;
                }
                
                // Type validation
                if (rules.type && typeof value !== rules.type) {
                    this.logError('Validation Error', {
                        context,
                        field: key,
                        error: `Expected type ${rules.type}, got ${typeof value}`,
                        value
                    }, 'medium');
                    return false;
                }
                
                // Range validation for numbers
                if (rules.type === 'number') {
                    if (rules.min !== undefined && value < rules.min) {
                        this.logError('Validation Error', {
                            context,
                            field: key,
                            error: `Value ${value} below minimum ${rules.min}`,
                            value
                        }, 'medium');
                        return false;
                    }
                    
                    if (rules.max !== undefined && value > rules.max) {
                        this.logError('Validation Error', {
                            context,
                            field: key,
                            error: `Value ${value} above maximum ${rules.max}`,
                            value
                        }, 'medium');
                        return false;
                    }
                }
                
                // Custom validation function
                if (rules.validate && !rules.validate(value)) {
                    this.logError('Validation Error', {
                        context,
                        field: key,
                        error: 'Custom validation failed',
                        value
                    }, 'medium');
                    return false;
                }
            }
            
            return true;
        } catch (error) {
            this.logError('Validation System Error', {
                context,
                error: error.message,
                stack: error.stack
            }, 'high');
            return false;
        }
    }

    /**
     * Get error statistics
     * @returns {Object} Error statistics
     */
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            bySeverity: {},
            byType: {},
            recent: this.errorLog.slice(-10)
        };
        
        this.errorLog.forEach(error => {
            stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
        });
        
        return stats;
    }

    /**
     * Clear error log
     */
    clearErrorLog() {
        this.errorLog = [];
        try {
            localStorage.removeItem('game_errors');
        } catch (e) {
            console.warn('Failed to clear persisted errors:', e);
        }
    }

    /**
     * Export error log for debugging
     * @returns {string} JSON string of error log
     */
    exportErrorLog() {
        return JSON.stringify({
            errorLog: this.errorLog,
            stats: this.getErrorStats(),
            exportTime: new Date().toISOString()
        }, null, 2);
    }
}

// Create singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions
export const logError = (type, details, severity) => errorHandler.logError(type, details, severity);
export const wrapFunction = (fn, context, severity) => errorHandler.wrapFunction(fn, context, severity);
export const wrapAsyncFunction = (fn, context, severity) => errorHandler.wrapAsyncFunction(fn, context, severity);
export const validateInput = (params, schema, context) => errorHandler.validateInput(params, schema, context);