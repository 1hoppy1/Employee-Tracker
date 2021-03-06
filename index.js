const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
const connection = require("./db/database")
require("console.table")

connection.connect(function (err) {
  if (err) {
    console.log(err)
  }
  console.log("connection id", connection.threadId)
  mainMenu()
})

function mainMenu() {
  inquirer.prompt([{
    type: 'list',
    name: 'mainMenu',
    message: 'What do you want to do?',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
  }]).then(function (userInput) {
    switch (userInput.mainMenu) {
      case "View all departments":
        viewDepartments()
        break
      case "View all roles":
        viewRoles()
        break
      case "View all employees":
        viewEmployee()
        break
      case "Add a department":
        addDepartment()
        break
      case "Add a role":
        addRole()
        break
      case "Add an employee":
        addEmployee()
        break
      case "Update an employee role":
        updateEmployeeRole()
        break
    }
  })
}

function viewDepartments() {
  var statement = connection.query("SELECT * FROM department", function (err, data) {
    console.table(data)
    mainMenu()
  })
}

function viewRoles() {
  var statement = connection.query("SELECT * FROM role",
    function (err, data) {
      console.table(data)
      mainMenu()
    }
  )
}

function viewEmployee() {
  var statement = connection.query("SELECT * FROM employee",

    function (err, data) {
      console.table(data)
      mainMenu()
    }
  )
  // Can't figure out how to make it work... :(
  // `SELECT employee.id id, employee.first_name firstName,
  // employee.last_name lastName, roles.title, CONCAT(employee2.first_name, " ", employee2.last_name) 
  // manager FROM employee LEFT JOIN employee employee2 ON employee.manager_id = employee2.id
  // LEFT JOIN roles ON employee.role_id = roles.id;`
}

function updateEmployeeRole() {
  var statement = connection.query("SELECT * FROM employee",
    function (err, data) {
      console.table(data)
      updateRole()
    }
  )

  function updateRole() {

    inquirer.prompt([{
        type: "number",
        message: "Enter Employee ID Number.",
        name: "updateRole1"
      },
      {
        type: "input",
        message: "Enter Employees new Role Number.",
        name: "updateRole2",

      }

    ]).then(function (userInput) {
      connection.query(`UPDATE employee SET role_id = ${userInput.updateRole2} WHERE id = ${userInput.updateRole1}`)
      mainMenu()
    })
  }
}

function addDepartment() {
  inquirer.prompt([{
    type: "input",
    message: "What is the New Departments name?",
    name: "newDepartment"
  }]).then(function (userInput) {
    connection.query("INSERT INTO department(name)VALUES(?)", [userInput.newDepartment])
    mainMenu()
  })
}

function addRole() {
  inquirer.prompt([{
      type: "input",
      message: "New Role Title?",
      name: "NewRoleTitle"
    },
    {
      type: "number",
      message: "New Role Salary?",
      name: "NewRoleSalary"
    },
    {
      type: "number",
      message: "New Role Department Id?",
      name: "NewRoleDepartmentID"
    }
  ]).then(function (userInput) {
    connection.query("INSERT INTO role(title, salary, department_id)VALUES(?, ?, ?)", [userInput.NewRoleTitle, userInput.NewRoleSalary, userInput.NewRoleDepartmentID])
    mainMenu()
  })
}

function addEmployee() {
  inquirer.prompt([{
      type: "input",
      message: "First Name?",
      name: "firstName"
    },
    {
      type: "input",
      message: "Last Name?",
      name: "lastName"
    },
    {
      type: "number",
      message: "New employee role id number?",
      name: "roleID"
    },
    {
      type: "input",
      message: "New employee managers ID?",
      name: "managerID"
    }
  ]).then(function (userInput) {
    connection.query("INSERT INTO employee(first_name, last_name, role_id, manager_id)VALUES(?, ?, ?, ?)", [userInput.firstName, userInput.lastName, userInput.roleID, userInput.managerID])
    mainMenu()
  })
}