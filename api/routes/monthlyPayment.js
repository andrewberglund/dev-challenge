var express = require('express');
var router = express.Router();

/**
 * @swagger
 *
 * /calculateMonthlyPaymentAmount:
 *   post:
 *     description: Post total amount financed & monthly term to calculate monthly cost
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Amount Financed
 *         description: Total amount financed
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

    var error = false;
    var validCalculation = true;
    var errorMessage = '';
    var response = {};
  
    var result = Math.round((req.body.amountFinanced / req.body.term), 2);
  
    response = {
      result: result,
      error: error,
      errorMessage: errorMessage,
      validCalculation: validCalculation
    }

    res.json(response);
});

module.exports = router;
