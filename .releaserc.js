module.exports = {
  branches: ["production"],
  plugins: [
    // Analyze commits to determine the version bump
    ["@semantic-release/commit-analyzer", {
      preset: "angular",
      releaseRules: [
        { breaking: true, release: "major" },
        { type: "feat", release: "minor" },
        { type: "fix", release: "patch" },
        { release: "patch" } // Default to patch release if no other match
      ]
    }],

    // Generate release notes based on commit messages
    ["@semantic-release/release-notes-generator", {
      preset: "conventionalcommits",
      writerOpts: {
        transform: (commit, context) => {
          // Shorten the commit hash to the first 7 characters
          if (typeof commit.hash === 'string') {
            commit.hash = commit.hash.substring(0, 7);
          }

          // Simplify commit subjects and remove issue references
          if (typeof commit.subject === 'string') {
            // Format commit message (remove extra information)
            commit.subject = commit.subject.replace(/(.*?)(?=\s+\(\w+\))/, '$1');
          }

          // Transform commit type to more readable format
          switch (commit.type) {
            case "feat":
              commit.type = "Features";
              break;
            case "fix":
              commit.type = "Bug Fixes";
              break;
            default:
              commit.type = "Changes";
          }

          return commit;
        },
        groupBy: "type",
        commitGroupsSort: "title",
        commitsSort: ["scope", "subject"],
        noteGroupsSort: "title"
      }
    }],

    // Generate or update the changelog file
    ["@semantic-release/changelog", {
      changelogFile: "CHANGELOG.md"
    }],

    // Publish release on GitHub
    ["@semantic-release/github", {
      assets: []  // No assets to upload
    }],

    // Commit updated changelog and version files
    ["@semantic-release/git", {
      assets: ["CHANGELOG.md", "package.json", "package-lock.json"],
      message: "chore(release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }]
  ]
};
