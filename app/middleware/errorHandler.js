
const errorHandler = (error, req, res, next) => {

    console.log(error);
    const generatedError = error?.error?.status ? error?.error : {
        timestamp: Date.now(),
        type: 'rest',
        status: 500,
        message: 'Internal server error at error handler',
    };

    return res.status(generatedError.status).json({ error: generatedError });
}

module.exports = errorHandler;