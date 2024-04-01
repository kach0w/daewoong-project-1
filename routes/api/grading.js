const express = require('express')
const router = express.Router()
const handleError = require('../../utils/errorHandler')
const Subject = require("../../models/Subjects")
const Student = require("../../models/Students")
const Teacher = require("../../models/Teachers")
const Class = require("../../models/Classes")
const Grade = require("../../models/Grades")
const ObjectId = require("mongodb").ObjectId

function getCurrentSemesterAndYear() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
  
    let currentSemester;
    if (currentMonth < 5) {
      currentSemester = "Spring";
    } else if (currentMonth < 8) {
      currentSemester = "Summer";
    } else {
      currentSemester = "Fall";
    }
  
    return { currentSemester, currentYear };
}
function isPastSemester(semester, year) {
    const { currentSemester, currentYear } = getCurrentSemesterAndYear();
  
    if (year < currentYear) {
      return true;
    } else if (year === currentYear) {
      const semesterOrder = { "Spring": 1, "Summer": 2, "Fall": 3 };
      return semesterOrder[semester] < semesterOrder[currentSemester];
    }
    return false;
}
router.post("/subjects", async (req, res) => {
    try {
        const subjectName = req.body.name;
        console.log(subjectName)
        const existingSubject = await Subject.findOne({name: subjectName});
        console.log(existingSubject);
        if(existingSubject){
            console.log("Subject already in db")
            return res.status(400).json({message: "you have already added this subject"})
        } else {
            const newSubject = new Subject(req.body)
            newSubject.save().catch(err => console.log(err));
            return res.status(200).json(newSubject)
        }
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.post("/students", async (req, res) => {
    try {
        const studentName = req.body.name;
        console.log(studentName)
        const existingStudent = await Student.findOne({name: studentName});
        console.log(existingStudent);
        if(existingStudent){
            console.log("Student already in db")
            return res.status(400).json({message: "you have already added this student"})
        } else {
            const newStudent = new Student(req.body)
            newStudent.save().catch(err => console.log(err));
            return res.status(200).json(newStudent)
        }
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.post("/teachers", async (req, res) => {
    try {
        const teacherName = req.body.name;
        console.log(teacherName)
        const existingTeacher = await Teacher.findOne({name: teacherName});
        console.log(existingTeacher);
        if(existingTeacher){
            console.log("Teacher already in db")
            return res.status(400).json({message: "you have already added this teacher"})
        } else {
            const newTeacher = new Teacher(req.body)
            newTeacher.save().catch(err => console.log(err));
            return res.status(200).json(newTeacher)
        }
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.post("/grades", async (req, res) => {
    try {
        const newGrade = new Grade(req.body)
        newGrade.save().catch(err => console.log(err));
        return res.status(200).json(newGrade)
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.post("/classes", async (req, res) => {
    try {
        const newClass = new Class(req.body)
        newClass.save().catch(err => console.log(err));
        return res.status(200).json(newClass)
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.get("/students/:studentId/gpa/:semester/:year", async(req, res) => {
    const studentId = req.params.studentId
    const smstr = req.params.semester
    const yr = req.params.year
    const hasStudentId = await Grade.findOne({student_id: studentId});
    const hasSmstr = await Grade.findOne({semester: smstr})
    const hasYr= await Grade.findOne({year: yr});
    if(!(hasStudentId || hasSmstr || hasYr)){
        return res.status(404)
    }
    // can't use aggregation bc need to multiply the thing by a value depending on A, B, C, ...
    try {
        const grades = await Grade.find({
            student_id: {$eq: studentId},
            semester: {$eq: smstr}, 
            year: {$eq: yr},   
        })

        var total = 0.0;
        var count = 0;
        for(var g in grades){
            g = grades[g]
            count++;
            if(g.grade.includes("A")) {total += 4.0}
            if(g.grade.includes("B")) {total += 3.0}
            if(g.grade.includes("C")) {total += 2.0}
            if(g.grade.includes("D")) {total += 1.0}
            if(g.grade.includes("F")) {total += 0.0}
        }       
        const gpa = Math.round((total / count) * 100) / 100;
        console.log(JSON.stringify(gpa))
       return res.status(200).json(gpa)
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.get("/students/:studentId/gpa", async(req, res) => {
    const studentId = req.params.studentId
    const hasStudentId = await Grade.findOne({student_id: studentId});
    if(!hasStudentId){
        return res.status(404)
    }
    // can't use aggregation bc need to multiply the thing by a value depending on A, B, C, ...
    try {
        const grades = await Grade.find({
            student_id: {$eq: studentId},
        })
        var total = 0.0;
        var count = 0;
        for(var g in grades){
            g = grades[g]
            count++;
            if(g.grade.includes("A")) {total += 4.0}
            if(g.grade.includes("B")) {total += 3.0}
            if(g.grade.includes("C")) {total += 2.0}
            if(g.grade.includes("D")) {total += 1.0}
            if(g.grade.includes("F")) {total += 0.0}
        }       
        const gpa = Math.round((total / count) * 100) / 100;
        console.log(JSON.stringify(gpa))
       return res.status(200).json(gpa)
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.put("/grades/:gradeId", async (req, res) => {
    const id = req.params.gradeId;
    const newData = req.body.grade
    const ObjId = new ObjectId(id)
    try {
        const updatedGrade = await Grade.findByIdAndUpdate(
            ObjId,
            {grade: newData},
        )
        if(!updatedGrade){
            return res.status(404).json({message: "no such grade exists to update"})
        }
        return res.status(200).json({message: "Updated Grade"})
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.get("/students/:studentId/grades", async(req, res) => {
    const studentId = req.params.studentId
    const hasStudentId = await Grade.findOne({student_id: studentId});
    if(!hasStudentId){
        return res.status(404)
    }
    try {
        const grades = await Grade.find({
            student_id: {$eq: studentId},
        })
        console.log(JSON.stringify(grades))
       return res.status(200).json(grades)
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.get("/teachers/:teacherId/classes", async(req, res) => {
    const teacherId = req.params.teacherId
    const hasTeacherId = await Teacher.findById(teacherId);
    if(!hasTeacherId){
        return res.status(404)
    }
    try {
        const classes = await Class.find({
            teacher_id: {$eq: teacherId},
        })
        console.log(JSON.stringify(classes))
       return res.status(200).json(classes)
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.put("/classes/:classId/enroll", async (req, res) => {
    const id = req.params.classId;
    const newData = req.body.student_ids
    const ObjId = new ObjectId(id)
    try {
        const updatedClass = await Class.findByIdAndUpdate(
            ObjId,
            {studentIds: newData},
        )
        if(!updatedClass){
            return res.status(404).json({message: "no such class exists to update"})
        }
        return res.status(200).json({message: "Updated Class Roster"})
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.put("/classes/:classId/drop", async (req, res) => {
    const id = req.params.classId;
    const newData = req.body.student_id
    const ObjId = new ObjectId(id)
    try {
        const updatedClass = await Class.findByIdAndUpdate(
            ObjId,
            {$pull: {studentIds: newData}},
        )
        if(!updatedClass){
            return res.status(404).json({message: "no such class exists to update"})
        }
        return res.status(200).json({message: "Updated Class Roster"})
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})
router.get("/grades/class/:classId", async(req, res) => {
    const classId = req.params.classId
    const hasClassId = await Subject.findOne({_id: classId});
    if(!hasClassId){
        return res.status(404)
    }
    try {
        const grades = await Grade.find({
            subject_id: {$eq: classId},
        })
        console.log(JSON.stringify(grades))
       return res.status(200).json(grades)
    } catch(error) {
        console.log(error)
        handleError(error, res)
    }
})

module.exports = router;

