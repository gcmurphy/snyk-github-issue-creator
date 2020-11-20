const { prompt } = require('enquirer');
const flatten = require('lodash.flatten');

const {
    capitalize,
    compare,
    uniq,
    getProjectName,
    getUniqueProjectNamePrefixes,
    getGraph,
} = require('./utils');

const getBatchProps = async (issues) => {
    const packageNames = uniq(issues.map((x) => x.package));

    if (packageNames.length === 1) {
        return {
            package: packageNames[0],
            version: getBatchVersionString(issues),
            issues,
        };
    }

    const reduced = issues.reduce((acc, cur) => {
        const { package } = cur;
        if (!acc[package]) {
            acc[package] = [];
        }
        acc[package].push(cur);
        return acc;
    }, {});
    const choices = Object.entries(reduced).map(
        ([package, issues]) => `${package} ${getBatchVersionString(issues)}`
    );

    const { selected } = await prompt({
        type: 'select',
        name: 'selected',
        message: 'Pick a vulnerable package',
        choices,
    });

    const package = selected.substring(0, selected.indexOf(' '));
    const version = selected.substring(selected.indexOf(' ') + 1);
    const _issues = issues.filter((issue) => issue.package === package);
    return {
        package,
        version,
        issues: _issues,
    };
};

const getBatchVersionString = (issues) => {
    const versions = uniq(issues.map((x) => x.version)).sort(compare.versions);
    return versions.join('/');
};

const getProjects = (issues) => {
    return uniq(flatten(issues.map((issue) => issue.projects)));
};

const getBatchIssue = async (issues) => {
    const sevMap = issues.reduce((acc, cur) => {
        acc[cur.severity] = (acc[cur.severity] || []).concat(cur);
        return acc;
    }, {});
    const batchProps = await getBatchProps(issues);

    // if there is a single vulnerability, just use that for the description
    let description = `${issues[0].title}`;
    if (issues.length > 1) {
        // otherwise, if there are multiple vulnerabilities:
        const titles = uniq(issues.map((x) => x.title));
        const vuln = titles.length === 1 ? ` ${titles[0]}` : '';
        // if there are multiple of vulnerabilities of a single type, include the type in the description
        // otherwise, if there are multiple types of vulnerabilities of a multiple types, leave that out of the description
        description = `${issues.length}${vuln} findings`;
    }
    const projects = getProjects(issues);
    const showFullManifest = getUniqueProjectNamePrefixes(projects).size > 1;
    const title = `${getProjectName(projects)} - ${description} in ${
        batchProps.package
    } ${batchProps.version}`;

    const headerText = `This issue has been created automatically by a source code scanner.\r\n\r\nSnyk project(s):`;
    const projectText = projects
        .map(
            ({ name, browseUrl, imageTag }) =>
                `\r\n * [\`${name}\`](${browseUrl}) (manifest version ${imageTag})`
        )
        .join('');
    const sectionText = Object.keys(sevMap)
        .map((sev) => {
            const header = `# ${capitalize(sev)}-severity vulnerabilities`;
            const body = sevMap[sev]
                .map(
                    (issue, i) =>
                        `\r\n\r\n<details>
<summary>${i + 1}. ${issue.title} in ${issue.package} ${issue.version} (${
                            issue.id
                        })</summary>

## Detailed paths
${getGraph(issue, '* ', showFullManifest)}

${issue.description}
- [${issue.id}](${issue.url})
</details>`
                )
                .join('');
            return '\r\n\r\n' + header + body;
        })
        .join('');
    const body = headerText + projectText + sectionText;

    return { title, body };
};

module.exports = {
    getBatchProps,
    getBatchVersion: getBatchVersionString,
    getBatchIssue,
};
