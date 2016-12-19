const router = require('koa-router')();
const controllers = require('../controllers');

router.get('/video_main.html', controllers.page.videoMainHTML);

module.exports = router;
