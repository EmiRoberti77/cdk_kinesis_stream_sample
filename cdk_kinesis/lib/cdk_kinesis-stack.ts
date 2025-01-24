import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stream, StreamMode } from "aws-cdk-lib/aws-kinesis";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkKinesisStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stream = new Stream(this, "emi_cdk_stream", {
      streamName: "emi-kinesis-stream",
      streamMode: StreamMode.ON_DEMAND,
    });
  }
}
