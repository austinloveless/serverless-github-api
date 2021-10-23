#!/usr/bin/env node
import "source-map-support/register";
import { App } from "@aws-cdk/core";

import { GraphqlApiStack } from "../lib/api.stack";

const app = new App();

// Serverless Lambda/API Gateway Graphql API
new GraphqlApiStack(app, "APIStack", {});
