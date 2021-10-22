import express from "express";

import {
  pullRequestsForARepo,
  numberOfCommitsForEveryPullRequest,
  numberOfCommitsForASinglePullRequest,
} from "../handlers/github.handler";

export const githubRouter = express.Router();

githubRouter.get("/pulls/:owner/:repo", async (req, res) => {
  const { owner, repo } = req.params;
  const input = {
    owner,
    repo,
  };
  const response = await pullRequestsForARepo(input);
  if (response.error) {
    return res.status(response.statusCode).json(response);
  }
  res.status(200).json(response);
});

githubRouter.get("/pulls/:owner/:repo/commits", async (req, res) => {
  const { owner, repo } = req.params;
  const input = {
    owner,
    repo,
  };
  const response: any = await numberOfCommitsForEveryPullRequest(input);
  if (response.error) {
    return res.status(response.statusCode).json(response);
  }
  res.status(200).json(response);
});

githubRouter.get(
  "/pulls/:owner/:repo/:pull_number/commits",
  async (req, res) => {
    const { owner, repo, pull_number } = req.params;
    const input = {
      owner,
      repo,
      pull_number,
    };
    const response: any = await numberOfCommitsForASinglePullRequest(input);
    if (response.error) {
      return res.status(response.statusCode).json(response);
    }
    res.status(200).json(response);
  }
);
