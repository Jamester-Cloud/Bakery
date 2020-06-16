const express=require('express');
const router = express.Router();
const pool = require('../views/database');
const {isLoggedIn} = require('../lib/auth'); // llamando a las librerias en donde se verifica si el usuario esta logueado
//////////////////////////////////////////////////////////////////////
// Agregando datos de un articulo en la db
router.post('/add', isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {nombre,precio,stock,idCategoria} = req.body;
        const newArticulo = {
            idCategoria,
            nombre,
            precio,
            stock
        };
        await pool.query('INSERT INTO articulo SET ?', [newArticulo]);
        req.flash('success', 'Articulo agregado exitosamente'); //Mensaje de confirmacion
        res.redirect('/articulo');
    }else{
        res.redirect('/profile'); 
    }
});

// ruta para la consulta de los articulos
router.get('/', isLoggedIn,async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const category = await pool.query('SELECT * FROM categoria');
        const articulos = await pool.query('SELECT * FROM articulo LEFT JOIN categoria ON categoria.idCategoria=articulo.idCategoria WHERE articulo.estatusArticulo=1');
        res.render('articulos/list', {articulos:articulos,category:category} );
    }else{
        res.redirect('/profile'); 
    }
    
})
//ruta para la eliminacion de los productos
router.get('/borrar/:id' , isLoggedIn, async (req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        await pool.query('UPDATE articulo SET estatusArticulo=0 WHERE idArticulo = ?', [id]);
        req.flash('success', ' Articulo Eliminado exitosamente'); //Mensaje de confirmacion
        res.redirect('/articulo');
    }else{
        res.redirect('/profile'); 
    }
});

//ruta para modificar los registros
router.get('/modificar/:id', isLoggedIn, async(req,res)=>{
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const category = await pool.query('SELECT * FROM categoria');
        const productosIdFilter = await pool.query('SELECT * FROM articulo WHERE idArticulo = ?', [id]);
        res.render('articulos/edit', {producto:productosIdFilter[0],category:category});
    }else{
        res.redirect('/profile'); 
    }
    
});
// funcion que recibe los datos del formulario para la modificacion en la base de datos
router.post('/modificar/:id', isLoggedIn, async (req,res) =>{ 
    if(req.user.perfil == 'Administrador'){ // verificando rol del usuario en el sistema
        const {id} = req.params;
        const {nombre,precio,idCategoria,stock} = req.body; // datos del formulario
        const newArticulo = {
            nombre,
            precio,
            idCategoria,
            stock
        };

        await pool.query('UPDATE articulo SET ? WHERE idArticulo=?',[newArticulo,id]);
        req.flash('success', 'Articulo modificado exitosamente'); //Mensaje de confirmacion
        res.redirect('/articulo');
    }else{
        res.redirect('/profile'); 
    }
})

module.exports=router;