
var pg = require('pg');
var CONNECTION = 'postgres://admin:rQUNyC8W9YT7ZZBW@localhost:5432/markable'

var client = new pg.Client(CONNECTION);

var cleanText = function (text) {
  return '\'' + text + '\'';
}


var updateComment = function(markupid, authorid, comment, callback) {
  pool.query({
    text: 'UPDATE comment c SET c.comment = ' + cleanText(comment) + ' \
    WHERE c.markupid = ' + markupid + ' AND c.authorid = ' + authorid + ';' 
  }, function(err, rows) {
    //if error send callback
    if(err) {
      callback(err, null);
    } else {
      callback(null, rows.rows)
    }
  }
};

var createComment = function(markupid, authorid, comment, callback) {
  pool.query({
    text: 'INSERT INTO comment(markupid, authorid, comment) \
      VALUES($1, $2, $3)',
      values: [markupid, authorid, cleanText(comment)]
  }, function(err, rows) {
    //if error send callback
    if(err) {
      callback(err, null);
    } else {
      callback(null, rows.rows)
    }
  }
};

var getUserFromName = function(username, callback) {
  pool.query({
    text: 'SELECT * FROM users u WHERE u.username = \'' + username + '\' );'
  }, function(err, rows) {
    if(err) {
      callback(err, null);
    } else if (rows.rowCount === 1) {
      callback(null, rows.rows[0]);
    } else {
      callback('User ' + username + ' not found!', null);
    }
  });
};

var checkCommentExists = function(markupid, authorid, callback) {
  pool.query({
      text: 'SELECT * FROM comments c WHERE c.markupid = \'' + markupid + '\' \
      AND c.authorid = \'' + authorid +'\' );'
    }, function(err, rows) {
    if(err) {
      callback(err, null);
    } else if (rows.rowCount) {
      //comment exists
      callback(null, true);
    } else {
      //no comment
      callback(null, false);
    }
};


exports.setComment = function(markupid, username, comment, callback) {
  //first get userid
  getUserFromName(username, function(err, user) {
    if(err) {
      callback(err, null);
    } else {
      const authorid = user.id;
      checkCommentExists(markupid, authorid, function(err, exists) {
        //if exists, update
        if (exists) {
          updateComment(markupid, authorid, comment, callback);
        } else {
          createComment(markupid, authorid, comment, callback);
        }
      });
    }
  });
};



  pool.query({
    // find all groups user is a part of (and their owners)
    text: 'SELECT u.id AS userid, g.id AS groupid, g.name AS groupname, \
      g.owner AS groupowner, g.createdat AS createdat \
      FROM users u \
      LEFT JOIN usersgroups ug \
      ON u.id = ug.userid \
      LEFT JOIN groups g \
      ON g.id = ug.groupid \
      WHERE userid IN ( \
        SELECT u.id FROM users u \
        WHERE u.username = \'' + username + '\' \
      );'
  }, 

  function(err, rows) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, rows.rows);
    }
  });
};