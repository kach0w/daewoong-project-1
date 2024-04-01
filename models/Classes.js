const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClassSchema = new Schema({
    subject_id: String,
    teacher_id: String,
    semester: String,
    year: Number,
    studentIds: [String]
})

module.exports = mongoose.model("Class", ClassSchema);