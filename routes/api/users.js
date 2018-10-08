const express = require('express');
const router = express.Router();

// @route GET /api/users/test
// @desc Test for users
// @access public
router.get('/test', (req,res)=>res.json({msg:"Users is OK"}));

module.exports = router;