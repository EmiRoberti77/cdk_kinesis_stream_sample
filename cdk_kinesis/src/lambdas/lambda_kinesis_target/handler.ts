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
