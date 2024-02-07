import mongoose from "mongoose";

const cartsCollection = "carts";

const CartSchema = new mongoose.Schema({
    products: [
        {
        product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"products"},
        quantity: {
                    type:Number,
                    default:1}
                }],
    default:[]}) 

CartSchema.pre(['find', 'findOne'], function () {
    this.populate({path: 'products.product'})
})

export const CartModel = mongoose.model(cartsCollection, CartSchema);