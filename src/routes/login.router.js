import {Router} from "express";

const router = Router();

router.get("/", (req,res) => {
    res.render("login", {
        title: "Inicia Sesión",
        style:"/css/styles.css",
    })
});

export default router;