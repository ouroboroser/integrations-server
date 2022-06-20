const models = require('../models');

const checkAPIKeys = async (ctx, next) => {
    const apiKey =  ctx.request.query.apiKey;

    if (apiKey) {
        
        const key = await models.ApiKey.findOne({
            where: {
                key: apiKey,
                disable: false 
            }
        });

        if (key) {
            const developer = await models.Developer.findOne({
                where: {
                    id: key.developerId
                }
            });

            ctx.state.developer = developer;
            await next();
        };
        
        if (key === null) {
            ctx.throw(403);
        };
        
    } else {
        ctx.throw(403, 'You don\'t have an access to perform this action');
    }
};

module.exports = {
    checkAPIKeys
};