const fs = require('fs');
const axios = require('axios');
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

const updateAPIKeyStatus = async (ctx) => {
    const id = ctx.state.developer.id;
    const apiKeyId = ctx.request.params.id;
    
    const developer = await models.Developer.findOne({ where: { id } });

    if (!developer) {
        ctx.throw(404, errorMsg.notFound);
    };

    const apiKey = await models.ApiKey.findOne({ where: { id: apiKeyId } });

    if (!apiKey) {
        ctx.throw(404, errorMsg.notFound);
    };

    apiKey.update({
        disable: !apiKey.disable
    });

    ctx.status = 200;
    ctx.body = apiKey;
};

const retrieveActiveAPIKey = async (ctx) => {
    const id = ctx.state.developer.id;
    
    const developer = await models.Developer.findOne({ where: { id } });

    if (!developer) {
        ctx.throw(404, errorMsg.notFound);
    };

    const apiKey = await models.ApiKey.findOne({
        where: {
            [Op.and]: [
                { disable: false },
                { developerId: id }
            ]
        }
    });

    ctx.body = {
        apiKey: apiKey ? apiKey.key: '',
        apiKeyStatus: apiKey ? true : false,
    };
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

    // const keysMapped = keys.map(key => {
    //     const a = String(key.createdAt);

    //     console.log('A', a);

    //     return {
    //         id: key.id,
    //         key: key.key,
    //         createdAt: String(key.createdAt).split('T')[0],
    //         disable: true
    //     };
    // });

    // console.log(keysMapped);

    ctx.body = keys;
};

const uploadDiagramInJSONFormat = async ctx => {
    const developer = ctx.state.developer;

    const file = ctx.request.body.files.diagram;
    const diagram = fs.readFileSync(file.path);
    
    const title = uuidv4();
    const link = await upload(title, diagram);

    await models.Diagram.create({
        key: title,
        link,
        developerId: developer.id
    });

    ctx.body = 200;
};

const retrieveSavedDiagrams = async (ctx) => {
    
    const id = ctx.state.developer.id;
    let response;
    
    const developer = await models.Developer.findOne({ where: { id } });

    if (!developer) {
        ctx.throw(404, errorMsg.notFound);
    };

    const diagrams = await models.Diagram.findAll({
        where: {
            developerId: id
        }
    });

    if (diagrams.length > 0) {
        response = await Promise.all(diagrams.map((diagram) => {
            return axios
            .get(diagram.link)
            .then(response => {
    
                return {
                    id: diagram.key,
                    operations: response.data,
                    data: diagram.createdAt,
                }
            })
            .catch(e  => {
                console.log(e);
            });
        }));
    };

    ctx.body = diagrams.length > 0 ? response : [];
}; 

module.exports = {
    createApiKey,
    updateAPIKeyStatus,
    uploadDiagramInJSONFormat,
    retrieveAllAPIKeys,
    retrieveSavedDiagrams,
    retrieveActiveAPIKey
};