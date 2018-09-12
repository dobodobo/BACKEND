'use strict';

const jwt = require('jsonwebtoken');

const config = require('../config/config');
const pool = config.pool;


exports.checkEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT idx, email
      FROM Users
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
      SELECT idx, email, nick, avatar, salt
      FROM Users
      WHERE idx = ?;
      `;

    pool.query(sql, [idx], (err, rows)=> {
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
      INSERT INTO Users(email, pwd, nick, avatar, salt)
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
      FROM Users
      WHERE email = ?;
      `;

    pool.query(sql, [email], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        if (rows === 0) {
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
      SELECT idx, email, nick, avatar
      FROM Users
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
            email: rows[0].email
          };

          const token = jwt.sign(profile, config.jwt.cert, {"expiresIn": "10h"});

          const result = {profile, token};
          resolve(result);
        }
      }
    });
  });
};
