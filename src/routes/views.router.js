import {Router} from "express";
import Products from "../dao/dbManagers/product.service.js";
import Carts from "../dao/dbManagers/cart.service.js";
// import isLoggedIn from "../middlewares/isLoggedIn.js";

const router = Router();

router.get("/products", async (req, res) => {
    const products = new Products();
    const result = await products.getAll();
    res.render("products", {title:"Listado de Productos", products: result, style:"css/products.css"})
});

router.get("/carts/:cid", async (req, res) => {
    const {cid} = req.params;    
    const carts = new Carts();
    const result = await carts.getById(cid);
    res.render("carts", {title:"Carts", products: result.products, style:"css/products.css"})
});

router.get("/login",  async (req,res) => { //isLoggedIn,
    res.render("login", {
        title: "Inicia Sesión",
        style:"/css/styles.css", //con o sin / adelante de css?
    })
});

router.get("/signup",  async (req,res) => { //isLoggedIn,
    res.render("signup", {
        title:"Creá tu cuenta",
        style:"/css/styles.css",
    })
});


export default router;