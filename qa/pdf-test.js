// QA-гейт калькулятора (Task_Router § Интерактивные тулзы): 5 наборов данных → PDF + скриншоты всех вкладок.
// Запуск: 1) npm run build  2) поднять сервер: в папке с симлинком site/calculadora → build: python3 -m http.server 8765
//         3) npm i puppeteer-core (или взять из scratchpad-сессии)  4) node qa/pdf-test.js
// Результаты (pdf-out/) смотреть ГЛАЗАМИ: PDF постранично + скрины моб/десктоп.
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'pdf-out');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:8765/calculadora/';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function setInput(page, label, value) {
  // находим input по тексту label
  const ok = await page.evaluate((label, value) => {
    const labels = Array.from(document.querySelectorAll('label'));
    const l = labels.find(x => x.textContent.trim() === label);
    if (!l) return false;
    const input = l.parentElement.querySelector('input');
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }, label, value);
  if (!ok) throw new Error('label not found: ' + label);
}

async function clickByText(page, selector, text) {
  const ok = await page.evaluate((selector, text) => {
    const els = Array.from(document.querySelectorAll(selector));
    const el = els.find(x => x.textContent.trim().includes(text));
    if (!el) return false;
    el.click();
    return true;
  }, selector, text);
  if (!ok) throw new Error('not found: ' + text);
}

async function downloadPDF(page, client, name) {
  await clickByText(page, 'button', 'CALCULAR').catch(() => {});
  await sleep(400);
  // кнопка PDF теперь и на Principal, и на Despesas — пробуем текущую вкладку, иначе Principal
  try {
    await clickByText(page, 'button', 'Baixar relatório PDF');
  } catch (e) {
    await clickByText(page, 'button', 'Principal');
    await sleep(300);
    await clickByText(page, 'button', 'CALCULAR').catch(() => {});
    await sleep(400);
    await clickByText(page, 'button', 'Baixar relatório PDF');
  }
  // ждём файл
  for (let i = 0; i < 60; i++) {
    await sleep(500);
    const f = fs.readdirSync(OUT).find(x => x === 'Relatorio_Double_Sales.pdf');
    if (f && !fs.readdirSync(OUT).some(x => x.endsWith('.crdownload'))) {
      fs.renameSync(path.join(OUT, f), path.join(OUT, name + '.pdf'));
      return;
    }
  }
  throw new Error('PDF not downloaded: ' + name);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const client = await page.createCDPSession();
  await client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: OUT });

  // ---------- Сценарий A: дефолтные данные ----------
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT, 'A-ui-main.png') });
  await downloadPDF(page, client, 'A-default');
  console.log('A done');

  // ---------- Сценарий B: много расходов (перенос страниц) ----------
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await clickByText(page, 'button', 'Despesas');
  await sleep(300);
  // добавляем 12 фиксированных + заполняем имена/суммы
  for (let i = 0; i < 12; i++) {
    await clickByText(page, 'button', 'Adicionar'); // первая секция Fixas
    await sleep(80);
  }
  await page.evaluate(() => {
    // заполняем все "Nova despesa" в первой секции
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const inputs = Array.from(document.querySelectorAll('input'));
    let n = 0;
    inputs.forEach(inp => {
      if (inp.value === 'Nova despesa') {
        n++;
        setter.call(inp, 'Despesa extra de teste número ' + n + ' com nome comprido');
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        // сумма — соседний input
        const amount = inp.parentElement.parentElement.querySelectorAll('input')[1];
        if (amount) { setter.call(amount, String(50 + n * 10)); amount.dispatchEvent(new Event('input', { bubbles: true })); }
      }
    });
  });
  await sleep(300);
  await page.screenshot({ path: path.join(OUT, 'B-ui-expenses.png'), fullPage: true });
  await downloadPDF(page, client, 'B-many-expenses');
  console.log('B done');

  // ---------- Сценарий C: минимум (все нули, upsell>0, лимит мест) ----------
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await setInput(page, 'Upsell', '297');
  await setInput(page, 'Vagas do PP/mês', '20');
  await setInput(page, 'LM/Conteúdo → inscrição direta', '0');
  await clickByText(page, 'button', 'Despesas');
  await sleep(300);
  // удаляем почти все расходы: жмём все кнопки удаления (оставится по 1 — защита в коде)
  for (let k = 0; k < 30; k++) {
    const removed = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter(b => b.querySelector('svg.lucide-trash-2') || b.querySelector('svg.lucide-trash2'));
      // мобильные и десктопные дубли — берём видимые
      const btn = btns.find(b => b.offsetParent !== null);
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!removed) break;
    await sleep(60);
  }
  await sleep(300);
  await page.screenshot({ path: path.join(OUT, 'C-ui-expenses-min.png'), fullPage: true });
  await downloadPDF(page, client, 'C-minimal');
  console.log('C done');

  // ---------- Сценарий D: большие числа + быстрый рост ----------
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await setInput(page, 'Preço do tripwire', '497');
  await setInput(page, 'Preço do produto principal', '5000');
  await setInput(page, 'Alcance médio por publicação', '120000');
  await setInput(page, 'Publicações por semana', '7');
  await setInput(page, 'Crescimento do alcance/mês', '30');
  await downloadPDF(page, client, 'D-big-numbers');
  await page.screenshot({ path: path.join(OUT, 'D-ui-results.png'), fullPage: true });
  console.log('D done');

  // ---------- Сценарий E: нулевые конверсии (Infinity → «—») ----------
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await setInput(page, 'Conteúdo → entrada na automação', '0');
  await setInput(page, 'LM/Conteúdo → inscrição direta', '0');
  await clickByText(page, 'button', 'CALCULAR');
  await sleep(500);
  await page.screenshot({ path: path.join(OUT, 'E-ui-zero-conv.png'), fullPage: true });
  await downloadPDF(page, client, 'E-zero-conversions');
  console.log('E done');

  // мобильный скрин шапки (лого-воронка)
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(OUT, 'F-ui-mobile-header.png') });
  console.log('F done');

  await browser.close();
})().catch(e => { console.error('FAIL:', e.message); process.exit(1); });
