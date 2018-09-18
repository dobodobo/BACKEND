'use strict';

const jwt = require('jsonwebtoken');

const config = require('../config/config');
const pool = config.pool;


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
      SELECT idx, email, nick, avatar, salt, role
      FROM user
      WHERE idx = ?;
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
      INSERT INTO user(email, pwd, nick, avatar, salt, role)
      VALUES (?, ?, ?, ?, ?, ?);
      `;

    pool.query(sql, [user.email, user.pwd, user.nick, user.avatar, user.salt, "NORMAL"], (err, rows) => {
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
            email: rows[0].email
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
    회원 정보 수정
    writed by 경인
*/
exports.editUser = (user) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
    UPDATE user
    SET pwd = ? , salt = ? , nick = ? , avatar = ?
    WHERE idx = ?
    `

    pool.query(sql, [user.pwd, user.salt, user.nick, user.avatar, user.idx], (err, rows) => {

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
exports.editRole = (idx) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
    UPDATE user
    SET role = ?
    WHERE idx = ?
    `

    pool.query(sql, ["SEOULITE",idx], (err, rows) => {

      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

exports.seoulight = (sData) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      INSERT INTO seoullight(name, birth, organization, portfolio, email, phone, intro, image, user_idx)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
      `;

    pool.query(sql, [sData.name, sData.birth, sData.organization, sData.portfolio, sData.email, sData.phone, sData.intro, sData.image, sData.user_idx], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};