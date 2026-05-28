// importing necessary packages
import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import * as userService from '../service/user.service'
import { setNotification } from '../service/notification.service'
import { Inventory } from '../model/inventory.model'

const data = async (d: any)=>{
  const item = {
    id: (await d).id,
    name: (await d).stock,
    qty: (await d).quantity,
    boughtPrice: (await d).boughtPrice,
    sellingPrice: (await d). sellingPrice,
    category: (await d).category,
    unit: (await d).unit
  }
  return item
}

// Add inventory
export const addInventory = asyncHandler(async (req: Request, res: Response) => {
  const { stock, quantity, boughtPrice, sellingPrice, category, unit } = req.body
  const userId = (req as any).user.id

  if (
    !userId ||
    !stock ||
    quantity == null ||
    boughtPrice == null ||
    sellingPrice == null ||
    !category
  ) {
    return res.status(400).json({
      success: false,
      message: 'missing required item'
    })
  }

  const user = await userService.getUserById(userId as string)

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'user not found'
    })
  }

  const inventoryStock = Inventory.create({
    userId,
    stock,
    quantity,
    boughtPrice,
    sellingPrice,
    category,
    unit
  })

  const newStock = await data(inventoryStock)
  console.log(`item added to inventory: ${newStock.name}`)

  await setNotification(
    user.id,
    newStock,
   `${newStock.name} item added to inventory`,
    'inventory'
  )

  return res.status(201).json({
    success: true,
    message: 'new item added to inventory',
    inventoryStock,
    stockId: (await inventoryStock).id
  })
})


// Delete item
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const { stockId } = req.params
  const userId = (req as any).user.id

  if (!stockId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'missing stock or user'
    })
  }

  const deletedItem = await Inventory.findOneAndDelete({
    _id: stockId,
    userId,
  })

  if(!deletedItem){
    return res.status(404).json({
      success: false,
      message: 'item not found'
    })
  }
  
  await setNotification(
    userId.toString(),
    deleteItem,
    `${deletedItem.stock} removed from inventory`,
    'inventory'
  )

  return res.status(200).json({
    success: true,
    message: 'item deleted from inventory'
  })
})


// Update inventory
export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const { stock, quantity, boughtPrice, sellingPrice } = req.body
  const userId = (req as any).user.id
  const stockId = req.params.id

  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: 'nothing to update'
    })
  }

  if(!userId){
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }

  const result = await Inventory.findOneAndUpdate(
  {
    _id: stockId,
    userId,
  },
  {
    $set: {
      stock,
      quantity,
      boughtPrice,
      sellingPrice,
    },
  },
  {
    new: true,
  }
)

  await setNotification(
    userId as string,
    data(result),
    'stock updated successfully',
    'inventory'
  )

  return res.status(200).json({
    success: true,
    message: 'inventory updated',
    result,
    stockId: result?.id
  })
})

export const getInventory = asyncHandler(async(req: Request, res: Response)=>{

  const userId = (req.user as any).id

  if(!userId) return res.status(404).json({
    message: 'user id missing',
    success: false
  })

  const inventory = await Inventory.findById(userId)

  if(!inventory) return res.status(400).json({
    success: false,
    message: 'no inventory found for this user'
  })

  return res.status(200).json({
    success: true,
    message: 'user inventory sent ✈️ successfully ✅',
    inventory
  })

})