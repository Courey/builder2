'use strict';

var traceur = require('traceur');
var Tree = traceur.require(__dirname + '/../models/tree.js');
var Mongo = require('mongodb');
var User = traceur.require(__dirname + '/../models/user.js');


exports.plant = (req, res)=>{
  Tree.plant(req.body.userId, tree=>{
    res.render('trees/tree', {tree:tree});
  });
};

exports.forest = (req, res)=>{
  Tree.findAllByUserId(req.query.userId, trees=>{
    res.render('trees/forest', {trees:trees});
  });
};

exports.grow = (req, res)=>{
  Tree.findByTreeId(req.params.treeID, tree=>{
    tree.grow();
    tree.save(()=>{
      res.render('trees/tree', {tree:tree});
    });
  });
};

exports.chop = (req, res)=>{
  Tree.findByTreeId(req.params.treeID, tree=>{
    var userId = Mongo.ObjectID(tree.userId);
    var wood = tree.height/2;
    tree.chop();
    User.findByUserId(userId, user=>{
      user.wood += wood;
      user.save(()=>{
        tree.save(()=>{
          res.render('trees/tree', {tree:tree, user:user}, (error, html)=>{
            var htmlAndUser = {html: html, user: user};
            console.log(htmlAndUser);
            res.send({html: html, user: user});
          });
        });
      });
    });
  });
};
