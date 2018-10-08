const express = require('express');
const router = express.Router();

// @route GET /api/posts/test
// @desc Test for posts
// @access public
router.get('/test', (req,res)=>res.json({msg:"Posts is OK"}));

module.exports = router;