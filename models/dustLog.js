const mongoose = require('mongoose');

const PacketParamsSchema = mongoose.model('PacketParams').schema;

const dustLogSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    dustId: {
        type: Number
    },
    ipAddress: {
        type: String
    },
    packetParams: [PacketParamsSchema],
    createDate: {
        type: Date,
        default: () => new Date(),
    }
});

const DustLog = mongoose.model('DustLog', dustLogSchema);;
module.exports = DustLog;
