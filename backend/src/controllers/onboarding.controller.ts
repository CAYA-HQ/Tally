import type { Request, Response } from "express";
import * as userService from '../service/user.service'
import { asyncHandler } from "../utils/asyncHandler";

export const userOnBoarding = asyncHandler(async(req: Request, res: Response)=>{
    const {
        usage, storeName, address, businessType,
        country, city, businessPhone, inventoryName,
        inventoryType, category, currency, unit
    } = req.body

    const userId = (req.user as any ).id
    const user = await userService.getUserById(userId)

    if(!user){
        return res.status(404).json({
            success: false,
            message: 'user not found'
        })
    }
    
    const business = { 
        storeName, address, businessPhone,
        businessType, country, city, 
    }

    user.set({
        usage,
        business,
        "inventory.inventoryName": inventoryName,
        "inventory.inventoryType": inventoryType,
        "inventory.category": category,
        "inventory.currency": currency,
        "inventory.unit": unit,
    });
    userService.setNotification(user, 'set up complete', 'user')
    await user.save()
    const data = {'usage': user.usage, 'business': user.business, 'inventory': user.inventory}

    res.status(200).json({
        success: true,
        message: 'onboarding completed',
        data
    })
})