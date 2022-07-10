import { exec } from 'child_process';
import { existsSync, mkdirSync, promises } from 'fs';
import meta from './template.meta.json';
class UpdateTemplates {
  repoDir = './templates.repo';
  outFile = './src/template/templates.json';
  metaFile = './src/template/template.meta.json';
  repo = 'https://github.com/github/gitignore.git';
  constructor() {
    this.init();
  }
  async init() {
    const lastDownload = new Date(meta.lastDownload).getTime();

    if (!existsSync(this.repoDir)) {
      console.log(`Creating dir at: ${this.repoDir}`)
      mkdirSync(this.repoDir)
    }

    const files = await promises.readdir(this.repoDir);
    const templatesFileExists = existsSync(this.outFile);
    let force = lastDownload + 1000 * 60 * 60 * 24 < Date.now();
    let writeFile = !templatesFileExists || force;
    if (files.length < 0 || force) {
      console.log(`Cloning: ${this.repo}`);
      writeFile = true;
      if (files.length > 0) {
        console.log(`Cleaning ${this.repoDir}`);
        await this.exec(`rm -f -r ${this.repoDir}`);
      }
      await this.exec(`git clone ${this.repo} ${this.repoDir}`);

      meta.lastDownload = new Date().toUTCString();
      await promises.writeFile(this.metaFile, JSON.stringify(meta));
      console.log(`Successfully Cloned ${this.repo}`);
    }
    if (writeFile) {
      const files = await promises.readdir(this.repoDir);
      const templates: { [key: string]: string } = {};
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.endsWith('.gitignore')) {
          const fileContent = await promises.readFile(`${this.repoDir}/${file}`);
          templates[file.replace(/\.gitignore/, '')] = fileContent.toString();
        }
      }
      await promises.writeFile(`${this.outFile}`, JSON.stringify(templates, undefined, 2));
      console.log(`Successfully Created ${this.outFile}`);
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
    return new Promise<void>((res, rej) => {
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

new UpdateTemplates();
