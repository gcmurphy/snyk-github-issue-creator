'use strict';

const { name: pkgName, version: pkgVersion } = require('../package.json');
const help = `Usage: snyk-github-issue-creator [options]`;

const conf = (exports.conf = {}); // "Singleton" config object
exports.init = async (args) => {
    Object.assign(conf, {
        snykToken: process.env['SNYK_TOKEN'] ,
        snykOrg: process.env['SNYK_ORG'],
        snykProjects: process.env['SNYK_PROJECTS'].split(',').map(s => s.trim()),
        ghPat: process.env['GH_PAT'],
        ghOwner: process.env['GH_OWNER'],
        ghRepo: process.env['GH_REPO'],
        ghLabels: process.env['GH_LABELS'].split(',').map(s => s.trim()),
        projectName: process.env['PROJECT_NAME'],
        severityLabel: true,
        parseManifestName: false,
        batch: false,
        minimumSeverity: 'low',
        autoGenerate: true,
        save: false,
    });
    if (conf.save) config.set(conf);
};
