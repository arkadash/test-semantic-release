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
        { type: "perf", release: "patch" },
        { type: "refactor", release: "patch" },
        { type: "docs", release: "patch" },
        { type: "style", release: "patch" },
        { type: "test", release: "patch" },
        { type: "chore", release: "patch" },
        { type: "ci", release: "patch" },
        { type: "build", release: "patch" },
        { release: "patch" } // Default to patch release if no other match
      ]
    }],

    // Generate release notes based on commit messages
    ["@semantic-release/release-notes-generator", {
      preset: "conventionalcommits",
      writerOpts: {
        transform: (commit, context) => {
          const issues = [];

          // Remove unnecessary commit scope
          if (commit.scope === '*') {
            commit.scope = '';
          }

          // Shorten the commit hash to the first 7 characters
          if (typeof commit.hash === 'string') {
            commit.hash = commit.hash.substring(0, 7);
          }

          // Modify the commit subject to remove "closes" and handle PR references
          if (typeof commit.subject === 'string') {
            // Remove "closes" references to issues (no "closes" in the final text)
            commit.subject = commit.subject.replace(/closes?\s*#\d+/gi, '');

            // Remove the parentheses if the subject contains a reference
            commit.subject = commit.subject.replace(/\s?\(\s*\)/g, '');

            // Add issue references in square brackets
            commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
              issues.push(issue);
              return `[#${issue}](${context.repositoryUrl}/issues/${issue})`;
            });

            // Add JIRA ticket references
            commit.subject = commit.subject.replace(/(NGTPA-\d+)/g, (_, issue) => {
              issues.push(issue);
              return `[${issue}](${context.repositoryUrl}/issues/${issue})`;
            });
          }

          commit.references = commit.references.filter(reference => {
            return issues.indexOf(reference.issue) === -1;
          });

          // Transform commit type to more readable format
          switch (commit.type) {
            case "feat":
              commit.type = "✨ Features";
              break;
            case "fix":
              commit.type = "🐛 Bug Fixes";
              break;
            case "perf":
              commit.type = "⚡ Performance Improvements";
              break;
            case "refactor":
              commit.type = "♻️ Refactoring";
              break;
            case "docs":
              commit.type = "📚 Documentation";
              break;
            case "style":
              commit.type = "💄 Code Style Changes";
              break;
            case "test":
              commit.type = "🧪 Tests";
              break;
            case "chore":
              commit.type = "🔧 Chores";
              break;
            case "ci":
              commit.type = "👷 Continuous Integration";
              break;
            case "build":
              commit.type = "🏗️ Build System";
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
