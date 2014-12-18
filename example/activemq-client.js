var util = require('util');

var seneca = require('seneca')()
      .use('stomp-transport')
      .use('../')
      .client({type:'activemq', port: 61613});

seneca.act( {cmd:'salestax', net:100}, function(err,result){
  console.log( "RESULT:", result.total )
})
