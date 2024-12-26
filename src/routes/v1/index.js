const express = require('express');

const { InfoController } = require('../../controllers');
const userRouter = require('./user-routes');
const router = express.Router();
const { AuthRequestMiddlewares } = require('../../middlewares');

router.get('/info', AuthRequestMiddlewares.checkAuth, InfoController.info);

router.use('/user', userRouter)
module.exports = router;