'use strict';
var Mongo = require('mongodb');
var _ = require('lodash');

var users = global.nss.db.collection('users');

class User{

  constructor(userName){
    this.userName = userName;
    this.wood = 0;
    this.cash = 0;
  }

  save(func){
    users.save(this, ()=>func());
    //res.render('trees/tree', {tree:tree});
  }

  static login(userName, func){
     userName = userName.trim().toLowerCase();
     users.findOne({userName: userName}, (error, userData)=>{
      if(userData){
        func(userData);
      }
      else{
        userData = new User(userName);
        users.save(userData, ()=>{
          func(userData);
        });
      }
    });
  }

  static findByUserId(userID, callback){
    userID = Mongo.ObjectID(userID);
    users.findOne({_id: userID}, (error, user)=>{
      user = _.create(User.prototype, user);
      callback(user);
    });
  }

}// end User

module.exports = User;
