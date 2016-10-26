var pg = require('pg');
var Pool = require('pg').Pool;
var Promise = require('es6-promise').Promise;

var CONFIG = {
  host: 'localhost',
  user: 'admin',
  password: 'rQUNyC8W9YT7ZZBW',
  database: 'markable'
};

var pool = new Pool(CONFIG);

exports.createGroup = function(groupName, owner, callback) {

  pool.query({
    text: 'SELECT ug.groupid, ug.userid FROM users u \
      LEFT JOIN usersgroups ug \
      ON u.id = ug.userid \
      LEFT JOIN groups g \
      ON g.id = ug.groupid \
      WHERE u.id IN ( \
        SELECT u.id FROM users u \
        WHERE u.username = \'' + owner + '\' \
      ) \
      AND g.name = \' ' + groupName + '\';'
  },

  function(err, rows) {
    if (rows.rowCount > 0) {
      callback('duplicate group name for specified user');
    } else {

      pool.query({
        text: 'SELECT u.id FROM users u \
        WHERE u.username = \'' + owner + '\''
      },

      function(err2, rows2) {
        console.log(rows2);
      });
    }
  });

};
