const router = require('express').Router();
const employeeData = require('./routes');



router.route('/getUsers').get(employeeData.getData);
router.route('/create_user').post(employeeData.addData);

module.exports = router;