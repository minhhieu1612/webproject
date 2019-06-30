var config=require('config');
var mysl=require('mysql');
var connection=mysl.createConnection({
    host: config.get('mysql.host'),
    user: config.get('mysql.user'),
    password: config.get('mysql.password'),
    database: config.get('mysql.database'),
    port: config.get('mysql.port')
});
connection.connect();
function getConnection(){
    if(!connection){
        connection.connect();
    }
    return connection;
}
module.exports={
    getConnection:getConnection
}
