import mongoose from "mongoose";

const userCollection = "users";

const UserSchema = new mongoose.Schema({
    first_name: {type:String, require:true, max:100},
    last_name: {type:String, require:true, max:100},
    email: {type:String, require:true, unique:true},
    password: {type:String, require:true, min:8, max:100},
    age: {type:Number},
    cart:{type: mongoose.Schema.Types.ObjectId, ref:"Carts"},
    role:{type:String, require:true, enum:["admin","user","private"], default:"user"},
})

export const UserModel = mongoose.model(userCollection, UserSchema);

