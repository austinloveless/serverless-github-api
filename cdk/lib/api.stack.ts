import { Stack, Construct, CfnOutput, Duration } from "@aws-cdk/core";
import { LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { Function, Runtime, Code } from "@aws-cdk/aws-lambda";
import { Secret } from "@aws-cdk/aws-secretsmanager";

export class GraphqlApiStack extends Stack {
  readonly handler: any;

  constructor(scope: Construct, id: string, props: {}) {
    super(scope, id, props);

    const gitHubAccessToken = Secret.fromSecretNameV2(
      this,
      "GITHUB_ACCESS_TOKEN",
      "GITHUB_ACCESS_TOKEN"
    );

    const handler = new Function(this, "graphql", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset("app"),
      handler: "dist/lambda.handler",
      timeout: Duration.seconds(30),

      environment: {
        GITHUB_ACCESS_TOKEN: gitHubAccessToken.secretValue.toString(),
      },
    });

    const api = new LambdaRestApi(this, "graphql-api", {
      handler,
      proxy: false,
    });

    api.root.addMethod("GET");

    const github = api.root.addResource("github");
    const githubPull = github.addResource("pulls");
    const githubPullOwner = githubPull.addResource("{owner}");
    const githubPullRepo = githubPullOwner.addResource("{repo}");
    githubPullRepo.addMethod("GET");

    const githubPullCommits = githubPullRepo.addResource("commits");
    githubPullCommits.addMethod("GET");

    const githubPullPullNumber = githubPullRepo.addResource("{pull_number}");
    const githubPullPullNumberCommits =
      githubPullPullNumber.addResource("commits");
    githubPullPullNumberCommits.addMethod("GET");

    new CfnOutput(this, "apiPath", {
      value: api.root.path,
      description: "Path of the API",
    });
  }
}
