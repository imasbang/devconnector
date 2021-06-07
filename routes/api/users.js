const express = require('express');
const router = express.Router();
const app = express();
const {check, validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtsecret = config.get('jwtSecret');
const User = require('../../models/User');

// @Route POST /api/users
// @desc Register User
// @access Public

router.post('/', [
    check('name', 'Name is required.').trim().not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a valid password with 6 or more characters').isLength({min: 6}),
],  async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors);
        return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;

    try{

    
        // Check if user exists

        let user = await User.findOne({email});
        if(user){
        return res.status(400).json({errors: [{msg:'User already exists.'}]})
        }

        // Get users gravatar
        const avatar = gravatar.url(email, {s:'200', r:'pg', d:'mm'});

        user = new User({
            name: name,
            email: email,
            password: password,
            avatar: avatar
        });


        // Encrypt password using bcrypt

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save()
        // res.send('User registered');

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