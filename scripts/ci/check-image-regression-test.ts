import { setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { readdirSync, statSync } from "fs";
import { resolve } from "path";

async function run() {
  const pullRequest = context.payload.pull_request;
  if (pullRequest === undefined) {
    return setFailed("the payload is not a pull_request");
  }

  try {
  } catch (error) {
    console.error(error);
    return setFailed("error");
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (githubToken === undefined) {
    return setFailed("github token is undefined");
  }
  const runId = process.env.RUN_ID;
  if (runId === undefined) {
    return setFailed("runId is undefined");
  }

  const contents = readdirSync(resolve("./src/__image_snapshots__/__diff_output__"));
  const files = contents.filter((content) =>
    statSync(resolve("./src/__image_snapshots__/__diff_output__", content)).isFile()
  );
  const diffs = files.map((file) => ({
    imageUrl: `https://agricola-card-image-generator-snapshot.s3.ap-northeast-1.amazonaws.com/${runId}/${file}`,
  }));

  const oktokit = getOctokit(githubToken);
  await oktokit.rest.checks.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    name: "check-image-regression-test",
    head_sha: pullRequest.head.sha,
    conclusion: "failure",
    completed_at: new Date().toISOString(),
    output: {
      title: "Report of check-image-regression-test",
      summary: `${files.length} diffs`,
      text: `${files.length} differences are foundin the image regression test.`,
      annotations: diffs.map((diff) => ({
        path: "src/index.test.ts",
        // TODO: matchSnapshot の行番号を自動で探す
        start_line: 46,
        end_line: 46,
        annotation_level: "failure",
        message: `[diff img](${diff.imageUrl})`,
      })),
      images: diffs.map((diff) => ({
        alt: "diff",
        image_url: diff.imageUrl,
      })),
    },
  });
}

run();
