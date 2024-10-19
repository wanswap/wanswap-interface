const fs = require('fs');
const path = require('path');

function updatePackageVersions() {
  // 读取 package.json 文件
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // 读取 package-version.json 文件
  const versionJsonPath = path.join(__dirname, 'package-versions.json');
  const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));

  // 遍历 package.json 中的依赖
  ['dependencies', 'devDependencies'].forEach(depType => {
    if (packageJson[depType]) {
      Object.keys(packageJson[depType]).forEach(pkg => {
        if (versionJson[pkg]) {
          // 如果在 package-version.json 中找到对应的版本,则更新
          packageJson[depType][pkg] = versionJson[pkg];
        }
      });
    }
  });

  // 将更新后的 package.json 写回文件
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log('Package versions have been updated successfully.');
}

updatePackageVersions();

