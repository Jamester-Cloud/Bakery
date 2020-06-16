const express=require('express'); // llamando a express
const router = express.Router(); // llamando al enrutador para la ejecucion del router
const pool = require('../views/database');// librerias para la conexion a la base de datos
const {isLoggedIn} = require('../lib/auth'); // llamando a las librerias en donde se verifica si el usuario esta logueado
/////////////////////////////////////////////////////////
router.get('/', isLoggedIn,async (reg,res)=>{ // vista principal(tienda en linea)
    const articulos = await pool.query('SELECT * FROM articulo LEFT JOIN categoria ON categoria.idCategoria=articulo.idCategoria WHERE articulo.estatusArticulo=1');
    res.render('pedidos/orders', {articulos:articulos} );
})

//ruta para agregar al carrito los articulos
router.get('/order/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params;
    const articulosIdFilter = await pool.query('SELECT * FROM articulo LEFT JOIN categoria ON categoria.idCategoria=articulo.idCategoria WHERE articulo.idArticulo=?', [id]);
    if(articulosIdFilter[0].stock == '0'){
        req.flash('message', 'Existencias Agotadas, diculpe. Intente mas tarde..'); //Mensaje de confirmacion
        res.redirect('/pedidos');
    }else{

        res.render('pedidos/order', {art:articulosIdFilter[0]});
    }
});
///Agregar al carrito
router.post('/agregarCarro', isLoggedIn, async(req,res)=>{
    const {idCliente,idArticulo,cantidad} = req.body; // datos del formulario
    //Objeto lista de articulos (antes de la asignacion de un id al cliente)
    const lista_articulos={
    	idArticulo,
    	idCliente,
    	cantidad
    }
    // insertando los datos en la lista del cliente
    const listaArticulos = await pool.query('INSERT INTO lista_articulos SET ?', [lista_articulos]);
    //Restando al stock de articulos en la db
    const itemsRestantes = await pool.query('SELECT SUM(stock-cantidad) AS restante FROM lista_articulos LEFT JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo WHERE lista_articulos.idListaArticulos=?', [listaArticulos.insertId]);
    await pool.query('UPDATE articulo SET stock=? WHERE articulo.idArticulo=?', [itemsRestantes[0].restante, idArticulo])
    // mensaje de confirmacion
    req.flash('success', ' Agregado al carro exitosamente'); //Mensaje de confirmacion
    res.redirect('/pedidos');
    
});

// carrito de compras
router.get('/lista_articulos/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params; // datos de la web
    // Consulta de la lista de articulos del cliente
    const listArtiFilter = await pool.query('SELECT * FROM lista_articulos LEFT JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo LEFT JOIN categoria ON articulo.idCategoria=categoria.idCategoria WHERE lista_articulos.idCliente=? AND lista_articulos.estatusListaArticulos=1',[id]);
    //Calculo del total a pagar en la DB
    const total = await pool.query('SELECT SUM(precio * cantidad) as totalPagar FROM lista_articulos LEFT JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo LEFT JOIN categoria ON articulo.idCategoria=categoria.idCategoria WHERE lista_articulos.idCliente=? AND lista_articulos.estatusListaArticulos=1',[id]);
    // cargando vista carrito de compras del cliente
    console.log(total);
    res.render('carrito/list', {listArt:listArtiFilter, totalPay:total[0].totalPagar}); 
});
/// procedimiento del cashout
router.post('/cashout', isLoggedIn, async(req,res)=>{
    // data del formulario
    const {idCliente,descripcion,fechaEntrega} = req.body;
    //creando el objeto del nuevo pedido
    const newPedido={ 
        descripcion,
        fechaEntrega
    }
    // creando el objeto pedido_cliente
    const newPedidoCliente={
        idPedido:0,
        idCliente,
        totalAPagar:0
    }
    //Multiplicando la cantidad por el total
    const total = await pool.query('SELECT SUM(precio * cantidad) as totalPagar FROM lista_articulos LEFT JOIN articulo ON articulo.idArticulo=lista_articulos.idArticulo LEFT JOIN categoria ON articulo.idCategoria=categoria.idCategoria WHERE lista_articulos.idCliente=?',[idCliente]);
    newPedidoCliente.totalAPagar=total[0].totalPagar;
    // comienzo de la transaccion
    try {
        await pool.query("START TRANSACTION");
        // estableciendo el commit a cero 
        await pool.query('SET autocommit=0');
        //insertando el nuevo pedido en la db
        const pedido = await pool.query('INSERT INTO pedido SET ?', [newPedido]);
        // llamando al ultimo id Insertado
        newPedidoCliente.idPedido=pedido.insertId;
        console.log(newPedidoCliente);
        //insertando el pedido_cliente en la db
        await pool.query('INSERT INTO pedido_cliente SET ?', [newPedidoCliente]);
        //vaciando el carrito de compras
        await pool.query('UPDATE lista_articulos SET estatusListaArticulos=0 WHERE idCliente=?', [idCliente]);
        //Commit de la transaccion
        await pool.query("COMMIT");
        // Mensaje de confirmacion y redireccionamiento
        req.flash('success', 'Ha realizado un pedido de nuestra tienda, Muchas Gracias!, en breve se lo enviaremos..'); //Mensaje de confirmacion
        res.redirect('/pedidos');
    } catch (error) {
        await pool.query("ROLLBACK"); /// Rollback 
        console.log('Ha ocurrido un error, error en:', error);
        req.flash('message', 'ERROR: '+ error);
        //res.redirect('/pedidos');
        throw err;
    }
});

//Ver pedidos del cliente
router.get('/lista_pedidos/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params; // id de la web
    // Consulta de la lista de pedidos del cliente(Activos)
    const listPedidosFilter = await pool.query('SELECT * FROM pedido_cliente LEFT JOIN pedido ON pedido_cliente.idPedido=pedido.idPedido LEFT JOIN cliente ON cliente.idCliente=pedido_cliente.idCliente LEFT JOIN persona ON cliente.idPersona=persona.idPersona WHERE pedido_cliente.idCliente=? AND pedido_cliente.estatusPedidoCliente=1',[id]);   
    // Consulta de la lista de pedidos del cliente(Completados)
    const listPedidosFilterCompleted = await pool.query('SELECT * FROM pedido_cliente LEFT JOIN pedido ON pedido_cliente.idPedido=pedido.idPedido LEFT JOIN cliente ON cliente.idCliente=pedido_cliente.idCliente LEFT JOIN persona ON cliente.idPersona=persona.idPersona WHERE pedido_cliente.idCliente=? AND pedido_cliente.estatusPedidoCliente=2',[id]); 
    // Consulta de la lista de pedidos del cliente(Anulados o inactivos)
    const listPedidosFilterDesactivados = await pool.query('SELECT * FROM pedido_cliente LEFT JOIN pedido ON pedido_cliente.idPedido=pedido.idPedido LEFT JOIN cliente ON cliente.idCliente=pedido_cliente.idCliente LEFT JOIN persona ON cliente.idPersona=persona.idPersona WHERE pedido_cliente.idCliente=? AND pedido_cliente.estatusPedidoCliente=0',[id]);
    // cargando vista Pedidos del cliente
    res.render('pedidos/list', {listPedido:listPedidosFilter,listPedidoComplete:listPedidosFilterCompleted,listPedidoIncomplete:listPedidosFilterDesactivados}); 
});

//Confirmando Pedido
router.get('/confirmar/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params; // data del formulario
    // Actualizacion del pedido
    await pool.query('UPDATE pedido_cliente SET estatusPedidoCliente=2 WHERE idPedidoCliente=?',[id]);
    //redirigiendo
    req.flash('success', 'Gracias, por su preferencia!'); //Mensaje de confirmacion
    res.redirect('/profile');  
})
//Anulando Pedido
router.get('/anular/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params; // data del formulario
    // Actualizacion del pedido
    await pool.query('UPDATE pedido_cliente SET estatusPedidoCliente=0 WHERE idPedidoCliente=?',[id]);
    //redirigiendo
    req.flash('message', 'El pedido ha sido anulado.'); //Mensaje de confirmacion
    res.redirect('/profile');  
})

module.exports=router;
