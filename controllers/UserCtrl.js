'use strict';

const config = require('../config/config');

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
    회원 정보 수정
    Writed By 정경인
*/
exports.editUser = async (req, res, next) => {


  try {
    const secretData = config.doCipher(req.body.pwd);

    const reqData = {
      idx: req.userIdx,
      pwd : secretData.pw,
      salt : secretData._salt,
      nick : req.body.nick
    };

    await userModel.editUser(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
}
/*
    프로필 사진 수정
    Writed By 정경인
*/
exports.editAvatar = async (req, res, next) => {


  try {

    const reqData = {
      idx: req.userIdx,
      avatar: req.file 
    };

    await userModel.editAvatar(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
}
/*
    시민 해설사 신청
    Writed By 정경인
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
      user_idx: req.userIdx
    };
      // 어떻게 처리해야할지 모르겠음 ----------트랜잭션 처리 해야하나? -경인-
    await userModel.reqSeoulight(data);
    await userModel.editRole(data.user_idx);

  } catch (error) {
    return next(error);
  }

  return res.r();
};