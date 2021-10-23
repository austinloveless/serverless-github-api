import express from "express";

import {
  pullRequestsForARepo,
  numberOfCommitsForEveryPullRequest,
  numberOfCommitsForASinglePullRequest,
} from "../handlers/github.handler";

export const githubRouter = express.Router();

// Returns information about a repo
githubRouter.get("/pulls/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  const response = await pullRequestsForARepo({
    owner,
    repo,
  });
  if (response.error) {
    return res.status(response.statusCode).json(response);
  }
  res.status(200).json(response);
});

// Returns the number of commits for every pull request in a repo
githubRouter.get("/pulls/:owner/:repo/commits", async (req, res) => {
  const { owner, repo } = req.params;
  const response: any = await numberOfCommitsForEveryPullRequest({
    owner,
    repo,
  });
  if (response.error) {
    return res.status(response.statusCode).json(response);
  }
  res.status(200).json(response);
});

// Returns the number of commits for a single pull request
githubRouter.get(
  "/pulls/:owner/:repo/:pull_number/commits",
  async (req, res) => {
    const { owner, repo, pull_number } = req.params;
    const response: any = await numberOfCommitsForASinglePullRequest({
      owner,
      repo,
      pull_number,
    });
    if (response.error) {
      return res.status(response.statusCode).json(response);
    }
    res.status(200).json(response);
  }
);
