import { z } from "zod";

const pullRequestsCommits = z.object({
  pullRequestNumber: z.number(),
  pullRequestTitle: z.string(),
  commits: z.number(),
});

const ownerRepo = z.object({
  owner: z.string(),
  repo: z.string(),
});

const ownerRepoPullNumber = z.object({
  owner: z.string(),
  repo: z.string(),
  pull_number: z.string(),
});

export type PullRequestsCommits = z.infer<typeof pullRequestsCommits>;
export type OwnerRepo = z.infer<typeof ownerRepo>;
export type OwnerRepoPullNumber = z.infer<typeof ownerRepoPullNumber>;
