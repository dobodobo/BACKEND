'use strict';

const {DOBO_STATUS} = require('../Constant');
const userModel = require('../models/UserModel');
const doboSTLEModel = require('../models/DoboSTLEModel');


exports.register = async(req, res, next) => {


  try {

    console.log(req.userIdx);
    const user = await userModel.getUserByIdx(req.userIdx);
    if (user.role !== 'SEOULITE') {
      return next(9402);
    }


    console.log(req.files);
    let images = [];
    req.files ? req.files.map(file => images.push(file.location)) : images.push(null);

    const reqData = {
      seoullight_idx: user.sIdx,
      title: req.body.title,
      content: req.body.content,
      min_people: req.body.min_people,
      max_people: req.body.max_people,
      category: req.body.category,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      due_date: req.body.due_date,
      status: DOBO_STATUS.WAITING
    };

    await doboSTLEModel.register(reqData, images);


  } catch (error) {
    return next(error);
  }


  return res.r();

};