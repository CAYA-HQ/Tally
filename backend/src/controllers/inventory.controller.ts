// importing necessary packages
import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import * as userService from '../service/user.service'
import { setNotification } from '../service/notification.service'
import { Inventory } from '../model/inventory.model'
import { setRecordsJob } from '../service/reports.service'

const data = (d: any)=>{
  const data = {
    id:  d._id,
    name:  d.stock,
    qty:  d.quantity,
    boughtPrice:  d.boughtPrice,
    sellingPrice:  d.sellingPrice,
    category:  d.category,
    unit:  d.unit,
  };
  return data
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

  const Stock = await inventoryStock
  const newStock = data(Stock)
 

  const reportJobId = user.reportsJobId

  if(reportJobId){
    return null
  }else{
    try{
      setRecordsJob(userId)
    }catch(error){
      console.log(`Error creating Recorde ${error}`)
    }
  }

  await setNotification(
    user.id,
    newStock,
   `${newStock.name} item added to inventory`,
    'inventory'
  )

  return res.status(201).json({
    success: true,
    message: 'new item added to inventory',
    newStock,
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
    deletedItem,
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
      boughtPrice,
      sellingPrice,
    },
  },
  {
    new: true,
  }
  )
  if(!result){
    console.error(`failed to update inventory with this error: ${Error}`)
    return res.status(400).json({
      success: false,
      message: 'failed to update inventory'
    })
  }
  const qtySaved = result.quantity  
  const base = result.updatedQuantity ?? result.quantity;
  const qtyDifference = base - quantity;

  if(qtyDifference < 0) result.quantity = qtySaved + Math.abs(qtyDifference)
  if(qtyDifference > 0) result.soldQuantity += qtyDifference

  result.updatedQuantity = quantity
  await result.save()
  
  const updatedResult = data(result)

  await setNotification(
    userId as string,
    data(result),
    'stock updated successfully',
    'inventory'
  )

  return res.status(200).json({
    success: true,
    message: 'inventory updated',
    updatedResult,
    stockId: result?._id
  })
})

export const getInventory = asyncHandler(async(req: Request, res: Response)=>{

  const userId = (req.user as any).id

  if(!userId) return res.status(404).json({
    message: 'user id missing',
    success: false
  })

  const inventory = await Inventory.findById({userId})
  
  if(!inventory) return res.status(400).json({
    success: false,
    message: 'no inventory found for this user'
  })
  const sentInventory = data(inventory)

  return res.status(200).json({
    success: true,
    message: 'user inventory sent ✈️ successfully ✅',
    sentInventory
  })

})