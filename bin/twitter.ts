#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { TwitterStack } from '../lib/twitter-stack';

const app = new cdk.App();
new TwitterStack(app, 'TwitterStack');
