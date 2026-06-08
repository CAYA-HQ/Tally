import Reports from "../model/Reports.model";
import { asyncHandler } from "../utils/asyncHandler";
import type { Request, Response } from "express";
import { getUserId } from "../utils/getUserId";

export const getReports = asyncHandler(async(req: Request, res: Response)=>{
    
    const userId = getUserId(req)

    const weeklyReports = await Reports.find({userId})
    .sort({createdAt: -1}).limit(46)

    if(!weeklyReports?.length){
        console.log(`reports empth for now: ${weeklyReports}`)
        return res.status(404).json({
            success: false,
            message: 'no weekly reports yet'
        })
    }

    res.status(200).json({
        success: true,
        weeklyReports
    })
})