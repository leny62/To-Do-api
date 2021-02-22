import express from 'express';
import multer from 'multer';

const router = express.Router();
const userController = require('../controllers/user');
const SchemaValidator = require('../middlewares/SchemaValidator');

const validateRequest = SchemaValidator(true);

router.post('/signup', validateRequest, userController.signup);

module.exports = router;