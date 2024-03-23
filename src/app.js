import express from "express";
// import {Server} from "socket.io";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from "passport";
import passportConfig from "./config/passport.config.js";

//Importo las routes
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import viewsRouter from "./routes/views.router.js";
import authRouter from "./routes/auth.router.js";
// import signupRouter from "./routes/signup.router.js"; Las pasé al viewsRouter
// import loginRouter from "./routes/login.router.js"; Las pasé al viewsRouter



import {__dirname} from "./utils.js";

//Inicializo dotenv para proteger mis datos sensibles, y creo las constantes
dotenv.config();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const COOKIESECRET = process.env.COOKIESECRET;
const SESSIONSECRET = process.env.SESSIONSECRET;

//Creo y conecto el puerto
const app = express();
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`)
})

server.on("error", (error) => console.log(error)); // El server tiene metodos u opciones que nos permite manejar errores, y etc.

//Conecto mi BD de Mongoose
const environment = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log("Base de Datos conectada");
    } catch (error) {console.log(error)}
}

environment();

// mongoose.connect(DB_URL).then(()=> {console.log("Base de Datos conectada:" + DB_URL);
// }).catch((error)=>{console.log("Error en la conexion de la base de datos", error);})

// Inicializamos Express
app.use(express.json()); // Middleware que me permite recibir y mandar JSON
app.use(express.urlencoded({extended:true})); // Middleware que me permite obtener querys y params
app.use(express.static(__dirname + "/public")); // creamos el directorio publico

// Inicializamos Handlebars
app.engine("handlebars", handlebars.engine()); //motor 
app.set("views", __dirname + "/views"); // le decimos el directorio a utilizar
app.set("view engine", "handlebars"); //

// Inicializo y Configuro las Sessions. Trabaja con Mongo Store para que la info de la sesión se guarde en la base de datos a través del objeto request session.
app.use(session({
    store: MongoStore.create({
        mongoUrl: DB_URL, // Para registrarlo en la base de datos.
        ttl:60 * 60, // El tiempo en el que expirará la session
        mongoOptions: {
            useNewUrlParser:true,
        }
    }),
    secret: SESSIONSECRET,
    resave:false, //o true?
    saveUninitialized: true,
}))

//Conecto las routes
app.use("/api/products", productsRouter); //le pongo api para poder manejar el crud
app.use("/api/carts", cartRouter);
app.use("/api", authRouter)
app.use("/", viewsRouter) //aca va todo lo que renderiza una vistas de los handlebars




//Conecto el cookie-parser, convierte y pasa al front la info en una Cookie. 
app.use(cookieParser(COOKIESECRET));

passportConfig();
app.use(passport.initialize());
app.use(passport.session());


//Configuro el socket
// const socketServer = new Server(server);

// socketServer.on ("connection", (socket) => {
//     console.log("Nuevo Cliente Conectado");
    
//     socket.on("addProduct", async (product)=>{
//         const nombre= product.nombre;
//         const descripcion = product.descripcion;
//         const img = product.img;
//         const precio = product.precio;
//         const stock = product.stock;
//         const code = product.code;

//         try {
//             const agregarProducto = await productManager.addProduct(nombre, descripcion, img, precio, stock, code);
//             const allProducts = await productManager.getProducts();

//             agregarProducto && socketServer.emit("updateProducts", allProducts)
//         } catch (error) {console.log("Error al agregar Producto," + error)};
//         })

//     socket.on("deleteProduct", async (id) => {
//         try {
//             const borrarProducto = await productManager.deleteProductById(id);
//             const allProducts = await productManager.getProducts();

//             borrarProducto && socketServer.emit("updateProducts", allProducts)
//     } catch (error) {console.log("Error al eliminar el producto," + error)}})
// })

