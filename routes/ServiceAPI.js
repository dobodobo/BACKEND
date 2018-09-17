'use strict';

const userCtrl = require('../controllers/UserCtrl');

module.exports = (router) => {

  router.route('/users/signup')
    .post(userCtrl.signup);

  router.route('/users/signin')
    .post(userCtrl.signin);



  return router;
};