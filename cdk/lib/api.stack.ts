import { Stack, Construct, CfnOutput } from "@aws-cdk/core";
import { LambdaRestApi, ResourceBase, RestApi } from "@aws-cdk/aws-apigateway";
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
import { ISecret, Secret } from "@aws-cdk/aws-secretsmanager";

export class GraphqlApiStack extends Stack {
  readonly handler: any;
  readonly api: RestApi;
  readonly apiPathOutput: CfnOutput;
  readonly graphql: ResourceBase;
  readonly gitHubAccessToken: ISecret;

  constructor(scope: Construct, id: string, props: {}) {
    super(scope, id, props);

    this.gitHubAccessToken = Secret.fromSecretNameV2(
      this,
      "GITHUB_ACCESS_TOKEN",
      "GITHUB_ACCESS_TOKEN"
    );

    this.handler = new Function(this, "graphql", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("./"),
      handler: "dist/src/lambda.handler",

      environment: {
        GITHUB_ACCESS_TOKEN: this.gitHubAccessToken.secretValue.toString(),
      },
    });

    this.api = new LambdaRestApi(this, "graphql-api", {
      handler: this.handler,
      proxy: false,
    });

    this.graphql = this.api.root.addResource("graphql");
    this.graphql.addMethod("ANY");

    this.apiPathOutput = new CfnOutput(this, "apiPath", {
      value: this.api.root.path,
      description: "Path of the API",
    });
  }
}
