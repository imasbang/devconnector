const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');
const User = require('../../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const jwtsecret = config.get('jwtSecret');

// @Route GET /api/auth
// @desc Test Route
// @access Public

router.get('/',auth, async (req, res)=>{

    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);

    }
    catch(err){

        res.status(500).send({msg:'Server Error'});
    }
    
});

// Authenticate Existing Users

// @Route POST /api/auth
// @desc Authenticate user and get token
// @access Public

router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
],  async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try{

        
        // Check if user exists

        let user = await User.findOne({email});
        if(!user){
        return res.status(400).json({errors: [{msg:'Invalid Credentials'}]})
        }

        // Compare password

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
        return res.status(400).json({errors: [{msg:'Invalid Credentials'}]})
        }

        // Return JSON web token
        const payload = {
            user: {
                id:user.id 
            }
        }
        jwt.sign(payload, jwtsecret, 
            {expiresIn: '2h'}, (err, token)=>{
                if(err) throw err;
                else res.json({token});


            });


    }

    catch(err){

        console.log(err.message);
        res.status(500).send('Server Error');
    }

});

module.exports = router;