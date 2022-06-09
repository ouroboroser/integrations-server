const catchErrors = async (ctx, next) => {
    try {
        await next();
    } 
    
    catch (e) {
        const errorStatusCode = e.statusCode || e.status || 500;

        e.status = errorStatusCode;
        ctx.status = errorStatusCode;
        
        ctx.body = {
            error: e.message
        }
        ctx.app.emit('error', e, ctx);
    }
};

module.exports = {
    catchErrors
};