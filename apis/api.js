const express = require('express');
const bodypress = require('body-parser');
const sql = require('mssql');

const app = express();
app.use(bodypress.json());

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});
  
//Set up your sql connection string, i am using here my own, you have to replace it with your own.  
var dbConfig = {  
    user: "SA",  
    password: "Ronak4490",  
    server: "localhost",  
    database: "TestDB"  
};
    
function queryToExecuteInDatabase(res, query) {
    sql.connect(dbConfig, function(error){
        if(error){
            console.log('Error while connect database');
            res.send(error);
        }else{
            const request = new sql.Request();
            request.query(query, function (error, responseResult) {
                if (error) {
                    console.log('Error: '+error);
                    res.send(error); 
                }else{
                    res.send(responseResult);
                }
            });
        }
    });
}

app.get('/', function(req, res){
    let sqlQuery = "select * from [Persons]";
    queryToExecuteInDatabase(res, sqlQuery);
});

app.post('/', function(req, res){
    let sqlQuery = "insert into [Persons] (PersonID, LastName, FirstName, Address, City) values (" + req.body.PersonID + ", '" + req.body.LastName + "', '" + req.body.FirstName + "', '" + req.body.Address + "', '"+ req.body.City+"')";
    queryToExecuteInDatabase(res, sqlQuery);
});

app.put('/:id', function(req, res){
    let sqlQuery = "update [Persons] set LastName='"+req.body.LastName+"', FirstName='"+req.body.FirstName+"', Address='"+req.body.Address+"', City= '"+req.body.City+"' WHERE PersonID="+req.params.id;
    queryToExecuteInDatabase(res, sqlQuery);
});

app.delete('/:id', function(req, res){
    let sqlQuery = "delete from [Persons] WHERE PersonID=" + req.params.id;
    queryToExecuteInDatabase(res, sqlQuery);
});

const server = app.listen(process.env.port || 8082, 'localhost', function(err){
    if (err) {
        throw err;
    }
    console.log('server start on http://%s:%s', server.address().address, server.address().port);
});