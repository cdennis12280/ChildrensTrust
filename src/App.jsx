import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const fmt = (value) => `£${Number(value).toFixed(1)}m`;
const pct = (value) => `${Number(value).toFixed(1)}%`;

const ragFromValue = (value, thresholds) => {
  if (value >= thresholds.red) return { label: "Red", color: "bg-rag-red" };
  if (value >= thresholds.amber) return { label: "Amber", color: "bg-rag-amber" };
  return { label: "Green", color: "bg-rag-green" };
};

const ragInverse = (value, thresholds) => {
  if (value <= thresholds.red) return { label: "Red", color: "bg-rag-red" };
  if (value <= thresholds.amber) return { label: "Amber", color: "bg-rag-amber" };
  return { label: "Green", color: "bg-rag-green" };
};

const Card = ({ title, subtitle, rag, children, action }) => (
  <div className="glass rounded-2xl p-5 shadow-panel">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-mist/70 font-semibold">{subtitle}</p>
        <h3 className="text-lg font-semibold font-display mt-1">{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {rag && <span className={`rag-pill ${rag.color}`}>{rag.label}</span>}
        {action}
      </div>
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const Stat = ({ label, value, helper }) => (
  <div>
    <p className="text-xs uppercase tracking-[0.2em] text-mist/70">{label}</p>
    <p className="text-xl font-semibold font-display mt-1">{value}</p>
    {helper && <p className="text-xs text-mist/70 mt-1">{helper}</p>}
  </div>
);

const InputField = ({ label, value, onChange, step = "0.1", suffix, type = "number" }) => (
  <label className="text-xs text-mist/70 flex flex-col gap-1">
    {label}
    <div className="flex items-center gap-2">
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-1 text-white"
      />
      {suffix && <span className="text-xs text-mist/60">{suffix}</span>}
    </div>
  </label>
);

const Insight = ({ text }) => (
  <div className="mt-4 p-3 rounded-xl bg-white/10 border border-white/10">
    <p className="insight">{text}</p>
  </div>
);

export default function App() {
  const [boardView, setBoardView] = useState(false);
  const [pressureRate, setPressureRate] = useState(5);
  const [localitiesImpact, setLocalitiesImpact] = useState(true);
  const [stepDown, setStepDown] = useState(false);
  const [marketInflation, setMarketInflation] = useState(true);
  const [reduceAgency, setReduceAgency] = useState(10);
  const [reducePlacements, setReducePlacements] = useState(8);
  const [efficiencyRate, setEfficiencyRate] = useState(85);
  const [refreshDate, setRefreshDate] = useState("2026-02-24");

  const [finance, setFinance] = useState({
    income: 90.4,
    expenditure: 99.2,
    inYearDeficit: 8.8,
    cumulativeDeficit: 19.7,
    reserveSupport: 3.36,
    openingReserves: 6.0,
    earmarkedReserves: 1.5,
    minimumReserves: 2.0
  });

  const [placements, setPlacements] = useState({
    budgeted: 62,
    actual: 79,
    costPressure: 6.3,
    avgWeeklyCost: 4.2,
    benchmarkWeeklyCost: 3.6
  });

  const [uasc, setUasc] = useState({
    pressure: 2.7,
    grant: 1.4,
    arrivals: 28
  });

  const [workforce, setWorkforce] = useState({
    vacancyRate: 23.94,
    agencyRate: 20.7,
    asye: 32,
    wteRequired: 520,
    wteFunded: 495,
    wteInPost: 420,
    timeToFill: 120
  });

  const [efficiencies, setEfficiencies] = useState({
    delivery: {
      ongoing: 77,
      oneOff: 8,
      undelivered: 15
    },
    carriedForward: 1.742,
    targetNext: 2.34,
    cashableShare: 70,
    recurringShare: 80
  });

  const [demandDrivers, setDemandDrivers] = useState({
    lacGrowth: 4.0,
    uascGrowth: 3.0,
    edgeOfCareImprovement: 2.0
  });

  const reserveCoverage = finance.reserveSupport / finance.inYearDeficit;
  const monthsToExhaustion = (finance.reserveSupport / finance.inYearDeficit) * 12;
  const reserveRag = ragInverse(monthsToExhaustion, { red: 6, amber: 12 });
  const deficitRag = ragFromValue(finance.inYearDeficit, { red: 8, amber: 4 });

  const placementDelta = placements.actual - placements.budgeted;
  const pressurePerPlacement = placements.costPressure / Math.max(1, placementDelta);
  const modelledPlacementBase = placements.actual
    * (localitiesImpact ? 0.95 : 1)
    * (stepDown ? 0.92 : 1)
    * (marketInflation ? 1.06 : 1);
  const modelledPressure = Math.max(0, (modelledPlacementBase - placements.budgeted) * pressurePerPlacement);

  const agencyPremium = finance.expenditure * (workforce.agencyRate / 100) * 0.3;
  const breakEven = agencyPremium / (finance.expenditure * 0.1);

  const uascNet = uasc.pressure - uasc.grant;

  const scenarioSavings =
    placements.costPressure * (reducePlacements / 100)
    + agencyPremium * (reduceAgency / 100)
    + Math.max(0, (efficiencyRate - 77) / 100) * efficiencies.targetNext;

  const scenarioDeficit = Math.max(0, finance.inYearDeficit - scenarioSavings);

  const mtfpYears = ["24/25", "25/26", "26/27", "27/28"];

  const demandGrowth = useMemo(() => {
    const base = pressureRate;
    const lacImpact = demandDrivers.lacGrowth * 0.4;
    const uascImpact = demandDrivers.uascGrowth * 0.25;
    const edgeBenefit = demandDrivers.edgeOfCareImprovement * 0.3;
    return Math.max(0.5, base + lacImpact + uascImpact - edgeBenefit);
  }, [pressureRate, demandDrivers]);

  const mtfpSeries = useMemo(() => {
    const base = finance.inYearDeficit;
    const demand = demandGrowth / 100;
    const currentDelivery = efficiencies.delivery.ongoing / 100;
    const deliveryOptions = {
      current: currentDelivery,
      delivered: 0.9,
      optimized: 1.05
    };

    const cashable = efficiencies.cashableShare / 100;
    const recurring = efficiencies.recurringShare / 100;

    return mtfpYears.map((year, idx) => {
      const inflated = base * Math.pow(1 + demand, idx);
      const efficiencyTotal = efficiencies.targetNext * deliveryOptions.current;
      const deliveredTotal = efficiencies.targetNext * deliveryOptions.delivered;
      const optimizedTotal = efficiencies.targetNext * deliveryOptions.optimized;

      const recurringEff = efficiencyTotal * recurring;
      const oneOffEff = efficiencyTotal * (1 - recurring);
      const cashableEff = efficiencyTotal * cashable;

      const baseDeficit = Math.max(0, inflated - (recurringEff + oneOffEff));
      const deliveredDeficit = Math.max(0, inflated - deliveredTotal);
      const optimizedDeficit = Math.max(0, inflated - optimizedTotal);

      return {
        year,
        base: inflated,
        current: baseDeficit,
        delivered: deliveredDeficit,
        optimized: optimizedDeficit,
        cashable: cashableEff,
        nonCashable: efficiencyTotal - cashableEff
      };
    });
  }, [demandGrowth, efficiencies, finance.inYearDeficit]);

  const riskBands = useMemo(() => {
    return mtfpSeries.map((row) => ({
      year: row.year,
      low: Math.max(0, row.current * 0.85),
      central: row.current,
      high: row.current * 1.2
    }));
  }, [mtfpSeries]);

  const reservesTimeline = useMemo(() => {
    let reserves = finance.openingReserves;
    return mtfpSeries.map((row) => {
      reserves = Math.max(0, reserves - row.current);
      return { year: row.year, reserves };
    });
  }, [finance.openingReserves, mtfpSeries]);

  const totalCumulativeDeficit = mtfpSeries.reduce((sum, row) => sum + row.current, 0);
  const scenarioCumulativeDeficit = mtfpSeries.reduce(
    (sum, row) => sum + Math.max(0, row.current - scenarioSavings / 4),
    0
  );

  const wteGap = workforce.wteRequired - workforce.wteInPost;
  const fundedGap = workforce.wteRequired - workforce.wteFunded;
  const timeToFillMonths = workforce.timeToFill / 30;

  const reservesAfterYear1 = finance.openingReserves - (mtfpSeries[0]?.current || 0);
  const section114Risk =
    reservesAfterYear1 < finance.minimumReserves ||
    monthsToExhaustion < 3 ||
    finance.openingReserves - finance.earmarkedReserves < finance.minimumReserves;

  const scenarioTable = [
    {
      name: "Current Path",
      inYear: finance.inYearDeficit,
      cumulative: totalCumulativeDeficit,
      reserveMonths: monthsToExhaustion
    },
    {
      name: "Delivered Transformation",
      inYear: Math.max(0, finance.inYearDeficit - efficiencies.targetNext * 0.9),
      cumulative: mtfpSeries.reduce((sum, row) => sum + row.delivered, 0),
      reserveMonths: (finance.openingReserves / Math.max(0.1, mtfpSeries[0]?.delivered || 1)) * 12
    },
    {
      name: "Optimised Recovery",
      inYear: scenarioDeficit,
      cumulative: scenarioCumulativeDeficit,
      reserveMonths: (finance.openingReserves / Math.max(0.1, scenarioDeficit)) * 12
    }
  ];

  const boardMessages = [
    `The Trust is forecasting a £${finance.inYearDeficit.toFixed(1)}m in-year deficit with a cumulative position of £${finance.cumulativeDeficit.toFixed(1)}m.`,
    `Opening reserves of £${finance.openingReserves.toFixed(1)}m provide ${monthsToExhaustion.toFixed(1)} months of cover at current burn.`,
    `Residential placement volatility remains the single largest pressure at £${placements.costPressure.toFixed(1)}m.`,
    `Transformation delivery confidence is mixed: ${efficiencies.delivery.undelivered}% is undelivered.`,
    `Four-year cumulative deficits reach £${totalCumulativeDeficit.toFixed(1)}m under the current path.`
  ];

  const topRisks = [
    "Insufficient reserve cover leading to statutory intervention risk.",
    "Market inflation in residential placements outpacing mitigation.",
    "Agency reliance sustaining a structural cost premium.",
    "Transformation benefits slipping beyond 24/25 delivery windows.",
    "UASC supported accommodation pressures not offset by grant."
  ];

  const executiveInsight = `At the current burn rate reserves will be depleted in ${monthsToExhaustion.toFixed(1)} months, triggering a ${reserveRag.label.toLowerCase()} statutory risk profile.`;
  const placementInsight = `Residential placement volatility is contributing £${placements.costPressure.toFixed(1)}m to the in-year deficit. A 10% reduction in placements would reduce the pressure by £${(placements.costPressure * 0.1).toFixed(1)}m.`;
  const workforceInsight = `Agency premiums are estimated at £${agencyPremium.toFixed(1)}m. Every 10% reduction in agency usage removes roughly £${(agencyPremium * 0.1).toFixed(1)}m from the cost base.`;
  const transformationInsight = `Transformation delivery confidence is ${100 - efficiencies.delivery.undelivered}%. Improving delivery to ${efficiencyRate}% would reduce the in-year gap by £${(Math.max(0, (efficiencyRate - 77) / 100) * efficiencies.targetNext).toFixed(2)}m.`;
  const uascInsight = `UASC pressures total £${uasc.pressure.toFixed(1)}m with £${uasc.grant.toFixed(1)}m grant offset, leaving a net pressure of £${uascNet.toFixed(1)}m.`;
  const recoveryInsight = `Scenario actions reduce the in-year deficit to £${scenarioDeficit.toFixed(1)}m and reduce the 4-year cumulative deficit to £${scenarioCumulativeDeficit.toFixed(1)}m.`;

  const financeBars = [
    { name: "Budget", value: finance.income },
    { name: "Actual", value: finance.expenditure },
    { name: "Forecast", value: finance.expenditure + finance.inYearDeficit * 0.25 },
    { name: "Worst Case", value: finance.expenditure + placements.costPressure + uascNet }
  ];

  const placementBars = [
    { name: "Budget", value: placements.budgeted },
    { name: "Actual", value: placements.actual },
    { name: "Modelled", value: Math.round(modelledPlacementBase) }
  ];

  const vacancyTrend = [
    { month: "Apr", rate: 24.8 },
    { month: "May", rate: 24.3 },
    { month: "Jun", rate: 23.9 },
    { month: "Jul", rate: 23.4 },
    { month: "Aug", rate: 23.1 },
    { month: "Sep", rate: 23.94 }
  ];

  const workforceMix = [
    { name: "Permanent", value: 100 - workforce.agencyRate },
    { name: "Agency", value: workforce.agencyRate }
  ];

  const efficiencyStack = [
    {
      name: "24/25",
      cashable: efficiencies.delivery.ongoing * (efficiencies.cashableShare / 100),
      nonCashable: efficiencies.delivery.ongoing * (1 - efficiencies.cashableShare / 100),
      oneOff: efficiencies.delivery.oneOff
    }
  ];

  const uascWaterfall = [
    { name: "Gross", value: uasc.pressure },
    { name: "Grant", value: -uasc.grant },
    { name: "Net", value: uascNet },
    { name: "Residual", value: uascNet * 0.4 }
  ];

  return (
    <div className="px-5 py-8 lg:px-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mist/70">Sandwell Children&#39;s Trust</p>
          <h1 className="text-3xl lg:text-4xl font-display font-semibold mt-2">Strategic Financial Intelligence</h1>
          <p className="text-mist/80 mt-2 max-w-2xl">
            Intelligence-led decision support for the Strategic Partnership Board and Section 151 oversight.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/10 transition"
            onClick={() => setBoardView((prev) => !prev)}
          >
            {boardView ? "Switch to Analyst View" : "Strategic Partnership Board View"}
          </button>
          <button
            className="px-4 py-2 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/10 transition"
            onClick={() => window.print()}
          >
            Export Board Pack (PDF)
          </button>
        </div>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-4">
        <Card title="Executive Statutory Risk" subtitle="Reserves & Deficit" rag={reserveRag}>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Cumulative Deficit" value={fmt(finance.cumulativeDeficit)} />
            <Stat label="In-Year Outturn" value={fmt(finance.inYearDeficit)} helper="Forecast deficit" />
            <Stat label="Reserve Coverage" value={`${(reserveCoverage * 100).toFixed(0)}%`} helper="Reserve / deficit" />
            <Stat label="Months to Exhaustion" value={monthsToExhaustion.toFixed(1)} helper="Based on current burn" />
          </div>
          <Insight text={executiveInsight} />
        </Card>
        <Card title="Key Cost Drivers" subtitle="Exposure" rag={ragFromValue(placements.costPressure + uascNet, { red: 8, amber: 4 })}>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Placement Pressure" value={fmt(placements.costPressure)} />
            <Stat label="UASC Net Pressure" value={fmt(uascNet)} />
            <Stat label="Agency Premium" value={fmt(agencyPremium)} />
            <Stat label="Undelivered Efficiencies" value={`${efficiencies.delivery.undelivered}%`} />
          </div>
          <Insight text="Pressure concentration remains high in placements and workforce. Targeted demand management is required to stabilise the in-year position." />
        </Card>
        <Card title="Workforce Sustainability" subtitle="VfM" rag={ragFromValue(workforce.agencyRate, { red: 25, amber: 18 })}>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Vacancy Rate" value={pct(workforce.vacancyRate)} helper="PI12 target <34%" />
            <Stat label="Agency Rate" value={pct(workforce.agencyRate)} />
            <Stat label="ASYE Pipeline" value={workforce.asye} helper="Current recruits" />
            <Stat label="Break-even Point" value={`${breakEven.toFixed(1)}%`} helper="Agency to perm switch" />
          </div>
          <Insight text={workforceInsight} />
        </Card>
        <Card title="Transformation Confidence" subtitle="24/25" rag={ragInverse(efficiencies.delivery.undelivered, { red: 15, amber: 8 })}>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Ongoing" value={`${efficiencies.delivery.ongoing}%`} />
            <Stat label="One-off" value={`${efficiencies.delivery.oneOff}%`} />
            <Stat label="Undelivered" value={`${efficiencies.delivery.undelivered}%`} />
            <Stat label="Carried Forward" value={fmt(efficiencies.carriedForward)} />
          </div>
          <Insight text={transformationInsight} />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Financial Position & Forecast" subtitle="Budget to worst-case" rag={deficitRag}>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={financeBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip formatter={(val) => fmt(val)} />
                <Bar dataKey="value" fill="#5aa5ff" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <Insight text={`Forecast outturn variance is ${fmt(finance.inYearDeficit)} (${((finance.inYearDeficit / finance.income) * 100).toFixed(1)}% of income). Immediate mitigation is required to avoid reserve depletion.`} />
        </Card>
        <Card title="Risk-Adjusted Forecast" subtitle="Probability bands" rag={deficitRag}>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={riskBands}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip formatter={(val) => fmt(val)} />
                <Area type="monotone" dataKey="high" stroke="#f87171" fill="rgba(248,113,113,0.25)" />
                <Area type="monotone" dataKey="central" stroke="#f4b740" fill="rgba(244,183,64,0.25)" />
                <Area type="monotone" dataKey="low" stroke="#34d399" fill="rgba(52,211,153,0.25)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Insight text="Risk-adjusted forecast shows volatility bands. Focus mitigation on drivers that push the outturn into the high-risk trajectory." />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Placement Market Volatility" subtitle="Scenario modeller" rag={ragFromValue(modelledPressure, { red: 6, amber: 3 })}>
          <div className="flex flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={localitiesImpact} onChange={(e) => setLocalitiesImpact(e.target.checked)} />
              Localities model impact
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={stepDown} onChange={(e) => setStepDown(e.target.checked)} />
              Step-down to fostering
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={marketInflation} onChange={(e) => setMarketInflation(e.target.checked)} />
              External market inflation
            </label>
          </div>
          <div className="h-56 mt-4">
            <ResponsiveContainer>
              <BarChart data={placementBars}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip />
                <Bar dataKey="value" fill="#ffb84d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-4">
            <InputField
              label="Avg weekly cost (£k)"
              value={placements.avgWeeklyCost}
              onChange={(val) => setPlacements((prev) => ({ ...prev, avgWeeklyCost: val }))}
              step="0.1"
            />
            <InputField
              label="Benchmark weekly cost (£k)"
              value={placements.benchmarkWeeklyCost}
              onChange={(val) => setPlacements((prev) => ({ ...prev, benchmarkWeeklyCost: val }))}
              step="0.1"
            />
          </div>
          <Insight text={`Cost per child is £${placements.avgWeeklyCost.toFixed(1)}k vs benchmark £${placements.benchmarkWeeklyCost.toFixed(1)}k. A 5% unit-cost reduction saves £${(placements.avgWeeklyCost * 0.05 * placements.actual * 52 / 1000).toFixed(1)}m annually.`} />
        </Card>
        <Card title="Workforce Value for Money" subtitle="Agency vs permanent" rag={ragFromValue(agencyPremium, { red: 6, amber: 3 })}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-52">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={workforceMix} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70}>
                    {workforceMix.map((entry, idx) => (
                      <Cell key={entry.name} fill={idx === 0 ? "#4dd0e1" : "#f87171"} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(val) => pct(val)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-52">
              <ResponsiveContainer>
                <LineChart data={vacancyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#cbd5f5" />
                  <YAxis stroke="#cbd5f5" />
                  <Tooltip formatter={(val) => pct(val)} />
                  <Line type="monotone" dataKey="rate" stroke="#5aa5ff" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-4">
            <InputField
              label="WTE required"
              value={workforce.wteRequired}
              onChange={(val) => setWorkforce((prev) => ({ ...prev, wteRequired: val }))}
              step="1"
            />
            <InputField
              label="WTE in post"
              value={workforce.wteInPost}
              onChange={(val) => setWorkforce((prev) => ({ ...prev, wteInPost: val }))}
              step="1"
            />
            <InputField
              label="WTE funded"
              value={workforce.wteFunded}
              onChange={(val) => setWorkforce((prev) => ({ ...prev, wteFunded: val }))}
              step="1"
            />
            <InputField
              label="Time-to-fill (days)"
              value={workforce.timeToFill}
              onChange={(val) => setWorkforce((prev) => ({ ...prev, timeToFill: val }))}
              step="1"
            />
          </div>
          <Insight text={`Establishment gap is ${wteGap} WTE (funded gap ${fundedGap}). At ${timeToFillMonths.toFixed(1)} months time-to-fill, agency conversion must accelerate to stabilise delivery.`} />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Transformation Benefits Realisation" subtitle="Cashable vs non-cashable" rag={ragInverse(efficiencies.delivery.undelivered, { red: 15, amber: 8 })}>
          <div className="h-52">
            <ResponsiveContainer>
              <BarChart data={efficiencyStack}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip />
                <Bar dataKey="cashable" stackId="a" fill="#5aa5ff" />
                <Bar dataKey="nonCashable" stackId="a" fill="#83c5be" />
                <Bar dataKey="oneOff" stackId="a" fill="#ffb84d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-4">
            <InputField
              label="Cashable share (%)"
              value={efficiencies.cashableShare}
              onChange={(val) => setEfficiencies((prev) => ({ ...prev, cashableShare: val }))}
              step="1"
              suffix="%"
            />
            <InputField
              label="Recurring share (%)"
              value={efficiencies.recurringShare}
              onChange={(val) => setEfficiencies((prev) => ({ ...prev, recurringShare: val }))}
              step="1"
              suffix="%"
            />
          </div>
          <Insight text={`Delivery confidence remains ${100 - efficiencies.delivery.undelivered}%. Cashable savings cover £${(efficiencies.targetNext * efficiencies.cashableShare / 100).toFixed(2)}m of the gap.`} />
        </Card>
        <Card title="UASC Pressure & Grant Offset" subtitle="Net exposure" rag={ragFromValue(uascNet, { red: 2, amber: 1 })}>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={uascWaterfall}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip formatter={(val) => fmt(Math.abs(val))} />
                <Bar dataKey="value" fill="#7dd3fc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs mt-4">
            <InputField
              label="UASC arrivals (monthly)"
              value={uasc.arrivals}
              onChange={(val) => setUasc((prev) => ({ ...prev, arrivals: val }))}
              step="1"
            />
          </div>
          <Insight text={uascInsight} />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Deficit Recovery Scenario Modeller" subtitle="Controls" rag={ragFromValue(scenarioDeficit, { red: 7, amber: 4 })}>
          <div className="grid gap-3 text-sm">
            <label className="flex items-center justify-between">
              Reduce agency usage ({reduceAgency}%)
              <input
                type="range"
                min="0"
                max="30"
                value={reduceAgency}
                onChange={(e) => setReduceAgency(Number(e.target.value))}
              />
            </label>
            <label className="flex items-center justify-between">
              Reduce residential placements ({reducePlacements}%)
              <input
                type="range"
                min="0"
                max="25"
                value={reducePlacements}
                onChange={(e) => setReducePlacements(Number(e.target.value))}
              />
            </label>
            <label className="flex items-center justify-between">
              Efficiency delivery rate ({efficiencyRate}%)
              <input
                type="range"
                min="70"
                max="110"
                value={efficiencyRate}
                onChange={(e) => setEfficiencyRate(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Stat label="Scenario Deficit" value={fmt(scenarioDeficit)} />
            <Stat label="4-Year Cumulative" value={fmt(scenarioCumulativeDeficit)} />
          </div>
          <Insight text={recoveryInsight} />
        </Card>
        <Card title="Scenario Comparison" subtitle="Current vs Recovery" rag={reserveRag}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-mist">
              <thead>
                <tr className="text-xs uppercase tracking-[0.2em] text-mist/70">
                  <th className="text-left py-2">Scenario</th>
                  <th className="text-left py-2">In-year</th>
                  <th className="text-left py-2">4-yr cumulative</th>
                  <th className="text-left py-2">Reserve months</th>
                </tr>
              </thead>
              <tbody>
                {scenarioTable.map((row) => (
                  <tr key={row.name} className="border-t border-white/10">
                    <td className="py-2">{row.name}</td>
                    <td className="py-2">{fmt(row.inYear)}</td>
                    <td className="py-2">{fmt(row.cumulative)}</td>
                    <td className="py-2">{row.reserveMonths.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Insight text="Scenario comparison highlights the scale of recovery required to sustain reserves beyond 12 months." />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="MTFP Outlook & Reserves" subtitle="4-year model" rag={reserveRag}>
          <div className="flex flex-wrap gap-2 text-xs">
            {[3, 5, 8].map((rate) => (
              <button
                key={rate}
                className={`px-3 py-1 rounded-full border ${pressureRate === rate ? "bg-white text-ink" : "border-white/30"}`}
                onClick={() => setPressureRate(rate)}
              >
                Demand pressure {rate}%
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs mt-4">
            <InputField
              label="LAC growth (%)"
              value={demandDrivers.lacGrowth}
              onChange={(val) => setDemandDrivers((prev) => ({ ...prev, lacGrowth: val }))}
              step="0.1"
            />
            <InputField
              label="UASC growth (%)"
              value={demandDrivers.uascGrowth}
              onChange={(val) => setDemandDrivers((prev) => ({ ...prev, uascGrowth: val }))}
              step="0.1"
            />
            <InputField
              label="Edge-of-care improvement (%)"
              value={demandDrivers.edgeOfCareImprovement}
              onChange={(val) => setDemandDrivers((prev) => ({ ...prev, edgeOfCareImprovement: val }))}
              step="0.1"
            />
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer>
              <LineChart data={mtfpSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip formatter={(val) => fmt(val)} />
                <Line type="monotone" dataKey="current" stroke="#f87171" strokeWidth={3} />
                <Line type="monotone" dataKey="delivered" stroke="#f4b740" strokeWidth={2} />
                <Line type="monotone" dataKey="optimized" stroke="#34d399" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Insight text={`Demand-driven growth assumption is ${demandGrowth.toFixed(1)}%. Delivered transformation would reduce the 4-year cumulative deficit to £${mtfpSeries.reduce((sum, row) => sum + row.delivered, 0).toFixed(1)}m.`} />
        </Card>
        <Card title="Reserves Sustainability Engine" subtitle="Drawdown" rag={reserveRag}>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <InputField
              label="Opening reserves (£m)"
              value={finance.openingReserves}
              onChange={(val) => setFinance((prev) => ({ ...prev, openingReserves: val }))}
              step="0.1"
            />
            <InputField
              label="Earmarked reserves (£m)"
              value={finance.earmarkedReserves}
              onChange={(val) => setFinance((prev) => ({ ...prev, earmarkedReserves: val }))}
              step="0.1"
            />
            <InputField
              label="Minimum balance (£m)"
              value={finance.minimumReserves}
              onChange={(val) => setFinance((prev) => ({ ...prev, minimumReserves: val }))}
              step="0.1"
            />
          </div>
          <div className="h-56 mt-4">
            <ResponsiveContainer>
              <AreaChart data={reservesTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="year" stroke="#cbd5f5" />
                <YAxis stroke="#cbd5f5" />
                <Tooltip formatter={(val) => fmt(val)} />
                <Area type="monotone" dataKey="reserves" stroke="#5aa5ff" fill="rgba(90,165,255,0.35)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Insight text={`Reserves fall below the minimum threshold within ${monthsToExhaustion.toFixed(1)} months under the current path. Section 114 early-warning status is ${section114Risk ? "triggered" : "not triggered"}.`} />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Assumptions & Inputs" subtitle="Audit trail" rag={ragInverse(0, { red: 1, amber: 1 })}>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <InputField
              label="Data refresh date"
              value={refreshDate}
              onChange={(val) => setRefreshDate(val)}
              type="date"
              step="1"
            />
            <InputField
              label="Reserve support (£m)"
              value={finance.reserveSupport}
              onChange={(val) => setFinance((prev) => ({ ...prev, reserveSupport: val }))}
              step="0.1"
            />
            <InputField
              label="Income (£m)"
              value={finance.income}
              onChange={(val) => setFinance((prev) => ({ ...prev, income: val }))}
              step="0.1"
            />
            <InputField
              label="Expenditure (£m)"
              value={finance.expenditure}
              onChange={(val) => setFinance((prev) => ({ ...prev, expenditure: val }))}
              step="0.1"
            />
            <InputField
              label="In-year deficit (£m)"
              value={finance.inYearDeficit}
              onChange={(val) => setFinance((prev) => ({ ...prev, inYearDeficit: val }))}
              step="0.1"
            />
            <InputField
              label="Cumulative deficit (£m)"
              value={finance.cumulativeDeficit}
              onChange={(val) => setFinance((prev) => ({ ...prev, cumulativeDeficit: val }))}
              step="0.1"
            />
            <InputField
              label="Residential budgeted"
              value={placements.budgeted}
              onChange={(val) => setPlacements((prev) => ({ ...prev, budgeted: val }))}
              step="1"
            />
            <InputField
              label="Residential actual"
              value={placements.actual}
              onChange={(val) => setPlacements((prev) => ({ ...prev, actual: val }))}
              step="1"
            />
            <InputField
              label="Placement pressure (£m)"
              value={placements.costPressure}
              onChange={(val) => setPlacements((prev) => ({ ...prev, costPressure: val }))}
              step="0.1"
            />
            <InputField
              label="UASC pressure (£m)"
              value={uasc.pressure}
              onChange={(val) => setUasc((prev) => ({ ...prev, pressure: val }))}
              step="0.1"
            />
            <InputField
              label="UASC grant (£m)"
              value={uasc.grant}
              onChange={(val) => setUasc((prev) => ({ ...prev, grant: val }))}
              step="0.1"
            />
            <InputField
              label="Agency rate (%)"
              value={workforce.agencyRate}
              onChange={(val) => setWorkforce((prev) => ({ ...prev, agencyRate: val }))}
              step="0.1"
              suffix="%"
            />
            <InputField
              label="Vacancy rate (%)"
              value={workforce.vacancyRate}
              onChange={(val) => setWorkforce((prev) => ({ ...prev, vacancyRate: val }))}
              step="0.1"
              suffix="%"
            />
            <InputField
              label="Efficiency target (£m)"
              value={efficiencies.targetNext}
              onChange={(val) => setEfficiencies((prev) => ({ ...prev, targetNext: val }))}
              step="0.1"
            />
          </div>
          <Insight text="Assumptions log captures key parameters for governance and audit trail. Update as data refreshes." />
        </Card>
        <Card title="Section 114 Early Warning" subtitle="Policy thresholds" rag={section114Risk ? { label: "Red", color: "bg-rag-red" } : { label: "Green", color: "bg-rag-green" }}>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Opening Reserves" value={fmt(finance.openingReserves)} />
            <Stat label="Minimum Balance" value={fmt(finance.minimumReserves)} />
            <Stat label="Earmarked" value={fmt(finance.earmarkedReserves)} />
            <Stat label="Risk Status" value={section114Risk ? "Triggered" : "Stable"} />
          </div>
          <Insight text={`Section 114 is ${section114Risk ? "at risk" : "not indicated"} based on reserve coverage and minimum balance policy thresholds.`} />
        </Card>
      </section>

      {boardView && (
        <section className="mt-8 glass rounded-2xl p-6 shadow-glow">
          <h2 className="text-2xl font-display font-semibold">Strategic Partnership Board Narrative</h2>
          <div className="grid gap-6 lg:grid-cols-2 mt-4">
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-mist/70">Key Messages</h3>
              <ul className="mt-3 space-y-2 text-mist">
                {boardMessages.map((message) => (
                  <li key={message}>• {message}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-[0.2em] text-mist/70">Top 5 Risks</h3>
              <ul className="mt-3 space-y-2 text-mist">
                {topRisks.map((risk) => (
                  <li key={risk}>• {risk}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/10">
            <h3 className="text-sm uppercase tracking-[0.2em] text-mist/70">Required Decisions</h3>
            <div className="mt-3 text-mist">
              <p>Approve accelerated placement step-down commissioning and establish an agency conversion taskforce by Q1.</p>
              <p className="mt-2">Mandate monthly transformation delivery reporting with escalation triggers for any variance above 10%.</p>
              <p className="mt-2">Agree a reserve drawdown strategy aligned to recovery scenarios to avoid Section 114 thresholds.</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-10 text-xs text-mist/70">
        <p>All figures in £m. Insights auto-generated from embedded model assumptions and live scenario toggles.</p>
      </section>
    </div>
  );
}
