import Products from "../dao/dbManagers/product.service.js";

const products = new Products();

const getProducts = async (req, res) => {
    const {limit, page, query, sort} = req.query;

    const isSorted = () => { if(sort.toLowerCase() === "asc") {return 1
    } else if (sort.toLowerCase() === "desc") {return -1} }

    const parsedQuery = () => { if (query) {
        const queryObj = JSON.parse(query);
        return queryObj;}
        return {};}

    const options = await ProductModel.paginate(parsedQuery(), {
        limit: limit || 2, //aca piden 10, pero lo dejo en 2 porque no tengo tantos productos como para que se vea mas de 1 pagina.
        page: page || 1,
        sort: sort ? {precio:isSorted()} : null,
        lean: true,
    })

    const {docs,hasPrevPage,hasNextPage,prevPage, nextPage} = options

    const products = docs;

    res.render("products", {products,hasPrevPage,hasNextPage,prevPage,nextPage, style:"/css/products.css"})
}

const getProductsById = async (req, res) => {
    const {id} = req.params;

    try{
        const result = await products.getById(id);
        res.json(result);
    } catch(error) {console.log("Error al buscar el Producto:" + id + "," + error)}
}

const createProduct = async (req, res) => {

    const {categoria, nombre, descripcion,img, precio, stock, code} = req.body;

    try{
        const newProduct = {categoria, nombre, descripcion,img, precio, stock, code};
        const result = await products.saveProduct(newProduct);
        res.json(result);
        console.log("El producto se ha creado con exito.")
    } catch (error) {console.log("Error al crear nuevo Producto:" + error)}
}

const updateProduct = async (req, res) => {
    try{
        const {id} = req.params;
        const {categoria, nombre, descripcion,img, precio, stock, code} = req.body;

        const newProduct = {categoria, nombre, descripcion,img, precio, stock, code};
        const result = await products.updateProduct(id, newProduct);
        res.json(result);
        console.log("El producto ha sido modificado");
    } catch (error) {console.log("Error al modificar Producto:" + id + "," + error)}
}

const deleteProduct = async (req, res) => {
    const {id} = req.params;

    try{
        const result = await products.deleteProduct(id);
        res.json(result);
        console.log("El producto ha sido eliminado");
    } catch(error) {console.log("Error al eliminar el Producto:" + id + "," + error)}
}

export default {getProducts, getProductsById, createProduct, updateProduct, deleteProduct};