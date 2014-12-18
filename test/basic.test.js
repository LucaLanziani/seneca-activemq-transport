var mocha = require('mocha');
var assert = require("assert");
var Seneca = require('seneca');
var startServer = require('./helpers/start-server.js');
var calc = require('./helpers/calc.js');

describe('ActiveMQ over stomp', function () {
   it('has to return 2', function (done) {
    startServer(function () {
      this.use('stomp-transport');
      this.use(require('../'));
      calc(this);
    }, { type: 'activemq' }, function () {
      var seneca = Seneca()
        .use('stomp-transport')
        .use(require('../'))
        .client({ type: 'activemq' })
        .ready(function () {
          seneca.act('role:calc, cmd:add', { a: 1, b: 1 }, function (err, res) {
            if (err) throw err;
            assert.equal(2, res.result);
            done();
          });
        });
    });
  });
});
