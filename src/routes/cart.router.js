import {Router} from "express";
import cartController from "../controllers/cart.controller.js";

const router = Router();

router.get("/", cartController.getCart);

router.get("/:cid", cartController.getCartById);

router.post("/", cartController.createCart);

router.put("/:cid/product/:pid", cartController.updateCart);

router.delete("/:cid", cartController.deleteCart);

router.delete("/:cid/product/:pid", cartController.deleteProductFromCart);

export default router;