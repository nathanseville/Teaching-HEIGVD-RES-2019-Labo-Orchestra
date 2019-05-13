var protocol = require('./musician-protocol');
var dgram = require('dgram');
const uuidv1 = require('uuid/v1');

var s = dgram.createSocket('udp4');

function Musician(instrument) {
    this.uuid = uuidv1();
    this.created = Date.now(),
    this.instrument = instrument;
    this.sound = instruments.get(instrument);

    Musician.prototype.update = function() {
        var sound = {
            uuid: this.uuid,
            created: this.created,
            timestamp: Date.now(),
            instrument: this.instrument,
            sound: this.sound
        };
        var payload = JSON.stringify(sound);

        message = new Buffer(payload);
        s.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + s.address().port);
        });
    }

	setInterval(this.update.bind(this), 1000);
}

var instruments = new Map();
instruments.set("piano", "ti-ta-ti");
instruments.set("trumpet", "pouet");
instruments.set("flute", "trulu");
instruments.set("violin", "gzi-gzi");
instruments.set("drum", "boum-boum");

var instrument = process.argv[2];

var m1 = new Musician(instrument);