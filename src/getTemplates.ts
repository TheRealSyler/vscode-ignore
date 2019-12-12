import { exec } from 'child_process';
import { promises } from 'fs';
import meta from '../templates.meta/meta.json';
class Main {
  repoDir = './templates.repo';
  outDir = './src/templates';
  metaFile = './templates.meta/meta.json';
  repo = 'https://github.com/github/gitignore.git';
  constructor() {
    this.init();
  }
  async init() {
    const lastDownload = new Date(meta.lastDownload).getTime();
    const files = await promises.readdir(this.repoDir);
    const templates = await promises.readdir(this.outDir);
    let force = lastDownload + 1000 * 60 * 60 * 24 < Date.now();
    let skip = templates.length > 0 && !force;
    if (files.length < 0 || force) {
      console.log('Cloning Repo');
      skip = false;
      if (files.length > 0) {
        console.log(`Cleaning ${this.repoDir}`);
        await this.exec(`rm -f -r ${this.repoDir}`);
        await this.exec(`mkdir ${this.repoDir}`);
      }
      await this.exec(`git clone ${this.repo} ${this.repoDir}`);

      meta.lastDownload = new Date().toUTCString();
      await promises.writeFile(this.metaFile, JSON.stringify(meta));
      console.log(`Successfully Cloned ${this.repo}`);
    }
    if (!skip) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.endsWith('.gitignore')) {
          const fileContent = await promises.readFile(`${this.repoDir}/${file}`);
          await promises.writeFile(`${this.outDir}/${file}`, fileContent);
          console.log(`Successfully Copied ${file}`);
        }
      }
    } else {
      console.log(
        'Skipped!',
        'Not Downloading for:',
        ((lastDownload + 1000 * 60 * 60 * 24 - Date.now()) / 1000 / 60 / 60).toFixed(2),
        'hours'
      );
    }
  }
  async exec(command: string) {
    return new Promise((res, rej) => {
      exec(command).addListener('exit', code => {
        console.log(command, code);
        if (code !== 0 && code !== null) {
          rej();
          process.exit(code);
        }
        res();
      });
    });
  }
}

new Main();
