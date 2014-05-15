'use strict';
//var traceur = require('traceur');
var trees = global.nss.db.collection('trees');
//var users = global.nss.db.collection('users');
//var User = traceur.require(__dirname + '/../models/user.js');
var Mongo = require('mongodb');
var _ = require('lodash');
class Tree{
  constructor(userId){
    this.userId = userId;
    this.height = 0;
    this.isHealthy = true;
    this.isChopped = false;
  }

  save(func){
    trees.save(this, ()=>func());
  }

  chop(){
    this.isChopped = true;
  }

  grow(){
    this.height += _.random(0, 2);
    this.isHealthy = _.random(0, 200) !== 42;
  }

  getClasses(){
    var classes = [];
    if(this.height === 0){
      classes.push('seed');
    }else if(this.height < 12){
      classes.push('sapling');
    }else if(this.height < 24){
      classes.push('treenager');
    }else{
      classes.push('adult');
    }

    if(!this.isHealthy){
      classes.push('dead');
    }

    if(this.isChopped){
      classes.push('chopped');
    }
    return classes.join(' ');
  }// end getClasses

  static plant(userId, fn){
    userId = Mongo.ObjectID(userId);
    var tree = new Tree(userId);
    trees.save(tree, ()=>fn(tree));
  }

  static findAllByUserId(userId, func){
    userId = Mongo.ObjectID(userId);
    trees.find({userId: userId}).toArray((error, objects)=>{
      //we want to turn just plain objects back into trees
      //we're going to use the lodash create method to do this
      //first param of create is the prototype you want it to have
      //second param is the data you want assigned.
      var forest = objects.map(object=> _.create(Tree.prototype, object));
      func(forest);
    });
  }

  static findByTreeId(treeID, callback){
    treeID = Mongo.ObjectID(treeID);
    trees.findOne({_id: treeID}, (error, tree)=>{
      tree = _.create(Tree.prototype, tree);
      callback(tree);
    });
  }



}// end Tree

module.exports = Tree;
