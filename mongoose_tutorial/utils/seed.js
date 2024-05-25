const connection = require('../config/connection');
const { Course, Student } = require('../models');
const { getRandomName, getRandomAssignments } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('connected');

    let courseCheck = await connection.db.listCollections({ name: 'courses' }).toArray();
    if (courseCheck.length) {
        await connection.dropCollection('courses');
    }

    let studentsCheck = await connection.db.listCollections({ name: 'students' }).toArray();
    if (studentsCheck.lenght) {
        await connection.dropCollection('students');
    }

    const students = [];

    for (let i = 0; i < 20; i++) {
        const assignments = getRandomAssignments(20);

        const fullName = getRandomName();
        const first = fullName.split(' ')[0];
        const last = fullName.split(' ')[1];
        const github = `${first}${Math.floor(Math.random() * (99 - 18 + 1) + 18)}`;

        students.push({
            first,
            last,
            github,
            assignments,
        });
    }
    const studentData = await Student.create(students);

    await Course.create({
        courseName: 'UCLA',
        inPerson: false,
        students: [...studentData.map(({ _id }) => _id)],
    });

    console.table(students);
    console.info('Seeding complete!');
    process.exit(0);
});