'use strict';

const jwt = require('jsonwebtoken');

const config = require('../config/config');
const pool = config.pool;
const transactionWrapper = require('./TransactionWrapper');
const { RESERVE_STATUS } = require('../Constant');



exports.checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT idx, email
      FROM user
      WHERE email = ?;
      `;

    pool.query(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length !== 0) { // email이 존재하는 경우
          reject(1401);
        } else {
          resolve(rows[0]);
        }
      }
    })
  })
};

// exports.getUserByEmail = (email) => {
//   return new Promise((resolve, reject) => {
//     const sql =
//       `
//       SELECT idx, email, nick, avatar, salt
//       FROM Users
//       WHERE email = ?;
//       `;
//
//     pool.query(sql, [email], (err, rows) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (rows.length !== 0) { // email이 존재하는 경우
//           reject(1401);
//         } else {
//           resolve(rows[0]);
//         }
//       }
//     })
//   })
// };

exports.getUserByIdx = (idx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT u.idx as uIdx, u.email, nick, avatar, salt, role, s.idx sIdx
      FROM user u
      LEFT JOIN seoullight s on u.idx = s.user_idx
      WHERE u.idx = ?;
      `;

    pool.query(sql, [idx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          reject(1402);
        } else {
          resolve(rows[0]);
        }
      }
    })
  });
};


exports.signup = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      INSERT INTO user(email, pwd, nick, avatar, salt)
      VALUES (?, ?, ?, ?, ?);
      `;

    pool.query(sql, [user.email, user.pwd, user.nick, user.avatar, user.salt], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  })
};

exports.getSalt = (email) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT salt
      FROM user
      WHERE email = ?;
      `;

    pool.query(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) {
          reject(1402);
        } else {
          resolve(rows[0].salt);
        }
      }
    });
  });
};

exports.signin = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT idx, email, nick, avatar, role
      FROM user
      WHERE email = ? AND pwd = ?;
      ;
      `;

    pool.query(sql, [user.email, user.pwd], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows.length === 0) { // 로그인 실패
          reject(1405);
        } else {
          const profile = {
            idx: rows[0].idx,
            email: rows[0].email,
            role: rows[0].role
          };

          const token = jwt.sign(profile, config.jwt.cert, { "expiresIn": "10h" });

          const result = { profile, token };
          resolve(result);
        }
      }
    });
  });
};
/*
    비밀번호 수정
    writed by 경인
*/
exports.editPwd = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
    UPDATE user
    SET pwd = ? , salt = ? 
    WHERE idx = ?
    `

    pool.query(sql, [user.pwd, user.salt, user.idx], (err, rows) => {

      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/*
    프로필 사진 수정
    writed by 경인
*/
exports.editAvatar = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
    UPDATE user
    SET avatar = ?
    WHERE idx = ?
    `

    pool.query(sql, [user.avatar, user.idx], (err, rows) => {

      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};



/*
    건의사항 등록
    writed by 경인
*/
exports.addFeedback = (fb) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      INSERT INTO feedback(title,content,user_idx)
      VALUES (?, ?, ?);
      `;

    pool.query(sql, [fb.title, fb.content, fb.user_idx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/*
    신청 관광리스트 가져오기 
    writed by 경인
*/
exports.getAskingList= (idx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `       
      SELECT  d.idx as dIdx, title , content, image, d.status
      FROM citizen_reserve as r
      LEFT JOIN citizen_dobo as d on citizen_dobo_idx = d.idx
      WHERE user_idx = ? AND r.status = ?; 
      `;

    pool.query(sql, [idx,RESERVE_STATUS.RESERVE], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

/*
    개설 관광리스트 가져오기 
    writed by 경인
*/
exports.getMadeList= (sIdx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `       
      SELECT  title , content, image, status
      FROM citizen_dobo
      WHERE seoullight_idx = ?;
      `;

    pool.query(sql, [sIdx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};


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
