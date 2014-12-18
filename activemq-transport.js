'use strict';
var Seneca = require('seneca');
var _ = require('underscore');

module.exports = function (options) {
  var seneca = this;

  var so = seneca.options();
  var name = 'activemq-transport';
  var config = _.extend({}, {type: 'stomp'}, options.config);

  options = seneca.util.deepextend(
    {
      stomp: {
        timeout:     so.timeout ? so.timeout-555 :  22222,
        type:        'stomp',
        host:        'localhost',
        port:        61613,
        act_channel: "/queue/%s_act",
        res_channel: "/queue/%s_res"
      },
    },
    so.transport,
    options);

  var transportUtils = seneca.export('transport/utils');

  function clientHook(args, clientDone) {
    var seneca = this;
    var client_options = seneca.util.clean(_.extend({}, options[config.type], args, config));
    seneca.act(client_options, clientDone);
  }

  function listenHook(args, done) {
    var seneca = this;
    var listen_options = seneca.util.clean(_.extend({}, options[config.type], args, config));
    transportUtils.listen_topics(seneca, args, listen_options, function() {
      seneca.act(listen_options);
    });
    done();
  }

  seneca.add({role: 'transport', hook: 'client', type: 'activemq'}, clientHook);
  seneca.add({role: 'transport', hook: 'listen', type: 'activemq'}, listenHook);

  return { name: name };
};
