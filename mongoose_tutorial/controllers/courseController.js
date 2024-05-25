const { Course, Student } = require('../models');

module.exports = {
    async getCourses(req, res) {
        try {
            const courses = await Course.find().populate('students');
            res.json(courses);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },
    async getSingleCourse(req, res) {
        try {
            const course = await Course.findOne({ _id: req.params.courseId }).populate('students');

            if (!course) {
                return res.status(404).json({ message: "No course with that ID" });
            }

            res.json(course);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },
    async createCourse(req, res) {
        try {
            const course = await Course.create(req.body);
            res.json(course);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },
    async updateCourse(req, res) {
        try {
            const course = await Course.findOneAndUpdate(
                { _id: req.params.courseId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!course) {
                res.status(404).json({ message: "No course with this ID" });
            }

            res.json(course);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },
    async deleteCourse(req, res) {
        try {
            const course = await Course.findOneAndDelete({ _id: req.params.courseId });

            if (!course) {
                res.status(404).json({ message: "No course with that ID" });
            }

            await Student.deleteMany({ _id: { $in: course.students } });
            res.json({ message: 'Course and students deleted!' })
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }
}