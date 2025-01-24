import { KinesisClient, PutRecordCommand } from "@aws-sdk/client-kinesis";
import { timeStamp } from "console";
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
