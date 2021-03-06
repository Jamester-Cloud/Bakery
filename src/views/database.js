const mysql = require ('mysql');
const  {promisify}  = require('util');
//const { database } = ('./keys'); // comentar
const pool = mysql.createPool({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'enterprise',
    acquireTimeout: 30000,
    multipleStatements: true
});

pool.getConnection((err, connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONECTION_LOST '){ // cuando se pierde la conexion con la base de datos
            console.err("La Conexion con la base de datos fue cerrada");
        }
        if(err.code === 'ER_COUNT_ERROR'){ // cuando hay muchas conexiones
            console.err("La base de datos tiene muchas conexiones");
        }
        if(err.code === 'ERCONNREFUSED'){ // conexion rechazada. Credenciales erroneas
            console.err("La conexion a la base de datos fue rechazada");
        }
    }
    if(connection) connection.release();
    console.log("Esta conectado a la base de datos");
    return;
});
//hay notificacion de errores
pool.query = promisify(pool.query);
module.exports=pool;