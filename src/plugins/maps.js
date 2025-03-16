const { withDangerousMod, withPlugins } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function modifyPodfile(podfilePath) {
  let fileContent = fs.readFileSync(podfilePath, 'utf8');

  const elseLine = '  else';
  const targetLine = '  config = use_native_modules!';
  const podLine =
    "  pod 'react-native-google-maps', path: File.dirname(`node --print \"require.resolve('react-native-maps/package.json')\"`)";

  const elseIndex = fileContent.indexOf(elseLine);

  if (elseIndex !== -1) {
    const configIndex = fileContent.indexOf(targetLine, elseIndex);

    if (configIndex !== -1 && !fileContent.includes(podLine, elseIndex)) {
      // Insert the pod line after the `else` line but before the `config = use_native_modules!` line
      fileContent =
        fileContent.slice(0, configIndex) + `${podLine}\n` + fileContent.slice(configIndex);

      // Write the modified content back to the Podfile
      fs.writeFileSync(podfilePath, fileContent, 'utf8');
    }
  }
}

const withReactNativeMapsWorkaround = config => {
  return withDangerousMod(config, [
    'ios',
    async config => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      modifyPodfile(podfilePath);
      return config;
    },
  ]);
};

module.exports = config => withPlugins(config, [withReactNativeMapsWorkaround]);