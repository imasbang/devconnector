const express = require('express');
const router = express.Router();

// @Route GET /api/users
// @desc Test Route
// @access Public

router.get('/', (req, res)=>{

    res.send('user route');

});

module.exports = router;