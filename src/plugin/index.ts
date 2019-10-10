import * as path from 'path';
import { pri, tempTypesPath } from 'pri';
import * as fs from 'fs-extra';

const requestFilePath = path.join(pri.projectRootPath, tempTypesPath.dir, 'request.ts');

/** Support pri/models alias */
pri.build.pipeConfig(config => {
  if (!config.resolve.alias) {
    config.resolve.alias = {};
  }

  config.resolve.alias['pri/request'] = requestFilePath;

  return config;
});

pri.project.onCreateEntry(async () => {
  const requestContent = `
      import request from 'pri-request'
      export { request }
    `;

  const prettier = await import('prettier');

  // If has stores, create helper.ts
  fs.outputFileSync(
    requestFilePath,
    prettier.format(requestContent, {
      semi: false,
      parser: 'typescript',
    }),
  );
});
