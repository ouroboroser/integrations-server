const fs = require('fs');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const { diagram } = require('../services/diagram');
const models = require('../models');
const { errorMsg } = require('../errorMsg');
const { upload } = require('../libs/s3');

const createApiKey = async (ctx) => {
    const id = ctx.state.developer.id;

    const developer = await models.Developer.findOne({ where: { id } });

    if (!developer) {
        ctx.throw(404, errorMsg.notFound);
    };

    const checkIfApiKeyIsAlreadyExists = await models.ApiKey.findOne({
        where: {
            [Op.and]: [
                { disable: false },
                { developerId: id }
            ]
        }
    });

    if (checkIfApiKeyIsAlreadyExists) {
        ctx.throw(400, errorMsg.developerAlreadyCreatedApiKey);
    };
    
    const apiKey = await diagram.generateApiKey(developer);
    
    await models.ApiKey.create({
        key: apiKey,
        disable: false,
        developerId: id
    });

    ctx.body = {
        apiKey,
    }
};

const retrieveAllAPIKeys = async (ctx) => {
    const id = ctx.state.developer.id;
    
    const developer = await models.Developer.findOne({ where: { id } });

    if (!developer) {
        ctx.throw(404, errorMsg.notFound);
    };

    const keys = await models.ApiKey.findAll({
        where: {
            developerId: id
        }
    });

    ctx.body = keys;
};

const uploadDiagramInJSONFormat = async (ctx) => {
    const file = ctx.request.body.files.diagram;
    const diagram = fs.readFileSync(file.path);
    
    const title = uuidv4();
    const link = await upload(title, diagram);

    ctx.body = 200;
};

module.exports = {
    createApiKey,
    uploadDiagramInJSONFormat,
    retrieveAllAPIKeys
};