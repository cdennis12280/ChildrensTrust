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
        <p className="text-[10px] uppercase tracking-[0.35em] text-mist/60 font-semibold">{subtitle}</p>
        <h3 className="text-lg font-semibold font-display mt-2">{title}</h3>
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

const InputField = ({
  label,
  value,
  onChange,
  step = "0.1",
  suffix,
  prefix,
  type = "number"
}) => (
  <label className="text-[11px] text-mist/70 flex flex-col gap-2">
    <span className="uppercase tracking-[0.2em]">{label}</span>
    <div className="flex items-center gap-2">
      {prefix && <span className="text-xs text-mist/60">{prefix}</span>}
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
        className="control-input"
      />
      {suffix && <span className="text-xs text-mist/60">{suffix}</span>}
    </div>
  </label>
);

const ToggleField = ({ label, value, onChange, helper }) => (
  <label className="flex items-center justify-between gap-4 text-xs text-mist/70">
    <div>
      <p className="uppercase tracking-[0.2em]">{label}</p>
      {helper && <p className="text-[11px] text-mist/60 mt-1">{helper}</p>}
    </div>
    <button
      type="button"
      className={`toggle ${value ? "bg-aqua/40" : ""}`}
      onClick={() => onChange(!value)}
    >
      <span className={`toggle-dot ${value ? "translate-x-5 bg-aqua" : "translate-x-1"}`} />
    </button>
  </label>
);

const SliderField = ({ label, value, min, max, step = 1, onChange, suffix, helper }) => (
  <label className="flex flex-col gap-2 text-xs text-mist/70">
    <div className="flex items-center justify-between">
      <span className="uppercase tracking-[0.2em]">{label}</span>
      <span className="text-mist/60">
        {value}
        {suffix}
      </span>
    </div>
    <input
      className="slider"
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
    {helper && <span className="text-[11px] text-mist/60">{helper}</span>}
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
  const [marketInflationRate, setMarketInflationRate] = useState(6);
  const [localitiesReduction, setLocalitiesReduction] = useState(5);
  const [stepDownRate, setStepDownRate] = useState(8);
  const [uascGrantUplift, setUascGrantUplift] = useState(10);
  const [demandShock, setDemandShock] = useState(false);
  const [demandShockRate, setDemandShockRate] = useState(1.5);
  const [agencyConversionGain, setAgencyConversionGain] = useState(6);
  const [commissioningSavings, setCommissioningSavings] = useState(1.2);
  const [inflationIndex, setInflationIndex] = useState(3.4);
  const [unitCostImprovement, setUnitCostImprovement] = useState(4);
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
  const marketInflationFactor = marketInflation ? 1 + marketInflationRate / 100 : 1;
  const localitiesFactor = localitiesImpact ? 1 - localitiesReduction / 100 : 1;
  const stepDownFactor = stepDown ? 1 - stepDownRate / 100 : 1;
  const unitCostFactor = 1 - unitCostImprovement / 100;
  const modelledPlacementBase =
    placements.actual * localitiesFactor * stepDownFactor * marketInflationFactor * unitCostFactor;
  const modelledPressure = Math.max(0, (modelledPlacementBase - placements.budgeted) * pressurePerPlacement);

  const effectiveAgencyRate = Math.max(0, workforce.agencyRate - agencyConversionGain);
  const agencyPremium = finance.expenditure * (effectiveAgencyRate / 100) * 0.3;
  const breakEven = agencyPremium / (finance.expenditure * 0.1);

  const grantUplifted = uasc.grant * (1 + uascGrantUplift / 100);
  const uascNet = uasc.pressure - grantUplifted;

  const scenarioSavings =
    placements.costPressure * (reducePlacements / 100)
    + agencyPremium * (reduceAgency / 100)
    + Math.max(0, (efficiencyRate - 77) / 100) * efficiencies.targetNext
    + commissioningSavings;

  const scenarioDeficit = Math.max(0, finance.inYearDeficit - scenarioSavings);

  const mtfpYears = ["24/25", "25/26", "26/27", "27/28"];

  const demandGrowth = useMemo(() => {
    const base = pressureRate;
    const lacImpact = demandDrivers.lacGrowth * 0.4;
    const uascImpact = demandDrivers.uascGrowth * 0.25;
    const edgeBenefit = demandDrivers.edgeOfCareImprovement * 0.3;
    const shock = demandShock ? demandShockRate : 0;
    const inflation = inflationIndex * 0.15;
    return Math.max(0.5, base + lacImpact + uascImpact - edgeBenefit + shock + inflation);
  }, [pressureRate, demandDrivers, demandShock, demandShockRate, inflationIndex]);

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

  const liveInYearDeficit = finance.inYearDeficit;
  const liveMonthsToExhaustion = monthsToExhaustion;
  const liveCostPressure = placements.costPressure;
  const liveModelledPressure = modelledPressure;

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
    `The Trust is forecasting a £${finance.inYearDeficit.toFixed(1)}m in-year deficit with a year-to-date cumulative position of £${finance.cumulativeDeficit.toFixed(1)}m.`,
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

  const walkthroughSteps = [
    {
      title: "Start with the executive risk snapshot",
      body:
        "Read the Executive Snapshot first. The reserves, deficit, and transformation cards give an at-a-glance RAG view so you can decide where to dive deeper."
    },
    {
      title: "Use Live Exposure Snapshot as your control loop",
      body:
        "As you move sliders and toggles, the Live Exposure Snapshot updates instantly. Use it as your headline dashboard for in-year deficit, reserves runway, and placement volatility."
    },
    {
      title: "Validate the demand and placement drivers",
      body:
        "Use the Placement Market Volatility panel to test step-downs, localities impact, and market inflation. The chart shows the gap between budget, actuals, and a modelled scenario."
    },
    {
      title: "Stress-test the workforce cost premium",
      body:
        "Check the workforce mix donut and vacancy trend. Then adjust WTE funded and time-to-fill to see how agency reliance shifts the premium."
    },
    {
      title: "Model recovery actions",
      body:
        "Use the sliders in the Deficit Recovery Scenario Modeller to test reductions in agency usage, placements, and delivery performance. The scenario deficit and four-year cumulative totals update immediately."
    },
    {
      title: "Review the medium-term outlook",
      body:
        "Switch between demand pressure buttons and adjust growth drivers to see how the four-year deficit profile changes. The reserves chart beneath shows when minimum balance thresholds are breached."
    },
    {
      title: "Lock down the audit trail",
      body:
        "Use the Assumptions & Inputs panel to update refresh dates and core financial assumptions, creating a transparent audit trail for governance."
    }
  ];

  const executiveInsight = `At the current burn rate reserves will be depleted in ${monthsToExhaustion.toFixed(1)} months, triggering a ${reserveRag.label.toLowerCase()} statutory risk profile.`;
  const placementInsight = `Residential placement volatility is contributing £${placements.costPressure.toFixed(1)}m to the in-year deficit. A ${unitCostImprovement}% unit-cost improvement reduces modelled pressure by £${(placements.costPressure * (unitCostImprovement / 100)).toFixed(1)}m.`;
  const workforceInsight = `Agency premiums are estimated at £${agencyPremium.toFixed(1)}m. Conversion activity reduces the agency rate to ${effectiveAgencyRate.toFixed(1)}%.`;
  const transformationInsight = `Transformation delivery confidence is ${100 - efficiencies.delivery.undelivered}%. Improving delivery to ${efficiencyRate}% would reduce the in-year gap by £${(Math.max(0, (efficiencyRate - 77) / 100) * efficiencies.targetNext).toFixed(2)}m.`;
  const uascInsight = `UASC pressures total £${uasc.pressure.toFixed(1)}m with £${grantUplifted.toFixed(1)}m grant offset, leaving a net pressure of £${uascNet.toFixed(1)}m.`;
  const recoveryInsight = `Scenario actions reduce the in-year deficit to £${scenarioDeficit.toFixed(1)}m and reduce the 4-year cumulative deficit to £${scenarioCumulativeDeficit.toFixed(1)}m. Commissioning actions contribute £${commissioningSavings.toFixed(1)}m.`;

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
    { name: "Permanent", value: 100 - effectiveAgencyRate },
    { name: "Agency", value: effectiveAgencyRate }
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
    { name: "Grant", value: -grantUplifted },
    { name: "Net", value: uascNet },
    { name: "Residual", value: uascNet * 0.4 }
  ];

  return (
    <div className="px-5 py-8 lg:px-12">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between print:hidden">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-mist/60">Children&#39;s Trust Finance</p>
          <h1 className="text-3xl lg:text-5xl font-display font-semibold mt-3">
            Strategic Financial Command Center
          </h1>
          <p className="text-mist/70 mt-3 max-w-2xl">
            Executive intelligence for Trust finance leaders. Stress-test scenarios, adjust drivers, and lock the
            governance narrative in real time.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 text-xs text-mist/60">
            <span className="rounded-full border border-white/10 px-3 py-1">Refresh date: {refreshDate}</span>
            <span className="rounded-full border border-white/10 px-3 py-1">Model version: 2026.1</span>
            <span className="rounded-full border border-white/10 px-3 py-1">
              Board view: {boardView ? "On" : "Off"}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-5 py-2 rounded-full bg-aqua/20 border border-aqua/40 text-sm font-semibold hover:bg-aqua/30 transition"
            onClick={() => setBoardView((prev) => !prev)}
          >
            {boardView ? "Switch to Analyst View" : "Strategic Partnership Board View"}
          </button>
        </div>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="glass rounded-2xl p-6 shadow-panel lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] text-mist/60">Control Tower</p>
              <h2 className="text-xl font-display font-semibold mt-2">Scenario Inputs & Policy Levers</h2>
              <p className="text-sm text-mist/70 mt-2 max-w-2xl">
                Tune the Trust-wide finance levers below. Every change updates deficit projections, reserves exposure,
                and risk flags instantly.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs text-mist/60">
              <span className="rounded-full border border-white/10 px-3 py-1">Live model</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Inputs auto-saved</span>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-mist/60">Macro Pressure</p>
              <div className="mt-4 grid gap-4">
                <SliderField
                  label="Demand pressure baseline"
                  value={pressureRate}
                  min={2}
                  max={9}
                  step={1}
                  suffix="%"
                  onChange={setPressureRate}
                  helper="Board-approved base assumption"
                />
                <SliderField
                  label="Inflation index"
                  value={inflationIndex}
                  min={1}
                  max={6}
                  step={0.1}
                  suffix="%"
                  onChange={setInflationIndex}
                  helper="Care market inflation weighting"
                />
                <ToggleField
                  label="Demand shock overlay"
                  value={demandShock}
                  onChange={setDemandShock}
                  helper="Toggle for surge scenarios"
                />
                <SliderField
                  label="Shock uplift"
                  value={demandShockRate}
                  min={0}
                  max={4}
                  step={0.1}
                  suffix="%"
                  onChange={setDemandShockRate}
                />
              </div>
            </div>

            <div className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-mist/60">Placement & Commissioning</p>
              <div className="mt-4 grid gap-4">
                <ToggleField
                  label="Localities impact"
                  value={localitiesImpact}
                  onChange={setLocalitiesImpact}
                  helper="Enables place-based demand dampening"
                />
                <SliderField
                  label="Localities reduction"
                  value={localitiesReduction}
                  min={0}
                  max={12}
                  step={0.5}
                  suffix="%"
                  onChange={setLocalitiesReduction}
                />
                <ToggleField
                  label="Step-down programme"
                  value={stepDown}
                  onChange={setStepDown}
                  helper="Step-down to lower-cost provision"
                />
                <SliderField
                  label="Step-down scale"
                  value={stepDownRate}
                  min={0}
                  max={20}
                  step={1}
                  suffix="%"
                  onChange={setStepDownRate}
                />
                <ToggleField
                  label="Market inflation"
                  value={marketInflation}
                  onChange={setMarketInflation}
                  helper="Applies care market price uplift"
                />
                <SliderField
                  label="Market inflation rate"
                  value={marketInflationRate}
                  min={0}
                  max={12}
                  step={0.5}
                  suffix="%"
                  onChange={setMarketInflationRate}
                />
                <SliderField
                  label="Unit-cost improvement"
                  value={unitCostImprovement}
                  min={0}
                  max={10}
                  step={0.5}
                  suffix="%"
                  onChange={setUnitCostImprovement}
                />
                <InputField
                  label="Commissioning savings"
                  value={commissioningSavings}
                  onChange={setCommissioningSavings}
                  step="0.1"
                  suffix="£m"
                />
              </div>
            </div>

            <div className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-mist/60">Workforce & Agency Mix</p>
              <div className="mt-4 grid gap-4">
                <SliderField
                  label="Agency conversion gain"
                  value={agencyConversionGain}
                  min={0}
                  max={12}
                  step={0.5}
                  suffix="%"
                  onChange={setAgencyConversionGain}
                  helper="Improvement to agency rate"
                />
                <SliderField
                  label="Vacancy stabilisation"
                  value={workforce.vacancyRate}
                  min={10}
                  max={30}
                  step={0.2}
                  suffix="%"
                  onChange={(val) => setWorkforce((prev) => ({ ...prev, vacancyRate: val }))}
                />
                <InputField
                  label="Recruitment time-to-fill"
                  value={workforce.timeToFill}
                  onChange={(val) => setWorkforce((prev) => ({ ...prev, timeToFill: val }))}
                  step="1"
                  suffix="days"
                />
              </div>
            </div>

            <div className="surface rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-mist/60">Grant & Funding</p>
              <div className="mt-4 grid gap-4">
                <SliderField
                  label="UASC grant uplift"
                  value={uascGrantUplift}
                  min={0}
                  max={25}
                  step={1}
                  suffix="%"
                  onChange={setUascGrantUplift}
                />
                <InputField
                  label="Reserve support"
                  value={finance.reserveSupport}
                  onChange={(val) => setFinance((prev) => ({ ...prev, reserveSupport: val }))}
                  step="0.1"
                  suffix="£m"
                />
                <InputField
                  label="Opening reserves"
                  value={finance.openingReserves}
                  onChange={(val) => setFinance((prev) => ({ ...prev, openingReserves: val }))}
                  step="0.1"
                  suffix="£m"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 shadow-panel">
          <p className="text-[10px] uppercase tracking-[0.35em] text-mist/60">Finance Pulse</p>
          <h2 className="text-xl font-display font-semibold mt-2">Live Exposure Snapshot</h2>
          <p className="text-xs text-mist/60 mt-2">Auto-updates from live inputs and scenario levers.</p>
          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl surface p-4 glow-ring">
              <p className="text-xs uppercase tracking-[0.3em] text-mist/60">In-year deficit</p>
              <p className="text-3xl font-display mt-2">{fmt(liveInYearDeficit)}</p>
              <p className="text-xs text-mist/60 mt-2">
                Scenario-adjusted gap: {fmt(scenarioDeficit)}
              </p>
            </div>
            <div className="rounded-2xl surface p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-mist/60">Reserves runway</p>
              <p className="text-2xl font-display mt-2">{liveMonthsToExhaustion.toFixed(1)} months</p>
              <p className="text-xs text-mist/60 mt-2">
                Minimum balance threshold: {fmt(finance.minimumReserves)}
              </p>
            </div>
            <div className="rounded-2xl surface p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-mist/60">Placement volatility</p>
              <p className="text-2xl font-display mt-2">{fmt(liveCostPressure)}</p>
              <p className="text-xs text-mist/60 mt-2">
                Modelled pressure: {fmt(liveModelledPressure)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <div className="glass rounded-2xl p-6 shadow-panel">
          <details className="group" open>
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold font-display">
              <span>Walkthrough: Quick Orientation</span>
              <span className="text-xs uppercase tracking-[0.2em] text-mist/70 transition group-open:rotate-180">▼</span>
            </summary>
            <p className="text-sm text-mist/80 mt-3 max-w-3xl">
              Designed for busy leaders. Start with risk, interrogate drivers, test recovery, and finish with
              governance. Expand or collapse whenever you need a refresher.
            </p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {walkthroughSteps.map((step, idx) => (
                <div key={step.title} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-mist/70">Step {idx + 1}</p>
                  <h3 className="mt-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-mist/80 mt-2">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 p-4 rounded-xl bg-white/10 border border-white/10 text-sm text-mist/80">
              <p>
                Tip: switch to Strategic Partnership Board View once scenarios are tested to generate the narrative
                for board discussion.
              </p>
            </div>
          </details>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-mist/60">Executive Snapshot</p>
          <h2 className="text-lg font-display font-semibold mt-2">Statutory Risk & Exposure</h2>
        </div>
      </div>
      <section className="mt-4 grid gap-4 lg:grid-cols-4">
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
          <Insight text={`Total exposure from placements and UASC is £${(placements.costPressure + uascNet).toFixed(1)}m. Agency premium adds £${agencyPremium.toFixed(1)}m to the cost base.`} />
        </Card>
        <Card title="Workforce Sustainability" subtitle="VfM" rag={ragFromValue(effectiveAgencyRate, { red: 25, amber: 18 })}>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Vacancy Rate" value={pct(workforce.vacancyRate)} helper="PI12 target <34%" />
            <Stat label="Agency Rate (Adj.)" value={pct(effectiveAgencyRate)} />
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

      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-mist/60">Drivers & Volatility</p>
          <h2 className="text-lg font-display font-semibold mt-2">Demand, Market, Workforce</h2>
        </div>
      </div>
      <section className="mt-4 grid gap-6 lg:grid-cols-2">
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
          <Insight text={`Risk-adjusted forecast shows a high-band year-one exposure of £${(riskBands[0]?.high || 0).toFixed(1)}m. Focus mitigation on drivers that push the outturn into the high-risk trajectory.`} />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="Placement Market Volatility" subtitle="Scenario modeller" rag={ragFromValue(modelledPressure, { red: 6, amber: 3 })}>
          <div className="grid gap-3 text-xs">
            <ToggleField
              label="Localities model impact"
              value={localitiesImpact}
              onChange={setLocalitiesImpact}
            />
            <ToggleField label="Step-down to fostering" value={stepDown} onChange={setStepDown} />
            <ToggleField label="External market inflation" value={marketInflation} onChange={setMarketInflation} />
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

      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-mist/60">Recovery & Outlook</p>
          <h2 className="text-lg font-display font-semibold mt-2">Mitigation, Scenarios, Reserves</h2>
        </div>
      </div>
      <section className="mt-4 grid gap-6 lg:grid-cols-2">
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
          <div className="grid gap-4 text-sm">
            <SliderField
              label="Reduce agency usage"
              value={reduceAgency}
              min={0}
              max={30}
              step={1}
              suffix="%"
              onChange={setReduceAgency}
            />
            <SliderField
              label="Reduce residential placements"
              value={reducePlacements}
              min={0}
              max={25}
              step={1}
              suffix="%"
              onChange={setReducePlacements}
            />
            <SliderField
              label="Efficiency delivery rate"
              value={efficiencyRate}
              min={70}
              max={110}
              step={1}
              suffix="%"
              onChange={setEfficiencyRate}
            />
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
          <Insight text={`Scenario comparison highlights the recovery needed to sustain reserves beyond 12 months. Optimised recovery extends runway to ${scenarioTable[2]?.reserveMonths.toFixed(1)} months.`} />
        </Card>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card title="MTFP Outlook & Reserves" subtitle="4-year model" rag={reserveRag}>
          <div className="flex flex-wrap gap-2 text-xs">
            {[3, 5, 8].map((rate) => (
              <button
                key={rate}
                className={`px-3 py-1 rounded-full border transition ${
                  pressureRate === rate
                    ? "bg-aqua/30 border-aqua/60 text-white"
                    : "border-white/20 text-mist/70 hover:bg-white/10"
                }`}
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

      <div className="mt-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-mist/60">Governance & Assurance</p>
          <h2 className="text-lg font-display font-semibold mt-2">Inputs, Audit Trail, Early Warning</h2>
        </div>
      </div>
      <section className="mt-4 grid gap-6 lg:grid-cols-2">
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
              label="UASC base grant (£m)"
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
            <h3 className="text-sm uppercase tracking-[0.2em] text-mist/70">Decisions Sought</h3>
            <div className="mt-3 text-mist">
              <p>Approve accelerated placement step-down commissioning and establish an agency conversion taskforce by Q1.</p>
              <p className="mt-2">Mandate monthly transformation delivery reporting with escalation triggers for any variance above 10%.</p>
              <p className="mt-2">Agree a reserve drawdown strategy aligned to recovery scenarios to avoid Section 114 thresholds.</p>
            </div>
          </div>
        </section>
      )}

      <section className="mt-10 text-xs text-mist/70">
        <p>All figures in £m. Summaries and insights update live from the model inputs and scenario levers.</p>
      </section>
    </div>
  );
}
