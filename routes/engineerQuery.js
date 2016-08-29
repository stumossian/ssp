var mongoose = require('mongoose');
var Product = mongoose.model('Product');
var User = mongoose.model('User');
var Equipment = mongoose.model('Equipment');
var ServiceOrder = mongoose.model('ServiceOrder');
var ProblemType = mongoose.model('ProblemType');
var PMType = mongoose.model('PMType');
var Priority = mongoose.model('Priority');
var Status = mongoose.model('Status');
var _ = require('underscore');
var async = require('async');

exports.getData = function(req, res){
  var workoffers = [];
  var workassigned = [];
  console.log("==Engineer Queries==");
  async.parallel([
    function(callback){
      ServiceOrder.find({CloseDate: {$exists: false} })
        .where('CurrentStatus').equals('Assigned, Waiting to be Accepted')
        // .populate('_CreatedBy')
        .populate('_Product')
        .populate('Priority')
        .populate('_Equipment')
        .populate('User')
          //.select('_id SerialNumber OpenDate ProblemTypeDescription ProductName CurrentStatus')
          .exec(function (err, serviceorders){
            serviceorders.forEach(function(yours){
              workoffers.push({
                "_id": yours._id,
                "CustomerContactInfo": yours.CustomerContactInfo,
                "ProductName": yours._Product.ProductName,
                "SerialNumber": yours._Equipment.SerialNumber,
                "Location": yours._Equipment.Room,
                //***CHANGE: Added more Equipment Queries
                "ProblemTypeDescription": yours.ProblemTypeDescription,
                "PriorityDescription": yours.PriorityDescription,
                "CurrentStatus": yours.CurrentStatus,
                "Name": yours.CustomerContactInfo.Name
              });
            });
            callback();
          });
        },
        function(callback){
          ServiceOrder.find({CloseDate: {$exists: false} })
            .where('CurrentStatus').equals('Accepted')
            // .populate('_CreatedBy')
            .populate('_Product')
            .populate('Priority')
            .populate('_Equipment')
            .populate('User')
              //.select('_id SerialNumber OpenDate ProblemTypeDescription ProductName CurrentStatus')
              .exec(function (err, serviceorders){
                serviceorders.forEach(function(mine){
                  workassigned.push({
                    "_id": mine._id,
                    "CustomerContactInfo": mine.CustomerContactInfo,
                    "ProductName": mine._Product.ProductName,
                    "SerialNumber": mine._Equipment.SerialNumber,
                    "Location": mine._Equipment.Room,
                    //***CHANGE: Added more Equipment Queries
                    "ProblemTypeDescription": mine.ProblemTypeDescription,
                    "PriorityDescription": mine.PriorityDescription,
                    "CurrentStatus": mine.CurrentStatus,
                    "Name": mine.CustomerContactInfo.Name
                  });
                });
                callback();
              });
            }], function(err){
                if (err)return next(err);
                if (req.session.user.RoleName === "Customer")
                  res.render('customer',
                        { equipment: workoffers,
                          products:  workassigned,
                          firstname: req.session.user.FirstName});
                else if (req.session.user.RoleName === "Onsite Engineer")
                console.log("-----Work Offers");
                console.log(workoffers);
                console.log("-------------Assigned Work");
                console.log(workassigned);
                res.render('engineer',
                      { WorkOffers: workoffers,
                        WorkAssigned:  workassigned,
                         firstname: req.session.user.FirstName});
              }
            );
        };
//Render queires for work offer modal
exports.getWorkOfferModal = function(req, res){
  var workoffers = [];
      ServiceOrder.find({CloseDate: {$exists: false} })
        .where('CurrentStatus').equals('Assigned, Waiting to be Accepted')
        // .populate('_CreatedBy')
        .populate('_Product')
        .populate('Priority')
        .populate('_Equipment')
        .populate('User')
          //.select('_id SerialNumber OpenDate ProblemTypeDescription ProductName CurrentStatus')
          .exec(function (err, serviceorders){
            serviceorders.forEach(function(yours){
              workoffers.push({
                "_id": yours._id,
                "CustomerContactInfo": yours.CustomerContactInfo,
                "ProductName": yours._Product.ProductName,
                "SerialNumber": yours._Equipment.SerialNumber,
                "Location": yours._Equipment.Room,
                "ID": yours._Equipment._id,
                "ProblemNotes": yours.ProblemNotes,
                //***CHANGE: Added more Equipment Queries
                "ProblemTypeDescription": yours.ProblemTypeDescription,
                "PriorityDescription": yours.PriorityDescription,
                "CurrentStatus": yours.CurrentStatus
              });
            });
          });
<<<<<<< HEAD
        },
        function(callback){
          ServiceOrder.find({CloseDate: {$exists: false} })
            .where('CurrentStatus').equals('Accepted')
            // .populate('_CreatedBy')
            .populate('_Product')
            .populate('Priority')
            .populate('_Equipment')
            .populate('User')
              //.select('_id SerialNumber OpenDate ProblemTypeDescription ProductName CurrentStatus')
              .exec(function (err, serviceorders){
                serviceorders.forEach(function(mine){
                  workassigned.push({
                    "_id": mine._id,
                    "CustomerContactInfo": mine.CustomerContactInfo ,
                    "ProductName": mine._Product.ProductName,
                    "SerialNumber": mine._Equipment.SerialNumber,
                    "Location": mine._Equipment.Room,
                    "ID": mine._Equipment._id,
                    //***CHANGE: Added more Equipment Queries
                    "ProblemTypeDescription": mine.ProblemTypeDescription,
                    "PriorityDescription": mine.PriorityDescription,
                    "CurrentStatus": mine.CurrentStatus
                  });
                });
                callback();
              });
            }], function(err){
                if (err)return next(err);
                res.render('workOfferModal_test',
                      { WorkOffers: workoffers,
                        WorkAssigned:  workassigned,
                        firstname: req.session.user.FirstName});
              }
            );
=======
          res.render('workOfferModal',
                { WorkOffers: workoffers,
                  firstname: req.session.user.FirstName});
>>>>>>> 44f7bd6c3e157efff4e353e0dfecd64abce3b6a8
        };

  exports.getWorkAssModal = function(req, res){
    res.render('workAssModal',
      { firstname: req.session.user.FirstName,
        reqid: req.query.reqid,
        reqprd: req.query.prd,
        reqpd: req.query.pd,
        reqstatus: req.query.status,
        reqname: req.query.name
      });
    };

  exports.postWorkAssModal = function(req, res){
    console.log(req.body.reqid);
    ServiceOrder.findOne({ _id: req.body.reqid})
    .exec(function(err, so) {
       so.CurrentStatus = req.body.Status;
       so.save(function (err,so){
       });
    });
    res.redirect('/engineer');
  };

  exports.getWorkOffModal = function(req, res){
    res.render('workOffModal',
      { firstname: req.session.user.FirstName,
        reqid: req.query.reqid,
        reqprd: req.query.prd,
        reqpd: req.query.pd,
        reqstatus: req.query.status,
        reqname: req.query.name
      });
    };

  exports.postWorkOffModal = function(req, res){
    console.log(req.body.reqid);
    ServiceOrder.findOne({ _id: req.body.reqid})
    .exec(function(err, so) {
       so.CurrentStatus = req.body.Status;
       so.save(function (err,so){
       });
    });
    res.redirect('/engineer');
  };
