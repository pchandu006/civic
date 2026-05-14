const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
console.log("SERVER FILE IS RUNNING");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log("MongoDB Connected Successfully ✅");
})
.catch((err) => {
  console.error("❌ Database connection error:", err.message);
});
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});