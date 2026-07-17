// QA-доп: невалидный ввод (санитайзер числовых полей) + скрины вкладок Dicas/Faturamento — против ПРОДА.
// Запуск: node qa/invalid-input-test.js (нужен puppeteer-core + системный Chrome)
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'pdf-out-prod');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'https://yuliyatsapova.com.br/calculadora/';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto(BASE, { waitUntil: 'networkidle0' });

  // Сценарий G: мусорный ввод в числовые поля — что реально остаётся в input
  const results = await page.evaluate(() => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const labels = Array.from(document.querySelectorAll('label'));
    const out = [];
    const tryInput = (labelText, junk) => {
      const l = labels.find(x => x.textContent.trim() === labelText);
      if (!l) { out.push([labelText, 'LABEL NOT FOUND', '']); return; }
      const input = l.parentElement.querySelector('input');
      if (!input) { out.push([labelText, 'INPUT NOT FOUND', '']); return; }
      setter.call(input, junk);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      out.push([labelText, junk, input.value]);
    };
    tryInput('Preço do tripwire', 'abc97xx');
    tryInput('Preço do produto principal', '99🚀7,5!!');
    tryInput('Alcance médio por publicação', '-500e2');
    tryInput('Publicações por semana', '3,,5,,');
    return out;
  });
  console.log('G invalid-input:', JSON.stringify(results, null, 1));
  await page.screenshot({ path: path.join(OUT, 'G-invalid-input.png'), fullPage: false });

  // Скрины вкладок (все кнопки-табы по очереди)
  const tabs = ['Dicas', 'Faturamento', 'Metas', 'Benchmarks'];
  for (const t of tabs) {
    const clicked = await page.evaluate((t) => {
      const el = Array.from(document.querySelectorAll('button')).find(x => x.textContent.trim().includes(t));
      if (!el) return false;
      el.click();
      return true;
    }, t);
    if (clicked) {
      await sleep(400);
      await page.screenshot({ path: path.join(OUT, `H-tab-${t}.png`), fullPage: true });
      console.log('tab ok:', t);
    } else {
      console.log('tab NOT FOUND:', t);
    }
  }

  // Мобилка 390 полная страница
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT, 'I-mobile-full.png'), fullPage: true });

  await browser.close();
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
