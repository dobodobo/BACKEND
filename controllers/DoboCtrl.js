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

    if(parseInt(reqData.category) === 7)
        result = await doboModel.getAllList();
    else
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
  let result ={};
  try {
    let temp, review;
    const reqData = {
      dobo_idx: req.params.dobo_idx
    };
    
    temp = await doboModel.getDetail(reqData.dobo_idx);
    temp.review = await doboModel.getReview(reqData.dobo_idx);
    const {idx, title, intro, content, image, category, cos_code } = temp;
    result.dobo =  {idx, title, intro, content, image };
    if(parseInt(category) === 5){
      result.dobo.cos_url = 'http://korean.visitseoul.net/walking-tour/%EC%8B%9C%EC%B2%AD%EA%B0%81-%EC%9E%A5%EC%95%A0%EC%9D%B8_/18262?curPage=3';
    }
    else{
    result.dobo.cos_url = 'http://dobo.visitseoul.net/web/_kr/webReservation/new_request_step1.do?cos_code=' + cos_code ;
    }
    result.review = temp.review;

    // result.dobo.tourlist =tourlist;
    result.dobo.course = temp.course.split(',');
    result.dobo.tourlist = temp.tourlist.split(',');

    result.dobo.course.map((data, id) => {
      const [name,category] = data.split('|');
      result.dobo.course[id] ={name,category};
    });
    result.dobo.tourlist.map((data, id) => {
      const [name,image] = data.split('|');
      result.dobo.tourlist[id] ={name,image};
    });
    // result.dobo.tourlist =temp.tourlist;

  } catch (error) {
    return next(error);
  }
  // console.log(result +"aaaaaaaaaaa")
  // console.log(review)
  return res.r(result);
};

