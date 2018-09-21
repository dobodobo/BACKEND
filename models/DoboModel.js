'use strict';


const config = require('../config/config');
const pool = config.pool;

const transactionWrapper = require('./TransactionWrapper');
const {DOBO_STATUS} = require('../Constant');




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
  
  



function escapeSansQuotes(connection, criterion) {
  return connection.escape(criterion).match(/^'(\w+)'$/)[1];
}

exports.getListByCount = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT 
        cd.idx,
        cd.min_people,
        cd.max_people,
        cd.title,
        cd.content,
        cd.category,
        cd.due_date,
        cd.status,
        cd.image,
        cd.lang,
        COUNT(cr.citizen_dobo_idx) AS count
      FROM citizen_dobo AS cd
             LEFT JOIN citizen_review cr on cd.idx = cr.citizen_dobo_idx
      GROUP BY cd.idx
      ORDER BY count DESC, cd.idx DESC ;
      `;

    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};

exports.getListByDue = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT 
        cd.idx,
        cd.min_people,
        cd.max_people,
        cd.title,
        cd.content,
        cd.category,
        cd.due_date,
        cd.status,
        cd.image,
        cd.lang,
        COUNT(cr.citizen_dobo_idx) AS count
      FROM citizen_dobo AS cd
             LEFT JOIN citizen_review cr on cd.idx = cr.citizen_dobo_idx
      GROUP BY cd.idx
      ORDER BY cd.due_date DESC, cd.idx DESC ;
      `;

    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};



exports.getDetail = (idx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT
       cd.idx,
       cd.title,
       cd.content,
       cd.min_people,
       cd.max_people,
       cd.category,
       cd.lang,
       DATE_FORMAT(cd.start_date, '%Y.%m.%d') AS start_date,
       DATE_FORMAT(cd.end_date, '%Y.%m.%d') AS end_date,
       DATE_FORMAT(cd.due_date, '%Y.%m.%d') AS due_date,
       cd.status,
       GROUP_CONCAT(DISTINCT cc.name, '|', cc.category) AS course,
       GROUP_CONCAT(DISTINCT ci.image) AS bgi,
       GROUP_CONCAT(DISTINCT ct.name, '|', ct.image) AS tourlist,
       s.idx AS seoulite_idx,
       s.name,
       u.idx AS user_idx,
       u.avatar,
       DATE_FORMAT(s.birth, '%Y.%m.%d'),
       s.intro,
       s.email
      FROM citizen_dobo AS cd
             LEFT JOIN citizen_course cc on cd.idx = cc.citizen_dobo_idx
             LEFT JOIN citizen_image ci on cd.idx = ci.citizen_dobo_idx
             LEFT JOIN citizen_tourlist ct on cd.idx = ct.citizen_dobo_idx
             LEFT JOIN seoullight s ON cd.seoullight_idx = s.idx
             LEFT JOIN user u on s.user_idx = u.idx
      WHERE cd.idx = ?;
      `;

    pool.query(sql, idx, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};

exports.getReviewByDoboIdx = (doboIdx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT cr.idx, cr.content, DATE_FORMAT(cr.created, '%Y.%m.%d') AS created, u.idx as uIdx, u.nick
      FROM citizen_review cr
      LEFT JOIN user u on cr.user_idx = u.idx
      WHERE citizen_dobo_idx = ?;
      `;

    pool.query(sql, [doboIdx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};

