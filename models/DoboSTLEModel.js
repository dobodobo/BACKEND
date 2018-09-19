'use strict';


const config = require('../config/config');
const pool = config.pool;

const transactionWrapper = require('./TransactionWrapper');


exports.register = (data, extraData) => {

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
          let bgiArr = [];
          for (let i = 0; i < extraData.bgi.length; i++) {
            bgiArr[i] = [insertedIdx];
            bgiArr[i].push(extraData.bgi[i]);
          }
          const sql =
            `
            INSERT INTO citizen_image(citizen_dobo_idx, image)
            VALUES ?;
            `;

          context.conn.query(sql, [bgiArr], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows === extraData.bgi.length) {
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
      .then(context => {
        return new Promise((resolve, reject) => {

          let tourArr = [];
          for (let i = 0; i < extraData.tour.length; i++) {
            tourArr[i] = [insertedIdx];
            tourArr[i].push(...extraData.tour[i]);
          }

          const sql =
            `
            INSERT INTO citizen_tourlist(citizen_dobo_idx, image, name)
            VALUES ?;
            `;

          context.conn.query(sql, [tourArr], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows === extraData.tour.length) {
                context.result = rows;
                resolve(context)
              } else {
                context.error = new Error("CUSTOM ERROR IN INSERT TOURLIST IMAGE")
                reject(context);
              }
            }
          })
        })
      })
      .then(context => {
        return new Promise((resolve, reject) => {

          let courseArr = [];
          for (let i = 0; i < extraData.course.length; i++) {
            courseArr[i] = [insertedIdx];
            courseArr[i].push(...extraData.course[i]);
          }

          console.log(courseArr);
          const sql =
            `
            INSERT INTO citizen_course(citizen_dobo_idx, category, name)
            VALUES ?;
            `;
          context.conn.query(sql, [courseArr], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows === extraData.course.length) {
                context.result = rows;
                resolve(context);
              } else {
                context.error = new Error("CUSTOM ERROR IN INSERT COURSE");
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


exports.getList = () => {
  return new Promise((resolve, reject) => {
    const sql =
      `SELECT cd.idx,
       cd.min_people,
       cd.max_people,
       cd.lang
       cd.title,
       cd.content,
       cd.category,
       cd.due_date,
       cd.status,
       cd.image
FROM citizen_dobo AS cd;`;

    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  })
};



exports.createReview = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      INSERT INTO citizen_review SET ?;
      `;
    pool.query(sql, [data], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    })
  });
};