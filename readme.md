# Kinesis Data Stream and Usage Guide

Amazon Kinesis Data Streams is a real-time data streaming service provided by AWS. It is commonly used for real-time analytics, application monitoring, log aggregation, and more.

This guide explains how to use the AWS SDK for JavaScript (v3) in TypeScript to interact with a Kinesis Data Stream by adding records to the stream.

## Prerequisites

1. **AWS SDK for JavaScript (v3)**:

   - Install the SDK by running:
     ```bash
     npm install @aws-sdk/client-kinesis
     ```

2. **Kinesis Data Stream**:

   - Ensure you have created a Kinesis Data Stream in your AWS account.
   - Note down the stream name and region.

3. **AWS Credentials**:
   - Configure your AWS credentials using the AWS CLI or environment variables.

---

## Code Example

Below is an example TypeScript code to add a record to a Kinesis Data Stream.

```typescript
import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";

// Initialize the Kinesis client
const kinesisClient = new KinesisClient({
  region: "us-east-1", // Replace with your AWS region
});

/**
 * Adds a record to the specified Kinesis Data Stream.
 *
 * @param streamName - The name of the Kinesis Data Stream.
 * @param data - The data to send to the stream.
 * @param partitionKey - The partition key to determine the shard for the record.
 * @returns A Promise with the response from the PutRecord API.
 */
async function addRecordToKinesis(
  streamName: string,
  data: string,
  partitionKey: string
): Promise<any> {
  try {
    // Convert the data to binary format
    const encodedData = Buffer.from(data);

    // Create the PutRecordCommand
    const putRecord = new PutRecordCommand({
      StreamName: streamName,
      Data: encodedData,
      PartitionKey: partitionKey,
    });

    // Send the record to the Kinesis stream
    const response = await kinesisClient.send(putRecord);
    console.log("Record added successfully:", response);
    return response;
  } catch (err: any) {
    console.error("Error adding record to Kinesis stream:", err.message);
    return undefined;
  }
}

// Example usage
const streamName = "emi-kinesis-stream"; // Replace with your stream name
const data = "Hello, Emi"; // Example data payload
const partitionKey = "PartitionKey1"; // Partition key for routing

addRecordToKinesis(streamName, data, partitionKey).catch((err) =>
  console.error("Error in example usage:", err)
);
```

---

## Explanation of Key Components

### 1. **KinesisClient**

The `KinesisClient` is initialized with the AWS region where your Kinesis Data Stream is located.

### 2. **PutRecordCommand**

This command is used to send a single record to a Kinesis Data Stream. It requires:

- **StreamName**: The name of the Kinesis Data Stream.
- **Data**: The data payload in binary format (converted using `Buffer.from`).
- **PartitionKey**: A key to determine the shard where the record will be stored.

### 3. **Error Handling**

The `try-catch` block ensures any errors during the API call are logged and handled gracefully.

---

## IAM Permissions

Ensure the AWS identity (user or role) running the code has the following permission:

```json
{
  "Effect": "Allow",
  "Action": "kinesis:PutRecord",
  "Resource": "arn:aws:kinesis:<region>:<account-id>:stream/<stream-name>"
}
```

---

## Output

If successful, the response will include:

- `ShardId`: The shard where the record was added.
- `SequenceNumber`: A unique identifier for the record.

Example:

```json
{
  "ShardId": "shardId-000000000001",
  "SequenceNumber": "49659891250263205584801854121677320731210653829945098258",
  "EncryptionType": "KMS"
}
```

---

## Additional Notes

1. **Partition Key**:

   - Records with the same partition key are routed to the same shard.

2. **Data Encoding**:

   - Kinesis requires the `Data` field in binary format. Use `Buffer.from()` to convert strings.

3. **Batch Processing**:
   - For better performance, consider using `PutRecordsCommand` to send multiple records in one API call.

---

## References

- [AWS Kinesis Data Streams Documentation](https://docs.aws.amazon.com/kinesis/latest/dev/introduction.html)
- [AWS SDK for JavaScript (v3) Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html)

Emi Roberti - Happy coding
