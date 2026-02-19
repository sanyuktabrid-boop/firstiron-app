import cors from "cors";
import express from "express";
import AWS from "aws-sdk";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// AWS Config
AWS.config.update({
  region: "ap-south-1"
});

// DynamoDB
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE = "firstironcontacts";

// API Route
app.post("/book", async (req, res) => {

  // 🔥 DEBUG LOG 1
  console.log("📥 Incoming request:", req.body);

  const { name, email, message, phone, service } = req.body;

  const params = {
    TableName: TABLE,
    Item: {
      contactId: Date.now().toString(),
      name,
      email,
      phone,
      service,
      message,
      createdAt: new Date().toISOString()
    }
  };

  // 🔥 DEBUG LOG 2
  console.log("📦 Data to save:", params);

  try {
    console.log("⏳ Saving to DynamoDB...");

    await dynamo.put(params).promise();

    console.log("✅ Saved successfully!");

    res.json({
      message: "Booking Successful"
    });

  } catch (err) {
    console.error("❌ DynamoDB Error:", err);

    res.status(500).json({
      error: "Failed to save booking"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});