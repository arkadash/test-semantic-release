module.exports = {
  branches: ["production"],
  plugins: [
    ["@semantic-release/commit-analyzer", {
      preset: "angular",
      releaseRules: [
        { breaking: true, release: "major" },
        { type: "feat", release: "minor" },
        { type: "fix", release: "patch" },
        { type: "perf", release: "patch" },
        { type: "refactor", release: "patch" },
        { type: "docs", release: "patch" },
        { type: "style", release: "patch" },
        { type: "test", release: "patch" },
        { type: "chore", release: "patch" },
        { type: "ci", release: "patch" },
        { type: "build", release: "patch" },
        { release: "patch" }
      ]
    }],

    ["@semantic-release/release-notes-generator", {
      preset: "conventionalcommits",
      writerOpts: {
        transform: (commit, context) => {
          const issues = [];

          // Use the subject as-is unless changes are needed
          if (typeof commit.subject === 'string') {
            // Remove issue references ("closes #number")
            commit.subject = commit.subject.replace(/closes?\s*#\d+/gi, '').trim();

            // Remove empty parentheses
            commit.subject = commit.subject.replace(/\s\(\)/g, '').trim();

            // Clean up merge commit descriptions
            commit.subject = commit.subject.replace(/merge branch '[^']*'|merge pull request #[^ ]* from .*/, '').trim();
          }

          // If no subject exists, provide a default
          if (!commit.subject || commit.subject.trim() === '') {
            commit.subject = 'No subject';
          }

          // Transform commit type to a readable format
          switch (commit.type) {
            case "feat":
              commit.type = "Features";
              break;
            case "fix":
              commit.type = "Bug Fixes";
              break;
            case "perf":
              commit.type = "Performance Improvements";
              break;
            case "refactor":
              commit.type = "Refactoring";
              break;
            case "docs":
              commit.type = "Documentation";
              break;
            case "style":
              commit.type = "Code Style Changes";
              break;
            case "test":
              commit.type = "Tests";
              break;
            case "chore":
              commit.type = "Chores";
              break;
            case "ci":
              commit.type = "Continuous Integration";
              break;
            case "build":
              commit.type = "Build System";
              break;
            default:
              commit.type = "Miscellaneous Changes";
          }

          return commit;
        },
        groupBy: "type",
        commitGroupsSort: "title",
        commitsSort: ["scope", "subject"],
        noteGroupsSort: "title"
      }
    }],

    ["@semantic-release/changelog", {
      changelogFile: "CHANGELOG.md"
    }],

    ["@semantic-release/github", {
      assets: []
    }],

    ["@semantic-release/git", {
      assets: ["CHANGELOG.md", "package.json", "package-lock.json"],
      message: "chore(release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
    }]
  ]
};