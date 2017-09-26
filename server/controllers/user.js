const User = require('../models/user');
const setUserInfo = require('../helpers').setUserInfo;
const updateUserInfo = require('../helpers').updateUserInfo;

//=============================
// User Routes
//=============================

//view a user profile
//must have permission to view the profile (either your own profile or an admin can view all)
exports.viewUser = function (req, res, next) {
  const userId = req.params.userId;

  if(req.user.role.toString() !== "Admin" && req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'You are not authorized to view that user profile.'});
  }

  User.findById(userId, (err, user) => {
    if(err) {
      res.status(400).json({error: 'No user could be found for this ID.' });
      return next(err);
    }

    const userToReturn = setUserInfo(user);

    return res.status(200).json({ user: userToReturn });
  });
};

//get all users - requires admin auth
exports.viewUsers = function (req, res, next) {

  //double check that the user is an admin
  if(req.user.role.toString() !== "Admin") {
    return res.status(401).json({ error: 'You are not authorized to view this data.'});
  }

  User.find({}, (err, users) => {
    if(err) {
      res.status(400).json({error: 'No users could be found.' });
      return next(err);
    }

    const usersToReturn = [];
    users.forEach(function (user) {
      usersToReturn.push(setUserInfo(user));
    });

    return res.status(200).json({ users: usersToReturn });
  });
};

//update a user profile
//admins can update any profile
exports.updateUser = function (req, res, next) {
  const userId = req.params.userId;

  //first we check that the user has permission
  if(req.user.role.toString() !== "Admin" && req.user._id.toString() !== userId) {
    return res.status(401).json({ error: 'You are not authorized to view that user profile.'});
  }

  const updateUser = updateUserInfo(req.body);

  User.findOneAndUpdate({_id: userId}, updateUser, {new: true}, (err, user) => {
		if(err) {
      res.status(400).json({error: 'No user could be found for this ID.' });
      return next(err);
    }
    const userToReturn = setUserInfo(user);
		return res.status(200).json({ user: userToReturn });
	});
};

//delete user
//only admin can delete any profile
exports.deleteUser = function(req, res) {
  const userId = req.params.userId;

  //first we check that the user has permission
  if(req.user.role.toString() !== "Admin") {
    return res.status(401).json({ error: 'You are not authorized to delete users.'});
  }

	User.remove({_id: userId }, (err, task) => {
		if(err) {
        res.status(400).json({error: 'No user could be found for this ID.' });
        return next(err);
    }
	  return res.status(200).json({ content: "User successfully deleted." });
	});
};
