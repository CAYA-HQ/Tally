import { Request, Response } from "express";

export let register = (req: Request, res: Response) => {
    res.status(201).json({
        success: true
    })
}

export let login = (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: {
            token: "fake-jwt-token-12345"
        }
    })
}


