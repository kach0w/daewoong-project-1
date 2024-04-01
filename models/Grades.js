const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GradeSchema = new Schema({
    student_id: String,
    subject_id: String,
    grade: String,
    semester: String,
    year: Number,
})

module.exports = mongoose.model("Grade", GradeSchema);