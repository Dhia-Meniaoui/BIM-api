const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Client'
    },
    isFixed : {
        type : Boolean,
        default : false
    }
}, {timestamps : true});

const MaintenanceRequest = mongoose.model('MaintenanceRequest' , maintenanceRequestSchema);
module.exports = MaintenanceRequest;