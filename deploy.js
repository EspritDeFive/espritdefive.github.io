// deploy.js
// テスト用フォルダ（cuytq78hfdlazvirw）の内容を本番用（ルート直下）にコピーし、最適化するスクリプト。

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'cuytq78hfdlazvirw');
const DEST_DIR = __dirname;

console.log('=========================================');
console.log(' 本番デプロイプロセスを開始します... 🚀');
console.log('=========================================');

// コピー対象の個別ファイル
const filesToCopy = ['index.html', 'style.css', 'script.js', 'data.json', '404.html'];
// コピー対象のディレクトリ（共通管理化されたため、assetsはデプロイコピー対象から除外）
const dirsToCopy = [];

// 1. ファイルのコピーと本番用最適化
filesToCopy.forEach(file => {
    const srcPath = path.join(SRC_DIR, file);
    const destPath = path.join(DEST_DIR, file);

    if (fs.existsSync(srcPath)) {
        if (file === 'index.html') {
            let content = fs.readFileSync(srcPath, 'utf8');
            
            // 画像やリソースのパスを本番用（ルート直下基準）に変換
            // 例： ../source/header_v006.jpg -> source/header_v006.jpg
            const updatedContent = content
                .replace(/\.\.\/source\//g, 'source/')
                // 検索エンジンの回避設定（noindex）を本番環境用に解除する
                .replace(/<meta name="robots" content="noindex, nofollow">/g, '');
            
            fs.writeFileSync(destPath, updatedContent, 'utf8');
            console.log(`[成功] ${file} をコピーし、本番用に最適化しました。`);
        } else if (file === '404.html') {
            let content = fs.readFileSync(srcPath, 'utf8');
            
            // 画像やリソースのパスを本番用（ルート直下基準）に変換 (※404ページ自体が検索に載らないよう、noindexはそのまま維持)
            const updatedContent = content.replace(/\.\.\/source\//g, 'source/');
            
            fs.writeFileSync(destPath, updatedContent, 'utf8');
            console.log(`[成功] ${file} をコピーし、本番用に最適化しました。`);
        } else if (file === 'script.js') {
            let content = fs.readFileSync(srcPath, 'utf8');
            
            // ギャラリー画像のパスを本番用（ルート直下基準）に変換
            // 例： ../assets/gallery/ -> assets/gallery/
            const updatedContent = content.replace(/\.\.\/assets\//g, 'assets/');
            
            fs.writeFileSync(destPath, updatedContent, 'utf8');
            console.log(`[成功] ${file} をコピーし、本番用に最適化しました。`);
        } else {
            // index.html / script.js 以外はそのままコピー
            fs.copyFileSync(srcPath, destPath);
            console.log(`[成功] ${file} をコピーしました。`);
        }
    } else {
        console.warn(`[警告] テスト用フォルダ内に ${file} が見つかりませんでした。`);
    }
});

// 2. ディレクトリの再帰コピー
dirsToCopy.forEach(dir => {
    const srcPath = path.join(SRC_DIR, dir);
    const destPath = path.join(DEST_DIR, dir);

    if (fs.existsSync(srcPath)) {
        try {
            // Node.js 16.7.0以降の標準再帰コピーを使用
            fs.cpSync(srcPath, destPath, { recursive: true, force: true });
            console.log(`[成功] ${dir} フォルダを本番環境（ルート直下）にコピーしました。`);
        } catch (err) {
            // 古いNode.js環境用のフォールバック再帰コピー
            copyDirRecursive(srcPath, destPath);
        }
    } else {
        console.log(`[情報] コピー対象のディレクトリ ${dir} は存在しません。`);
    }
});

console.log('=========================================');
console.log(' 🎉 本番用デプロイファイルの生成が完了しました！');
console.log(' Gitでコミット＆プッシュして本番公開してください。');
console.log('=========================================');

// 再帰的にディレクトリをコピーする関数（古いNode.js環境用フォールバック）
function copyDirRecursive(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDirRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
