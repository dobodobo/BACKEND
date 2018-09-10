'use strict';

const userModel = require('../models/UserModel');

exports.signup = async (req, res, next) => {

  let result;
  try {
    result = await userModel.signup();
  } catch (error) {
    return next(error);
  }

  return res.r(result);
};


exports.signin = async (req, res, next) => {

  let result;

  try {

    result = await userModel.signin();

  } catch (error) {
    return next(error);
  }

  return res.r(result);
};