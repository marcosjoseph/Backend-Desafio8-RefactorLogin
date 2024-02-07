import {Router} from "express";
import {UserModel} from "../dao/models/user.model.js";
import {auth} from "../middlewares/index.js";

const router = Router();

router.post("/api/login", async (req,res) => {
    const {email, password} = req.body;
    const result = await UserModel.findOne({email, password}); //por seguridad, la password no deberia estar aca. habria que cryptarla.

    if(result === null) {
        res.status(400).json({error:"Usuario o contraseña incorrectos"})
    } else {
        req.session.user = email;
        req.session.role = result.role || "user";
        res.status(200).json({
            respuesta:"Ok"
        })
    }
});

router.post("/api/signup", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body;

    const newUser = {first_name, last_name, email, password, age, role:"user",}

    const user = new UserModel(newUser);

    const result = await user.save();

    if (result === null) {
        res.status(400).json({
            error: "Error al crear el usuario"
        })
    } else {
        req.session.user = email;
        req.session.role = newUser.role || "user";
        res.status(201).json({
            respuesta:"Usuario creado con éxito"
        })
    }
})

router.get("/privado", auth, (req, res) => {
    res.render("topsecret", {
        title: "Privado",
        user: req.session.user,
        style:"/css/styles.css",
    })
} )

export default router;