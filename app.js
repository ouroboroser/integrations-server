require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-body');
const cors = require('@koa/cors');
const models = require('./models');

const app = new Koa();
const router = new Router();

const userRouter = require('./user/router');

router.get('/', async (ctx) => {
    ctx.body = 'OK';
});

app.use(bodyParser());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.use(userRouter.routes());

// models.sequelize.sync({forse:true}).then(function () {
//     try {
//         app.listen(1111, () => {
//             console.log('Server has been stared');
//         });
//     }

//     catch (e) {
//         console.log(e)
//     };
// })

app.listen(process.env.PORT, () => {
    console.log(`Server has been started on port: ${process.env.PORT}`);
});