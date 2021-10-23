import {
  pullRequestsForARepo,
  numberOfCommitsForEveryPullRequest,
  numberOfCommitsForASinglePullRequest,
  errorHandler,
} from "../handlers/github.handler";
import { pullRequestInfo } from "./mocks/pullRequestInfo.mock";
import axios from "axios";

import {
  commitsPerPullRequestForRepoRequest,
  commitsPerPullRequestForRepoResponse,
} from "./mocks/commitsPerPullRequestForRepo.mock";
import { errorResponse } from "./mocks/error.mock";

const OWNER = "some-valid-owner";
const REPO = "some-valid-repo";
const PULL_NUMBER = "some-valid-pull-number";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const input = { owner: OWNER, repo: REPO };
describe("GET /github/pulls/:owner/:repo", () => {
  it("should return info about a given repo.", async () => {
    mockedAxios.get.mockResolvedValue(pullRequestInfo);

    const response = await pullRequestsForARepo(input);
    expect(response).toEqual(pullRequestInfo.data);
  });
});

describe("GET /github/pulls/:owner/:repo/:pull_number/commits", () => {
  it("should return commitNumber per every pull request in a repo.", async () => {
    mockedAxios.get
      .mockResolvedValueOnce(pullRequestInfo)
      .mockResolvedValue(commitsPerPullRequestForRepoRequest);

    const response = await numberOfCommitsForEveryPullRequest({
      owner: OWNER,
      repo: REPO,
    });
    expect(response).toEqual(commitsPerPullRequestForRepoResponse.data);
  });
});

describe("GET /github/pulls/:owner/:repo", () => {
  it("should return info about a given repo.", async () => {
    mockedAxios.get.mockResolvedValue(commitsPerPullRequestForRepoRequest);

    const response = await numberOfCommitsForASinglePullRequest({
      owner: OWNER,
      repo: REPO,
      pull_number: PULL_NUMBER,
    });
    expect(response).toEqual({ numberOfCommits: 6 });
  });
});

describe("Error Handler", () => {
  it("should return info about a given repo.", async () => {
    const response = errorHandler(errorResponse, input);
    expect(response).toEqual(errorResponse.response);
  });

  it("should return info about a given repo.", async () => {
    const response = errorHandler({}, input);
    expect(response).toEqual({
      error: "Could not find some-valid-owner/some-valid-repo",
      statusCode: 500,
    });
  });
});
