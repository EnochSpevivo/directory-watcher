const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Get command-line arguments
console.log({ "args": process.argv });
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Please provide the source and target directories as command-line arguments.");
    process.exit(1);
}

const sourceDir = path.resolve(args[0]);
const targetDir = path.resolve(args[1]);

// Function to copy a file
const copyFile = (src, dest) => {
    fs.copyFileSync(src, dest);
    console.log(`File copied from ${src} to ${dest}`);
};

// Function to remove a file
const removeFile = (filePath) => {
    fs.unlinkSync(filePath);
    console.log(`File removed: ${filePath}`);
};

// Function to ensure the directory structure is mirrored in the target
const ensureDirSync = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Directory created: ${dirPath}`);
    }
};

// Initialize the watcher
const watcher = chokidar.watch(sourceDir, {
    persistent: true,
    ignoreInitial: false,
    followSymlinks: true,
    awaitWriteFinish: true,
});

// Event listeners for the watcher
watcher
    .on('add', (filePath) => {
        const targetPath = path.join(targetDir, path.relative(sourceDir, filePath));
        ensureDirSync(path.dirname(targetPath));
        copyFile(filePath, targetPath);
    })
    .on('change', (filePath) => {
        const targetPath = path.join(targetDir, path.relative(sourceDir, filePath));
        copyFile(filePath, targetPath);
    })
    .on('unlink', (filePath) => {
        const targetPath = path.join(targetDir, path.relative(sourceDir, filePath));
        removeFile(targetPath);
    })
    .on('addDir', (dirPath) => {
        const targetPath = path.join(targetDir, path.relative(sourceDir, dirPath));
        ensureDirSync(targetPath);
    })
    .on('unlinkDir', (dirPath) => {
        const targetPath = path.join(targetDir, path.relative(sourceDir, dirPath));
        fs.rmdirSync(targetPath, { recursive: true });
        console.log(`Directory removed: ${targetPath}`);
    });

console.log(`Watching for changes in ${sourceDir}`);
