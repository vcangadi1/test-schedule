const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: 'test123',
    database: 'EmployeeDB',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err)
    console.log('DB connection successful')
    else
    console.log('DB connection failed \n Error : '+ JSON.stringify(err,undefined,2));
});

app.listen(80,()=>console.log('Express server is running at port no : 80'));

// Get all employees
app.get('/employees',(req,res)=>{
    mysqlConnection.query('SELECT * from Employee',(err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    });
});

// Get an employees
app.get('/employees/:id',(req,res)=>{
    mysqlConnection.query('SELECT * from Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
        res.send(rows);
        else
        console.log(err);
    });
});

// Delete an employees
app.delete('/employees/:id',(req,res)=>{
    mysqlConnection.query('DELETE FROM Employee WHERE EmpID = ?',[req.params.id],(err, rows, fields)=>{
        if(!err)
        res.send('Delete successfully');
        else
        console.log(err);
    });
});

// Insert an employees
app.post('/employees',(req,res)=>{
    let emp = req.body;
    var sql = "\
    SET @EmpID = ?; \
    SET @Name = ?; \
    SET @EmpCode = ?; \
    SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields)=>{
        if(!err)
            rows.forEach(element => {
                if(element.construct == Array)
                    res.send('Inserted employee id : '+element[0].EmpID);
            });
        else
            console.log(err);
    });
});


// Update an employees
app.put('/employees',(req,res)=>{
    let emp = req.body;
    var sql = "\
    SET @EmpID = ?; \
    SET @Name = ?; \
    SET @EmpCode = ?; \
    SET @Salary = ?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql,[emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields)=>{
        if(!err)
            res.send('Updated successful')
        else
            console.log(err);
    });
});