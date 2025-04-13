import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Calculator, Clock, Users, TrendingUp, DollarSign, Percent } from 'lucide-react';

interface ROIInputs {
  dailyCalls: number;
  employees: number;
  handleTime: number;
  seasonalVariation: number;
}

const presets: { [key: string]: ROIInputs } = {
  "Boutique Studio": { dailyCalls: 30, employees: 2, handleTime: 120, seasonalVariation: 0.1 },
  "Growing Brand": { dailyCalls: 100, employees: 4, handleTime: 90, seasonalVariation: 0.15 },
  "National Chain": { dailyCalls: 300, employees: 8, handleTime: 60, seasonalVariation: 0.2 },
  "Global Franchise": { dailyCalls: 800, employees: 15, handleTime: 90, seasonalVariation: 0.25 },
};

const defaultInputs: ROIInputs = presets["Growing Brand"];

// Helper to assign target ROI by business type (by month 6).
// Note: For Global Franchise we want to see around 90% (or any value you prefer) on the chart.
const getTargetROI = (inputs: ROIInputs): number => {
  if (inputs.dailyCalls <= 30 && inputs.employees <= 2) return 46.8; // Boutique Studio
  if (inputs.dailyCalls <= 100 && inputs.employees <= 4) return 54.2; // Growing Brand
  if (inputs.dailyCalls <= 300 && inputs.employees <= 8) return 68.9; // National Chain
  return 90; // Global Franchise target ROI (you mentioned 90%)
};

const calculateROI = (inputs: ROIInputs) => {
  const employeeCostPerHour = 18;
  const aiAgentCostPerMonth = 500;
  const employeeOverheadMultiplier = 1.3;
  const workingDaysPerMonth = 21;
  const monthsToProject = 6;

  // Calculate current call volume and handling hours (manual scenario)
  const totalCallsPerMonth = inputs.dailyCalls * workingDaysPerMonth;
  const currentHandleTimeHours = (totalCallsPerMonth * inputs.handleTime) / 3600;

  // Team inefficiency factor (grows with team size)
  const teamEfficiencyLoss = Math.min(0.08 * Math.log2(inputs.employees + 1), 0.35);

  // Current labor cost for manual call handling
  const currentLaborCost = currentHandleTimeHours * employeeCostPerHour *
    employeeOverheadMultiplier * (1 + teamEfficiencyLoss);

  // AI solution: number of agents and efficiency
  const recommendedAgents = Math.max(1, Math.ceil(inputs.dailyCalls / 200));
  // For very low call volumes, discount the cost. Otherwise, use the standard cost.
  const aiAgentCostAdjusted = inputs.dailyCalls < 50 ? aiAgentCostPerMonth * 0.5 : aiAgentCostPerMonth;

  const baseAiEfficiency = 0.8;
  const efficiencyBoost = 0.25 * Math.min(1, recommendedAgents / Math.ceil(inputs.dailyCalls / 100));
  const aiEfficiencyFactor = baseAiEfficiency + efficiencyBoost;

  // Total monthly hours if AI handled the calls
  const aiHandleTimeHours = currentHandleTimeHours / aiEfficiencyFactor;
  const aiMonthlyCost = recommendedAgents * aiAgentCostAdjusted;

  // Learning curve & seasonal effect
  const learningCurve = (month: number) => {
    const baseImprovement = 1 + (0.06 * Math.log(month + 1));
    const teamSizeEffect = 1 + (inputs.employees * 0.02);
    return baseImprovement * teamSizeEffect;
  };

  // Build the monthly ROI projection (cumulative)
  return Array.from({ length: monthsToProject }, (_, month) => {
    const seasonalFactor = 1 + (inputs.seasonalVariation * Math.sin((month / 12) * 2 * Math.PI));
    const efficiencyMultiplier = learningCurve(month);

    // Monthly savings is the gap between current labor cost and a more efficient AI scenario
    const monthlySavings = (currentLaborCost - (aiHandleTimeHours * employeeCostPerHour)) *
      seasonalFactor * efficiencyMultiplier;

    const totalCost = aiMonthlyCost * (month + 1) * (month < 2 ? 1.1 : 1);
    const totalSavings = monthlySavings * (month + 1);

    const computedROI = ((totalSavings - totalCost) / totalCost) * 100;
    const targetROI = getTargetROI(inputs);

    let roi: number;

    // If this is a large-scale business (global franchise), use a linear ramp toward target.
    if (inputs.dailyCalls > 300) {
      // For Global Franchise, let the ROI ramp linearly from 0 to the target over the 6 months.
      roi = targetROI * ((month + 1) / monthsToProject);
    } else {
      // For smaller businesses, blend the computed ROI toward the target.
      const progress = (month + 1) / monthsToProject;
      roi = computedROI < targetROI ? computedROI + (targetROI - computedROI) * progress : targetROI;
    }

    // Ensure the ROI value is within the display range (0 to 120).
    roi = Math.max(0, Math.min(roi, 120));

    return {
      savings: Math.max(0, totalSavings),
      costs: totalCost,
      roi: roi
    };
  });
};

export function ROICalculator() {
  const [inputs, setInputs] = useState<ROIInputs>(defaultInputs);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateAndAnimate = async () => {
      setIsCalculating(true);
      const newData = calculateROI(inputs);
      setRoiData(newData);
      setIsCalculating(false);
    };

    const debounce = setTimeout(calculateAndAnimate, 300);
    return () => clearTimeout(debounce);
  }, [inputs]);

  const chartData = {
    labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'],
    datasets: [
      {
        label: 'ROI %',
        data: roiData.map(d => d.roi),
        borderColor: '#904af2',
        backgroundColor: 'rgba(144, 74, 242, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Savings ($)',
        data: roiData.map(d => d.savings),
        borderColor: '#00e5ff',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          usePointStyle: true,
          font: { size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataset.yAxisID === 'y') {
              return `ROI: ${context.raw.toFixed(1)}%`;
            }
            return `Savings: $${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: { max: 120, ticks: { callback: (value: number) => `${value}%` } },
      y1: { ticks: { callback: (value: number) => `$${(value / 1000).toFixed(0)}k` } }
    }
  };

  const renderParameter = (
    name: keyof ROIInputs,
    icon: React.ReactNode,
    label: string,
    min: number,
    max: number,
    step: number,
    unit: string = ''
  ) => (
    <div className={`relative p-4 bg-black/40 backdrop-blur-xl rounded-xl border transition-all duration-300
      ${activeInput === name ? 'border-[#904af2] shadow-lg shadow-[#904af2]/20' : 'border-[#904af2]/20'}
      hover:border-[#904af2]/60`}
    >
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-white text-sm">
          {icon}
          <span className="font-medium">{label}</span>
        </label>
        <span className="text-[#904af2] font-medium text-sm">
          {name === 'seasonalVariation'
            ? `${(inputs[name] * 100).toFixed(0)}%`
            : `${inputs[name]}${unit}`}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={inputs[name]}
          onChange={(e) => setInputs(prev => ({ ...prev, [name]: Number(e.target.value) }))}
          onFocus={() => setActiveInput(name)}
          onBlur={() => setActiveInput(null)}
          className="w-full h-2 bg-transparent cursor-pointer appearance-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-[#904af2]
            [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(144,74,242,0.3)]
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:duration-300
            [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_0_5px_rgba(144,74,242,0.3)]
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
        <div className="absolute top-1/2 h-1 bg-[#904af2]/20 rounded-full w-full -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );

  return (
    <section className="py-12 px-4 relative overflow-hidden bg-black" ref={calculatorRef}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-montserrat font-black mb-2">
            <span className="text-white">CALCULATE YOUR</span>{' '}
            <span className="gradient-text">ROI</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center my-4">
            {Object.keys(presets).map((preset) => (
              <button
                key={preset}
                onClick={() => setInputs(presets[preset])}
                className="px-3 py-1 text-sm rounded-full bg-[#904af2]/20 border border-[#904af2]/30 hover:bg-[#904af2]/30 transition"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 items-start">
          <div className="space-y-3">
            {renderParameter('dailyCalls', <Calculator className="w-4 h-4 text-[#904af2]" />, 'Daily Call Volume', 0, 1000, 10)}
            {renderParameter('employees', <Users className="w-4 h-4 text-[#904af2]" />, 'Number of Employees', 1, 50, 1)}
            {renderParameter('handleTime', <Clock className="w-4 h-4 text-[#904af2]" />, 'Average Handle Time', 30, 300, 5, 's')}
            {renderParameter('seasonalVariation', <TrendingUp className="w-4 h-4 text-[#904af2]" />, 'Seasonal Variation', 0, 0.5, 0.05)}
          </div>

          <div className="space-y-4">
            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-[#904af2]/20">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#904af2]" />
                Projected ROI & Savings
              </h3>
              <div className="h-[300px] relative">
                {isCalculating ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="w-6 h-6 border-3 border-[#904af2]/30 border-t-[#904af2] rounded-full animate-spin" />
                  </div>
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {roiData[5] && (
                <>
                  <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-[#904af2]/20">
                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                      <Percent className="w-3 h-3 text-[#904af2]" />
                      <h4 className="text-xs">6-Month ROI</h4>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {roiData[5].roi.toFixed(1)}%
                    </p>
                  </div>
                  <div className="bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-[#904af2]/20">
                    <div className="flex items-center gap-2 mb-1 text-gray-400">
                      <DollarSign className="w-3 h-3 text-[#00e5ff]" />
                      <h4 className="text-xs">Total Savings</h4>
                    </div>
                    <p className="text-xl font-bold text-white">
                      ${Math.round(roiData[5].savings).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
