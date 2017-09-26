const AuthenticationController = require ('./controllers/authentication'),
      UserController = require ('./controllers/user'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport');

//middleware to require login/authentication
const requireAuth = passport.authenticate('jwt', {session: false}); //use require auth for routes that require a user to be authorized/logged in
const requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app) {
  //Initializing route groups
  const apiRoutes = express.Router(),
        authRoutes = express.Router(),
        userRoutes = express.Router();

  //=====================
  // Auth routes
  //=====================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  //Registration route
  authRoutes.post('/register', AuthenticationController.register);

  //Login route
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  //=====================
  // User routes
  //=====================

  //set users routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/users', userRoutes);

  //view a single user profile route
  userRoutes.get('/:userId', requireAuth, UserController.viewUser);

  //view all users route - requires admin auth
  userRoutes.get('', requireAuth, AuthenticationController.roleAuthorization("Admin"), UserController.viewUsers);

  //update a single user profile
  userRoutes.put('/:userId', requireAuth, UserController.updateUser);

  //delete a user
  userRoutes.delete('/:userId', requireAuth, AuthenticationController.roleAuthorization("Admin"), UserController.deleteUser);


  //=====================
  // Test/debugging routes
  //=====================

  //test protected route (i.e., a route that requires JWT token auth)
  apiRoutes.get('/protected', requireAuth, (req, res) => {
    res.send({content: 'The protected route is working as expected.' });
  });

  //test admin route (i.e., a route that requires both JWT token auth and an admin user)
  apiRoutes.get('/admins-only', requireAuth, AuthenticationController.roleAuthorization("Admin"), (req, res) => {
    res.send ({content: 'Admin dashboard is working'});
  });

  //test client route (i.e., a route that requires both JWT token auth and client user)
  apiRoutes.get('/clients-only', requireAuth, AuthenticationController.roleAuthorization("Client"), (req, res) => {
    res.send ({content: 'Client dashboard is working'});
  });

  //Set url for API group routes
  app.use('/api', apiRoutes);


};
