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