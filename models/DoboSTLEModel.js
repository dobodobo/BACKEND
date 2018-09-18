'use strict';


const config = require('../config/config');
const pool = config.pool;

const transactionWrapper = require('./TransactionWrapper');


// exports.register = (data) => {
//   return new Promise((resolve, reject) => {
//     // const sql = `INSERT INTO citizen_dobo(title, content, min_people, max_people, category, start_date, end_date, due_date, status, seoullite_idx)`;
//     const sql =
//       `
//       INSERT INTO citizen_dobo SET ?;
//       `;
//
//     pool.query(sql, [data], (err, rows) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(rows);
//       }
//     })
//   })
//     .then((result) => {
//       return new Promise((resolve,reject) => {
//
//       })
//     })
// };

exports.register = (data, images) => {

  let insertedIdx;
  return new Promise((resolve, reject) => {
    transactionWrapper.getConnection(pool)
      .then(transactionWrapper.beginTransaction)
      .then(context => {
        return new Promise((resolve, reject) => {
          const sql =
            `
            INSERT INTO citizen_dobo SET ?;
            `;

          context.conn.query(sql, [data], (err, rows) => {
            if (err) {
              context.errror = err;
              reject(context)
            } else {
              if (rows.affectedRows === 1) { // 쓰기 시도 성공
                insertedIdx = rows.insertId;
                context.result = rows;
                resolve(context);
              }
            }
          })
        })
      })
      .then(context => {
        return new Promise((resolve, reject) => {
          let imageArr = [];
          for (let i = 0; i < images.length; i++) {
            imageArr[i] = [insertedIdx];
            imageArr[i].push(images[i]);
          }
          const sql =
            `
            INSERT INTO citizen_image(citizen_dobo_idx, image)
            VALUES ?;
            `;

          context.conn.query(sql, [imageArr], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows === images.length) {
                context.result = rows;
                resolve(context);
              } else {
                context.error = new Error("CUSTOM ERROR IN INSERT DOBO IMAGE");
                reject(context);
              }
            }
          })
        })
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
};