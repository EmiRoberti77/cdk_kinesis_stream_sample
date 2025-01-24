# Kinesis Data Stream Development with AWS CDK and Lambda

This document provides an overview of setting up a Kinesis Data Stream with AWS CDK and integrating it with a Lambda function for processing records. The examples include:

- Sending records to the Kinesis Data Stream.
- Creating an AWS CDK stack for the stream and Lambda integration.
- Writing a Lambda function to process the records.

---

## Project Setup

To create and manage the infrastructure using AWS CDK, follow these steps:

### Install AWS CDK

Ensure you have the AWS CDK installed globally:

```bash
npm install -g aws-cdk
```

### Initialise the CDK Project

Run the following command to create a new CDK project:

```bash
cdk init app --language=typescript
```

This will create a basic file structure for your CDK project.

### File Structure

Below is the file structure for this example, including where the Lambda functions are stored:

```
project-root/
├── bin/
│   └── cdk-kinesis.ts           # Entry point for the CDK app
├── lib/
│   └── cdk-kinesis-stack.ts     # Stack definition for Kinesis and Lambda
├── src/
│   └── lambdas/
│       └── lambda_kinesis_target/
│           └── handler.ts       # Lambda handler for processing Kinesis records
├── node_modules/                # Node.js dependencies
├── package.json                 # Project dependencies
├── cdk.json                     # CDK project configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Documentation for the project
```

---

## Sending Records to Kinesis Data Stream

The following TypeScript code demonstrates how to send records to a Kinesis Data Stream. The record includes a random name, timestamp, and message, all of which are JSON-encoded.

```typescript
import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";
const kinesisClient = new KinesisClient({
  region: "us-east-1",
});

async function addRecordToKinesis(
  streamName: string,
  data: string,
  partitionKey: string
): Promise<any> {
  try {
    const encodedData = Buffer.from(data);
    const putRecord = new PutRecordCommand({
      StreamName: streamName,
      Data: encodedData,
      PartitionKey: partitionKey,
    });

    const response = await kinesisClient.send(putRecord);
    console.log(response);
    return response;
  } catch (err: any) {
    console.log(err.message);
    return undefined;
  }
}

const random = Math.floor(Math.random() * 1000);
const now = new Date().toISOString();
const streamName = "emi-kinesis-stream";
const data = JSON.stringify({
  name: "emi" + random,
  timeStamp: now,
  message: "kinesis message",
});
const partitionKey = "PartitionKey1";

addRecordToKinesis(streamName, data, partitionKey).catch((err) =>
  console.log(err)
);
```

---

## AWS CDK Stack for Kinesis and Lambda Integration

The following AWS CDK code sets up a Kinesis Data Stream and a Lambda function. It integrates the Lambda function with the Kinesis stream using an event source mapping.

```typescript
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stream, StreamMode } from "aws-cdk-lib/aws-kinesis";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime, StartingPosition } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { KinesisEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import * as path from "path";

export class CdkKinesisStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stream = new Stream(this, "emi_cdk_stream", {
      streamName: "emi-kinesis-stream",
      streamMode: StreamMode.ON_DEMAND,
    });

    const targetKinesisLambda = new NodejsFunction(
      this,
      "emi_cdk_kinesis_target_lambda",
      {
        functionName: "emi_cdk_kinesis_target_lambda",
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
          __dirname,
          "..",
          "src",
          "lambdas",
          "lambda_kinesis_target",
          "handler.ts"
        ),
      }
    );

    stream.grantReadWrite(targetKinesisLambda);

    targetKinesisLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ["*"],
        resources: ["*"],
        effect: Effect.ALLOW,
      })
    );

    targetKinesisLambda.addEventSource(
      new KinesisEventSource(stream, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 100,
        enabled: true,
      })
    );
  }
}
```

---

## Lambda Function for Processing Kinesis Records

The Lambda function below processes records from the Kinesis Data Stream. It decodes the Base64-encoded data, parses it as JSON, and logs the payload.

```typescript
import { KinesisStreamEvent, KinesisStreamRecord } from "aws-lambda";

export const handler = async (event: KinesisStreamEvent): Promise<void> => {
  for (const record of event.Records) {
    const { partitionKey, sequenceNumber } = record.kinesis;
    console.log(
      `[partitionKey=${partitionKey}]:[sequenceNumber=${sequenceNumber}]`
    );
    const payload = Buffer.from(record.kinesis.data, "base64").toString(
      "utf-8"
    );
    try {
      const decodedPayload = JSON.parse(payload);
      console.log(decodedPayload);
    } catch (err) {
      console.error(err);
    }
  }
};
```

---

## Summary

This setup demonstrates how to:

1. Send data to a Kinesis Data Stream.
2. Use AWS CDK to create and configure the stream and a Lambda function.
3. Process the Kinesis stream records in a Lambda function.

With this architecture, you can handle real-time streaming data and integrate it into your applications effectively.
