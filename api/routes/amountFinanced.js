const express = require('express');
const router = express.Router();

/**
 * @swagger
 *
 * /calculateAmountFinanced:
 *   post:
 *     description: Post term & monthly cost for calculation of financed amount
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Monthly Payment
 *         description: Amount to pay per month
 *         in: formData
 *         required: true
 *         type: integer
 *       - name: Term in months
 *         description: Number of months in term
 *         in: formData
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Calculation complete.
 */

router.post('/', function(req, res, next) {
  let error = false;
  let validCalculation = true;
  let errorMessage = '';
  let response = {};

  const result = Math.round((req.body.monthly * req.body.term), 2);

  if (result > 100000 || result < 10000) {
    if(result > 100000) 
      errorMessage = 'Calculated amount is out of bounds. Please enter lower monthly payment.';
    else
      errorMessage = 'Calculated amount is out of bounds. Please enter higher monthly payment.';
    error = true;
    validCalculation = false;
  }

  response = {
    result: result,
    error: error,
    errorMessage: errorMessage,
    validCalculation: validCalculation
  }
  
  res.json(response)
});

module.exports = router;
