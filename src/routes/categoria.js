const express=require('express');
const router = express.Router();
const pool = require('../views/database');
const {isLoggedIn} = require('../lib/auth'); // llamando a las librerias en donde se verifica si el usuario esta logueado
//////////////////////////////////////////////////////////////////////
// Agregando datos de una categoria en la db
router.post('/add', isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {categoria} = req.body;
        const newCategoria = {
            categoria,
        };
        await pool.query('INSERT INTO categoria SET ?', [newCategoria]);
        req.flash('success', 'Categoria agregada exitosamente'); //Mensaje de confirmacion
        res.redirect('/categoria');
    }else{
        res.redirect('/profile'); 
    }
});
// ruta para la consulta de las categorias
router.get('/', isLoggedIn,async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const category = await pool.query('SELECT * FROM categoria');
        res.render('categoria/list', {category:category} );
    }else{
        res.redirect('/profile'); 
    }
})
//ruta para la eliminacion de los productos
router.get('/borrar/:id' , isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        await pool.query('DELETE FROM categoria WHERE idCategoria = ?', [id]);
        req.flash('success', ' Categoria Eliminada exitosamente'); //Mensaje de confirmacion
        res.redirect('/categoria');
    }else{
        res.redirect('/profile'); 
    }
});

//ruta para modificar los registros
router.get('/modificar/:id', isLoggedIn, async(req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const categoriaIdFilter = await pool.query('SELECT * FROM categoria WHERE idCategoria = ?', [id]);
        res.render('categoria/edit', {categoria:categoriaIdFilter[0]});
    }else{
        res.redirect('/profile'); 
    }
});
// funcion que recibe los datos del formulario para la modificacion en la base de datos
router.post('/modificar/:id', isLoggedIn, async (req,res) =>{ 
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const {categoria} = req.body; // datos del formulario
        const newCategoria = {
            categoria
        };
        await pool.query('UPDATE categoria SET ? WHERE idCategoria=?',[newCategoria,id]);
        req.flash('success', 'categoria modificado exitosamente'); //Mensaje de confirmacion
        res.redirect('/categoria');
    }else{
        res.redirect('/profile'); 
    }
})

module.exports=router;