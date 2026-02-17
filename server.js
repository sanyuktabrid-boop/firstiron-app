<<<<<<< HEAD
import cors from "cors";
import express from "express";
import AWS from "aws-sdk";
import bodyParser from "body-parser";
import path from "path";

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// AWS Config
AWS.config.update({
  region: "ap-south-1"
});

// DynamoDB
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE = "firstironcontacts"; // change this

// API Route
app.post("/book", async (req, res) => {

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

  try {

    await dynamo.put(params).promise();

    res.json({
      message: "Booking Successful"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to save booking"
    });
  }

});

// Start server
app.listen(PORT, () => {
  console.log("Server running on", PORT);
=======
import express from "express";
import AWS from "aws-sdk";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

// AWS Config
AWS.config.update({
  region: "ap-south-1"
});

// DynamoDB
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE = "firstironcontacts"; // change this

// API Route
app.post("/book", async (req, res) => {

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

  try {

    await dynamo.put(params).promise();

    res.json({
      message: "Booking Successful"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to save booking"
    });
  }

});

// Start server
app.listen(PORT, () => {
  console.log("Server running on", PORT);
>>>>>>> 6c5336af878f66a76450a87f18cf8c3633f0941a
});