import mongoose from "mongoose";

const ReportsSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
            ref: 'User',
        },
        totalWeeklyRev:{
            type: Number,
            default: 0,
        },
        totalWeeklySales: {
            type: Number,
            default: 0,
        },
        totalQtyBought: {
            type: Number,
            default: 0,
        },
        totalQtySold: {
            type: Number,
            default: 0,
        },
        start: {
            type: Date,
            default: 0
        },
        end: {
            type: Date,
            default: 0
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const Reports = mongoose.model( 'ReportsSchema', ReportsSchema )
export default Reports