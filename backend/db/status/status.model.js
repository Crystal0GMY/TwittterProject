const mongoose = require("mongoose")

const StatusSchema = require('./status.schema').StatusSchema

const StatusModel = mongoose.model("StatusTwitterProject", StatusSchema);

function insertStatus(status) {
    return StatusModel.create(status);
}

function getAllStatus() {
    return StatusModel.find().sort({ createdTime: -1 }).exec();
}

function findStatusByUsername(username) {
    return StatusModel.find({username: username}).sort({ createdTime: -1 }).exec();
}

function findStatusById(id) {
    return StatusModel.findById(id).exec();
}

function deleteStatusById(id) {
    return StatusModel.deleteOne({_id: id}).exec();
}

module.exports = {
    findStatusByUsername,
    insertStatus,
    getAllStatus,
    findStatusById,
    deleteStatusById,
};