import { Router, type NextFunction, type Request, type Response } from "express";
import { addInventory, deleteItem, getInventory, updateInventory } from "../controllers/inventory.controller";

const inventoryRouter = Router()

inventoryRouter.post('/', addInventory)
inventoryRouter.delete('/:id', deleteItem)
inventoryRouter.put('/:id', updateInventory)
inventoryRouter.get('/', getInventory)

export default inventoryRouter