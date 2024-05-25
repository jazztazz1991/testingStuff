const { ObjectId } = require('mongoose').Types;
const { Student, Course } = require('../models');

const headCount = async () => {
    const numberOfStudents = await Student.aggregate().count('studentCount');
    return numberOfStudents;
}

const grade = async (studentId) =>
    Student.aggregate([
        { $match: { _id: new ObjectId(studentId) } },
        {
            $unwind: '$assignments'
        },
        {
            $group: {
                _id: new ObjectId(studentId),
                overallGrade: { $avg: '$assignments.score' }
            }
        }
    ]);

module.exports = {
    async getStudents(req, res) {
        try {
            const students = await Student.find();

            const studentObj = {
                students,
                headCount: await headCount()
            }

            res.json(studentObj);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async getSingleStudent(req, res) {
        try {
            const student = await Student.findOne({ _id: req.params.studentId }).select('-__v');

            if (!student) {
                return res.status(404).json({ message: "No student with that ID" });
            }

            res.json({
                student,
                grade: await grade(req.params.studentId)
            })
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    async createStudent(req, res) {
        try {
            const student = await Student.create(req.body);
            res.json(student);
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async deleteStudent(req, res) {
        try {
            const student = await Student.findOneAndDelete({ _id: req.params.studentId });

            if (!student) {
                return res.status(404).json({ message: "No such student exists" });
            }

            const course = await Course.findOneAndUpdate(
                { students: req.params.studentId },
                { $pull: { students: req.params.studentId } },
                { new: true }
            );

            if (!course) {
                return res.status(404).json({ message: "Stdent deleted, but no courses found" });
            }

            res.json({ message: "Student successfully deleted" });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },
    async addAssignment(req, res) {
        try {
            const student = await Student.findOneAndUpdate(
                { _id: req.params.studentId },
                { $addToSet: { assignments: req.body } },
                { runValidators: true, new: true }
            );

            if (!student) {
                return res.status(404).json({ message: "No student found with that ID" });
            }

            res.json(student);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },
    async removeAssignment(req, res) {
        console.log("this started")
        try {
            const student = await Student.findOneAndUpdate(
                { _id: req.params.studentId },
                { $pull: { assignments: { _id: req.params.assignmentId } } },
                { runValidators: true, new: true }
            );

            if (!student) {
                return res.status(404).json({ message: "No student found with that ID" });
            }

            res.json(student);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }
}