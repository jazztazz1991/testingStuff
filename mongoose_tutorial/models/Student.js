const { Schema, model } = require('mongoose');
const assignmentSchema = require('./Assignment');

const studentSchema = new Schema(
    {
        first: {
            type: String,
            retuired: true,
            max_length: 50,
        },
        last: {
            type: String,
            required: true,
            max_length: 50,
        },
        github: {
            type: String,
            required: true,
            max_length: 50,
        },
        assignments: [assignmentSchema],
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

const Student = model('student', studentSchema);

module.exports = Student;