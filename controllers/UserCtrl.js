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
    비밀번호 수정
    Writed By 정경인
*/
exports.editPwd = async (req, res, next) => {


  try {
    const secretData = config.doCipher(req.body.pwd);

    const reqData = {
      idx: req.userIdx,
      pwd : secretData.pw,
      salt : secretData._salt
    };

    await userModel.editPwd(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
}
/*
    프로필 사진 수정                              //미 완 성 !!!!!!!!! 
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
}

/*
    건의사항 등록
    Writed By 정경인
*/
exports.addFeedback = async (req, res, next) => {


  try {

    const reqData = {
      title: req.body.title,
      content : req.body.content,
      user_idx: req.userIdx
    };

    await userModel.addFeedback(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
}