const models = require('../models');
const { dataProtection } = require('../services/dataProtection');
const { createAccessToken } = require('../helpers/createAccessToken');
const { errorMsg } = require('../errorMsg');

const signUp = async (ctx) => {
  const { email, password, username } = ctx.request.body;
  
  const developer = await models.Developer.findOne({ where: { email } });
  
  if (developer) {
    ctx.throw(400, errorMsg.developerIsAlreadyExists);
  };
    
  const hashedPass = await dataProtection.kmsEncrypt(password);
    
  const createdDeveloper = await models.Developer.create({
    email,
    username,
    password: hashedPass
  });

  ctx.status = 201;

  ctx.body = {
    id: createdDeveloper.id,
    email: createdDeveloper.email,
    username: createdDeveloper.username,
    token: createAccessToken(createdDeveloper)
  }
};

const signIn = async (ctx) => {
  const { email, password } = ctx.request.body;
  const developer = await models.Developer.findOne({ where: { email } });
  
  if (!developer) {
    ctx.throw(400, errorMsg.developerIsNotExists);
  };
  
  const pass = await dataProtection.kmsDecrypt(developer.dataValues.password);

  if (pass !== password) {
    ctx.throw(400, errorMsg.incorrectPass);
  };

  ctx.body = {
    id: developer.id,
    email: developer.email,
    username: developer.username,
    token: createAccessToken(developer)
  };
};

module.exports = {
  signUp,
  signIn
};