import { CronJob } from "cron";
import https from "https";

const URL = "https://codecraft-5eaq.onrender.com";

// Function to make the GET request
const makeGetRequest = () => {
  https
    .get(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    })
    .on("error", (e: NodeJS.ErrnoException) => {
      console.error("Error while sending request", e);
    });
};

// Define the cron job
const job = new CronJob("*/14 * * * *", makeGetRequest);

export default job;
