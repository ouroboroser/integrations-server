const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { diagram } = require('../services/diagram');
const models = require('../models');
const { errorMsg } = require('../errorMsg');
const { upload } = require('../libs/s3');

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

const uploadDiagramInJSONFormat = async (ctx) => {
    const file = ctx.request.body.files.diagram;
    const diagram = fs.readFileSync(file.path);
    
    const title = uuidv4();
    const link = await upload(title, diagram);

    console.log('link', link);
};

module.exports = {
    createApiKey,
    uploadDiagramInJSONFormat
};