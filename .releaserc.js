module.exports = {
  branches: ["production"],
  plugins: [
    // Analyze commits to determine the version bump
    [
      "@semantic-release/commit-analyzer",
      {
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
        ],
      },
    ],

    // Generate release notes
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        writerOpts: {
          transform: (commit, context) => {
            const issues = [];
            commit.scope = commit.scope === "*" ? "" : commit.scope;
            commit.hash = typeof commit.hash === "string" ? commit.hash.slice(0, 7) : commit.hash;

            if (typeof commit.subject === "string") {
              // Link issue references
              commit.subject = commit.subject.replace(/#(\d+)/g, (_, issue) => {
                issues.push(issue);
                return `[#${issue}](${context.repositoryUrl}/issues/${issue})`;
              });

              // Link JIRA ticket references
              commit.subject = commit.subject.replace(/(NGTPA-\d+)/g, (_, issue) => {
                issues.push(issue);
                return `[${issue}](${context.repositoryUrl}/issues/${issue})`;
              });
            }

            // Filter out references included in issues
            commit.references = commit.references.filter(
              (ref) => !issues.includes(ref.issue)
            );

            // Map commit types to user-friendly names
            const typeMap = {
              feat: "✨ Features",
              fix: "🐛 Bug Fixes",
              perf: "⚡ Performance Improvements",
              refactor: "♻️ Refactoring",
              docs: "📚 Documentation",
              style: "💄 Code Style Changes",
              test: "🧪 Tests",
              chore: "🔧 Chores",
              ci: "👷 Continuous Integration",
              build: "🏗️ Build System",
            };
            commit.type = typeMap[commit.type] || "Miscellaneous Changes";

            return commit;
          },
          groupBy: "type",
          commitGroupsSort: "title",
          commitsSort: ["scope", "subject"],
          noteGroupsSort: "title",
        },
      },
    ],

    // Generate or update the changelog file
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],

    // Publish release notes on GitHub
    [
      "@semantic-release/github",
      {
        assets: [],
      },
    ],

    // Commit updated changelog and version files
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "package-lock.json"],
        message: "chore(release): v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
