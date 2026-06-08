import { Queue, Worker } from "bullmq";
import { ioRedis, ReportsConnection } from "../config/bullMQ";
import { Inventory } from "../model/inventory.model";
import Reports from "../model/Reports.model";
import { getUserById } from "./user.service";
import { getWeekRange, getDayRange } from "../utils/date";
import mongoose from "mongoose";

// Report Queue
export const reportQueue = new Queue("recordQueue", {
  connection: ioRedis,
});

const getWeeklyStats = async (
  userId: string,
  start: Date,
  end: Date
) => {

  const result = await Inventory.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: null,

        totalQtyBought: { $sum: "$quantity" },
        totalQtySold: { $sum: "$soldQuantity" },

        totalSales: {
          $sum: {
            $multiply: ["$sellingPrice", "$soldQuantity"],
          },
        },

        totalCost: {
          $sum: {
            $multiply: ["$boughtPrice", "$quantity"],
          },
        },
      },
    },
  ]);


  return result[0] || {
  totalQtyBought: 0,
  totalQtySold: 0,
  totalSales: 0,
  totalCost: 0,
};
};


// Report scheduler worker
new Worker(
  "recordQueue",
  async (job) => {
    try {
      const { userId } = job.data;
      const now = new Date();

      const { start, end } = getDayRange(now);

      const stats = await getWeeklyStats(userId, start, end);

      await Reports.create({
        userId,
        totalQtyBought: stats.totalQtyBought,
        totalQtySold: stats.totalQtySold,
        totalWeeklyCost: stats.totalCost,
        totalWeeklySales: stats.totalSales,
      });

      console.log(`Weekly report generated for user: ${userId}`);
    } catch (error) {
      console.error("Failed processing weekly records:", error);
      throw error;
    }
  },
  {
    connection: ReportsConnection,
  }
);

//Report SCHEDULER
export const setRecordsJob = async (userId: string, cron?: string) => {
  const user = await getUserById(userId);
  const cronTime = cron?.trim() || "0 0 * * 0"
  if (!user) {
    console.log("User not found");
    return null;
  }

  const schedulerId = `${userId}--recordJob`;


  await reportQueue.upsertJobScheduler(
    schedulerId,
    {
      pattern: cronTime ,
      tz: user.metadata?.timezone || "Africa/Lagos",
    },
    {
      name: "weekly-records",
      data: {
        userId,
      },
      opts: {
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }
  );
  user.dailyRecordsJobId = schedulerId
  user.save()

  console.log(`Weekly scheduler created for user: ${userId}`);
  return {
  success: true,
  scheduler: {
    id: schedulerId,
    cron: cronTime,
    timezone: user.metadata?.timezone || "Africa/Lagos",
    name: "weekly-records",
  },
};
};