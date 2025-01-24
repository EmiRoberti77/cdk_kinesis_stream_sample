import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Stream, StreamMode } from "aws-cdk-lib/aws-kinesis";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime, StartingPosition } from "aws-cdk-lib/aws-lambda";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { KinesisStream } from "aws-cdk-lib/aws-events-targets";
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
        runtime: Runtime.NODEJS_22_X,
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
