# Deploying `firstiron-app` to AWS Elastic Beanstalk (Console)

This guide shows exact steps to create an Elastic Beanstalk web environment and deploy this project by uploading a zip of the repository.

Prerequisites
- An AWS account with permissions to create Elastic Beanstalk applications, EC2 instances, and (optionally) IAM roles and DynamoDB tables.
- The repository root contains `package.json` and `server.js` (already present).

Quick notes before you deploy
- The app serves static files from the `public/` folder and exposes a POST `/book` endpoint that writes to DynamoDB using the AWS SDK. To allow successful writes, either provide AWS credentials as environment variables or attach an instance profile (IAM role) with DynamoDB permissions to the EB environment. If you do not need booking, the site will still serve static pages.
- `package.json` specifies Node `18.x`. Elastic Beanstalk will pick a compatible Node platform when you choose it.

Create a zip for upload
1. From the repository root, create a zip excluding `node_modules` (we included `.ebignore` to help):

```bash
zip -r firstiron-app.zip . -x@.ebignore
```

Console deployment steps
1. Open the AWS Management Console → Elastic Beanstalk.
2. Click **Create application**.
   - Application name: `firstiron-app` (or your preferred name)
   - Platform: **Node.js** (choose a recent Node.js/18.x platform, e.g. "Node.js 18 running on 64bit Amazon Linux 2")
3. Under **Application code**, choose **Upload** and select `firstiron-app.zip`.
4. Click **Create environment** (or **Create app** then **Create environment**) and wait for environment creation to finish.

Configure environment for DynamoDB access (recommended if you need `/book` to succeed)
1. In the EB environment page, go to **Configuration** → **Security** (or **Instances** depending on console layout).
2. Assign an **EC2 instance profile** (IAM role) to your environment. If you don't have one, create an IAM role with a policy that allows DynamoDB access (e.g., a policy scoped to the `firstironcontacts` table). Example managed policy to attach for quick testing: `AmazonDynamoDBFullAccess` (not recommended for production).
3. Save and redeploy if prompted.

Set environment variables (optional)
- If you prefer using explicit AWS credentials, add the following environment variables in the EB configuration -> Software -> Environment properties:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION` (e.g. `ap-south-1`)

Create the DynamoDB table (if you will use bookings)
1. Open the DynamoDB console.
2. Create a table named `firstironcontacts` with primary key `contactId` (String). Adjust read/write capacity or use on-demand.

Verify and test
1. After environment status is `Green` and health is `Ok`, access the app URL shown on the EB environment page (e.g., `http://<env>.<region>.elasticbeanstalk.com`).
2. Visit the site and try submitting the booking form. If DynamoDB writes fail, check environment logs and ensure IAM role or environment variables are configured.

Optional: Deploy with EB CLI
1. Install EB CLI: `pip install awsebcli` or use package manager.
2. Initialize: `eb init -p node.js firstiron-app` and follow prompts (choose region, platform Node.js 18).
3. Create environment: `eb create firstiron-app-env`.
4. Deploy: `eb deploy` (or upload zip and `eb deploy`).

Troubleshooting tips
- View logs: Elastic Beanstalk → your environment → **Logs** → Request logs (last 100 lines) or full logs.
- SSH to instance: Configure a keypair in EB environment settings, then use EC2 console to access the instance if deeper debugging is required.
- If Node process fails to start, check `npm start` and console logs. `Procfile` is included and starts `npm start`.

That's it — if you'd like, I can also prepare an IAM policy document scoped to `firstironcontacts` for safer DynamoDB access.
