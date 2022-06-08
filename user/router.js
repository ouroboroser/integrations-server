const Router = require('koa-router');
const userController = require('./controller');

const userRouter = new Router({ prefix: '/users' });

userRouter.post('/sign-up', userController.signUp);
userRouter.post('/sign-in', userController.signIn);

module.exports = userRouter;