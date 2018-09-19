'use strict';


const config = require('../config/config');
const pool = config.pool;
const transactionWrapper = require('./TransactionWrapper');


/*
    시민해설사 신청
    writed by 경인
*/
exports.reqSeoulight = (sData) => {
    return new Promise((resolve, reject) => {
      transactionWrapper.getConnection(pool)
        .then(transactionWrapper.beginTransaction)
        .then(context => {
          return new Promise((resolve, reject) => {
  
            const sql =
              `
             INSERT INTO seoullight(name, birth, organization, portfolio, email, phone, intro, image, user_idx)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
             `;
  
            context.conn.query(sql, [sData.name, sData.birth, sData.organization, sData.portfolio, sData.email, sData.phone, sData.intro, sData.image, sData.user_idx], (err, rows) => {
              if (err) {
                reject(context);
              } else {
                resolve(context);
              }
            })
          })
  
        })
        .then(context => {
          return new Promise((resolve, reject) => {
            const sql =
              `
               UPDATE user
               SET role = ?
               WHERE idx = ?
              `
  
            context.conn.query(sql, [sData.role, sData.user_idx], (err, rows) => {
              if (err) {
                reject(context);
              } else {
                resolve(context);
              }
            });
          });
        })
        .then(transactionWrapper.commitTransaction)
        .then(context => {
          context.conn.release();
          resolve(context.result);
        })
        .catch(context => {
          context.conn.rollback(() => {
            context.conn.release();
            reject(context.error);
          })
        })
    })
  }

  /*
    시민해설사 신청
    writed by 경인
*/