var seneca = require('seneca')();

seneca.add( {cmd:'salestax'}, function(args,callback){
  var rate  = 0.23
  var total = args.net * (1+rate)
  callback(null, {total:total})
});

seneca.use('stomp-transport')
    .use('../', {config: {port: 61613}})
    .listen({type:'activemq'});
