# serverless-github-api

Serverless Typescript RESTful API returning information based on specified GitHub Repos.

## Production Testing

As of October 22 2021 this application is live this is subject to change.

Base URL: https://pkk06vpt98.execute-api.us-east-1.amazonaws.com/prod/

- Info on a given repo: `github/pulls/{owner}/{repo}`
  (e.g. https://pkk06vpt98.execute-api.us-east-1.amazonaws.com/prod/github/pulls/facebook/jest)

- Numbers of Commits for all Pull requests in a given repo: `github/pulls/{owner}/{repo}/commits`
  (e.g. https://pkk06vpt98.execute-api.us-east-1.amazonaws.com/prod/github/pulls/facebook/jest/commits)

- Number of commits for a specific pull request in a given repo: `github/pulls/{owner}/{repo}/{pull_number}/commits` (e.g. https://pkk06vpt98.execute-api.us-east-1.amazonaws.com/prod/github/pulls/facebook/jest/11988/commits)

## Getting started.

---

**NOTE:**
GitHub throttles API request at 60 per hour. To get around this follow this [guide](https://docs.github.com/en/rest/guides/basics-of-authentication) and replace the value in .env.example to your GitHub Access Code.

THIS IS AN OPTIONAL STEP.

---

- `npm ci`
- `cd app`
- `cp .env.example .env`
- `npm ci`
- `npm start`

## Testing

Tests are written with Jest and Supertest.

- `cd app/`
- `npm run test`

## Deploying to AWS Lambda

```
export AWS_PROFILE=YOUR_PROFILE
export CDK_DEFAULT_REGION=YOUR_REGION
export CDK_DEFAULT_ACCOUNT=YOUR_ACCOUNT
```

1. Bootstrap CDK

```
cdk bootstrap aws://${CDK_DEFAULT_ACCOUNT}/${CDK_DEFAULT_REGION} --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess
```

2. Store GitHub Access Token in aws secrets manager

```bash
aws secretsmanager create-secret --name GITHUB_ACCESS_TOKEN --description "GitHub Access Token" --secret-string YOUR_TOKEN
```

3. `npm run cdk:deploy`
