const Router = require('koa-router');
const diagramController = require('./controller');
const { authenticate } = require('../middlewares/authenticate'); 

const diagramRouter = new Router({ prefix: '/diagrams' });

diagramRouter.post('/api-key', authenticate, diagramController.createApiKey);
// diagramRouter.post('/sign-in', userController.signIn);

module.exports = diagramRouter;