//function to take in user info nested in profile and return it unnested
//for pulling out of database
exports.setUserInfo = function setUserInfo(req) {
  const getUserInfo = {
    _id: req._id,
    firstName: req.profile.firstName,
    lastName: req.profile.lastName,
    email: req.email,
    role: req.role
  };
  return getUserInfo;
};

//function to take in unnested user info and return in nested in profile
//for updating in database
exports.updateUserInfo = function updateUserInfo(req) {
  const updateUser = {
    email: req.email,
    profile: {
      firstName: req.firstName,
      lastName: req.lastName,
    },
    role: req.role
  };
  return updateUser;
}
