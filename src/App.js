import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Calculator, TrendingUp, DollarSign, Target, ChevronRight, Sparkles, PiggyBank, Rocket, Lightbulb, Play, Download } from 'lucide-react';

const COLORS = { primary: '#2B72D4', mid: '#1A56B0', accent: 'rgba(43,114,212,0.12)', surface: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.10)', borderStrong: 'rgba(255,255,255,0.20)', textBody: '#C4C4C4', textSecondary: '#8A8A8A', positive: '#22C55E' };

const TabBtn = ({ id, activeTab, setActiveTab, icon: Icon, label }) => (
  <button onClick={() => setActiveTab(id)} className="flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all" style={activeTab === id ? { backgroundColor: COLORS.primary, color: 'white', boxShadow: '0 0 20px rgba(43,114,212,0.50)' } : { backgroundColor: COLORS.surface, color: COLORS.textBody, border: `1px solid ${COLORS.border}` }}>
    <Icon size={18} /><span className="hidden sm:inline">{label}</span>
  </button>
);

const Input = ({ label, value, onChange, suffix, hint }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>{label}</label>
    <div className="relative">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 border rounded-xl font-semibold pr-12" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: COLORS.border, color: '#FFFFFF' }} />
      {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium" style={{ color: COLORS.textSecondary }}>{suffix}</span>}
    </div>
    {hint && <p className="text-xs" style={{ color: COLORS.textSecondary }}>{hint}</p>}
  </div>
);

const ResultCard = ({ icon: Icon, label, value, sub, hl }) => (
  <div className="p-5 rounded-2xl" style={{ backgroundColor: hl ? COLORS.primary : COLORS.surface, color: 'white', border: `1px solid ${hl ? 'transparent' : COLORS.border}`, boxShadow: hl ? '0 0 20px rgba(43,114,212,0.50)' : 'none' }}>
    <div className="flex items-start justify-between">
      <div><p className="text-sm mb-1" style={{ color: COLORS.textSecondary }}>{label}</p><p className="text-2xl font-bold">{value}</p>{sub && <p className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>{sub}</p>}</div>
      <div className="p-3 rounded-xl" style={{ backgroundColor: hl ? 'rgba(255,255,255,0.2)' : 'rgba(43,114,212,0.15)' }}><Icon size={24} /></div>
    </div>
  </div>
);

const ExpenseRow = ({ expense, onUpdate, onRemove, isVar }) => (
  <div className="space-y-1">
    <div className="hidden sm:flex items-center gap-2 p-3 rounded-xl group" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
      <input type="text" value={expense.name} onChange={(e) => onUpdate(expense.id, 'name', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm min-w-0" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: COLORS.border, color: '#FFFFFF' }} />
      <input type="text" value={isVar ? expense.percent : expense.amount} onChange={(e) => onUpdate(expense.id, isVar ? 'percent' : 'amount', e.target.value)} className="w-24 px-3 py-2 border rounded-lg font-semibold text-right" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: COLORS.border, color: '#FFFFFF' }} />
      <span className="text-sm w-8" style={{ color: COLORS.textSecondary }}>{isVar ? '%' : 'R$'}</span>
      <button onClick={() => onRemove(expense.id)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-900/30" style={{ color: '#EF4444' }}><Trash2 size={18} /></button>
    </div>
    <div className="sm:hidden p-3 rounded-xl" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
      <input type="text" value={expense.name} onChange={(e) => onUpdate(expense.id, 'name', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: COLORS.border, color: '#FFFFFF' }} />
      <div className="flex items-center gap-2">
        <input type="text" value={isVar ? expense.percent : expense.amount} onChange={(e) => onUpdate(expense.id, isVar ? 'percent' : 'amount', e.target.value)} className="flex-1 px-3 py-2 border rounded-lg font-semibold" style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: COLORS.border, color: '#FFFFFF' }} />
        <span className="text-sm" style={{ color: COLORS.textSecondary }}>{isVar ? '%' : 'R$'}</span>
        <button onClick={() => onRemove(expense.id)} className="p-2 rounded-lg hover:bg-red-900/30" style={{ color: '#EF4444' }}><Trash2 size={18} /></button>
      </div>
    </div>
    {expense.hint && <p className="text-xs ml-3" style={{ color: COLORS.textSecondary }}>* {expense.hint}</p>}
  </div>
);

const RoadmapRow = ({ goal, reachN, note, hl, avgReach, reelsPerWeek }) => {
  const formatNum = (n) => !isFinite(n) || n <= 0 ? '—' : n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : Math.round(n).toLocaleString('pt-BR');
  const pubs = avgReach > 0 ? Math.max(1, Math.ceil(reachN / avgReach)) : 1;
  const weeks = avgReach > 0 && reelsPerWeek > 0 ? Math.max(1, Math.ceil(reachN / avgReach / reelsPerWeek)) : 1;
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: hl ? COLORS.primary : COLORS.surface, color: 'white', border: hl ? 'none' : `1px solid ${COLORS.border}`, boxShadow: hl ? '0 0 20px rgba(43,114,212,0.50)' : 'none' }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[200px]"><h3 className="font-bold">{goal}</h3><p className="text-sm" style={{ color: COLORS.textSecondary }}>{note}</p></div>
        <div className="flex gap-6 text-center">
          <div><p className="text-xs" style={{ color: COLORS.textSecondary }}>Alcance</p><p className="font-bold text-lg">{formatNum(reachN)}</p></div>
          <div><p className="text-xs" style={{ color: COLORS.textSecondary }}>Publicações</p><p className="font-bold text-lg">{pubs}</p></div>
          <div><p className="text-xs" style={{ color: COLORS.textSecondary }}>Semanas</p><p className="font-bold text-lg">{weeks}</p></div>
        </div>
      </div>
    </div>
  );
};

const CalculateButton = ({ onClick, calculated }) => (
  <button onClick={onClick} className="w-full py-4 px-6 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all hover:scale-[1.02]" style={{ backgroundColor: calculated ? COLORS.positive : COLORS.primary, boxShadow: calculated ? '0 0 20px rgba(34,197,94,0.45)' : '0 0 20px rgba(43,114,212,0.50)' }}>
    <Play size={24} fill="white" />
    {calculated ? 'Pronto! Clique para recalcular se alterar os dados' : 'CALCULAR'}
  </button>
);

const DoubleSalesCalculator = () => {
  const [products, setProducts] = useState({ tripwirePrice: '97', flagshipPrice: '997', upsellPrice: '0', maxFlagshipSales: '999' });
  const [conversions, setConversions] = useState({ reelsToBot: '2', botToLM: '70', lmToTR: '5', trToApplication: '30', applicationToFL: '20', lmToApplicationDirect: '1' });
  const [reach, setReach] = useState({ avgReelsReach: '3000', reelsPerWeek: '3', monthlyGrowth: '10' });

  const [fixedExpenses, setFixedExpenses] = useState([
    { id: 1, name: 'Automação (WhatsApp/email)', amount: '80', hint: 'ManyChat, RD Station, LeadLovers' },
    { id: 2, name: 'Tráfego pago', amount: '0', hint: 'Meta Ads, Google Ads — comece com orgânico!' },
    { id: 3, name: 'Assinaturas', amount: '100', hint: 'IA, Canva Pro, apps' },
    { id: 4, name: 'Domínio e hospedagem', amount: '0', hint: '~R$30-80/ano se necessário' },
    { id: 5, name: 'Editor de vídeo', amount: '0', hint: 'CapCut — faça você mesmo' },
    { id: 6, name: 'Designer', amount: '0', hint: 'Canva — faça você mesmo' },
    { id: 7, name: 'Outros', amount: '0', hint: 'Outras despesas fixas' },
  ]);

  const [variableExpenses, setVariableExpenses] = useState([
    { id: 1, name: 'Taxa da plataforma', percent: '9.9', hint: 'Hotmart 9,9%, Kiwify 8,99%, Eduzz 4,9%' },
    { id: 2, name: 'Antecipação de recebíveis', percent: '2.5', hint: '2-4% para receber em 2 dias; 0 se esperar 30 dias' },
    { id: 3, name: 'Taxa de parcelamento', percent: '1.5', hint: 'Custo de oferecer 12x sem juros; 0 se só PIX' },
    { id: 4, name: 'Impostos', percent: '6', hint: 'MEI: fixo ~R$81/mês; Simples: 6-13%' },
    { id: 5, name: 'Reembolsos', percent: '7', hint: 'CDC: 7 dias por lei; típico 5-10%' },
    { id: 6, name: 'Outros %', percent: '0', hint: 'Outras taxas variáveis' },
  ]);

  const [startupExpenses, setStartupExpenses] = useState([
    { id: 1, name: 'Equipamento', amount: '350', hint: 'Ring light ~R$200, microfone ~R$250' },
    { id: 2, name: 'Design', amount: '0', hint: 'Canva + templates grátis' },
    { id: 3, name: 'Landing page', amount: '0', hint: 'Hotmart Pages / Kiwify — grátis' },
    { id: 4, name: 'Edição de vídeo', amount: '0', hint: 'CapCut grátis' },
    { id: 5, name: 'Outros', amount: '0', hint: 'Outras despesas únicas' },
  ]);

  const [activeTab, setActiveTab] = useState('main');
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [generating, setGenerating] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeTab]);

  const num = (val) => parseFloat(String(val).replace(',', '.').replace(/[^\d.-]/g, '')) || 0;

  const calculate = () => {
    const p = { tripwirePrice: num(products.tripwirePrice), flagshipPrice: num(products.flagshipPrice), upsellPrice: num(products.upsellPrice), maxFlagshipSales: num(products.maxFlagshipSales) || 999 };
    const conv = { reelsToBot: num(conversions.reelsToBot)/100, botToLM: num(conversions.botToLM)/100, lmToTR: num(conversions.lmToTR)/100, trToApplication: num(conversions.trToApplication)/100, applicationToFL: num(conversions.applicationToFL)/100, lmToApplicationDirect: num(conversions.lmToApplicationDirect)/100 };
    const r = { avgReelsReach: num(reach.avgReelsReach), reelsPerWeek: num(reach.reelsPerWeek), monthlyGrowth: num(reach.monthlyGrowth) };
    const totalFixed = fixedExpenses.reduce((sum, e) => sum + num(e.amount), 0);
    const totalVarPercent = variableExpenses.reduce((sum, e) => sum + num(e.percent), 0) / 100;
    const totalStartup = startupExpenses.reduce((sum, e) => sum + num(e.amount), 0);
    const weeklyReach = r.avgReelsReach * r.reelsPerWeek;
    const monthlyReachBase = weeklyReach * 4;
    const weeklyBotSubs = weeklyReach * conv.reelsToBot;
    const weeklyLMViews = weeklyBotSubs * conv.botToLM;
    const weeklyTRSales = weeklyLMViews * conv.lmToTR;
    const weeklyApps = weeklyTRSales * conv.trToApplication + weeklyLMViews * conv.lmToApplicationDirect;
    const weeklyFLSales = Math.min(weeklyApps * conv.applicationToFL, p.maxFlagshipSales / 4);
    const weeklyRevTR = weeklyTRSales * p.tripwirePrice;
    const weeklyRevFL = weeklyFLSales * (p.flagshipPrice + p.upsellPrice);
    const weeklyRevTotal = weeklyRevTR + weeklyRevFL;
    const monthlyRev = weeklyRevTotal * 4;
    const monthlyProfit = monthlyRev * (1 - totalVarPercent) - totalFixed;
    const overallToTR = conv.reelsToBot * conv.botToLM * conv.lmToTR;
    const overallToFL = conv.reelsToBot * conv.botToLM * (conv.lmToTR * conv.trToApplication + conv.lmToApplicationDirect) * conv.applicationToFL;
    const convToApp = conv.reelsToBot * conv.botToLM * (conv.lmToTR * conv.trToApplication + conv.lmToApplicationDirect);
    const revPerReach = overallToTR * p.tripwirePrice + overallToFL * (p.flagshipPrice + p.upsellPrice);
    const calcScenario = (mult) => {
      const growthRate = 1 + (r.monthlyGrowth / 100);
      const months = [];
      let totalTR = 0, totalFL = 0, totalRev = 0;
      for (let m = 1; m <= 12; m++) {
        const mReach = monthlyReachBase * Math.pow(growthRate, m - 1);
        const mBot = mReach * conv.reelsToBot * mult;
        const mLM = mBot * conv.botToLM;
        const mTR = mLM * conv.lmToTR * mult;
        const mApps = mTR * conv.trToApplication * mult + mLM * conv.lmToApplicationDirect * mult;
        const mFL = Math.min(mApps * conv.applicationToFL * mult, p.maxFlagshipSales);
        const mRev = mTR * p.tripwirePrice + mFL * (p.flagshipPrice + p.upsellPrice);
        totalTR += mTR; totalFL += mFL; totalRev += mRev;
        months.push({ m, reach: mReach, bot: mBot, tr: mTR, apps: mApps, fl: mFL, rev: mRev });
      }
      return { months, totalTR, totalFL, totalRev, yearProfit: totalRev * (1 - totalVarPercent) - totalFixed * 12 };
    };
    const weeklyProfit = monthlyProfit / 4;
    const paybackWeeks = weeklyProfit > 0 ? Math.max(1, Math.ceil((totalStartup + totalFixed) / weeklyProfit)) : Infinity;
    setResults({ p, conv, r, totalFixed, totalVarPercent, totalStartup, weeklyReach, monthlyReachBase, weeklyBotSubs, weeklyLMViews, weeklyTRSales, weeklyApps, weeklyFLSales, weeklyRevTR, weeklyRevFL, weeklyRevTotal, monthlyRev, monthlyProfit, reachFirstTR: overallToTR > 0 ? 1 / overallToTR : Infinity, reachFirstFL: overallToFL > 0 ? 1 / overallToFL : Infinity, reach30Apps: convToApp > 0 ? 30 / convToApp : Infinity, reach10k: revPerReach > 0 ? 10000 / revPerReach : Infinity, reach100k: revPerReach > 0 ? 100000 / revPerReach : Infinity, scenarios: { conservative: calcScenario(0.7), realistic: calcScenario(1.0), optimistic: calcScenario(1.3) }, totalInvestment: totalStartup + totalFixed, paybackWeeks });
    setCalculated(true);
  };

  const generatePDF = async () => {
    if (!results || !pdfRef.current) return;
    setGenerating(true);

    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = pdfRef.current;
      const footerEl = element.querySelector('#pdf-footer');
      const pieces = Array.from(element.querySelectorAll('.pdf-section'));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      let footerCanvas = null;
      let footerImgHeight = 0;
      let footerImgWidth = 0;

      if (footerEl) {
        footerCanvas = await html2canvas(footerEl, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
        footerImgWidth = pdfWidth - margin * 2;
        footerImgHeight = (footerCanvas.height * footerImgWidth) / footerCanvas.width;
      }

      const footerOffset = 8;
      const bottomReserve = footerCanvas ? (footerImgHeight + footerOffset + 10) : 22;

      let currentY = margin;
      let pageNum = 1;
      const pageContents = [[]];

      for (let i = 0; i < pieces.length; i++) {
        const section = pieces[i];
        const canvas = await html2canvas(section, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });

        const imgWidth = pdfWidth - margin * 2;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const maxPageY = pdfHeight - margin - bottomReserve;

        if (imgHeight <= (maxPageY - margin)) {
          if (currentY + imgHeight > maxPageY && currentY > margin) { pageNum++; pageContents.push([]); currentY = margin; }
          pageContents[pageNum - 1].push({ canvas, y: currentY, width: imgWidth, height: imgHeight });
          currentY += imgHeight + 3;
        } else {
          const pxPerMm = canvas.height / imgHeight;
          const sliceMm = maxPageY - margin;
          const slicePx = Math.floor(sliceMm * pxPerMm);
          let yPx = 0;
          while (yPx < canvas.height) {
            const remainingPx = canvas.height - yPx;
            const curSlicePx = Math.min(slicePx, remainingPx);
            const sliceCanvas = document.createElement('canvas');
            sliceCanvas.width = canvas.width;
            sliceCanvas.height = curSlicePx;
            const ctx = sliceCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, yPx, canvas.width, curSlicePx, 0, 0, canvas.width, curSlicePx);
            const sliceHeightMm = (curSlicePx * imgWidth) / canvas.width;
            if (currentY + sliceHeightMm > maxPageY && currentY > margin) { pageNum++; pageContents.push([]); currentY = margin; }
            pageContents[pageNum - 1].push({ canvas: sliceCanvas, y: currentY, width: imgWidth, height: sliceHeightMm });
            currentY += sliceHeightMm + 3;
            yPx += curSlicePx;
          }
        }
      }

      for (let p = 0; p < pageContents.length; p++) {
        if (p > 0) pdf.addPage();
        const items = pageContents[p];
        for (const item of items) {
          const imgData = item.canvas.toDataURL('image/png');
          pdf.addImage(imgData, 'PNG', margin, item.y, item.width, item.height);
        }
        if (footerCanvas) {
          const footerY = pdfHeight - margin - footerImgHeight - footerOffset;
          const footerImgData = footerCanvas.toDataURL('image/png');
          pdf.addImage(footerImgData, 'PNG', margin, footerY, footerImgWidth, footerImgHeight);
          pdf.link(margin, footerY, pdfWidth - margin * 2, footerImgHeight, { url: 'https://yuliyatsapova.com/' });
        }
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${p + 1} / ${pageContents.length}`, pdfWidth - margin, pdfHeight - 6, { align: 'right' });
      }

      pdf.save('Double_Sales_Report_BR.pdf');
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }

    setGenerating(false);
  };

  const resetCalc = () => setCalculated(false);
  const formatNum = (n) => !isFinite(n) ? '—' : n >= 1e6 ? (n/1e6).toFixed(1)+'M' : n >= 1e3 ? (n/1e3).toFixed(1)+'K' : Math.round(n).toLocaleString('pt-BR');
  const formatCur = (n) => !isFinite(n) ? '—' : 'R$ ' + new Intl.NumberFormat('pt-BR').format(Math.round(n));

  // PDF Report Component
  const PDFReport = React.forwardRef(({ results, fixedExpenses, variableExpenses, startupExpenses }, ref) => {
    if (!results) return null;

    const nonZeroFixed = fixedExpenses.filter(e => num(e.amount) > 0);
    const nonZeroVar = variableExpenses.filter(e => num(e.percent) > 0);
    const nonZeroStartup = startupExpenses.filter(e => num(e.amount) > 0);
    const showUpsell = results.p.upsellPrice > 0;
    const showMaxSales = results.p.maxFlagshipSales !== 999;

    const Piece = ({ children, style }) => (
      <div style={{ backgroundColor: 'white', ...style }}>{children}</div>
    );

    const BIG_TITLES = new Set(['PRODUTOS', 'ALCANCE', 'CONVERSÕES DO FUNIL', 'RESULTADOS (por semana)', 'QUANTO PRECISA PARA SUAS METAS', 'DESPESAS', 'RESUMO DE DESPESAS', 'FATURAMENTO']);

    const Section = ({ title, children }) => (
      <div className="pdf-section" style={{ backgroundColor: 'white', marginTop: 0, marginBottom: 0, paddingTop: title && BIG_TITLES.has(title) ? 10 : 0 }}>
        {title ? (
          <Piece style={{ backgroundColor: COLORS.primary, color: 'white', padding: '10px 16px', fontSize: 14, fontWeight: 'bold' }}>{title}</Piece>
        ) : null}
        {children}
      </div>
    );

    const Row = ({ label, value, bold, highlight }) => (
      <Piece style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px 9px', backgroundColor: highlight ? COLORS.mid : '#EBF4FF', color: highlight ? 'white' : '#333', borderBottom: '1px solid white', fontSize: 12 }}>
        <span style={{ fontWeight: bold ? 'bold' : 'normal' }}>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{value}</span>
      </Piece>
    );

    const chunk = (arr, size) => {
      const res = [];
      for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
      return res;
    };
    const EXP_ROWS_PER_PAGE = 22;

    return (
      <div ref={ref} style={{ width: 794, padding: 20, backgroundColor: 'white', fontFamily: 'Arial, sans-serif', fontSize: 12, color: '#333' }}>
        <div className="pdf-section" style={{ backgroundColor: COLORS.primary, color: 'white', padding: '25px 20px', textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 5 }}>DOUBLE SALES</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Sistema de vendas</div>
        </div>

        <Section title="PRODUTOS">
          <Row label="Preço do tripwire" value={formatCur(results.p.tripwirePrice)} />
          <Row label="Preço do flagship" value={formatCur(results.p.flagshipPrice)} />
          {showUpsell && <Row label="Upsell" value={formatCur(results.p.upsellPrice)} />}
          {showMaxSales && <Row label="Vagas FL/mês" value={results.p.maxFlagshipSales} />}
        </Section>

        <Section title="ALCANCE">
          <Row label="Alcance médio por publicação" value={formatNum(results.r.avgReelsReach)} />
          <Row label="Publicações por semana" value={results.r.reelsPerWeek} />
          <Row label="Crescimento do alcance/mês" value={results.r.monthlyGrowth + '%'} />
        </Section>

        <Section title="CONVERSÕES DO FUNIL">
          <Row label="Conteúdo → entrada no bot" value={(results.conv.reelsToBot * 100).toFixed(1) + '%'} />
          <Row label="Bot → visualização do LM" value={(results.conv.botToLM * 100).toFixed(0) + '%'} />
          <Row label="LM → compra do TW" value={(results.conv.lmToTR * 100).toFixed(1) + '%'} />
          <Row label="TW → inscrição para FL" value={(results.conv.trToApplication * 100).toFixed(0) + '%'} />
          <Row label="Inscrição → compra do FL" value={(results.conv.applicationToFL * 100).toFixed(0) + '%'} />
          {results.conv.lmToApplicationDirect > 0 && <Row label="LM/Conteúdo → inscrição direta" value={(results.conv.lmToApplicationDirect * 100).toFixed(1) + '%'} />}
        </Section>

        <Section title="RESULTADOS (por semana)">
          <Row label="Alcance" value={formatNum(results.weeklyReach)} />
          <Row label="Entradas no bot" value={results.weeklyBotSubs.toFixed(1)} />
          <Row label="Visualizações do LM" value={results.weeklyLMViews.toFixed(1)} />
          <Row label="Vendas TW" value={results.weeklyTRSales.toFixed(2)} />
          <Row label="Inscrições para FL" value={results.weeklyApps.toFixed(2)} />
          <Row label="Vendas FL" value={results.weeklyFLSales.toFixed(3)} />
          <Row label="Faturamento por semana" value={formatCur(results.weeklyRevTotal)} bold highlight />
          <Row label="Faturamento por mês" value={formatCur(results.monthlyRev)} bold highlight />
          <Row label="Lucro por mês" value={formatCur(results.monthlyProfit)} bold highlight />
        </Section>

        <Section title="QUANTO PRECISA PARA SUAS METAS">
          {[
            { name: 'Primeira venda TW', reach: results.reachFirstTR },
            { name: 'Primeira venda FL', reach: results.reachFirstFL },
            { name: '30 inscrições para FL', reach: results.reach30Apps },
            { name: 'R$ 10.000', reach: results.reach10k },
            { name: 'R$ 100.000 (6em7)', reach: results.reach100k },
          ].map((g, i) => {
            const pubs = results.r.avgReelsReach > 0 ? Math.max(1, Math.ceil(g.reach / results.r.avgReelsReach)) : 1;
            const weeks = results.r.avgReelsReach > 0 && results.r.reelsPerWeek > 0 ? Math.max(1, Math.ceil(g.reach / results.r.avgReelsReach / results.r.reelsPerWeek)) : 1;
            return <Row key={i} label={g.name} value={formatNum(g.reach) + ' alc / ' + pubs + ' pub / ' + weeks + ' sem'} />;
          })}
        </Section>

        {(() => {
          const expenseRows = [];
          if (nonZeroFixed.length > 0) {
            expenseRows.push({ type: 'sub', text: 'Fixas/mês:' });
            nonZeroFixed.forEach(e => expenseRows.push({ type: 'row', label: e.name, value: formatCur(num(e.amount)) }));
          }
          if (nonZeroVar.length > 0) {
            expenseRows.push({ type: 'sub', text: 'Variáveis:' });
            nonZeroVar.forEach(e => expenseRows.push({ type: 'row', label: e.name, value: num(e.percent) + '%' }));
          }
          if (nonZeroStartup.length > 0) {
            expenseRows.push({ type: 'sub', text: 'Iniciais:' });
            nonZeroStartup.forEach(e => expenseRows.push({ type: 'row', label: e.name, value: formatCur(num(e.amount)) }));
          }
          const summaryRows = [
            { type: 'row', label: 'TOTAL fixas/mês', value: formatCur(results.totalFixed), bold: true, highlight: true },
            { type: 'row', label: 'TOTAL variáveis', value: (results.totalVarPercent * 100).toFixed(1) + '%', bold: true, highlight: true },
            { type: 'row', label: 'TOTAL iniciais', value: formatCur(results.totalStartup), bold: true, highlight: true },
            { type: 'row', label: 'Payback', value: results.paybackWeeks === Infinity ? '—' : results.paybackWeeks + ' sem', bold: true, highlight: true },
          ];
          const pages = chunk(expenseRows, EXP_ROWS_PER_PAGE);
          return (
            <>
              {pages.map((page, idx) => (
                <Section key={idx} title={idx === 0 ? 'DESPESAS' : ''}>
                  {page.map((it, i) => {
                    if (it.type === 'sub') {
                      return (<Piece key={`sub-${i}`} style={{ padding: '8px 16px 6px', fontWeight: 'bold', color: COLORS.primary, fontSize: 11, backgroundColor: 'white' }}>{it.text}</Piece>);
                    }
                    return (<Row key={`row-${i}`} label={it.label} value={it.value} bold={it.bold} highlight={it.highlight} />);
                  })}
                </Section>
              ))}
              <Section title="RESUMO DE DESPESAS">
                {summaryRows.map((it, i) => (<Row key={i} label={it.label} value={it.value} bold={it.bold} highlight={it.highlight} />))}
              </Section>
            </>
          );
        })()}

        <Section title="FATURAMENTO">
          <Piece style={{ backgroundColor: '#F97316', color: 'white', padding: '8px 16px', fontSize: 13, fontWeight: 'bold', marginTop: 10 }}>CENÁRIO: CONSERVADOR</Piece>
          <Row label="Vendas TW/ano" value={Math.round(results.scenarios.conservative.totalTR)} />
          <Row label="Vendas FL/ano" value={results.scenarios.conservative.totalFL.toFixed(1)} />
          <Row label="Faturamento anual" value={formatCur(results.scenarios.conservative.totalRev)} bold />
          <Row label="Lucro líquido" value={formatCur(results.scenarios.conservative.yearProfit)} bold />

          <Piece style={{ backgroundColor: COLORS.primary, color: 'white', padding: '8px 16px', fontSize: 13, fontWeight: 'bold', marginTop: 10 }}>CENÁRIO: REALISTA</Piece>
          <Row label="Vendas TW/ano" value={Math.round(results.scenarios.realistic.totalTR)} />
          <Row label="Vendas FL/ano" value={results.scenarios.realistic.totalFL.toFixed(1)} />
          <Row label="Faturamento anual" value={formatCur(results.scenarios.realistic.totalRev)} bold />
          <Row label="Lucro líquido" value={formatCur(results.scenarios.realistic.yearProfit)} bold />

          <Piece style={{ backgroundColor: '#22C55E', color: 'white', padding: '8px 16px', fontSize: 13, fontWeight: 'bold', marginTop: 10 }}>CENÁRIO: OTIMISTA</Piece>
          <Row label="Vendas TW/ano" value={Math.round(results.scenarios.optimistic.totalTR)} />
          <Row label="Vendas FL/ano" value={results.scenarios.optimistic.totalFL.toFixed(1)} />
          <Row label="Faturamento anual" value={formatCur(results.scenarios.optimistic.totalRev)} bold />
          <Row label="Lucro líquido" value={formatCur(results.scenarios.optimistic.yearProfit)} bold />
        </Section>

        <div id="pdf-footer" style={{ width: '100%', marginTop: 0, paddingTop: 14, paddingBottom: 20, lineHeight: 1.25, borderTop: `2px solid ${COLORS.primary}`, textAlign: 'center', backgroundColor: 'white' }}>
          <div style={{ color: '#666', fontSize: 14, marginBottom: 5 }}>Calculado com a calculadora Double Sales</div>
          <a href="https://yuliyatsapova.com/" style={{ display: 'inline-block', color: COLORS.primary, fontSize: 14, fontWeight: 'bold', textDecoration: 'none' }}>@yuliya_tsapova | yuliyatsapova.com</a>
        </div>
      </div>
    );
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#000000', color: '#C4C4C4' }}>
      <header className="text-white py-6 px-4" style={{ backgroundColor: '#000000', borderBottom: `1px solid ${COLORS.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(43,114,212,0.25)', boxShadow: '0 0 20px rgba(43,114,212,0.30)' }}><Rocket size={28} /></div>
            <div><h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#FFFFFF' }}>DOUBLE SALES</h1><p className="text-sm" style={{ color: COLORS.textSecondary }}>Calculadora do sistema de vendas</p></div>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-50 py-3 px-4 border-b" style={{ backgroundColor: '#000000', borderColor: COLORS.border }}>
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-2">
          <TabBtn id="main" activeTab={activeTab} setActiveTab={setActiveTab} icon={Calculator} label="Principal" />
          <TabBtn id="expenses" activeTab={activeTab} setActiveTab={setActiveTab} icon={PiggyBank} label="Despesas" />
          <TabBtn id="income" activeTab={activeTab} setActiveTab={setActiveTab} icon={TrendingUp} label="Faturamento" />
          <TabBtn id="useful" activeTab={activeTab} setActiveTab={setActiveTab} icon={Lightbulb} label="Dicas" />
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {activeTab === 'main' && (
          <div className="space-y-8">
            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Seus produtos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Input label="Preço do tripwire" value={products.tripwirePrice} onChange={(v) => { setProducts({...products, tripwirePrice: v}); resetCalc(); }} suffix="R$" hint="Referência: R$27-197" />
                <Input label="Preço do flagship" value={products.flagshipPrice} onChange={(v) => { setProducts({...products, flagshipPrice: v}); resetCalc(); }} suffix="R$" hint="Referência: R$497-5.000" />
                <Input label="Upsell" value={products.upsellPrice} onChange={(v) => { setProducts({...products, upsellPrice: v}); resetCalc(); }} suffix="R$" hint="Opcional" />
                <Input label="Vagas FL/mês" value={products.maxFlagshipSales} onChange={(v) => { setProducts({...products, maxFlagshipSales: v}); resetCalc(); }} hint="999 = sem limite" />
              </div>
            </section>

            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Conversões do funil</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input label="Conteúdo → entrada no bot" value={conversions.reelsToBot} onChange={(v) => { setConversions({...conversions, reelsToBot: v}); resetCalc(); }} suffix="%" hint="Normal: 1-3%" />
                <Input label="Bot → visualização do LM" value={conversions.botToLM} onChange={(v) => { setConversions({...conversions, botToLM: v}); resetCalc(); }} suffix="%" hint="Normal: 60-80%" />
                <Input label="LM → compra do TW" value={conversions.lmToTR} onChange={(v) => { setConversions({...conversions, lmToTR: v}); resetCalc(); }} suffix="%" hint="Normal: 3-7%" />
                <Input label="TW → inscrição para FL" value={conversions.trToApplication} onChange={(v) => { setConversions({...conversions, trToApplication: v}); resetCalc(); }} suffix="%" hint="Normal: 20-40%" />
                <Input label="Inscrição → compra do FL" value={conversions.applicationToFL} onChange={(v) => { setConversions({...conversions, applicationToFL: v}); resetCalc(); }} suffix="%" hint="Normal: 15-30%" />
                <Input label="LM/Conteúdo → inscrição direta" value={conversions.lmToApplicationDirect} onChange={(v) => { setConversions({...conversions, lmToApplicationDirect: v}); resetCalc(); }} suffix="%" hint="0, se somente via TW" />
              </div>
            </section>

            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Seu alcance</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <Input label="Alcance médio por publicação" value={reach.avgReelsReach} onChange={(v) => { setReach({...reach, avgReelsReach: v}); resetCalc(); }} hint="Referência: veja benchmarks" />
                <Input label="Publicações por semana" value={reach.reelsPerWeek} onChange={(v) => { setReach({...reach, reelsPerWeek: v}); resetCalc(); }} hint="Normal: 2-7" />
                <Input label="Crescimento do alcance/mês" value={reach.monthlyGrowth} onChange={(v) => { setReach({...reach, monthlyGrowth: v}); resetCalc(); }} suffix="%" hint="Normal: 5-15%" />
              </div>
            </section>

            <CalculateButton onClick={calculate} calculated={calculated} />

            {calculated && results && (
              <>
                <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Resultados</h2>
                  <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: 'rgba(43,114,212,0.10)', border: `1px solid ${COLORS.border}` }}>
                    <h3 className="font-bold mb-4" style={{ color: '#FFFFFF' }}>Funil por semana</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {[{ l: 'Alcance', v: results.weeklyReach }, { l: 'Bot', v: results.weeklyBotSubs }, { l: 'LM', v: results.weeklyLMViews }, { l: 'TW', v: results.weeklyTRSales }, { l: 'Inscrições', v: results.weeklyApps }, { l: 'FL', v: results.weeklyFLSales, hl: true }].map((item, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <ChevronRight size={16} style={{ color: COLORS.textSecondary }} />}
                          <div className="px-3 py-2 rounded-lg" style={{ backgroundColor: item.hl ? COLORS.primary : COLORS.surface, color: 'white', border: item.hl ? 'none' : `1px solid ${COLORS.border}` }}>
                            <span style={{ color: COLORS.textSecondary }}>{item.l}</span><span className="ml-2 font-bold" style={{ color: '#FFFFFF' }}>{formatNum(item.v)}</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <ResultCard icon={DollarSign} label="Faturamento/sem" value={formatCur(results.weeklyRevTotal)} sub={'TW: ' + formatCur(results.weeklyRevTR)} />
                    <ResultCard icon={TrendingUp} label="Faturamento/mês" value={formatCur(results.monthlyRev)} hl />
                    <ResultCard icon={Target} label="Lucro/mês" value={formatCur(results.monthlyProfit)} sub="Após despesas" />
                    <ResultCard icon={Sparkles} label="Projeção anual" value={formatCur(results.scenarios.realistic.totalRev)} sub={'Líquido: ' + formatCur(results.scenarios.realistic.yearProfit)} />
                  </div>
                </section>

                <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Quanto precisa para suas metas?</h2>
                  <div className="space-y-4">
                    <RoadmapRow goal="Primeira venda TW" reachN={results.reachFirstTR} note="Mínimo para o primeiro resultado" avgReach={results.r.avgReelsReach} reelsPerWeek={results.r.reelsPerWeek} />
                    <RoadmapRow goal="Primeira venda FL" reachN={results.reachFirstFL} note="Se as vendas vierem sem lançamento" avgReach={results.r.avgReelsReach} reelsPerWeek={results.r.reelsPerWeek} />
                    <RoadmapRow goal="30 inscrições para FL" reachN={results.reach30Apps} note="Mínimo para lançamento" avgReach={results.r.avgReelsReach} reelsPerWeek={results.r.reelsPerWeek} />
                    <RoadmapRow goal="R$ 10.000" reachN={results.reach10k} note="Primeira meta — você chegou!" hl avgReach={results.r.avgReelsReach} reelsPerWeek={results.r.reelsPerWeek} />
                    <RoadmapRow goal="R$ 100.000 (6em7)" reachN={results.reach100k} note="Seis dígitos — é real!" hl avgReach={results.r.avgReelsReach} reelsPerWeek={results.r.reelsPerWeek} />
                  </div>
                </section>

                <button onClick={generatePDF} disabled={generating} className="w-full py-3 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 border transition-all disabled:opacity-50" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>
                  <Download size={20} /> {generating ? 'Gerando PDF...' : 'Baixar relatório PDF'}
                </button>
              </>
            )}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-8">
            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Fixas/mês</h2>
                <button onClick={() => { setFixedExpenses([...fixedExpenses, { id: Date.now(), name: 'Nova despesa', amount: '0', hint: '' }]); resetCalc(); }} className="flex items-center gap-2 px-4 py-2 text-white rounded-xl" style={{ backgroundColor: COLORS.primary }}><Plus size={18} />Adicionar</button>
              </div>
              <div className="space-y-3">{fixedExpenses.map(e => <ExpenseRow key={e.id} expense={e} onUpdate={(id, f, v) => { setFixedExpenses(fixedExpenses.map(x => x.id === id ? {...x, [f]: v} : x)); resetCalc(); }} onRemove={(id) => { if(fixedExpenses.length > 1) setFixedExpenses(fixedExpenses.filter(x => x.id !== id)); resetCalc(); }} />)}</div>
            </section>

            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Variáveis (%)</h2>
                <button onClick={() => { setVariableExpenses([...variableExpenses, { id: Date.now(), name: 'Nova %', percent: '0', hint: '' }]); resetCalc(); }} className="flex items-center gap-2 px-4 py-2 text-white rounded-xl" style={{ backgroundColor: COLORS.primary }}><Plus size={18} />Adicionar</button>
              </div>
              <div className="space-y-3">{variableExpenses.map(e => <ExpenseRow key={e.id} expense={e} isVar onUpdate={(id, f, v) => { setVariableExpenses(variableExpenses.map(x => x.id === id ? {...x, [f]: v} : x)); resetCalc(); }} onRemove={(id) => { if(variableExpenses.length > 1) setVariableExpenses(variableExpenses.filter(x => x.id !== id)); resetCalc(); }} />)}</div>
            </section>

            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-xl font-bold" style={{ color: '#FFFFFF' }}>Iniciais</h2>
                <button onClick={() => { setStartupExpenses([...startupExpenses, { id: Date.now(), name: 'Nova despesa', amount: '0', hint: '' }]); resetCalc(); }} className="flex items-center gap-2 px-4 py-2 text-white rounded-xl" style={{ backgroundColor: COLORS.primary }}><Plus size={18} />Adicionar</button>
              </div>
              <div className="space-y-3">{startupExpenses.map(e => <ExpenseRow key={e.id} expense={e} onUpdate={(id, f, v) => { setStartupExpenses(startupExpenses.map(x => x.id === id ? {...x, [f]: v} : x)); resetCalc(); }} onRemove={(id) => { if(startupExpenses.length > 1) setStartupExpenses(startupExpenses.filter(x => x.id !== id)); resetCalc(); }} />)}</div>
            </section>

            <CalculateButton onClick={calculate} calculated={calculated} />

            {calculated && results && (
              <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 30px rgba(43,114,212,0.40)' }}>
                <h2 className="text-xl font-bold mb-6 text-white">Resumo</h2>
                <div className="grid sm:grid-cols-4 gap-4">
                  <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}><p className="text-sm text-white" style={{ opacity: 0.8 }}>Fixas/mês</p><p className="text-xl font-bold text-white">{formatCur(results.totalFixed)}</p></div>
                  <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}><p className="text-sm text-white" style={{ opacity: 0.8 }}>Variáveis</p><p className="text-xl font-bold text-white">{(results.totalVarPercent * 100).toFixed(1)}%</p></div>
                  <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}><p className="text-sm text-white" style={{ opacity: 0.8 }}>Iniciais</p><p className="text-xl font-bold text-white">{formatCur(results.totalStartup)}</p></div>
                  <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}><p className="text-sm text-white" style={{ opacity: 0.8 }}>Payback</p><p className="text-xl font-bold text-white">{results.paybackWeeks === Infinity ? '—' : results.paybackWeeks} sem</p></div>
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'income' && (
          <div className="space-y-8">
            {calculated && results ? (
              <>
                <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                  <p className="text-sm" style={{ color: COLORS.textBody }}><strong style={{ color: '#FFFFFF' }}>Crescimento:</strong> alcance +{results.r.monthlyGrowth}%/mês. Início: {formatNum(results.monthlyReachBase)} → ano: {formatNum(results.monthlyReachBase * Math.pow(1 + results.r.monthlyGrowth/100, 11))}</p>
                </div>
                {[{ name: 'Cenário: Conservador', key: 'conservative', color: '#F97316' }, { name: 'Cenário: Realista', key: 'realistic', color: COLORS.primary }, { name: 'Cenário: Otimista', key: 'optimistic', color: '#22C55E' }].map((sc) => {
                  const data = results.scenarios[sc.key];
                  return (
                    <section key={sc.key} className="rounded-3xl overflow-hidden" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                      <div className="px-6 py-4 text-white" style={{ backgroundColor: sc.color }}><h2 className="text-xl font-bold">{sc.name}</h2></div>
                      <div className="p-6">
                        <div className="grid sm:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}` }}><p className="text-sm" style={{ color: COLORS.textSecondary }}>TW/ano</p><p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{formatNum(data.totalTR)}</p></div>
                          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}` }}><p className="text-sm" style={{ color: COLORS.textSecondary }}>FL/ano</p><p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{data.totalFL.toFixed(1)}</p></div>
                          <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}` }}><p className="text-sm" style={{ color: COLORS.textSecondary }}>Faturamento</p><p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>{formatCur(data.totalRev)}</p></div>
                          <div className="text-center p-4 rounded-xl text-white" style={{ backgroundColor: sc.color }}><p className="text-sm" style={{ opacity: 0.9 }}>Líquido</p><p className="text-2xl font-bold">{formatCur(data.yearProfit)}</p></div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm"><thead><tr style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}><th className="px-3 py-2 text-left" style={{ color: COLORS.textSecondary }}>M</th><th className="px-3 py-2 text-right" style={{ color: COLORS.textSecondary }}>Alcance</th><th className="px-3 py-2 text-right" style={{ color: COLORS.textSecondary }}>Bot</th><th className="px-3 py-2 text-right" style={{ color: COLORS.textSecondary }}>TW</th><th className="px-3 py-2 text-right" style={{ color: COLORS.textSecondary }}>Inscrições</th><th className="px-3 py-2 text-right" style={{ color: COLORS.textSecondary }}>FL</th><th className="px-3 py-2 text-right" style={{ color: COLORS.textSecondary }}>Faturamento</th></tr></thead>
                            <tbody>
                              {data.months.map((row) => (<tr key={row.m} className="border-t" style={{ borderColor: COLORS.border }}><td className="px-3 py-2" style={{ color: COLORS.textBody }}>{row.m}</td><td className="px-3 py-2 text-right" style={{ color: COLORS.textBody }}>{formatNum(row.reach)}</td><td className="px-3 py-2 text-right" style={{ color: COLORS.textBody }}>{formatNum(row.bot)}</td><td className="px-3 py-2 text-right" style={{ color: COLORS.textBody }}>{row.tr.toFixed(1)}</td><td className="px-3 py-2 text-right" style={{ color: COLORS.textBody }}>{row.apps.toFixed(1)}</td><td className="px-3 py-2 text-right" style={{ color: COLORS.textBody }}>{row.fl.toFixed(2)}</td><td className="px-3 py-2 text-right font-bold" style={{ color: '#FFFFFF' }}>{formatCur(row.rev)}</td></tr>))}
                              <tr style={{ backgroundColor: sc.color, color: 'white' }}><td className="px-3 py-2 font-bold">ANO</td><td></td><td></td><td className="px-3 py-2 text-right font-bold">{formatNum(data.totalTR)}</td><td></td><td className="px-3 py-2 text-right font-bold">{data.totalFL.toFixed(1)}</td><td className="px-3 py-2 text-right font-bold">{formatCur(data.totalRev)}</td></tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </section>
                  );
                })}
              </>
            ) : (
              <div className="rounded-3xl p-12 text-center" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
                <p className="text-xl mb-6" style={{ color: '#FFFFFF' }}>Preencha os dados na aba "Principal" e clique em "Calcular"</p>
                <button onClick={() => setActiveTab('main')} className="px-6 py-3 rounded-xl text-white font-bold" style={{ backgroundColor: COLORS.primary }}>Ir para Principal</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'useful' && (
          <div className="space-y-8">
            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Benchmarks</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold mb-4" style={{ color: '#FFFFFF' }}>Conversões</h3>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ backgroundColor: COLORS.primary, color: 'white' }}><th className="px-4 py-3 text-left">Etapa</th><th className="px-4 py-3 text-center">Fraco</th><th className="px-4 py-3 text-center">Normal</th><th className="px-4 py-3 text-center">Excelente</th></tr></thead>
                    <tbody>{[{ s: 'Conteúdo → bot', l: '< 1%', n: '1-2%', h: '> 3%' }, { s: 'Bot → LM', l: '< 50%', n: '60-70%', h: '> 80%' }, { s: 'LM → TW', l: '< 2%', n: '3-5%', h: '> 7%' }, { s: 'TW → inscrição', l: '< 15%', n: '20-30%', h: '> 40%' }, { s: 'Inscrição → FL', l: '< 10%', n: '15-25%', h: '> 30%' }].map((r, i) => (<tr key={i} className="border-t" style={{ borderColor: COLORS.border }}><td className="px-4 py-3" style={{ color: COLORS.textBody }}>{r.s}</td><td className="px-4 py-3 text-center" style={{ color: '#DC2626' }}>{r.l}</td><td className="px-4 py-3 text-center" style={{ color: '#D97706' }}>{r.n}</td><td className="px-4 py-3 text-center" style={{ color: '#059669' }}>{r.h}</td></tr>))}</tbody>
                  </table></div>
                </div>
                <div>
                  <h3 className="font-bold mb-4" style={{ color: '#FFFFFF' }}>Preços</h3>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ backgroundColor: COLORS.primary, color: 'white' }}><th className="px-4 py-3 text-left">Produto</th><th className="px-4 py-3 text-center">Iniciante</th><th className="px-4 py-3 text-center">Intermediário</th><th className="px-4 py-3 text-center">Expert</th></tr></thead>
                    <tbody>{[{ p: 'Tripwire (TW)', n: 'R$27-97', m: 'R$97-297', e: 'R$297-997' }, { p: 'Flagship (FL)', n: 'R$497-1.500', m: 'R$1.500-5.000', e: 'R$5.000-15.000' }, { p: 'Premium', n: 'R$2.000-7.500', m: 'R$7.500-20.000', e: 'R$20.000-50.000' }].map((r, i) => (<tr key={i} className="border-t" style={{ borderColor: COLORS.border }}><td className="px-4 py-3" style={{ color: COLORS.textBody }}>{r.p}</td><td className="px-4 py-3 text-center" style={{ color: COLORS.textBody }}>{r.n}</td><td className="px-4 py-3 text-center" style={{ color: COLORS.textBody }}>{r.m}</td><td className="px-4 py-3 text-center" style={{ color: COLORS.textBody }}>{r.e}</td></tr>))}</tbody>
                  </table></div>
                </div>
                <div>
                  <h3 className="font-bold mb-4" style={{ color: '#FFFFFF' }}>Alcance de publicações</h3>
                  <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr style={{ backgroundColor: COLORS.primary, color: 'white' }}><th className="px-4 py-3 text-left">Conta</th><th className="px-4 py-3 text-center">Mediana</th><th className="px-4 py-3 text-center">Bom</th><th className="px-4 py-3 text-center">Viral</th></tr></thead>
                    <tbody>{[{ s: '< 1K', m: '200-500', g: '1K+', v: '5K+' }, { s: '1-5K', m: '500-1,5K', g: '3K+', v: '10K+' }, { s: '5-20K', m: '1,5-5K', g: '10K+', v: '50K+' }, { s: '20-100K', m: '5-20K', g: '30K+', v: '100K+' }].map((r, i) => (<tr key={i} className="border-t" style={{ borderColor: COLORS.border }}><td className="px-4 py-3" style={{ color: COLORS.textBody }}>{r.s}</td><td className="px-4 py-3 text-center" style={{ color: COLORS.textBody }}>{r.m}</td><td className="px-4 py-3 text-center" style={{ color: '#059669' }}>{r.g}</td><td className="px-4 py-3 text-center" style={{ color: '#5B9EE8' }}>{r.v}</td></tr>))}</tbody>
                  </table></div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}` }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#FFFFFF' }}>Plano de lançamento (12 semanas)</h2>
              <div className="space-y-3">
                {[
                  { w: '1', f: 'Estratégia', t: 'Linha de produtos + funil' },
                  { w: '2', f: 'Criação do LM', t: 'Produto gratuito para atração' },
                  { w: '3', f: 'Criação do TW', t: 'Tripwire — mini-produto pago de entrada' },
                  { w: '4', f: 'Parte técnica', t: 'Plataforma, automação WhatsApp, pagamento' },
                  { w: '5-6', f: 'Conteúdo', t: 'Atrair pessoas para o funil' },
                  { w: '7-8', f: 'Inscrições', t: 'Coletar 20-30 inscrições' },
                  { w: '9-10', f: 'Pré-lançamento', t: 'Aquecimento + preparação do FL e janela de vendas' },
                  { w: '11-12', f: 'LANÇAMENTO!', t: 'Vendas do flagship (produto principal)', hl: true }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: item.hl ? COLORS.primary : COLORS.surface, color: 'white', border: item.hl ? 'none' : `1px solid ${COLORS.border}`, boxShadow: item.hl ? '0 0 20px rgba(43,114,212,0.50)' : 'none' }}>
                    <div className="w-16 text-center py-2 rounded-lg font-bold text-sm text-white" style={{ backgroundColor: item.hl ? 'rgba(255,255,255,0.2)' : COLORS.primary }}>{item.w}</div>
                    <div className="flex-1"><p className="font-bold">{item.f}</p><p className="text-sm" style={{ color: COLORS.textSecondary }}>{item.t}</p></div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl p-6" style={{ backgroundColor: COLORS.primary, boxShadow: '0 0 30px rgba(43,114,212,0.40)' }}>
              <h2 className="text-xl font-bold mb-6 text-white">Dicas</h2>
              <div className="space-y-3">
                {[
                  'Não invista em tráfego pago antes de vender com conteúdo orgânico — assim você não joga dinheiro fora',
                  'Faça tudo você mesmo no início. Comece a contratar equipe depois de R$5.000/mês',
                  'Não construa um império de uma vez — comece pequeno. Quanto antes começar, antes vai faturar',
                  'Siga a estratégia Double Sales: 3 produtos + funil automático + lançamento ao vivo',
                  'Não tenha medo de vender pessoalmente pra quem deixou inscrição',
                  'Até R$81.000/ano, registre-se como MEI — DAS fixo de R$81,05/mês (2026)',
                  'Não tente fazer conteúdo perfeito — feito é melhor que perfeito',
                  'Ofereça PIX com desconto + parcelamento 12x sem juros via plataforma'
                ].map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>{idx + 1}</span>
                    <p className="text-sm text-white">{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="py-6 px-4 mt-12" style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-2xl font-bold" style={{ color: '#FFFFFF' }}>DOUBLE SALES</p>
          <p className="text-sm mt-2" style={{ color: COLORS.textSecondary }}>@yuliya_tsapova</p>
        </div>
      </footer>

      {/* Hidden PDF Template */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <PDFReport
          ref={pdfRef}
          results={results}
          fixedExpenses={fixedExpenses}
          variableExpenses={variableExpenses}
          startupExpenses={startupExpenses}
        />
      </div>
    </div>
  );
};

export default DoubleSalesCalculator;
