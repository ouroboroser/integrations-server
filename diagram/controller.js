const { diagram } = require('../services/diagram');

const createApiKey = async (ctx) => {
    const user = ctx.state.user;

    const apiKey = await diagram.generateApiKey(user);
    console.log('Apikey', apiKey);
};

module.exports = {
    createApiKey
};