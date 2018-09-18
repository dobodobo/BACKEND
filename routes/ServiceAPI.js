'use strict';

const userCtrl = require('../controllers/UserCtrl');

module.exports = (router) => {

  router.route('/users/signup')
    .post(userCtrl.signup);

  router.route('/users/signin')
    .post(userCtrl.signin);
   
  router.route('/users/info')
    .put(userCtrl.editUser);

  router.route('/users/avatar')
    .put(userCtrl.editAvatar);

  router.route('/users/seoulight') //시민해설사 신청
    .post(userCtrl.reqSeoulight);


   return router;

};