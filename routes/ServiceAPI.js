'use strict';

const imageUtil = require('../ImageUtil');

const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');
const seoulightCtrl = require('../controllers/SeoulightCtrl');
const doboSTLCtrl = require('../controllers/DoboSLTCtrl');

module.exports = (router) => {

  // USER
  router.route('/users/signup')
    .post(imageUtil.uploadSingle, userCtrl.signup);

  router.route('/users/signin')
    .post(userCtrl.signin);
   
  router.route('/users/pwd') //정보 수정
    .put(authCtrl.auth,userCtrl.editPwd);

  router.route('/users/avatar') //사진 수정
    .put(authCtrl.auth, imageUtil.uploadSingle, userCtrl.editAvatar);

  router.route('/seoulight/register') //시민해설사 신청
    .post(authCtrl.auth, seoulightCtrl.reqSeoulight);

  router.route('/users/feedback') //건의사항 
  .post(authCtrl.auth,userCtrl.addFeedback);

  // DOBO WITH SLT
  router.route('/seoulite')
    .get(authCtrl.auth, doboSTLCtrl.getList)
    .post(authCtrl.auth, imageUtil.uploadFields, doboSTLCtrl.register);

  router.route('/seoulite/:dobo_idx')
    .get(authCtrl.auth, doboSTLCtrl.getDetail);

  router.route('/seoulite/:dobo_idx/review')
    .post(authCtrl.auth, doboSTLCtrl.createReview);

  router.route('/seoulite/:dobo_idx/reserve')
    .post(authCtrl.auth, doboSTLCtrl.createReserve)
    .delete(authCtrl.auth, doboSTLCtrl.cancelReserve);



  return router;
};