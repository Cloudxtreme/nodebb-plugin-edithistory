(function(module) {
  "use strict";
  var Plugin = {};

  var log = module.parent.require("winston"),
  diff = require('jsdiff'),
  db = module.parent.require('./database.js'),
  user = module.parent.require('./user.js'),
  crypto = module.parent.require('crypto'),
  async = module.parent.require('async'),
  _ = module.parent.require('underscore'),
  SocketPosts = module.parent.require('./socket.io/posts');// 

  // internal-only api -- wrappers do security checks.
  var EditHistory = {
    getPIDHistoryCount: function(pid, cb) {
      if(!pid) return cb(new Error('[[error:invalid-data]]'));

      return 0;
    },
    getPID: function(pid, offset, cb) {
      if(!pid) return cb(new Error('[[error:invalid-data]]'));

      db.getListRange("pid:"+pid+":edithistory", offset, offset+10, function(err, hists) {
        if(err) return cb(err);

        // todo: thin sent data down before handoff?

        return cb(null, hists);
      });
    },
    // obsoleted, just store full posts. call normal Edit for a revert.
    revertPID: function(pid, step, cb) {
      if(!pid) return cb(new Error('[[error:invalid-data]]'));

      // todo: check if step > count, maybe.

      Posts.exists(pid, function(err, exists) {
        if(err||!exists) return cb(err || new Error('[[error:no-post]]'));

        // get history <step> steps back
        db.getListRange("pid:"+pid+":edithistory", 0, step-1, function(err, steps) {
          if(err) return cb(err);

          Posts.getPostData(pid, function(err, postData) {
            if(err) return cb(err);

            var origPost = postData;
            var newPost = postData;

            async.eachSeries(steps, function(item) {
              // Apply the diffs sequentially.

            }); // eachSeries
          }); // getPostData
        }); // getListRange
      }); // exists
    },
    addHist: function(pid, data, cb) {
      if(!pid) return cb(new Error('[[error:invalid-data]]'));

      Posts.exists(pid, function(err, exists) {
        if(err||!exists) return cb(err || new Error('[[error:no-post]]'));

        db.ListPrepend("pid:"+pid+":edithistory", data, function(err) {
          if(err) return cb(err);

          return cb(null, data);
        });

      });
    },
    canView: function(uid, pid, cb) {
      return cb(null, true);
    },
    canRevert: function(uid, pid, cb) {
      return cb(null, true);
    }
  };

  Plugin.socketLib = {
    // posts.edithistory.get {pid: XX}
    get: function(socket, data, callback) {
      if(!data || !data.pid) return callback(new Error('[[error:invalid-data]]'));
      var pid = parseInt(data.pid,10);

      if(!pid) return callback(new Error('Bad PID'));

      var offset = 0;
      if(!!data.offset) offset = parseInt(data.offset,10);


      EditHistory.canView(socket.uid, pid, function(err, canView) {
        if(err || !canView) return callback(err || canView);

        EditHistory.getPID(pid, offset, callback);
      });
    }
  }

  Plugin.actionPostEdit = function(params, cb) {
    // params is postData - .content is plaintext, .pid, .tid....
    logger.info("Post edit params:", params);
    var pid = params.pid;
    var content = params.content;

    // Push to the list of edit history.
    EditHistory.addHist(pid, content, function(err) {
      if(err) return cb(err);

      return cb(null, params);
    });
  };

  Plugin.actionPostPurge = function(params, cb) {
    // params might be pid
    logger.info("Post purge params:", params);

    db.delete("pid:"+params+":edithistory", function(err) {
      if(err) return cb(err);

      return cb(null, params);
    });
  };

  Plugin.init = function(params, callback) {
    function adminPanel(req, res, next) {
      res.render('admin/plugins/edithistory', {});
    }

    params.router.get('/admin/plugins/edithistory', params.middleware.admin.buildHeader, adminPanel);
    params.router.get('/api/admin/plugins/edithistory', adminPanel);

    SocketPosts.editHistory = Plugin.socketLib;

    callback(null);
  };


  Plugin.adminHeaderBuild = function(custom_header, callback) {
    custom_header.plugins.push({
      "route": '/plugins/edithistory',
      "icon": 'fa-edit',
      "name": 'Edit History'
    });

    callback(null, custom_header);
  };

  Plugin.admin = {};

  Plugin.admin.activate = function() {

  };

  module.exports = Plugin;

}(module));
