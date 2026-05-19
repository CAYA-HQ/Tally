import { Router } from "express";
import { addInventory, deleteItem, updateInventory } from "../controllers/inventory.controller";

const inventoryRouter = Router()

inventoryRouter.post('/:id', addInventory)
inventoryRouter.put('/:id', deleteItem)
inventoryRouter.post('/:id', updateInventory)

export default inventoryRouter