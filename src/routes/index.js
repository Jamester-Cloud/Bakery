const express=require('express');
const router = express.Router();
const {isNotloggedIn} = require('../lib/auth');

router.get('/', isNotloggedIn,(reg,res) =>{
    res.render("../index");
})

module.exports=router;