'use strict';

const {USER_ROLE} = require('../Constant');
const doboModel = require('../models/DoboModel');


/*
    리뷰 등록
    writed by 경인
*/
exports.addReview = async (req, res, next) => {

  try {

    const reqData = {
      user_idx: req.userIdx,
      dobo_idx: req.params.dobo_idx,
      content: req.body.content
    };

    await doboModel.addReview(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
};


/*
    리뷰 삭제
    writed by 경인
*/
exports.deleteReview = async (req, res, next) => {

  try {

    const reqData = {
      user_idx: req.userIdx,
      dobo_idx: req.params.dobo_idx,
    };

    await doboModel.deleteReview(reqData);

  } catch (error) {
    return next(error);
  }

  return res.r();
};

/*
    서울관광 전체 리스트 
    writed by 경인
*/
exports.getList = async (req, res, next) => {
  let result;
  try {

    const reqData = {
      category: req.params.category
    };


    if (!reqData.category) {
      return next(2401);  //카테고리 없으면 에러 
    }
    result = await doboModel.getList(reqData.category);

  } catch (error) {
    return next(error);
  }

  return res.r(result);
};

/*
  서울관광 글 상세보기
  writed by 경인
*/
exports.getDetail = async (req, res, next) => {
  let result= {};
  try {

    const reqData = {
      dobo_idx: req.params.dobo_idx,
      category: req.params.category          //쓰질않음 .. 경로 어떻게,,처리...
    };

    result = await doboModel.getDetail(reqData.dobo_idx);
    let review = await doboModel.getReview(reqData.dobo_idx);

    result[0].review = review;

  } catch (error) {
    return next(error);
  }
  // console.log(result +"aaaaaaaaaaa")
  // console.log(review)
  return res.r(result);
};

