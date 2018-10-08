const express = require('express');
const router = express.Router();

// @route GET /api/profile/test
// @desc Test for profile
// @access public
router.get('/test', (req,res)=>res.json({msg:"Profile is OK"}));

module.exports = router;