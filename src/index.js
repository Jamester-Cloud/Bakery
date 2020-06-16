const express = require('express');
const morgan =require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const passport= require('passport');
/// Iniatizilations
const app = express(); // aplications
const {database} = require('./keys');
require('./lib/passport');
//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layaouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars')
    
}));
app.set('view engine', '.hbs'); // estableciendo las extensiones de las vistas a hbs (Handlebars)

//Midlewares
app.use(session({
    secret:'Jamester',
    resave:false,
    saveUninitialized:false,
    store: new mysqlStore(database)
 }));
app.use(flash()); /// Mensajes
app.use( morgan('dev') ); // utilizando herramienta de desarrolador morgan
app.use(express.urlencoded({extended:false})); // que solo acepte nombres o formatos en strings   
app.use(express.json()); // utilizando json
app.use(passport.initialize()); // iniciando passport
app.use(passport.session()); // dandole a passport una session

//Global variables
app.use((req, res, next) => { // toma la informacion del usuario
    app.locals.success =  req.flash('success'); 
    app.locals.message =  req.flash('message');
    //Agregando usuario(Administrador)
    app.locals.users = req.user;
    //Ejecutando el codigo siguiente
    next();
});
//Routes
app.use(require('./routes')); // llamando al archivo rutas donde se encuentran todo los maestros
app.use(require('./routes/aunthentications')); // rutas principales de inicio de sesion y signup
app.use('/articulo',require('./routes/articulo')); // articulo
app.use('/clientes',require('./routes/clientes')); // cliente
app.use('/perfil', require('./routes/perfil')); // perfiles
app.use('/usuarios', require('./routes/usuario')); // perfiles
app.use('/categoria', require('./routes/categoria')); // categorias
app.use('/pedidos', require('./routes/pedidos')); // pedidos
//Public
app.use(express.static(path.join(__dirname, 'assets'))) // recursos externos de caracter publico(Img,icons,etc..)
//Starting the server
app.listen(app.get('port'), ()=>{
    console.log("Servidor en el puerto", app.get('port'));
})


