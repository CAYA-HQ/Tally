// importing necessary packages
import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { User } from '../model/User'
import * as userService from '../service/user.service';

//creating inventory
export const createInventory = asyncHandler(async (req: Request, res: Response) => {
  const { stockId, stock, quantity, boughtPrice, sellingPrice, date } = req.body;
  const userId = req.params.id

  if ( !userId || !stockId || !stock || quantity == null
    || boughtPrice == null || sellingPrice == null) {
    return res.status(400).json({
      success: false,
      message: 'missing required item'
    });
  }

  const stockInventory = {
    stockId,
    stock,
    quantity,
    boughtPrice,
    sellingPrice,
    date
  };

  await userService.addToMetaData(userId as string, stockInventory, 'inventory')

  return res.status(201).json({
    success: true,
    message: 'new item added to inventory'
  });
});

//deleting an item from the inventory
export const deleteItem = asyncHandler(async(req: Request, res:Response) => {
  const {stockId} = req.body
  const userId = req.params.id

  if(!stockId || !userId){
    return res.status(400).json({
        success: false,
        message: 'missing stock or user'
    })
  }
  
  await userService.deleteFromMetaData(userId as string, stockId, "inventory")
    
})

//updating inventory
export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
    const { userId, inventory } = req.body;

    if (!userId || !Array.isArray(inventory)) {
      return res.status(400).json({
        success: false,
        message: 'invalid inventory data'
      });
    }

    await userService.addToMetaData(userId, inventory, 'inventory')

    return res.status(200).json({
      success: true,
      message: 'inventory updated'
    });
  }
);