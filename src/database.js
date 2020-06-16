const mysql = require ('mysql');
const  {promisify}  = require('util');
//const { database } = ('./keys'); // comentar
const pool = mysql.createPool({
    host: "ec2-52-202-146-43.compute-1.amazonaws.com",
    user: 'qimlnyuyjrtgpj',
    password: 'bf6d928a02aef6c0a2c377a5f5cbd5ff57ec9c2b1d9f3d6c7bf135186e3e0c95',
    database: 'd4af7nba4huah8',
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
//hay notificacion de errores en formato promesas y no en callbacks 
pool.query = promisify(pool.query);
module.exports=pool;