const getError = (type, status, message, rest) => {

    return {
        error: {
            timestamp: Date.now(),
            type: type,
            status: status,
            message: message,
            ...rest,
        }
    }
}

module.exports = getError;