const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
router.get('/login', userController.getLogin)

router.post('/login', userController.postLogin);

router.get('/register', userController.getRegister);

router.post('/register', userController.postRegister);

module.exports = router;