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
    const id = ctx.state.developer.id;
    
    const developer = await models.Developer.findOne({ where: { id } });

    if (!developer) {
        ctx.throw(404, errorMsg.notFound);
    };

    const file = ctx.request.body.files.diagram;
    const diagram = fs.readFileSync(file.path);
    
    const title = uuidv4();
    const link = await upload(title, diagram);

    await models.Diagram.create({
        key: title,
        link,
        developerId: id,
    });

    ctx.body = 200;
};

const retrieveSavedDiagrams = async (ctx) => {
    const id = ctx.state.developer.id;
    
    const developer = await models.Developer.findOne({ where: { id } });

    if (!developer) {
        ctx.throw(404, errorMsg.notFound);
    };

    const diagrams = await models.Diagram.findAll({
        where: {
            developerId: id
        }
    });

    const response = await Promise.all(diagrams.map((diagram) => {
        return axios
        .get(diagram.link)
        .then(response => {
            console.log('console.log', response.data);

            return {
                id: diagram.key,
                operations: response.data,
                data: String(diagram.createdAt).split('T')[0]
            }
            
            //console.log(response.data);
            // return {
            //     id: diagram.key,
            //     data: diagram.createdAt,
            //     operations: response.data,
            // };
            // //console.log(response);
        })
        .catch(error => {
          console.log(error);
        });
    }));

    ctx.body = response;
}; 

module.exports = {
    createApiKey,
    uploadDiagramInJSONFormat,
    retrieveAllAPIKeys,
    retrieveSavedDiagrams
};