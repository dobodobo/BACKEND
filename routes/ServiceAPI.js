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



  // DOBO WITH SEOULITE
  router.route('/seoulite')
    .get(authCtrl.auth, doboSTLECtrl.getList)
    .post(authCtrl.auth, imageUtil.uploadFields, doboSTLECtrl.register);

  router.route('/seoulite/:dobo_idx/review')
    .post(authCtrl.auth, doboSTLECtrl.createReview);



  return router;
};