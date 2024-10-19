const fs = require('fs');
const path = require('path');

function getVersionsFromLock() {
  // 读取 yarn.lock 文件
  const lockFilePath = path.join(process.cwd(), 'yarn.lock');
  const lockFileContent = fs.readFileSync(lockFilePath, 'utf8');

  // 用于存储结果的对象
  const dependencies = {};

  // 按行分割内容
  const lines = lockFileContent.split('\n');

  let currentPackage = '';

  lines.forEach(line => {
    // 匹配包名行
    const packageMatch = line.match(/^"?(.+?)"?@/);
    if (packageMatch) {
      currentPackage = packageMatch[1];
    }

    // 匹配版本行
    const versionMatch = line.match(/^\s+version\s+"(.+)"/);
    if (versionMatch && currentPackage) {
      dependencies[currentPackage] = versionMatch[1];
      currentPackage = ''; // 重置当前包名
    }
  });

  // 将结果写入 JSON 文件
  const jsonOutput = JSON.stringify(dependencies, null, 2);
  fs.writeFileSync('package-versions.json', jsonOutput);

  console.log('Package versions have been saved to package-versions.json');
}

getVersionsFromLock();

