import * as fs from 'fs';
import { execSync } from 'child_process';

// Get the app name from the command line
const appName = process.argv[2];
// create a nest application with the name
execSync(`npx nest generate app ${appName}-ms`);

// Read the package.json file
const packageJson = JSON.parse(fs.readFileSync('package.json'));

// Add a new property in the scripts section
packageJson.scripts = {
  ...packageJson.scripts,
  [`start:${appName}`]: `npx nest start -w ${appName}-ms`,
};

// Write the updated package.json file
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
