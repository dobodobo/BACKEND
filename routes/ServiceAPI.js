'use strict';

const imageUtil = require('../ImageUtil');

const authCtrl = require('../controllers/AuthCtrl');
const userCtrl = require('../controllers/UserCtrl');
const doboSTLCtrl = require('../controllers/DoboSLTCtrl');
const doboCtrl = require('../controllers/DoboCtrl');

module.exports = (router) => {

  // USER
  router.route('/users/signup')
    .post(imageUtil.uploadSingle, userCtrl.signup);

  router.route('/users/signin')
    .post(userCtrl.signin);

  router.route('/users/pwd') //정보 수정
    .put(authCtrl.auth, userCtrl.editPwd);

  router.route('/users/avatar') //사진 수정
    .put(authCtrl.auth, imageUtil.uploadSingle, userCtrl.editAvatar);

  router.route('/seoulight/register') //시민해설사 신청
    .post(authCtrl.auth, userCtrl.reqSeoulight);

  router.route('/users/feedback') //건의사항 
    .post(authCtrl.auth, userCtrl.addFeedback);

  router.route('/users/mypage') //마이페이지
    .get(authCtrl.auth, userCtrl.getMypage);


  // DOBO WITH SLT

  router.route('/seoulite')
    .post(authCtrl.auth, imageUtil.uploadBGI, doboSTLCtrl.register);

  router.route('/seoulite/:category')
    .get(authCtrl.auth, doboSTLCtrl.getList);

  router.route('/seoulite/:dobo_idx/detail')
    .get(authCtrl.auth, doboSTLCtrl.getDetail);

  router.route('/seoulite/:dobo_idx/review')
    .post(authCtrl.auth, doboSTLCtrl.createReview);

  router.route('/seoulite/:dobo_idx/reserve')
    .post(authCtrl.auth, doboSTLCtrl.createReserve)
    .delete(authCtrl.auth, doboSTLCtrl.cancelReserve);


  // DOBO WITH SEOUL
  router.route('/seoul/:category')  //리스트
    .get(authCtrl.auth, doboCtrl.getList);

  router.route('/seoul/:dobo_idx/detail')  //상세보기
    .get(authCtrl.auth, doboCtrl.getDetail);

  router.route('/seoul/:dobo_idx/review')   //리뷰
    .post(authCtrl.auth, doboCtrl.addReview)
    .delete(authCtrl.auth, doboCtrl.deleteReview);

  return router;
};