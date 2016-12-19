const koa = require('koa');
const logger = require('koa-logger');
const static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const render = require('koa-ejs');
const path = require('path');

const config = require('./config');
const router = require('./router/index').routes();

const app = koa();

render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'html',
    cache: false,
    debug: true
})

app.use(static(__dirname + '/src'));
// app.use(favicon(__dirname + '/src/images/favicon.ico'));
app.use(bodyParser());
app.use(logger());

app.use(router);

app.listen(config.port, ()=> {
    console.log(`＊＊＊＊＊ live_video start ${config.port} ＊＊＊＊＊`);
});
