import {UserModel} from "../mongo/models/user.model.js";

// se crean diferentes capas que c/u tiene sus funciones. Por ejemplo, el modelo se conecta a la base de datos, ésta es la capa de servicio
// que se conecta al modelo y crea la lógica del negocio, cada una tiene su funcion.

export default class UserService {

    async createUser(user) {
        const newUser = await UserModel.create(user);
        return newUser;
    }

    async getUserByEmail(email) {
        const user = await UserModel.findOne({email}).lean();
        return user;
    }

    async getUserById(id) {
        const user = await UserModel.findById(id).lean();
        return user;
    }
    
    async getOrCreate(objectUser) {
        const userExists = await this.getUserByEmail(objectUser.email);
        
        if(userExists) {return userExists}

        const newUser = await this.createUser(objectUser);
        return newUser
    }
}