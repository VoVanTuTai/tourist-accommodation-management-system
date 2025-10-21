const express = require('express');
const router = express.Router();
const loaiphongController = require('../controllers/loaiphongController');

router.get('/', loaiphongController.getLoaiPhongs);

module.exports = router;
