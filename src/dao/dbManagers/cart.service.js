import {CartModel} from "../mongo/models/cart.model.js";

export default class Carts {
    constructor() {};

    async createCart() {
        try {
            const products = [];
            const cart = await CartModel.create({products});
            return cart;
        } catch (error) {throw error}
        
    }

    async getAll() {
        try {
            let carts = await CartModel.find().lean();
            return carts;
        } catch (error) {throw error}
        
    }

    async getById(cid) {
        try {
            let cart = await CartModel.findById(cid).lean();
            return cart;
        } catch (error) {throw error}
        
    }

    async saveCart(cart) {
        try {
            let newCart = new CartModel(cart);
            let result = await newCart.save();
            return result;
        } catch (error) {throw error}
        
    }

    async updateCart(cid, cart) {
        try {
            const result = await CartModel.updateOne({_id:cid}, cart);
            return result;
        } catch (error) {throw error}
        
    }

    async deleteCart(cid) {
        try {
            const result = await CartModel.findByIdAndDelete(cid);
            return result;
        } catch (error) {throw error}
        
    }
}