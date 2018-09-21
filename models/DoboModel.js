'use strict';

const config = require('../config/config');
const pool = config.pool;

const transactionWrapper = require('./TransactionWrapper');
const { DOBO_STATUS } = require('../Constant');


/*
    리뷰 등록
    writed by 경인
*/
exports.addReview = (data) => {
    return new Promise((resolve, reject) => {
      const sql =
        `
        INSERT INTO seoul_review(user_idx,seoul_dobo_idx, content)
        VALUES(?,?,?);
        `;
      pool.query(sql, [data.user_idx, data.dobo_idx, data.content], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    });
  };

  /*
      리뷰 삭제
      writed by 경인
  */
  exports.deleteReview = (data) => {
      return new Promise((resolve, reject) => {
        const sql =
          `
          DELETE FROM seoul_review
          WHERE user_idx = ? AND seoul_dobo_idx = ?
          `;
        pool.query(sql, [data.user_idx, data.dobo_idx], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        })
      });
    };
  
/*
    서울관광 전체 리스트 
    writed by 경인
*/
exports.getList = (category) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT idx, title, intro, image
      FROM seoul_dobo 
      WHERE category = ?
      `;

    pool.query(sql, [category], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};
 
/*
    서울관광 글 상세페이지
    writed by 경인
*/
exports.getDetail= (idx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT
       sd.idx,
       sd.title,
       sd.intro,
       sd.content,
       sd.image,
       GROUP_CONCAT(DISTINCT sc.name, '|', sc.category) AS course,
       GROUP_CONCAT(DISTINCT si.image) AS bgi,
       GROUP_CONCAT(DISTINCT st.name, '|', st.image) AS tourlist
      FROM seoul_dobo AS sd
             LEFT JOIN seoul_course sc on sd.idx = sc.seoul_dobo_idx
             LEFT JOIN seoul_image si on sd.idx = sc.seoul_dobo_idx
             LEFT JOIN seoul_tourlist st on sd.idx = st.seoul_dobo_idx
      WHERE sd.idx = ?;
      `;

    pool.query(sql, [idx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};

