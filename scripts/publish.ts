import { execaCommand } from "execa";

console.info("Starting release process");

try {
  console.log("Trying to publish");
  await execaCommand("pnpm publish --no-git-checks", {
    shell: true,
    all: true,
  });
  console.log("✅ Published successfully");

  console.log("Trying to push tags...");
  await $`git push --follow-tags`;
  console.log("✅ tags pushed successfully");
} catch (error) {
  if (error instanceof Error) {
    if (
      error.message.includes(
        "You cannot publish over the previously published versions"
      )
    ) {
      console.info("Version already published, skipping...");
      process.exit(0);
    } else {
      console.error("Something went wrong", error.message);
      process.exit(1);
    }
  } else {
    console.error("Unknown error", error);
    process.exit(1);
  }
}
