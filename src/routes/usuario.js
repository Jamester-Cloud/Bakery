const express=require('express'); // llamando a express
const router = express.Router(); // llamando al enrutador para la ejecucion del router
const pool = require('../views/database');// librerias para la conexion a la base de datos
const {isLoggedIn} = require('../lib/auth'); // llamando a las librerias en donde se verifica si el usuario esta logueado
//////////////////////////////////////////////////////////////////////
//consultar
router.get('/', isLoggedIn,async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const usuario = await pool.query('SELECT * FROM usuario LEFT JOIN persona ON usuario.idPersona=persona.idPersona LEFT JOIN perfil_usuario ON usuario.idUsuario=perfil_usuario.idUsuario LEFT JOIN perfil ON perfil.idPerfil=perfil_usuario.idPerfil');
        res.render('usuarios/list', {usuario});
    }else{
        res.redirect('/profile'); 
    }
});
//eliminar
 //ruta para la eliminacion de los usuario. Seran eliminados para siempre
 router.get('/borrar/:id' , isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        await pool.query('DELETE FROM usuario WHERE idUsuario=?', [id]);
        req.flash('success', ' Perfil eliminado exitosamente'); //Mensaje de confirmacion
        res.redirect('/perfil');
    }else{
        res.redirect('/profile'); 
    }
});
//////Funciones cliente
 //ruta para modificar los registros de un usuario si este es de perfil cliente y lo podra hacer desde la vista mi perfil
router.get('/modificar/:id', isLoggedIn, async(req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const usuarioIdFilter = await pool.query('SELECT * FROM usuario LEFT JOIN persona ON persona.idPersona=usuario.idPersona WHERE idUsuario = ?', [id]);
        res.render('perfil/miPerfil', {usuario:usuarioIdFilter[0]});
    }else{
        res.redirect('/profile'); 
    }
});
// funcion que recibe los datos del formulario para la modificacion en la base de datos
router.post('/modificar/:id', isLoggedIn, async (req,res) =>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const {nombrePersona,apellidoPersona,correoPersona,username,pass} = req.body; // datos del formulario
        const newUsuario = {
            nombrePersona,
            apellidoPersona,
            correoPersona,
            username,
            pass,
        };
       await pool.query('UPDATE usuario SET ? WHERE idUsuario=?',[newUsuario,id]);
       req.flash('success', 'Perfil modificado exitosamente'); //Mensaje de confirmacion
       res.redirect('/usuario');
    }else{
        res.redirect('/profile'); 
    } 
    
})

module.exports=router;