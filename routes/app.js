const express = require('express');

const router = express.Router();

const registerController = require('../controllers/register');
const signinController = require('../controllers/signin');
const screenshotsController = require('../controllers/screenshots');

require('dotenv').config();

router.post('/register', registerController.handleRegister);
router.post('/signin', signinController.handleSignIn);
router.post('/screenshot', screenshotsController.handleScreenshots);

module.exports = router;
