"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const https_1 = __importDefault(require("https"));
const URL = "https://codecraft-5eaq.onrender.com";
// Function to make the GET request
const makeGetRequest = () => {
    https_1.default
        .get(URL, (res) => {
        if (res.statusCode === 200) {
            console.log("GET request sent successfully");
        }
        else {
            console.log("GET request failed", res.statusCode);
        }
    })
        .on("error", (e) => {
        console.error("Error while sending request", e);
    });
};
// Define the cron job
const job = new cron_1.CronJob("*/14 * * * *", makeGetRequest);
exports.default = job;
