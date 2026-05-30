import { Router, type NextFunction, type Request, type Response } from "express";
import { addInventory, deleteItem, getInventory, updateInventory } from "../controllers/inventory.controller";

const inventoryRouter = Router()

inventoryRouter.post('/', addInventory)
inventoryRouter.delete('/:id', deleteItem)
inventoryRouter.put('/:id', updateInventory)
inventoryRouter.get('/',( req: Request, res: Response, next: NextFunction)=>{
    console.log({
        'request from user with id': (req.user as any).id
    })
    next()
}, getInventory)

export default inventoryRouter