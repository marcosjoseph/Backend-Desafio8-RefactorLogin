import {Router} from "express";

const router = Router();

router.get("/", (req,res) => {
    res.render("signup", {
        title:"Creá tu cuenta",
        style:"/css/styles.css",
    })
});

export default router;