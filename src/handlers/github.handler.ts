import axios, { AxiosResponse } from "axios";

import {
  PullRequestsCommits,
  OwnerRepo,
  OwnerRepoPullNumber,
} from "../zod/github.zod";

const BASE_URL = "https://api.github.com/repos/";

export const pullRequestsForARepo = async (input: OwnerRepo): Promise<any> => {
  try {
    const response = await axios.get(
      `${BASE_URL}${input.owner}/${input.repo}/pulls`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return {
      error: error.response.statusText,
      statusCode: error.response.status || 500,
    };
  }
};

export const numberOfCommitsForEveryPullRequest = async (input: OwnerRepo) => {
  try {
    const pullRequests = await pullRequestsForARepo(input);
    const pullRequestCommits: PullRequestsCommits[] = [];

    for (const pullRequest of pullRequests) {
      const obj: any = {};
      const commits: any = await axios.get(pullRequest.commits_url, {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      });

      obj.pullRequestNumber = pullRequest.number;
      obj.pullRequestTitle = pullRequest.title;
      obj.commits = commits.data.length;

      pullRequestCommits.push(obj);
    }
    return pullRequestCommits;
  } catch (error: any) {
    return {
      error: error.response.statusText,
      statusCode: error.response.status || 500,
    };
  }
};

export const numberOfCommitsForASinglePullRequest = async (
  input: OwnerRepoPullNumber
) => {
  try {
    const commits: any = await axios.get(
      `${BASE_URL}${input.owner}/${input.repo}/pulls/${input.pull_number}/commits`,
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
        },
      }
    );

    return { numberOfCommits: commits.data.length };
  } catch (error: any) {
    return {
      error: error.response.statusText,
      statusCode: error.response.status || 500,
    };
  }
};
