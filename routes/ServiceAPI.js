'use strict';

const userCtrl = require('../controllers/UserCtrl');

module.exports = (router) => {

  router.route('/signup')
    .post(userCtrl.signup);

  router.route('/signin')
    .post(userCtrl.signin);



  return router;
};