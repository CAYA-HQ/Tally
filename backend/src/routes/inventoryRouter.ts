import { Router } from "express";
import { createInventory, deleteItem, updateInventory } from "../controllers/inventory.controller";

const inventoryRouter = Router()

inventoryRouter.post('/:id', createInventory)
inventoryRouter.put('/:id', deleteItem)
inventoryRouter.post('/:id', updateInventory)

export default inventoryRouter