const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.get('/check-banking', paymentController.checkBankingPayment);

module.exports = router;