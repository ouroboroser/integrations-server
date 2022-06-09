const { diagram } = require('../services/diagram');
const models = require('../models');
const { errorMsg } = require('../errorMsg');

const createApiKey = async (ctx) => {
    const id = ctx.state.user.id;

    const user = await models.User.findOne({ where: { id } });

    if (!user) {
        ctx.throw(404, errorMsg.notFound);
    };

    const checkIfApiKeyIsAlreadyExists = await models.ApiKey.findOne({ where: { userId: id } });

    if (checkIfApiKeyIsAlreadyExists) {
        ctx.throw(400, errorMsg.userAlreadyCreatedApiKey);
    };
    
    const apiKey = await diagram.generateApiKey(user);
    
    await models.ApiKey.create({
        key: apiKey,
        userId: id
    });

    ctx.body = {
        apiKey,
    }
};

module.exports = {
    createApiKey
};