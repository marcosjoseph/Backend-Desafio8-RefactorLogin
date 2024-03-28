import Carts from "../dao/dbManagers/cart.service.js";
import Products from "../dao/dbManagers/product.service.js";

const carts = new Carts();
const productsCRUD = new Products();

const getCart = async (req, res) => {
    try{
        const result = await carts.getAll();
        res.json(result);
    } catch(error) {console.log("Error al traer los Carts:" + error)}
}

const getCartById = async (req, res) => {
    const {cid} = req.params;

    try{
        const result = await carts.getById(cid);
        console.log(result);
        res.render("carts", {
            carts: result._id.toString(),
            products:result.products,
            style:"/css/cart.css"
        });
    } catch(error) {console.log("Error al traer el Cart:" + req.params + "," + error)}
}

const createCart = async (req, res) => {
    try{
        const result = await carts.saveCart();
        res.json(result)
    } catch (error) {console.log("Error al crear nuevo Cart:" + error)}
}

const updateCart = async (req, res) => {
    const {cid, pid} = req.params;
    
    const isCartValid = await carts.getById(cid);
    const isProductValid = await productsCRUD.getById(pid)
    let hasChange = false;

    const newProduct = {
        product: pid,
        quantity:1
    };

    if (!isCartValid || !isProductValid) {
        return res.status(400).json({
            status:"error",
            message:"Cart o Producto o encontrado"
        })}

    const productIndex = isCartValid.products.findIndex(
        (productData) => productData.product._id == pid);

    if(productIndex === -1) {
        isCartValid.products.push(newProduct);
        hasChange = true} else {
        isCartValid.products[productIndex].quantity++;
        hasChange = true}

    if(hasChange) {
        const result = await carts.updateCart(cid,{products: isCartValid.products});
        res.json({
            status:"ok",
            message: isCartValid
        })
    }
}

const deleteCart = async (req, res) => {
    const {cid} = req.params;

    try{
        const result = await carts.deleteCart(cid);
        res.json(result);
    } catch(error) {console.log("Error al eliminar el Cart:" + req.params + "," + error)}
}

const deleteProductFromCart = async (req, res) => {
    const {cid, pid} = req.params;

    const isCartValid = await carts.getById(cid);
    const isProductValid = await productsCRUD.getById(pid)
    let hasChange = false;

    if (!isCartValid || !isProductValid) {
        return res.status(400).json({
            status:"error",
            message:"Cart o Producto no encontrado"
        })}

    const productIndex = isCartValid.products.findIndex(
        (productData) => productData.product._id == pid);

    if(productIndex === -1) {
            res.status(400).json({
            status:"error",
            message:"Producto no encontrado"
        }) } else {
            isCartValid.products[productIndex].quantity--;
        if (isCartValid.products[productIndex].quantity === 0) {
            isCartValid.products.splice(productIndex,1)
        }
        hasChange = true}

    if(hasChange) {
        const result = await carts.updateCart(cid,{products: isCartValid.products});
        res.json({
            status:"ok",
            message: isCartValid
        })
    }
}

export default {getCart, getCartById, createCart, updateCart, deleteCart, deleteProductFromCart};