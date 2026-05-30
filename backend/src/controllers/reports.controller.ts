import Reports from "../model/Reports.model";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";

export const getReports = asyncHandler(async(req: Request, res: Response)=>{
    
    const userId = (req.user! as any).id
    if(!userId) return res.status(404).json({
        success: false,
        message: 'user not found, no userId'
    })

    const weeklyReports = await Reports.find({userId})
    .sort({createdAt: -1})

    if(!weeklyReports?.length){
        console.log(`reports empth for now: ${weeklyReports}`)
        return res.status(404).json({
            success: false,
            message: 'no weekly reports'
        })
    }

    res.status(200).json({
        success: true,
        weeklyReports
    })
})