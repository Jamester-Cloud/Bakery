const express=require('express');
const router = express.Router();
const pool = require('../views/database');
const {isLoggedIn} = require('../lib/auth'); // llamando a las librerias en donde se verifica si el usuario esta logueado
//////////////////////////////////////////////////////////////////////
 // ruta para la consulta de los clientes. En donde cada cliente registrado habra hecho minimo una transaccion
 router.get('/', isLoggedIn,async (req,res)=>{
     if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const clientes = await pool.query('SELECT * FROM cliente LEFT JOIN persona ON persona.idPersona=cliente.idPersona WHERE estatusCliente=1');
        res.render('clientes/list', {clientes});
     }else{
        res.redirect('/profile');  
     }
 })


 //ruta para la eliminacion de los clientes. Seran eliminados para siempre
router.get('/borrar/:id' , isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        await pool.query('DELETE FROM cliente WHERE idCliente=?', [id]);
        req.flash('success', ' Cliente eliminado exitosamente'); //Mensaje de confirmacion
        res.redirect('/clientes');
    }else{
        res.redirect('/profile'); 
    }
});

//ruta para modificar los registros de un cliente
router.get('/modificar/:id', isLoggedIn, async(req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const clientesIdFilter = await pool.query('SELECT * FROM cliente LEFT JOIN persona ON persona.idPersona=cliente.idPersona WHERE idCliente = ?', [id]);
        res.render('clientes/edit', {clientes:clientesIdFilter[0]});
    }else{
        res.redirect('/profile'); 
    }
});

// funcion que recibe los datos del formulario para la modificacion en la base de datos
router.post('/modificar/:id', isLoggedIn, async (req,res) =>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const {nombrePersona,apellidoPersona,correoPersona} = req.body; // datos del formulario
        const newCliente = { // objeto con la informacion del formulario
            nombrePersona,
            apellidoPersona,
            correoPersona
        };
        await pool.query('UPDATE persona LEFT JOIN cliente ON persona.idPersona=cliente.idPersona SET ? WHERE idCliente=?',[newCliente,id]);
        req.flash('success', 'cliente modificado exitosamente'); //Mensaje de confirmacion
        res.redirect('/clientes');
    }else{
        res.redirect('/profile'); 
    } 
})

module.exports=router;
 