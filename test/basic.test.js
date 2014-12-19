var mocha = require('mocha');
var assert = require("assert");
var Seneca = require('seneca');
var startServer = require('./helpers/start-server.js');
var calc = require('./helpers/calc.js');

describe('ActiveMQ over stomp', function () {
   it('has to return 4', function (done) {
    startServer(function () {
      this.use(require('../'));
      calc(this);
    }, { type: 'activemq' }, function () {
      var seneca = Seneca()
        .use(require('../'))
        .client({ type: 'activemq' })
        .ready(function () {
          seneca.act('role:calc, cmd:add', { a:1, b:3 }, function (err, res) {
            if (err) throw err;
            assert.equal(4, res.result);
            done();
          });
        });
    });
  });
});
