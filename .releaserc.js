const commitTypeMap = {
  feat: "Features",
  fix: "Bug Fixes",
  perf: "Performance Improvements",
  refactor: "Refactoring",
  docs: "Documentation",
  style: "Code Style Changes",
  test: "Tests",
  chore: "Chores",
  ci: "Continuous Integration",
  build: "Build System"
};

const releaseRules = [
  { breaking: true, release: "major" },
  { type: "feat", release: "minor" },
  ...["fix", "perf", "refactor", "docs", "style", "test", "chore", "ci", "build"]
    .map(type => ({ type, release: "patch" })),
  { release: "patch" }
];

const transformCommit = (commit, context) => {
  // Handle empty or missing subject
  if (!commit.subject?.trim()) {
    commit.subject = commit.message || "No description provided";
  }

  // Clean up subject by removing empty parentheses
  if (typeof commit.subject === 'string') {
    commit.subject = commit.subject.replace(/\s\(\)/g, '').trim();
  }

  // Transform commit type using the mapping
  commit.type = commitTypeMap[commit.type] || "Miscellaneous Changes";

  return commit;
};

module.exports = {
  branches: ["production"],
  plugins: [
    ["@semantic-release/commit-analyzer", {
      preset: "angular",
      releaseRules
    }],

    ["@semantic-release/release-notes-generator", {
      preset: "conventionalcommits",
      writerOpts: {
        transform: transformCommit,
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