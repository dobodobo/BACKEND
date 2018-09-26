'use strict';


const config = require('../config/config');
const pool = config.pool;

const transactionWrapper = require('./TransactionWrapper');
const {DOBO_STATUS} = require('../Constant');


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

          let courseArr = [];
          for (let i = 0; i < extraData.course.length; i++) {
            courseArr[i] = [insertedIdx];
            courseArr[i].push(...extraData.course[i]);
          }

          const sql =
            `
            INSERT INTO citizen_course(citizen_dobo_idx, temp, category, name)
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



function escapeSansQuotes(connection, criterion) {
  return connection.escape(criterion).match(/^'(\w+)'$/)[1];
}

exports.getListByCount = (category) => {
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
        DATE_FORMAT(cd.due_date, '%Y.%m.%d') AS due_date,
        cd.status,
        cd.image,
        cd.lang,
        COUNT(cr.citizen_dobo_idx) AS count
      FROM citizen_dobo AS cd
             LEFT JOIN citizen_review cr on cd.idx = cr.citizen_dobo_idx
      WHERE cd.category = ?       
      GROUP BY cd.idx
      ORDER BY count DESC, cd.idx DESC ;
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

exports.getListByDue = (category) => {
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
        DATE_FORMAT(cd.due_date, '%Y.%m.%d') AS due_date,
        cd.status,
        cd.image,
        cd.lang,
        COUNT(cr.citizen_dobo_idx) AS count
      FROM citizen_dobo AS cd
             LEFT JOIN citizen_review cr on cd.idx = cr.citizen_dobo_idx
      WHERE cd.category = ?       
      GROUP BY cd.idx
      ORDER BY cd.due_date DESC, cd.idx DESC ;
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


exports.getAllListByDue = () => {
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
        DATE_FORMAT(cd.due_date, '%Y.%m.%d') AS due_date,
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


exports.getAllListByCount = () => {
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
        DATE_FORMAT(cd.due_date, '%Y.%m.%d') AS due_date,
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



exports.getDetail = (doboIdx, userIdx) => {
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
       s.idx AS seoulite_idx,
       s.name,
       u.idx AS user_idx,
       u.avatar,
       DATE_FORMAT(s.birth, '%Y.%m.%d'),
       s.intro,
       s.email,
       s.organization,
       (SELECT IF(COUNT(cr.user_idx) > 0, TRUE , FALSE ) FROM citizen_reserve cr WHERE cr.user_idx=? AND cr.status='RESERVE' AND cr.citizen_dobo_idx=?) as isReserved
      FROM citizen_dobo AS cd
             LEFT JOIN citizen_course cc on cd.idx = cc.citizen_dobo_idx
             LEFT JOIN citizen_image ci on cd.idx = ci.citizen_dobo_idx
             LEFT JOIN seoullight s ON cd.seoullight_idx = s.idx
             LEFT JOIN user u on s.user_idx = u.idx
      WHERE cd.idx = ?;
      `;

    pool.query(sql, [userIdx, doboIdx, doboIdx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        rows[0].isReserved === 1 ? rows[0].isReserved = true : rows[0].isReserved = false;
        resolve(rows[0]);
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
      WHERE citizen_dobo_idx = ?
      ORDER BY cr.idx DESC;
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


// reserve 테이블 추가 -> dobo.reserve_person 업데이트
exports.createReserve = (data) => {
  return new Promise((resolve, reject) => {
    transactionWrapper.getConnection(pool)
      .then(transactionWrapper.beginTransaction)
      .then(context => {
        return new Promise((resolve, reject) => {
          const sql =
            `
            INSERT INTO citizen_reserve(citizen_dobo_idx, user_idx, status)
            VALUES (?, ?, ?);
            `;

          context.conn.query(sql, [data.doboIdx, data.userIdx, data.status], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              context.result = rows;
              resolve(context);
            }
          })
        })
      })
      .then(context => {
        return new Promise((resolve, reject) => {
          const sql =
            `
            UPDATE citizen_dobo
            SET reserve_people = reserve_people + 1
            WHERE idx = ?;
            `;
          context.conn.query(sql, [data.doboIdx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows === 1) {
                context.result = rows;
                resolve(context);
              } else {
                context.error = new Error('CUSTON ERROR IN UPDATE RESERVE PERSON');
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

exports.checkReserve = (doboIdx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT min_people, max_people, reserve_people
      FROM citizen_dobo
      WHERE idx = ?;
      `;

    pool.query(sql, [doboIdx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // 예약 가능한 인원이 남아 있다면 true
        if (rows[0].max_people > rows[0].reserve_people) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    })
  })
};


exports.cancelReserve = (data) => {
  return new Promise((resolve, reject) => {
    transactionWrapper.getConnection(pool)
      .then(transactionWrapper.beginTransaction)
      .then(context => {
        return new Promise((resolve, reject) => {
          const sql =
            `
            UPDATE citizen_reserve cr
             SET cr.status = ?
            WHERE citizen_dobo_idx = ? AND user_idx = ?;
            `;

          context.conn.query(sql, [data.status, data.doboIdx, data.userIdx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              context.result = rows;
              resolve(context);
            }
          })
        })
      })
      .then(context => {
        return new Promise((resolve, reject) => {
          const sql =
            `
            UPDATE citizen_dobo
            SET reserve_people = reserve_people - 1
            WHERE idx = ?;
            `;
          context.conn.query(sql, [data.doboIdx], (err, rows) => {
            if (err) {
              context.error = err;
              reject(context);
            } else {
              if (rows.affectedRows === 1) {
                context.result = rows;
                resolve(context);
              } else {
                context.error = new Error('CUSTON ERROR IN UPDATE RESERVE PERSON');
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


exports.updateStatus = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT idx, min_people, max_people, reserve_people, status
      FROM citizen_dobo
      WHERE idx = ?;
      `;
    pool.query(sql, [data.doboIdx], (err, rows) => {
      if (err) {
        reject(err);
      } else {

        if (rows[0].max_people === rows[0].reserve_people){
          resolve(DOBO_STATUS.CLOSE);
        } else if (rows[0].max_people > rows[0].reserve_people) {
          resolve(DOBO_STATUS.WAITING)
        }
      }
    })
  })
    .then(result => {
      return new Promise((resolve, reject) => {
        const sql =
          `
          UPDATE citizen_dobo
          SET status = ?
          WHERE idx = ?;
          `;
        pool.query(sql, [result, data.doboIdx], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        })
      })
    });
};