// passport usa strategies para realizar ciertas tareas/funciones. Ej, autenticar usuarios con google, o passport local, etc.npm
// instalo passport, y ademas passport-local que es la estrategia que voy a usar con passport

import passport from "passport";
import passportLocal from "passport-local";
import passportGoogle from "passport-google-oauth20";
import dotenv from "dotenv";
import UserService from "../dao/dbManagers/user.service.js";
import CartService from "../dao/dbManagers/cart.service.js";
import bcrypt from "bcrypt";

dotenv.config();

const userService = new UserService();
const cartService = new CartService();

const passportConfig = () => {passport.use("login", new passportLocal.Strategy(

    {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true,
    },

async function (req, username, password, done) {
    try {
        const user = userService.getUserByEmail(username);
        const passwordMatches = bcrypt.compare(password, user.password);

        if(!user) {
            return done(null, false,{message:"Usuario no encontrado"})
        } 
    
        if (!passwordMatches) {
            return done(null, false,{message:"Contraseña Incorrecta"})
        }

        return done (null, user);

    } catch (error) {
        console.log(error.message)
        return done(error);
    }}
))

passport.use("signup", new passportLocal.Strategy(

{
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
},

async function (req, username, password, done) {
try {
    const user = userService.getUserByEmail(username);

    if(user) {
        return done(null, false,{message:"El Usuario ingresado ya existe"})
    }
    
    const userPassword = await bcrypt.hash(password, 10);

    const {first_name, last_name, age} = req.body; //lo creo despues de verificar si ese usuario existe o no, para no ejecutar al cohete.

    const cart = await cartService.createCart()

    const newUser = await userService.createUser({first_name, last_name, email: username, password: userPassword, age, role:"user", cart: cart._id})

    if (!newUser) {
        return done(null, false,{message:"Error al crear el usuario"})
    }
    
    return done (null, newUser);

} catch (error) {
    console.log(error.message)
    return done(error);
}}
))

passport.use("google", 
    new passportGoogle.Strategy (
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8082/api/googlecallback",
    },

    async function(accessToken, refreshToken, profile, done) {
        try {
            const cart = await cartService.createCart()

            const objectUser = {
                email: profile.emails[0].value,
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                password: "password", //mandar mail para confirmar cuenta e ingresar nueva contraseña
                cart: cart._id,
            };
    
            const user = await userService.getOrCreate(objectUser);
    
            if(!user) {
                return done(null, false, {message:"Error Interno del Servidor"})
            }
    
            return done(null, user);

        } catch(error) {
            console.log(error.message);
            done(error, null)
        }        
    }))

passport.serializeUser(function (user, done) {
done(null,user._id)
});

passport.deserializeUser(async function (id, done) {
const user = await userService.getUserById(id);
delete user.password;
done (null, user);
})}

export default passportConfig;
