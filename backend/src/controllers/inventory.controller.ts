// importing necessary packages
import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import * as userService from '../service/user.service'

// Add inventory
export const addInventory = asyncHandler(async (req: Request, res: Response) => {
  const { stock, quantity, boughtPrice, sellingPrice, date } = req.body
  const userId = req.params.id

  if (
    !userId ||
    !stock ||
    quantity == null ||
    boughtPrice == null ||
    sellingPrice == null
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

  const stockInventory = {
    stock,
    quantity,
    boughtPrice,
    sellingPrice,
    date
  }

  await userService.updateUserById(userId as string, {
    $push: {
      'inventory.inventoryStock': stockInventory
    }
  })

  userService.setNotification(
    user,
    'new item added to inventory',
    'inventory'
  )

  await user.save()

  return res.status(201).json({
    success: true,
    message: 'new item added to inventory',
  })
})


// Delete item
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const { stockId } = req.body
  const userId = req.params.id

  if (!stockId || !userId) {
    return res.status(400).json({
      success: false,
      message: 'missing stock or user'
    })
  }

  const user = await userService.getUserById(userId as string)

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'user not found'
    })
  }

  await userService.updateUserById(userId as string, {
    $pull: {
      'inventory.inventoryStock': { _id: stockId }
    }
  })

  userService.setNotification(
    user,
    'item removed from inventory',
    'inventory'
  )

  await user.save()

  return res.status(200).json({
    success: true,
    message: 'item deleted from inventory'
  })
})


// Update inventory
export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const { inventory } = req.body
  const userId = req.params.id

  if (!inventory) {
    return res.status(400).json({
      success: false,
      message: 'invalid inventory data'
    })
  }

  const user = await userService.getUserById(userId as string)

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'user not found'
    })
  }

  const upDatedStockId = inventory._id

  const result = await userService.updateUserById(
    userId as string,
    {
      $set: {
        'inventory.inventoryStock.$': inventory
      }
    },
    {
      arrayFilters: [
        { 'elem._id': upDatedStockId }
      ]
    }
  )

  userService.setNotification(
    user,
    'stock updated successfully',
    'inventory'
  )

  await user.save()

  return res.status(200).json({
    success: true,
    message: 'inventory updated'
  })
})