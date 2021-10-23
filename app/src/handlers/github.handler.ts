import axios from "axios";

import {
  PullRequestsCommits,
  OwnerRepo,
  OwnerRepoPullNumber,
} from "../zod/github.zod";

const BASE_URL = "https://api.github.com/repos/";

export const pullRequestsForARepo = async (input: OwnerRepo): Promise<any> => {
  if (process.env.GITHUB_ACCESS_TOKEN) {
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
    } catch (error) {
      errorHandler(error, input);
    }
  }
  try {
    const response = await axios.get(
      `${BASE_URL}${input.owner}/${input.repo}/pulls`
    );
    return response.data;
  } catch (error) {
    errorHandler(error, input);
  }
};

export const numberOfCommitsForEveryPullRequest = async (input: OwnerRepo) => {
  if (process.env.GITHUB_ACCESS_TOKE) {
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
    } catch (error) {
      errorHandler(error, input);
    }
  }
  try {
    const pullRequests = await pullRequestsForARepo(input);
    const pullRequestCommits: PullRequestsCommits[] = [];
    for (const pullRequest of pullRequests) {
      const obj: any = {};
      const commits: any = await axios.get(pullRequest.commits_url);

      obj.pullRequestNumber = pullRequest.number;
      obj.pullRequestTitle = pullRequest.title;
      obj.commits = commits.data.length;

      pullRequestCommits.push(obj);
    }
    return pullRequestCommits;
  } catch (error) {
    errorHandler(error, input);
  }
};

export const numberOfCommitsForASinglePullRequest = async (
  input: OwnerRepoPullNumber
) => {
  if (process.env.GITHUB_ACCESS_TOKEN) {
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
    } catch (error) {
      errorHandler(
        error,
        { owner: input.owner, repo: input.repo },
        input.pull_number
      );
    }
  }
  try {
    const commits: any = await axios.get(
      `${BASE_URL}${input.owner}/${input.repo}/pulls/${input.pull_number}/commits`
    );

    return { numberOfCommits: commits.data.length };
  } catch (error) {
    errorHandler(
      error,
      { owner: input.owner, repo: input.repo },
      input.pull_number
    );
  }
};

export const errorHandler = (
  error: any,
  ownerRepo: OwnerRepo,
  pull_number?: string // tslint:disable-line
) => {
  if (error.response) {
    return {
      error: error.response.statusText
        ? error.response.statusText
        : "Error completing request.",
      statusCode: error.response.status ? error.response.status : 500,
    };
  }
  return {
    error: pull_number
      ? `Could not find ${ownerRepo.owner}/${ownerRepo.repo}/${pull_number}`
      : `Could not find ${ownerRepo.owner}/${ownerRepo.repo}`,
    statusCode: 500,
  };
};
