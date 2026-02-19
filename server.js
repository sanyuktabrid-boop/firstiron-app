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

// SNS
const sns = new AWS.SNS();
const OWNER_TOPIC_ARN = process.env.OWNER_TOPIC_ARN || "";
const CUSTOMER_TOPIC_ARN = process.env.CUSTOMER_TOPIC_ARN || "";
const TABLE = "firstironcontacts";

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

    // Publish notification to owner (from customer)
    const ownerMessage = `New booking from ${name} (${email || phone})\nService: ${service}\nMessage: ${message || "(no message)"}`;
    if (OWNER_TOPIC_ARN) {
      try {
        await sns.publish({
          TopicArn: OWNER_TOPIC_ARN,
          Subject: "New Booking Received",
          Message: ownerMessage
        }).promise();
      } catch (snsErr) {
        console.error("Failed to publish to owner SNS topic:", snsErr);
      }
    }

    // Publish confirmation to customer (from owner)
    const customerMessage = `Hi ${name},\n\nThanks for your booking for '${service}'. We have received your request and will contact you shortly.\n\nRegards,\nOwner`;
    if (CUSTOMER_TOPIC_ARN) {
      try {
        await sns.publish({
          TopicArn: CUSTOMER_TOPIC_ARN,
          Subject: "Booking Confirmation",
          Message: customerMessage,
          MessageAttributes: {
            recipientEmail: {
              DataType: "String",
              StringValue: email || ""
            }
          }
        }).promise();
      } catch (snsErr) {
        console.error("Failed to publish to customer SNS topic:", snsErr);
      }
    }

    res.json({ message: "Booking Successful" });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Failed to save booking"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});