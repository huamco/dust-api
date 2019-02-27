const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        defualt: 0
    },
    username: {
        type: String,
        required: true,
    },
    hash: { type: String, required: true },
    name: {
        type: String,
        trim:true,
    },
    password: {
        type: String,
        trim:true,
    },
    companyId: String,
    email: String,
    tel: String,
    position: String,
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    isAdmin: Number,
    isManager: Number,
    isWorker: Number,
    isDemo: Number,
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

mongoose.model('User', userSchema);
