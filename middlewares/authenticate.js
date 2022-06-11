const jwt = require('jsonwebtoken');

const authenticate = async (ctx, next ) => {
    const header = ctx.headers.authorization;
    
    if (header) {
        const token = header.split(' ')[1];
        try {
            const developer = jwt.verify(token, process.env.JWT_SECRET);
            if (developer) {
                ctx.state.developer = developer;
                await next();
            } else {
                ctx.status = 401;
                ctx.throw(401);
            }
        } 
        
        catch (e) {
            const errorCode = e.statusCode || e.status;
            const errorMessage = e.message;
            
            ctx.throw(errorCode, errorMessage);
        }
    } else {
        ctx.throw(401);
    }
};

module.exports = {
    authenticate
};