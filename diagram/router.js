const Router = require('koa-router');
const diagramController = require('./controller');
const { authenticate } = require('../middlewares/authenticate'); 

const diagramRouter = new Router({ prefix: '/diagrams' });

diagramRouter.post('/api-key', authenticate, diagramController.createApiKey);
diagramRouter.patch('/api-key/:id', authenticate, diagramController.updateAPIKeyStatus);
diagramRouter.get('/api-key', authenticate, diagramController.retrieveAllAPIKeys);
diagramRouter.get('/api-key/active', authenticate, diagramController.retrieveActiveAPIKey);
diagramRouter.post('/upload-json', authenticate, diagramController.uploadDiagramInJSONFormat);
diagramRouter.get('/history', authenticate, diagramController.retrieveSavedDiagrams);
// diagramRouter.post('/sign-in', userController.signIn);

module.exports = diagramRouter;