#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkKinesisStack } from "../lib/cdk_kinesis-stack";

const app = new cdk.App();
new CdkKinesisStack(app, "CdkEmiKinesisStack", {});
