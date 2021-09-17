const express = require('express');

const router = express.Router();
const cors = require('cors');

const registerController = require('../controllers/register');
const signinController = require('../controllers/signin');
const screenshotsController = require('../controllers/screenshots');

require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

router.post('/register', registerController.handleRegister);
router.post('/signin', signinController.handleSignIn);
router.post('/screenshot', screenshotsController.handleScreenshots);

module.exports = router;
