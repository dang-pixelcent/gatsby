/**
 * Custom hook for ANSI color codes in terminal output
 * @returns {Object} Object containing color codes for styling terminal output
 */
function getTerminalColors() {
    return {
        reset: '\x1b[0m',
        bright: '\x1b[1m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',

        // Helper methods
        colorize: (text, color) => `${color}${text}\x1b[0m`,
        success: (text) => `\x1b[32m${text}\x1b[0m`,
        error: (text) => `\x1b[31m${text}\x1b[0m`,
        warning: (text) => `\x1b[33m${text}\x1b[0m`,
        info: (text) => `\x1b[34m${text}\x1b[0m`
    }
}

// Sử dụng CommonJS export thay vì ES6 export
module.exports = getTerminalColors;