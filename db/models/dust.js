const mongoose = require('mongoose');

const dustSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        defualt: 0
    },
    locationID: {
        type: String,
    },
    dustIPAddress: {
        type: String,
    },
    version: {
        type: String
    },
    dustType: {
        type: String
    },
    dustName: {
        type: String
    },
    image: String,
    m_wAuto_puls_val: Number,
    m_wPower_value: Number,
    m_waCurrent_nowx10: Number,
    m_byReserved: Number,
    m_fParam_power: Number,
    m_wParam_runtime: Number,
    isActive: Number,
    createDate: {
        type: Date,
        default: () => new Date(),
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId
    },
    updateDate: {
        type: Date,
        default: () => new Date(),
    },
    updateBy: {
        type: mongoose.Schema.Types.ObjectId
    }
});

mongoose.model('Dust', dustSchema);
