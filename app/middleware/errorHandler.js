
const errorHandler = (error, req, res, next) => {
    
    const generatedError = error?.error?.status ? error?.error : {
        timestamp: Date.now(),
        type: 'rest',
        status: 500,
        message: `Internal server error at error handler ${error}`,
    };

    return res.status(generatedError.status).json({ error: generatedError });
}

module.exports = errorHandler;
