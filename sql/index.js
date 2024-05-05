const { prompt } = require('inquirer');
const logo = require('asciiart-logo');
const db = require('./db');

init();

// Display logo text, load main prompts
function init() {
    const logoText = logo({ name: 'Employee Manager' }).render();

    console.log(logoText);

    loadMainPrompts();
}

function loadMainPrompts() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: ['View', 'Add', 'Update', 'Delete', 'Exit']
        }
    ]).then((res) => {
        switch (res.choice) {
            case 'View':
                viewPrompt();
                break;
            case 'Add':
                addPrompt();
                break;
            case 'Update':
                updatePrompt();
                break;
            case 'Delete':
                deletePrompt();
                break;
            case 'Exit':
                quit();
                break;
        }
    })
}



// First Prompt Functions
function viewPrompt() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to view?",
            choices: [
                {
                    name: "All Employees",
                    value: "allemployees"
                },
                {
                    name: "All Employees By Role",
                    value: "allbyrole"
                },
                {
                    name: "All Employees By Manager",
                    value: "allbymanager"
                },
                {
                    name: "All Employees By Department",
                    value: "allbydepartment"
                },
                {
                    name: "All Roles",
                    value: "allroles"
                },
                {
                    name: "All Departments",
                    value: "alldepartments"
                },
                'Exit'
            ]
        }
    ]).then((res) => {
        switch (res.choice) {
            case 'allemployees':
                viewAllEmployees();
                break;
            case 'allbyrole':
                viewByRole();
                break;
            case 'allbymanager':
                viewByManager();
                break;
            case 'allbydepartment':
                viewByDepartment();
                break;
            case 'allroles':
                viewAllRoles();
                break;
            case 'alldepartments':
                viewAllDepartments();
                break;
            case 'Exit':
                quit();
                break;
        }
    })
}
function addPrompt() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to add??",
            choices: [
                {
                    name: "Employee",
                    value: "employee"
                },
                {
                    name: "Role",
                    value: "role"
                },
                {
                    name: "Department",
                    value: "department"
                },
                'Exit'
            ]
        }
    ]).then((res) => {
        switch (res.choice) {
            case 'employee':
                addEmployee();
                break;
            case 'role':
                addRole();
                break;
            case 'department':
                addDepartment();
                break;
            case 'Exit':
                quit();
                break;
        }
    })
}
function updatePrompt() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to update??",
            choices: [
                {
                    name: "Employee",
                    value: "employee"
                },
                {
                    name: "Role",
                    value: "role"
                },
                'Exit'
            ]
        }
    ]).then((res) => {
        switch (res.choice) {
            case 'employee':
                updateEmployee();
                break;
            case 'role':
                updateRole();
                break;
            case 'Exit':
                quit();
                break;
        }
    })
}
function deletePrompt() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to delete??",
            choices: [
                {
                    name: "Employee",
                    value: "employee"
                },
                {
                    name: "Role",
                    value: "role"
                },
                {
                    name: "Department",
                    value: "department"
                },
                'Exit'
            ]
        }
    ]).then((res) => {
        switch (res.choice) {
            case 'employee':
                deleteEmployee();
                break;
            case 'role':
                deleteRole();
                break;
            case 'department':
                deleteDepartment();
                break;
            case 'Exit':
                quit();
                break;
        }
    })
}


// View Prompt Functions
function viewAllEmployees() {
    db.findAllEmployees().then(({ rows }) => {
        console.log('\n');
        console.table(rows);
    }).then(() => {
        loadMainPrompts();
    });
}
function viewByRole() {
    db.findAllRoles().then(({ rows }) => {
        let roles = rows;
        const rolesChoices = roles.map(({ role_id, role_title }) => ({
            name: role_title,
            value: role_id,
        }));

        prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which Role would you like to view the employees by?',
                choices: rolesChoices
            }
        ]).then((res) => db.findByRole(res.roleId))
            .then(({ rows }) => {
                console.log('\n');
                console.table(rows)
            })
            .then(() => {
                loadMainPrompts();
            });
    })
}
function viewByManager() {
    db.findAllEmployees().then(({ rows }) => {
        let employees = rows;
        const managerChoices = employees.map(({ employee_id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: employee_id,
        }));

        prompt([
            {
                type: 'list',
                name: 'managerId',
                message: 'Which employee do you want to see the direct reports for?',
                choices: managerChoices
            }
        ]).then((res) => db.findByManager(res.managerId))
            .then(({ rows }) => {
                let employees = rows;
                console.log('\n');
                if (employees.length === 0) {
                    console.log("The selected employee has no direct reports");
                } else {
                    console.table(rows)
                }
            })
            .then(() => {
                loadMainPrompts();
            });
    })
}
function viewByDepartment() {
    db.findAllDepartments().then(({ rows }) => {
        let departments = rows;
        const rolesChoices = departments.map(({ department_id, department_name }) => ({
            name: department_name,
            value: department_id,
        }));

        prompt([
            {
                type: 'list',
                name: 'departmentId',
                message: 'Which Department would you like to view the employees by?',
                choices: rolesChoices
            }
        ]).then((res) => db.findByDepartment(res.departmentId))
            .then(({ rows }) => {
                console.log('\n');
                console.table(rows)
            })
            .then(() => {
                loadMainPrompts();
            });
    })
}
function viewAllRoles() {
    db.findAllRoles().then(({ rows }) => {
        console.log('\n');
        console.table(rows);
    }).then(() => {
        loadMainPrompts();
    });
}
function viewAllDepartments() {
    db.findAllDepartments().then(({ rows }) => {
        console.log('\n');
        console.table(rows);
    }).then(() => {
        loadMainPrompts();
    });
}

// Add Prompt Functions
function addEmployee() {
    prompt([
        {
            name: 'first_name',
            message: 'What is the first name?'
        },
        {
            name: 'last_name',
            message: 'What is the last name?'
        }
    ]).then((res) => {
        let { first_name, last_name } = res;
        db.findAllRoles().then(({ rows }) => {
            const roles = rows.map(({ role_id, role_title }) => ({
                name: role_title,
                value: role_id,
            }));

            prompt([
                {
                    type: 'list',
                    name: 'roleId',
                    message: 'What is their role?',
                    choices: roles
                }
            ]).then((res)=>{
                let { roleId } = res;
                
                db.findAllEmployees().then(({rows})=>{
                    const managers = rows.map(({ employee_id, first_name, last_name})=>({
                        name: `${first_name} ${last_name}`,
                        value: employee_id
                    }));
                    managers.unshift({ name: "None", value: null});

                    prompt([
                        {
                            type: 'list',
                            name: 'managerId',
                            message: 'Who is their manager?',
                            choices: managers
                        }
                    ]).then((res)=>{
                        let employee = {
                            manager_id: res.managerId,
                            role_id: roleId,
                            first_name,
                            last_name
                        };

                        db.addEmployee(employee);
                    }).then(()=>{
                        console.log(`Added ${first_name} ${last_name} to the database.`);
                    }).then(()=> loadMainPrompts());
                })
            })
        })
    })


}
function addRole() {
    prompt([
        {
            name: 'role_title',
            message: 'What is the role title?'
        },
        {
            name: 'role_salary',
            message: 'What is the role salary?'
        }
    ]).then((res)=>{
        let salary = res.role_salary;
        let title = res.role_title;

        db.findAllDepartments().then(({rows}) => {
            const departments = rows.map(({department_id, department_name})=>({
                name: department_name,
                value: department_id
            }))

            prompt([
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'What department is this a part of?',
                    choices: departments
                }
            ]).then((res)=>{
                let role = {
                    salary,
                    title,
                    departmentId: res.departmentId
                }

                db.addRole(role).then(()=>{
                    console.log(`${title} has been added.`)
                }).then(()=> loadMainPrompts());
            })
        })
    })
}
function addDepartment() {
    prompt([
        {
            name: 'name',
            message: 'What is the department name?'
        }
    ]).then((res)=>{
        let name = res.name;

        db.addDepartment(name).then(()=>{
            console.log(`${name} was added to the list of available departments.`)
        }).then(()=>loadMainPrompts());
    })
}

// Update Prompt Functions
function updateEmployee() {
    db.findAllEmployees().then(({rows})=>{
        const employees = rows.map(({employee_id, first_name, last_name})=> ({
            name: `${first_name} ${last_name}`,
            value: employee_id
        }))

        prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee do you want to edit?',
                choices: employees
            }
        ]).then((res)=>{
            let employee = res.employee
            prompt([
                {
                    type: 'list',
                name: 'updateItem',
                message: 'What do you want to edit?',
                choices: [
                    {
                        name: 'first',
                        message: 'First Name',
                        value: 'first'
                    },
                    {
                        name: 'last',
                        message: 'Last Name',
                        value: 'last'
                    },
                    {
                        name: 'role',
                        message: 'Employee Role',
                        value: 'role'
                    },
                    {
                        name: 'manager',
                        message: 'Employee Manager',
                        value: 'manager'
                    }
                ]
                }
            ]).then((res)=>{
                switch(res.updateItem){
                    case 'first':
                        prompt([
                            {
                                name: 'first_name',
                                message: 'What is their first name?'
                            }
                        ]).then((res)=>{
                            db.updateEmployee(employee, 'first_name', res.first_name).then(()=>{
                                console.log("Employee Updated!");
                            }).then(()=>loadMainPrompts());
                        })
                        break;
                    case 'last':
                        prompt([
                            {
                                name: 'last_name',
                                message: 'What is their last name?'
                            }
                        ]).then((res)=>{
                            db.updateEmployee(employee, 'last_name', res.last_name).then(()=>{
                                console.log("Employee Updated!");
                            }).then(()=>loadMainPrompts());
                        })
                        break;
                    case 'role':
                        db.findAllRoles().then(({rows})=>{
                            let roles = rows.map(({role_id, role_title})=> ({
                                name: role_title,
                                value: role_id
                            }))
                       
                            prompt([
                                {
                                    type: 'list',
                                    name: 'role_id',
                                    message: 'What is their new role?',
                                    choices: roles
                                }
                            ]).then((res)=>{
                                db.updateEmployee(employee, 'role_id', res.role_id).then(()=>{
                                    console.log("Employee Updated!");
                                }).then(()=>loadMainPrompts());
                            })
                        })
                        break;
                    case 'manager':
                        db.findAllEmployees().then(({rows})=>{                        
                            prompt([
                                {
                                    type: 'list',
                                    name: 'manager_id',
                                    message: 'Who is their new manager?',
                                    choices: employees
                                }
                            ]).then((res)=>{
                                db.updateEmployee(employee, 'manager_id', res.manager_id).then(()=>{
                                    console.log("Employee Updated!");
                                }).then(()=>loadMainPrompts());
                            })
                        })
                        break;
                }
            })
        })
    })
}
function updateRole() {
    db.findAllRoles().then(({rows})=>{
        let roles = rows.map(({role_id, role_title})=>({
            name: role_title,
            value: role_id
        }))

        prompt([
            {
                type: 'list',
                name: 'roleId',
                message: 'Which role would you like to update',
                choices: roles
            }
        ]).then((res)=>{
            const role = res.roleId
            prompt([
                {
                    type: 'list',
                    name: 'updateItem',
                    mesage: 'What would you like to update?',
                    choices: [
                        {
                            name: 'Title',
                            value: 'title'
                        },
                        {
                            name: 'Salary',
                            value: 'salary'
                        },
                        {
                            name: 'Department',
                            value: 'department'
                        }
                    ]
                }
            ]).then((res)=>{
                switch(res.updateItem){
                    case 'title':
                        prompt([
                            {
                                name:'title',
                                message: 'What is the new title'
                            }
                        ]).then((res)=>{
                            let update = {
                                role_id: role,
                                updateInfo: res.title,
                                updateItem: 'role_title'
                            }

                            db.updateRole(update).then(()=>loadMainPrompts())
                        })
                        break;
                    case 'salary':
                        prompt([
                            {
                                name:'salary',
                                message: 'What is the new salary'
                            }
                        ]).then((res)=>{
                            let update = {
                                role_id: role,
                                updateInfo: res.salary,
                                updateItem: 'role_salary'
                            }

                            db.updateRole(update).then(()=>loadMainPrompts())
                        })
                        break;
                    case 'department':
                        db.findAllDepartments().then(({rows})=>{
                            let departments = rows.map(({department_id, department_name})=>({
                                name: department_name,
                                value: department_id
                            }))
                        
                            prompt([
                                {
                                    type: 'list',
                                    name:'department_id',
                                    message: 'What is the new department?',
                                    choices: departments
                                }
                            ]).then((res)=>{
                                console.log(res.department_id)
                                let update = {
                                    role_id: role,
                                    updateInfo: res.department_id,
                                    updateItem: 'department_id'
                                }

                                db.updateRole(update).then(()=>loadMainPrompts())
                            })
                        })
                        break;
                }
            })
        })
    })
}

// Delete Prompt Functions
function deleteEmployee() {
    console.log('deleteEmployee');
    loadMainPrompts();
}
function deleteRole() {
    console.log('deleteRole');
    loadMainPrompts();
}
function deleteDepartment() {
    console.log('deleteDepartment');
    loadMainPrompts();
}

// Exit Function
function quit() {
    console.log("Thank you for using Employee Tracker");
    process.exit();
}