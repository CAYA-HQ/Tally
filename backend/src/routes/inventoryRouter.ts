import { Router } from "express";
import { addInventory, deleteItem, updateInventory } from "../controllers/inventory.controller";

const inventoryRouter = Router()

inventoryRouter.post('/', addInventory)
inventoryRouter.delete('/:id', deleteItem)
inventoryRouter.put('/:id', updateInventory)

export default inventoryRouter