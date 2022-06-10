require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const cors = require('@koa/cors');
const { catchErrors } = require('./middlewares/catchErrors');

const userRouter = require('./user/router');
const diagramRouter = require('./diagram/router');

const app = new Koa();
const router = new Router();

app.use(catchErrors);

router.get('/', async (ctx) => {
    ctx.body = 'OK';
});

app.use(bodyParser({
    multipart: true,
    urlencoded: true
}));
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.use(userRouter.routes());
app.use(diagramRouter.routes());

app.listen(process.env.PORT, () => {
    console.log(`Server has been started on port: ${process.env.PORT}`);
});