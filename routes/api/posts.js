const express = require('express');
const router = express.Router();

// @Route GET /api/posts
// @desc Test Route
// @access Public

router.get('/', (req, res)=>{

    res.send('posts route');

});

module.exports = router;