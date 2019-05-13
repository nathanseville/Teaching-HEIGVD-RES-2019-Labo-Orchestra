const protocol = require('./musician-protocol');
const dgram = require('dgram');
var HashMap = require('hashmap');
var moment = require('moment');
var net = require('net');

var musicians = new HashMap();

var server = net.createServer(function(socket) {
  console.log("Process auditor infos");
  musicians.forEach(element => {
    console.log(Date.now() - element.timestamp);
    if(Date.now() - element.timestamp > 5000) { // 5 seconds
      musicians.remove(element.uuid);
    }
  });

  console.log("Sending auditor infos");
  socket.write(JSON.stringify(musicians.values(), ['uuid', 'instrument', 'activeSince'], 2) + '\r\n');
  socket.destroy();
}).listen(2205);

const s = dgram.createSocket('udp4');

s.bind(protocol.PROTOCOL_PORT, function() {
  console.log("Joining multicast group");
  s.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

s.on('message', function(msg, source) {
  console.log("Data has arrived: " + msg + ". Source port: " + source.port);
  var obj = JSON.parse(msg);

  var musician = {
    uuid : obj.uuid,
  	instrument : obj.instrument,
    activeSince : moment(obj.created),
    timestamp: obj.timestamp
  };
  
  musicians.set(musician.uuid, musician);
});