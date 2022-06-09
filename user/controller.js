const models = require('../models');
const { dataProtection } = require('../services/dataProtection');
const { createAccessToken } = require('../helpers/createAccessToken');
const { errorMsg } = require('../errorMsg');

const signUp = async (ctx) => {
  const { email, password } = ctx.request.body;
  
  const user = await models.User.findOne({ where: { email } });
  
  if (user) {
    ctx.throw(400, errorMsg.userIsAlreadyExists);
  };
    
  const hashedPass = await dataProtection.kmsEncrypt(password);
    
  const createdUser = await models.User.create({
    email,
    password: hashedPass
  });

  ctx.status = 201;
  ctx.body = {
    id: createdUser.id,
    email: createdUser.email,
    token: createAccessToken(createdUser)
  }
};

const signIn = async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await models.User.findOne({ where: { email } });
  
  if (!user) {
    ctx.throw(400, errorMsg.userIsAlreadyExists);
  };
  
  const pass = await dataProtection.kmsDecrypt(user.dataValues.password);

  if (pass !== password) {
    ctx.throw(400, errorMsg.incorrectPass);
  };

  ctx.body = {
    id: user.id,
    email: user.email,
    token: createAccessToken(user)
  };
};

module.exports = {
  signUp,
  signIn
};