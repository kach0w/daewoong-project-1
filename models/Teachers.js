const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    name: String,
    subjectsTaught: [String]
})

module.exports = mongoose.model("Teacher", TeacherSchema);