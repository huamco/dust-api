const mongoose = require('mongoose');

const dustLocationSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    companyCode: {
        type: String
    },
    location: {
        type: String,
        required: true,
    },
    locationIPAddress: {
        type: String,
    },
    mType: String,
    isActive: Number,
    createDate: {
        type: Date,
        default: () => new Date(),
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    updateDate: {
        type: Date,
        default: () => new Date(),
    },
    updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('DustLocation', dustLocationSchema);
