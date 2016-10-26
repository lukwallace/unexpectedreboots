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
      WHERE ug.userid IN ( \
        SELECT u.id FROM users u \
        WHERE u.username = \'' + owner + '\' \
      ) \
      AND g.name = \'' + groupName + '\';'
  },

  function(err, rows) {
    if (rows.rowCount > 0) {
      callback('duplicate group name for specified user', null);
    } else {

      pool.query({
        text: 'SELECT u.id FROM users u \
        WHERE u.username = \'' + owner + '\''
      },

      function(err2, rows2) {
        var ownerID = rows2.rows[0].id;

        pool.query({
          text: 'INSERT INTO groups(name, owner) \
            VALUES($1, $2) \
            RETURNING *',
          values: [groupName, ownerID]
        },

        function(err3, rows3) {
          var groupID = rows3.rows[0].id;

          pool.query({
            text: 'INSERT INTO usersgroups(userid, groupid) \
              VALUES ($1, $2)',
            values: [ownerID, groupID]
          }, 

          function(err4, rows4) {
            err4 ? callback(false, null) : callback(null, true);
          });
        });
      });
    }
  });
};

exports.addMember = function(groupName, username, newMember, callback) {
  pool.query({
    // retrieve ownerID, groupID & check if current user is owner of group
    text: 'SELECT u.id AS userid, g.id AS groupid FROM users u \
      LEFT JOIN usersgroups ug \
      ON u.id = ug.userid \
      LEFT JOIN groups g \
      on g.id = ug.groupid \
      WHERE u.username = \'' + username + '\' \
      AND g.name = \'' + groupName + '\''
  }, 

  function(err, rows) {
    if (rows.rowCount === 0) {
      callback('current user is not owner of specified group');
    } else {
      var ownerID = rows.rows[0].userid;
      var groupID = rows.rows[0].groupid; 
      
      pool.query({
        // check if new member already has membership to specified group
        text: 'SELECT u.id AS userid FROM users u \
        WHERE u.username = \'' + newMember + '\' \
        AND u.id IN ( \
          SELECT ug.userid FROM usersgroups ug \
          WHERE ug.groupid = \'' + groupID + '\' \
        )'
      },

      function(err2, rows2) {
        if (rows.rowCount > 0) {
          callback('cannot add a user that is already a member of the group');
        } else {
          
        }

      });

    }

  });
}