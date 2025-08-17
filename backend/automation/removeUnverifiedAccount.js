import cron from "node-cron"
import { User } from "../models/user.model.js";
export const removeUnverifiedAccounts = () => {
  cron.schedule("*/30 * * * *", async () => {
    const thirtymintesAgo = new Date(Date.now() - 30 * 60 * 1000);
    try {
      await User.deleteMany({
        isVerified: false,
        createdAt: { $lt: thirtymintesAgo }
      });
    } catch (error) {
      console.error("Error removing unverified accounts:", error);
    }
  })

}