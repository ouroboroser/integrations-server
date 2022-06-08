const bcrypt = require('bcrypt');
const models = require('../models');

const signUp = async (ctx) => {
  const { email, password } = ctx.request.body;
  
  const user = await models.User.findOne({ where: { email } });
  
  if (user) {
    ctx.throw(400, 'user with this mail already exists');
  };
    
  const hashedPass = bcrypt.hashSync(password, 15);
    
  const createdUser = await models.User.create({
    email,
    password: hashedPass,
  });
  
  ctx.status = 201;
  ctx.body = createdUser;
};

const signIn = async (ctx) => {
  const { email, password } = ctx.request.body;
  const user = await models.User.findOne({ where: { email } });
  
  if (!user) {
    ctx.throw(400, 'user with this mail do not exists');
  };
  
  const pass = bcrypt.compareSync(password, user.password);
  
  if (pass) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    
    const token = jwt.sign(payload, config.secret, {
      expiresIn: config.expired,
    });
    
    ctx.body = token;
  }
};

module.exports = {
  signUp,
  signIn
};