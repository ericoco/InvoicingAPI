#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InvoicingStack } from '../lib/infra/invoicing-stack';

const app = new cdk.App();
new InvoicingStack(app, 'InvoicingStack', { stackName: 'Invoicing' });
