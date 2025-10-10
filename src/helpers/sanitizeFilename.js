function sanitizeFilename(url) {
    return url.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

module.exports = sanitizeFilename;
