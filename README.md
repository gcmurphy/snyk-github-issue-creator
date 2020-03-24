# GitHub Issue Creator

[![Known Vulnerabilities](https://snyk.io/test/github/pierre-ernst/snyk-github-issue-creator/badge.svg?targetFile=package.json)](https://snyk.io/test/github/pierre-ernst/snyk-github-issue-creator?targetFile=package.json)

Creates GitHub issues from Snyk Project issues.

## Prerequisites

To use this tool you must first set:

1. an environment variable `SNYK_TOKEN` with your API key, as found at https://app.snyk.io/account.
1. an environment variable `GH_PAT` with a GitHub personal access token having enough privilege to create issues.

## Installation

```bash
$ npm install
$ chmod u+x ./cli/index.js
$ npm link
```

## Usage

You can find usage instructions by running:

```bash
$ snyk-github-issue-creator --help
```

```bash
$ snyk-github-issue-creator [--snykOrg=<snykOrg> --snykProject=<snykProject> | --stdin ] --ghOwner=<ghOwner> --ghRepo=<ghRepo> [--ghLabels=<ghLabel>,...] [--projectName=<projectName>] [--parseManifestName] [--batch] [--autoGenerate]
```

-   You can retrieve your snykOrg Id from your org settings page on [Snyk](https://snyk.io) or via the [Snyk API](https://snyk.docs.apiary.io/#reference/organisations/the-snyk-organisation-for-a-request/list-all-the-organisations-a-user-belongs-to).
-   The SnykProject Id is available via the [Snyk API](https://snyk.docs.apiary.io/#reference/projects/projects-by-organisation/list-all-projects).
-   You need to either provide a valid `SnykOrg` Id and `snykProject` Id, or use the `stdin` option to parse the output of a snyk monitor command to retrieve the necessary parameters.
-   The optional `projectName` allows to overrride the project name from Snyk (useful when runing Snyk with CI/CLI integration)
-   If `parseManifestName` is specified, the dependency paths will start with the manifest name instead of the project name
-   If `batch` is specified, the selected findings will be combined into a single GitHub issue (see this [example](screenshot-issue-batch.png))

You will be presented with a list of _high_ and _medium_ vulnerability issues to
generate a GitHub issue for. Type `t` or `true` to create an issue,
and `f` or `false` to skip it.

### Auto generating gitHub issues

If you wish to automatically generate GitHub issues and force the confirmation prompt (e.g. if you want to run this as part of a CI pipeline), enter the flag `--autoGenerate`.

### Examples

Running the script against this repository will create a set of issues, as seen here:

![screen shot of a created issue](screenshot-issue-dogfooding.png)
