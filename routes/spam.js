const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const transport = require('../plugins/mailtransporter');
const spamUserTemplate = require('../templates/spam/toAll.js');

//Model Imports
const User = require("../models/user");
const SpamUser = require("../models/spamUser");

var allowedOrigin = process.env.NODE_ENV == "production" ? process.env.FRONTENDURL : "http://localhost:8080";
var allowedHost = process.env.NODE_ENV == "production" ? process.env.SITE : "http://localhost:3000";

router.post('/user', function(req, res){
	if(req.headers.origin == allowedOrigin || req.headers.origin == allowedHost){
		User.findOne({ email: req.body.adminuseremail }, function(error, result){
			if(result){
				if(result.admin){
					bcrypt.compare(req.body.adminpass, result.password, function(err, synced){
						if(synced){
							User.findOne({ email: req.body.email }, function(error, result){
								if(result){
									const spamUser = new SpamUser({
										name: result.name,
										email: result.email,
										post: "User",
										flaggedby: req.body.adminuseremail,
										reason: req.body.message
									})
									spamUser.save(function(error, doc){
										if(error){
											res.status(200).send({ auth: true, registered: false, message: "Error Processing Request. Try Again Later" });
										} else {
											const message = {
												 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
												 to: req.body.email,
												 replyTo: process.env.REPLYTOMAIL,
												 subject: 'You Have Been Flagged',
												 html: spamUserTemplate(doc, req.body.adminuseremail, req.body.message)
											};
											transport.sendMail(message, function(err, info){
												if(err){
													console.log(err);
												} else {
													console.log(info);
												}
											})
											res.status(200).send({ auth: true, registered: true, message: 'User has Been Added to Spam User Database.'});
										}
									})
								} else {
									res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" })
								}
							})
						} else {
							res.status(200).send({ auth: false, registered: true, message: "Your Admin Password does Not Match with our Records" })
						}
					})
				} else {
					res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
				}
			} else {
				res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" })
			}
		})
	} else {
		res.status(200).send({auth: false, message: "Unauthorized"});
	}
})

router.post('/admin', function(req, res){
	if(req.headers.origin == allowedOrigin || req.headers.origin == allowedHost){
		User.findOne({ email: req.body.adminuseremail }, function(error, result){
			if(result){
				if(result.admin){
					if(result.superadmin){
						bcrypt.compare(req.body.adminpass, result.password, function(err, synced){
							if(synced){
								User.findOne({ email: req.body.email }, function(error, result){
									if(result){
										const spamUser = new SpamUser({
											name: result.name,
											email: result.email,
											post: "Admin",
											flaggedby: req.body.adminuseremail,
											reason: req.body.message
										})
										spamUser.save(function(error, doc){
											if(error){
												res.status(200).send({ auth: true, registered: false, message: "Error Processing Request. Try Again Later" });
											} else {
												const message = {
													 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
													 to: req.body.email,
													 replyTo: process.env.REPLYTOMAIL,
													 subject: 'You Have Been Flagged',
													 html: spamUserTemplate(doc, req.body.adminuseremail, req.body.message)
												};
												transport.sendMail(message, function(err, info){
													if(err){
														console.log(err);
													} else {
														console.log(info);
													}
												})
												res.status(200).send({ auth: true, registered: true, message: 'Admin has Been Added to Spam User Database.'});
											}
										})
									} else {
										res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" })
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: true, message: "Your Admin Password does Not Match with our Records" })
							}
						})
					} else {
						res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
					}
				} else {
					res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
				}
			} else {
				res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" })
			}
		})
	} else {
		res.status(200).send({auth: false, message: "Unauthorized"});
	}
})

router.post('/superadmin', function(req, res){
	if(req.headers.origin == allowedOrigin || req.headers.origin == allowedHost){
		User.findOne({ email: req.body.adminuseremail }, function(error, result){
			if(result){
				if(result.admin){
					if(result.superadmin){
						bcrypt.compare(req.body.adminpass, result.password, function(err, synced){
							if(synced){
								User.findOne({ email: req.body.email }, function(error, result){
									if(result){
										const spamUser = new SpamUser({
											name: result.name,
											email: result.email,
											post: "SuperAdmin",
											flaggedby: req.body.adminuseremail,
											reason: req.body.message
										})
										spamUser.save(function(error, doc){
											if(error){
												res.status(200).send({ auth: true, registered: false, message: "Error Processing Request. Try Again Later" });
											} else {
												const message = {
													 from: `"${process.env.FRONTENDSITENAME} - Support"<${process.env.EMAILID}>`,
													 to: req.body.email,
													 replyTo: process.env.REPLYTOMAIL,
													 subject: 'You Have Been Flagged',
													 html: spamUserTemplate(doc, req.body.adminuseremail, req.body.message)
												};
												transport.sendMail(message, function(err, info){
													if(err){
														console.log(err);
													} else {
														console.log(info);
													}
												})
												res.status(200).send({ auth: true, registered: true, message: 'Admin has Been Added to Spam User Database.'});
											}
										})
									} else {
										res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" })
									}
								})
							} else {
								res.status(200).send({ auth: false, registered: true, message: "Your Admin Password does Not Match with our Records" })
							}
						})
					} else {
						res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
					}
				} else {
					res.status(200).send({ auth: false, registered: true, message: "You are Unauthorized" })
				}
			} else {
				res.status(200).send({ auth: false, registered: false, message: "BAD REQUEST" })
			}
		})
	} else {
		res.status(200).send({auth: false, message: "Unauthorized"});
	}
})

router.use('/remove', require('./remove/spam'));

module.exports = router;
