// importing necessary packages
import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import * as userService from '../service/user.service'
import { setNotification } from '../service/notification.service'
import { Inventory } from '../model/inventory.model'
import { setRecordsJob } from '../service/reports.service'
import { getUserId } from '../utils/getUserId'

const data = (d: any)=>({
    id:  d._id,
    name:  d.stock,
    qty:  d.quantity,
    boughtPrice:  d.boughtPrice,
    sellingPrice:  d.sellingPrice,
    category:  d.category,
    unit:  d.unit,
  });


// Add inventory
export const addInventory = asyncHandler(async (req: Request, res: Response) => {
  const { stock, quantity, boughtPrice, sellingPrice, category, unit } = req.body
  const userId = getUserId(req)

  console.log(userId)

  if (
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
    return res.status(404).json({
      success: false,
      message: 'user not found'
    })
  }

  const inventoryStock = await Inventory.create({
    userId,
    stock,
    quantity,
    boughtPrice,
    sellingPrice,
    category,
    unit
  })

  const Stock = inventoryStock
  const newStock = data(Stock)

  const recordJobId = user.dailyRecordsJobId

  if(!recordJobId){
    try{
      setRecordsJob(userId)
    }catch(error){
      console.log(`Error creating Recorde ${error}`)
    }
  }else{
    console.log('records jobs created: ', recordJobId)
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
  const { id: stockId } = req.params
  const userId = getUserId(req)

  console.log(userId)

  if (!stockId) {
    return res.status(401).json({
      success: false,
      message: 'missing stock or user'
    })
  }

  console.log(stockId)

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
  const {quantity} = req.body
  const userId = getUserId(req)
  console.log(userId)
  const stockId = req.params.id
  
  if (!quantity) {
      return res.status(400).json({
        success: false,
        message: "nothing to update",
      });
    }

  const inventory = await Inventory.findOne({_id: stockId, userId})

  if (!inventory) {
    return res.status(400).json({
      success: false,
      message: "failed to update inventory",
    });
  }

  const qtySaved = inventory.quantity  
  const base = inventory.updatedQuantity ?? inventory.quantity;
  const qtyDifference = base - quantity;

  if(qtyDifference < 0) inventory.quantity = qtySaved + Math.abs(qtyDifference)
  if(qtyDifference > 0) inventory.soldQuantity += qtyDifference

  await inventory.save()

  const updatedinventory = data(inventory) 

  await setNotification(
    userId as string,
    data(inventory),
    'stock updated successfully',
    'inventory'
  )

  return res.status(200).json({
    success: true,
    message: 'inventory updated',
    updatedinventory,
    stockId: inventory?._id
  })
})

export const getInventory = asyncHandler(async(req: Request, res: Response)=>{

  const userId = getUserId(req)

  console.log(userId)
  

  const inventory = await Inventory.find({userId})
  
  
  if(!inventory) return res.status(400).json({
    success: false,
    message: 'no inventory found for this user'
  })
  const sentInventory = inventory.map(data)

  return res.status(200).json({
    success: true,
    message: 'user inventory sent ✈️ successfully ✅',
    sentInventory
  })

})