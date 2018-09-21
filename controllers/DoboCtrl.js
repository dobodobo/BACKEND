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
  
  