import { Queue, Worker } from "bullmq";
import { ioRedis, ReportsConnection } from "../config/bullMQ";
import { Inventory } from "../model/inventory.model";
import Reports from "../model/Reports.model";
import { getUserById } from "./user.service";
import { getWeekRange } from "../utils/date";


export const reportQueue = new Queue("recordQueue", {
  connection: ioRedis,
});


const getTotal = async ( field: string, userId: string, start: Date, end: Date) => {

  const result = await Inventory.aggregate([
    {
      $match: {
        userId,
        createdAt: {
          $gte: start,
          $lt: end,
        },
      },
    },

    {
      $group: {
        _id: null,

        total: {
          $sum: `$${field}`,
        },
      },
    },
  ]);

  return result[0]?.total || 0;
};



new Worker(

  "recordQueue",

  async (job) => {

    const { userId } = job.data;
    const now = new Date()

    try {

      const { start, end } = getWeekRange(now);
      const totalWeeklyRev = await getTotal("boughtPrice",userId,start,end);
      const totalWeeklySales = await getTotal("sellingPrice",userId,start,end);
      const totalQtyBought = await getTotal("quantity",userId,start,end);
      const totalQtyUpdated = await getTotal("updatedQuantity",userId,start,end);

      const totalQtySold = totalQtyBought - totalQtyUpdated;

      await Reports.create({
        userId,
        totalQtyBought,
        totalQtySold,
        totalWeeklyRev,
        totalWeeklySales,
        start,
        end,
      });

      console.log(
        `Weekly record updated for user ${userId}`
      );

    } catch (error) {

      console.log(`Failed processing weekly records: ${error}`);

      throw error;
    }
  },

  {
    connection: ReportsConnection,
  }
);


type ReportSchedulerData = {
  userId: string;
};



export const setDateRecords = async (data: ReportSchedulerData) => {

  const user = await getUserById(data.userId);

  if (!user) {
    console.log(
      "User not found to create records"
    );

    return null;
  }

  const timeZone =
    user.metadata?.timezone || "Africa/Lagos";

  const schedulerId =
    `${data.userId}--recordJob`;

  await reportQueue.upsertJobScheduler(

    schedulerId,

    {
      pattern: "0 0 * * 0",
      tz: timeZone,
    },

    {
      name: "weekly-records",

      data: {
        userId: data.userId,
      },

      opts: {
        removeOnComplete: true,
        removeOnFail: 100,
      },
    }
  );

  console.log(
    `Weekly scheduler created for ${data.userId}`
  );
};