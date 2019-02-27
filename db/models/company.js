
const mongoose = require('mongoose');

const companySchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    /*code: {
        type: String,
        trim:true
    },*/
    name: {
        type: String,
        trim:true,
        unique:true,
        required:'name cannot be blank'
    },
    /*serialNo: String,*/
    tel: String,
    fax: String,
    address1: String,
    address2: String,
    zipcode1: String,
    memo: String,
    isActive: Number,
    monitoringType:Number,
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

mongoose.model('Company', companySchema);