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

// Example usage
const streamName = "emi-kinesis-stream";
const data = "Hello, Emi";
const partitionKey = "PartitionKey1";

addRecordToKinesis(streamName, data, partitionKey).catch((err) =>
  console.log(err)
);
