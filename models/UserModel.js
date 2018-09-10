'use strict';

const config = require('../config/config');
const pool = config.pool;


exports.signup = () => {
  return new Promise((resolve, reject) => {
    const sql = ``;

    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  })
};

exports.signin = () => {
  return new Promise((resolve, reject) => {
    const sql = ``;

    pool.query(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};
