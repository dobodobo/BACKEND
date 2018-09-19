'use strict';

const seoulightModel = require('../models/SeoulightModel');

const {USER_ROLE} = require('../Constant');

exports.reqSeoulight = async (req, res, next) => {

    try {
  
      const data = {
        name: req.body.name,
        birth: req.body.birth,
        organization: req.body.organization,
        portfolio: req.body.portfolio,
        email: req.body.email,
        phone: req.body.phone,
        intro: req.body.intro,
        user_idx: req.userIdx,
        role : USER_ROLE.SEOULITE
      };
      await seoulightModel.reqSeoulight(data);
  
    } catch (error) {
      return next(error);
    }
  
    return res.r();
  };
  