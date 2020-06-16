const express=require('express'); // llamando a express
const router = express.Router(); // llamando al enrutador para la ejecucion del router
const pool = require('../views/database');// librerias para la conexion a la base de datos
const {isLoggedIn} = require('../lib/auth'); // llamando a las librerias en donde se verifica si el usuario esta logueado
//////////////////////////////////////////////////////////////////////
router.get('/', isLoggedIn,async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const perfiles = await pool.query('SELECT * FROM perfil');
        res.render('perfil/list', {perfiles});
    }else{
        res.redirect('/profile'); 
    }
});
 //ruta para la eliminacion de los clientes. Seran eliminados para siempre
 router.get('/borrar/:id' , isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        await pool.query('DELETE FROM perfil WHERE idPerfil=?', [id]);
        req.flash('success', ' Perfil eliminado exitosamente'); //Mensaje de confirmacion
        res.redirect('/perfil');
    }else{
        res.redirect('/profile'); 
    }
});
// Agregando datos de un perfil en la db
router.post('/add', isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {perfil} = req.body;
        const newPerfil = {
        perfil,
        };
        await pool.query('INSERT INTO perfil SET ?', [newPerfil]);
        req.flash('success', 'Perfil agregado exitosamente'); //Mensaje de confirmacion
        res.redirect('/perfil');
    }else{
        res.redirect('/profile'); 
    }
 });
 //ruta para modificar los registros de un perfil
router.get('/modificar/:id', isLoggedIn, async(req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const perfilIdFilter = await pool.query('SELECT * FROM perfil WHERE idPerfil = ?', [id]);
        res.render('perfil/edit', {perfil:perfilIdFilter[0]});
    }else{
        res.redirect('/profile'); 
    }
});
// funcion que recibe los datos del formulario para la modificacion en la base de datos
router.post('/modificar/:id', isLoggedIn, async (req,res) =>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const {perfil} = req.body; // datos del formulario
        const newPerfil = {
            perfil
        };

        await pool.query('UPDATE perfil SET ? WHERE idPerfil=?',[newPerfil,id]);
        req.flash('success', 'Perfil modificado exitosamente'); //Mensaje de confirmacion
        res.redirect('/perfil');
    }else{
        res.redirect('/profile'); 
    } 

})

module.exports=router;