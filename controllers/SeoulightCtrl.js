'use strict';


const seoulightModel = require('../models/SeoulightModel');

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
        role : "SOUELITE"
      };
      await seoulightModel.reqSeoulight(data);
  
    } catch (error) {
      return next(error);
    }
  
    return res.r();
  };
  