import {Router} from "express";
// import {UserModel} from "../dao/models/user.model.js";
// import UserService from "../dao/dbManagers/user.service.js";
// import {auth} from "../middlewares/index.js";
// import bcrypt from "bcrypt";
import passport from "passport";

const router = Router();
// const userService = new UserService();

// agregamos el passport authenticate antes de la funcion para que valide si está ok, y despues ahi redirigirnos al siguiente url.

router.post("/login", passport.authenticate("login", {}), async (req, res) => {

    if(!req.loginSuccess) {
        return res.status(401).json({success:false, message:"Los datos ingresados son incorrectos"})}

    res.status(200).json({success:true, message:"Usuario ingresado correctamente", redirectUrl: "/products"})
})

router.post("/signup", passport.authenticate("signup", {session:false}), async (req, res) => {
    if(!req.signupSuccess) {
        return res.status(400).json({success:false, message:"El usuario ingresado ya existe"})
    }
    res.status(201).json({success:true, message:"Usuario registrado correctamente", redirectUrl: "/login"})
})

router.get("/google", passport.authenticate("google", {scope: ["profile email"]}));

router.get("/googlecallback", passport.authenticate("google", {failureRedirect:"/login"}), function (req, res) {
    res.redirect("/products")});

// router.post("/login", async (req,res) => {

//     try { 
//         const {email, password} = req.body;
//         // const result = await UserModel.findOne({email, password}); //por seguridad, la password no deberia estar aca. habria que cryptarla.

//         const user = await userService.getUserByEmail(email)
//         const passwordMatches = bcrypt.compare(password, user.password);

//         if(!user) {
//             res.status(400).json({error:"Usuario no encontrado"})
//         } 
    
//         if (!passwordMatches) {
//             res.status(401).json({error:"Contraseña Incorrecta"})
//         } else {
//             delete user.password;
//             req.session.user = user; // req.session.user = email;
//             req.session.role = user.role || "user";
//             res.status(200).json({success:true})
//         }
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({success:false, message: "Error interno del servidor"})
//     }
// });

// router.post("/signup", async (req, res) => {
//     try {
//         const {first_name, last_name, email, password, age} = req.body;

//         const userExists = await userService.getUserByEmail(email); //Buscamos a ver si ya existe el usuario

//         if (userExists) {
//             return res.status(400).json({success:false, message:"El usuario ya existe."}) //Si ya existe, le damos un error
//         }

//         const userPassword = await bcrypt.hash(password, 10); //Encriptamos la contraseña del usuario

//         const newUser = await userService.createUser({first_name, last_name, email, password: userPassword, age, role:"user"}) //Si no existe, creamos el nuevo usuario

//         if (!newUser) {
//             return res.status(400).json({success:false, error: "Error al crear el usuario"})
//         } else {
//             req.session.user = email;
//             req.session.role = newUser.role || "user";
//             res.status(201).json({success:true})
//     }} catch (error) {
//         console.log(error.message);
//         res.status(500).json({success:false, message:"Error Interno del servidor"})
//     }
    
// })

// router.get("/privado", auth, (req, res) => {
//     res.render("topsecret", {
//         title: "Privado",
//         user: req.session.user,
//         style:"/css/styles.css",
//     })
// } )

export default router;