'use strict';

const imageUtil = require('../ImageUtil');

const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');
const doboSTLECtrl = require('../controllers/DoboSLTECtrl');

module.exports = (router) => {

  // USER
  router.route('/users/signup')
    .post(imageUtil.uploadSingle, userCtrl.signup);

  router.route('/users/signin')
    .post(userCtrl.signin);
   
  router.route('/users/info')
    .put(authCtrl.auth,userCtrl.editUser);

  router.route('/users/avatar')
    .put(authCtrl.auth,userCtrl.editAvatar);

  router.route('/users/seoulight') //시민해설사 신청
    .post(authCtrl.auth,userCtrl.reqSeoulight);

  // DOBO WITH SEOULITE
  router.route('/dobo/seoulite')
    .post(authCtrl.auth, imageUtil.uploadArray, doboSTLECtrl.register);




  return router;
};