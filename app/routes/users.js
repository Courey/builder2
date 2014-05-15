'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.login = (req, res)=>{
  User.login(req.body.userName, user =>{
    res.render('users/dashboard', {user:user});
  });
};

exports.tradeWood = (req, res)=>{
  var wood = req.body.wood;
  var userId = req.body.userId;

  User.findByUserId(userId, user=>{
    if(user.wood >= wood){
      user.wood -= wood;
      user.cash += wood/5;
      user.save(()=>{
        res.send({user:user});
      });
    }
  });

  console.log(req.body.wood);
};
