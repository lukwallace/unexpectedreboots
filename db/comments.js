
// var pg = require('pg');
// var CONNECTION = 'postgres://admin:rQUNyC8W9YT7ZZBW@localhost:5432/markable'

// var client = new pg.Client(CONNECTION);

// exports.getGroups = function(username, callback) {

//   pool.query({
//     // find all groups user is a part of (and their owners)
//     text: 'SELECT u.id AS userid, g.id AS groupid, g.name AS groupname, \
//       g.owner AS groupowner, g.createdat AS createdat \
//       FROM users u \
//       LEFT JOIN usersgroups ug \
//       ON u.id = ug.userid \
//       LEFT JOIN groups g \
//       ON g.id = ug.groupid \
//       WHERE userid IN ( \
//         SELECT u.id FROM users u \
//         WHERE u.username = \'' + username + '\' \
//       );'
//   }, 

//   function(err, rows) {
//     if (err) {
//       callback(err, null);
//     } else {
//       callback(null, rows.rows);
//     }
//   });
// };