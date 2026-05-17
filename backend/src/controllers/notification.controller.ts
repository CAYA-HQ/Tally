import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler'
import { Notification } from '../model/notification.model'

export const getNotification = asyncHandler(async(req: Request, res: Response) => {
    
    const {cursor} = req.query
    const userId = (req.user! as any).id

    const notification = await Notification.find({userId,
        _id: {
            $lt: cursor
        }
    }).sort({_id: -1}).limit(20)

    const nextCursor = notification[notification.length - 1]?._id
    const hasMore = notification.length === 20

    res.status(200).json({
        notification,
        nextCursor,
        hasMore,
    })

})