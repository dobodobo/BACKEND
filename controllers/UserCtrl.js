'use strict';

const config = require('../config/config');
const {USER_ROLE} = require('../Constant');
const userModel = require('../models/UserModel');

exports.signup = async (req, res, next) => {

  try {

    // 가입시 Email 중복 체크
    await userModel.checkEmail(req.body.email);

    const secretData = config.doCipher(req.body.pwd);

    const reqData = {
      email: req.body.email,
      pwd: secretData.pw,
      salt: secretData._salt,
      nick: req.body.nick,
      avatar: req.file ? req.file.location : null
    };

    await userModel.signup(reqData);


  } catch (error) {
    return next(error);
  }

  return res.r();
};


exports.signin = async (req, res, next) => {

  let result;

  try {

    const salt = await userModel.getSalt(req.body.email);


    const userData = {
      email: req.body.email,
      pwd: config.doCipher(req.body.pwd, salt).pw
    };

    result = await userModel.signin(userData);

  } catch (error) {
    return next(error);
  }

  return res.r(result);
};

/*
    비밀번호 수정
    Writed By 정경인
*/
exports.editPwd = async (req, res, next) => {


  try {
    const secretData = config.doCipher(req.body.pwd);

    const reqData = {
      idx: req.userIdx,
      pwd: secretData.pw,
      salt: secretData._salt
    };

    await userModel.editPwd(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
};
/*
    프로필 사진 수정     
    Writed By 정경인
*/
exports.editAvatar = async (req, res, next) => {


  try {

    // console.log(req)
    const reqData = {
      idx: req.userIdx,
      avatar: req.file.location
    };

    await userModel.editAvatar(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
};

/*
    건의사항 등록
    Writed By 정경인
*/
exports.addFeedback = async (req, res, next) => {


  try {

    const reqData = {
      title: req.body.title,
      content: req.body.content,
      user_idx: req.userIdx
    };

    await userModel.addFeedback(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
};


/*
    마이페이지 
    writed by 경인
*/
exports.getMypage = async (req, res, next) => {
  let reqData;
  try {


    const user = await userModel.getUserByIdx(req.userIdx);
    const askTourList = await userModel.getAskingList(req.userIdx);
    const madeTourList = (user.role === USER_ROLE.SEOULITE) ? await userModel.getMadeList(user.sIdx) : [];   //유저: null ,해설사 : 배열
    reqData = {
      email: user.email,
      nick: user.nick,
      avatar: user.avatar,
      role: user.role,
      askTourList: askTourList,
      madeTourList: madeTourList
    };


  } catch (error) {
    return next(error);
  }

  return res.r(reqData);
};

/*
    시민해설사 신청
    writed by 경인
*/
exports.reqSeoulight = async (req, res, next) => {

  try {

    const data = {
      name: req.body.name,
      birth: req.body.birth,
      oranization: req.body.oranization,
      portfolio: req.body.portfolio,
      email: req.body.email,
      phone: req.body.phone,
      intro: req.body.intro,
      user_idx: req.userIdx,
      role: USER_ROLE.SEOULITE
    };
    await userModel.reqSeoulight(data);

  } catch (error) {
    return next(error);
  }

  return res.r();
};
  