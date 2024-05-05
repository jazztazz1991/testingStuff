const pool = require('./connection');

class DB {
    constructor(){}

    async query(sql, args =[]) {
        const client = await pool.connect();
        try{
            const result = await client.query(sql, args);
            return result;
        } finally {
            client.release();
        }
    }

    findAllEmployees(){
        return this.query("SELECT * FROM employees");
    }
    findByRole(roleId){
        return this.query('SELECT * FROM employees WHERE role_id = $1', [roleId])
    }
    findByDepartment(departmentId){
        return this.query('SELECT employee_id as id, first_name, last_name, role_title as role FROM employees left join roles on employees.role_id = roles.role_id left join departments on roles.department_id = departments.department_id where departments.department_id = $1', [departmentId])
    }
    findByManager(managerId){
        return this.query('SELECT * FROM employees WHERE manager_id = $1', [managerId])
    }
    findAllRoles(){
        return this.query('SELECT * FROM roles');
    }
    findAllDepartments(){
        return this.query('SELECT * FROM departments');
    }
    findDepartmentBudget(){}
    addEmployee(employee){
        return this.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) values ($1, $2, $3, $4)',[employee.first_name, employee.last_name, employee.role_id, employee.manager_id]);
    }
    addRole(role){
        return this.query('INSERT INTO roles (role_title, role_salary, department_id) values ($1, $2, $3)', [role.title, role.salary, role.departmentId]);
    }
    addDepartment(department){
        return this.query('INSERT INTO departments (department_name) values ($1)', [department])
    }
    updateEmployee(employeeId, updateItem, updateInfo){
        return this.query(`UPDATE employees SET ${updateItem} = $2 WHERE employee_id = $1`, [employeeId, updateInfo])
    }
    updateRole(role){
        return this.query(`UPDATE roles SET ${role.updateItem} = $2 WHERE role_id = $1`, [role.role_id, role.updateInfo])
    }
    deleteEmployee(){}
    deleteRole(){}
    deleteDepartment(){}
}

module.exports = new DB();