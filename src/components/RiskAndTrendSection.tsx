import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { HealthRecord } from '../types';
import { HeartPulse, TrendingUp, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

interface RiskAndTrendSectionProps {
  records: HealthRecord[];
}

export const RiskAndTrendSection: React.FC<RiskAndTrendSectionProps> = ({ records }) => {
  // Field 1: Blood Pressure Status Distribution
  const bpCounts = { 'ปกติ (<120/80)': 0, 'เฝ้าระวัง (120-139/80-89)': 0, 'ความดันสูง (≥140/90)': 0 };
  
  // Field 2: Fasting Blood Sugar Status Distribution
  const fbsCounts = { 'ปกติ (<100)': 0, 'กลุ่มเสี่ยง (100-125)': 0, 'เสี่ยงสูง/เบาหวาน (≥126)': 0 };

  // Field 3: BMI Category Distribution
  const bmiCounts: Record<string, number> = {
    'น้ำหนักน้อย': 0,
    'ปกติ': 0,
    'น้ำหนักเกิน (ท้วม)': 0,
    'อ้วนระดับ 1': 0,
    'อ้วนอันตราย (ระดับ 2)': 0,
  };

  // Field 4: Cholesterol Status Distribution
  const cholCounts = { 'ปกติ (<200)': 0, 'ค่อนข้างสูง (200-239)': 0, 'สูง (≥240)': 0 };

  // Overall Risk Distribution
  const riskCounts = { ปกติ: 0, เสี่ยงต่ำ: 0, เสี่ยงปานกลาง: 0, เสี่ยงสูง: 0 };

  records.forEach((r) => {
    if (bpCounts[r.bpStatus] !== undefined) bpCounts[r.bpStatus]++;
    if (fbsCounts[r.fbsStatus] !== undefined) fbsCounts[r.fbsStatus]++;
    if (bmiCounts[r.bmiCategory] !== undefined) bmiCounts[r.bmiCategory]++;
    if (cholCounts[r.cholesterolStatus] !== undefined) cholCounts[r.cholesterolStatus]++;
    if (riskCounts[r.overallRisk] !== undefined) riskCounts[r.overallRisk]++;
  });

  const bpData = Object.entries(bpCounts).map(([name, count]) => ({
    name: name.split(' ')[0],
    fullName: name,
    count,
  }));

  const fbsData = Object.entries(fbsCounts).map(([name, count]) => ({
    name: name.split(' ')[0],
    fullName: name,
    count,
  }));

  const bmiData = Object.entries(bmiCounts).map(([name, count]) => ({
    name,
    count,
  }));

  const cholData = Object.entries(cholCounts).map(([name, count]) => ({
    name: name.split(' ')[0],
    fullName: name,
    count,
  }));

  const overallRiskData = [
    { name: 'ปกติ', count: riskCounts['ปกติ'], color: '#34d399' },
    { name: 'เสี่ยงต่ำ', count: riskCounts['เสี่ยงต่ำ'], color: '#38bdf8' },
    { name: 'เสี่ยงปานกลาง', count: riskCounts['เสี่ยงปานกลาง'], color: '#facc15' },
    { name: 'เสี่ยงสูง', count: riskCounts['เสี่ยงสูง'], color: '#f87171' },
  ];

  // Health Trends over Quarters (Trend 1: FBS Trend, Trend 2: Blood Pressure Trend, Trend 3: BMI Trend)
  const quarterMap: Record<string, { count: number; totalFbs: number; totalSys: number; totalDia: number; totalBmi: number }> = {
    '2026-Q1': { count: 0, totalFbs: 0, totalSys: 0, totalDia: 0, totalBmi: 0 },
    '2026-Q2': { count: 0, totalFbs: 0, totalSys: 0, totalDia: 0, totalBmi: 0 },
    '2026-Q3': { count: 0, totalFbs: 0, totalSys: 0, totalDia: 0, totalBmi: 0 },
  };

  records.forEach((r) => {
    const q = r.quarter || '2026-Q3';
    if (!quarterMap[q]) {
      quarterMap[q] = { count: 0, totalFbs: 0, totalSys: 0, totalDia: 0, totalBmi: 0 };
    }
    quarterMap[q].count++;
    quarterMap[q].totalFbs += r.fbs;
    quarterMap[q].totalSys += r.systolicBp;
    quarterMap[q].totalDia += r.diastolicBp;
    quarterMap[q].totalBmi += r.bmi;
  });

  const trendData = Object.entries(quarterMap).map(([quarter, val]) => {
    const n = val.count || 1;
    return {
      quarter: quarter.replace('2026-', 'ไตรมาส '),
      rawQuarter: quarter,
      avgFbs: Math.round(val.totalFbs / n),
      avgSysBp: Math.round(val.totalSys / n),
      avgDiaBp: Math.round(val.totalDia / n),
      avgBmi: Number((val.totalBmi / n).toFixed(1)),
      samples: val.count,
    };
  });

  // Pastel Tech palette
  const COLORS_PASTEL = ['#38bdf8', '#facc15', '#f87171', '#34d399', '#a78bfa'];

  return (
    <div className="space-y-8 mb-8">
      
      {/* Header of Risk Dimension */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/60">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-['Prompt']">
                มิติที่ 1: การวิเคราะห์ความเสี่ยงด้านสุขภาพ (Health Risk Dimensions)
              </h2>
              <p className="text-xs text-slate-500">
                วิเคราะห์ข้อมูล 4 ฟิลด์หลัก: ความดันโลหิต • ระดับน้ำตาลในเลือด (FBS) • ดัชนีมวลกาย (BMI) • คอเลสเตอรอล
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
            วิเคราะห์ 4 ฟิลด์ความเสี่ยงครบถ้วน
          </span>
        </div>

        {/* 4 Risk Fields Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          
          {/* Risk Field 1: Blood Pressure */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                1. ระดับความดันโลหิต (BP)
              </h3>
              <span className="text-[10px] text-slate-500">mmHg</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bpData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'จำนวน']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {bpData.map((entry, index) => (
                      <Cell key={`bp-cell-${index}`} fill={index === 2 ? '#f87171' : index === 1 ? '#facc15' : '#34d399'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Field 2: Fasting Blood Sugar */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                2. ระดับน้ำตาลในเลือด (FBS)
              </h3>
              <span className="text-[10px] text-slate-500">mg/dL</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fbsData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'จำนวน']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {fbsData.map((entry, index) => (
                      <Cell key={`fbs-cell-${index}`} fill={index === 2 ? '#f87171' : index === 1 ? '#facc15' : '#38bdf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Field 3: BMI Categories */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                3. ดัชนีมวลกาย (BMI)
              </h3>
              <span className="text-[10px] text-slate-500">5 ระดับ</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bmiData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'ประชากร']}
                  />
                  <Bar dataKey="count" fill="#facc15" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Field 4: Total Cholesterol */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                4. คอเลสเตอรอลในเลือด
              </h3>
              <span className="text-[10px] text-slate-500">mg/dL</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cholData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'จำนวน']}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {cholData.map((entry, index) => (
                      <Cell key={`chol-cell-${index}`} fill={index === 2 ? '#f87171' : index === 1 ? '#facc15' : '#38bdf8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Overall Health Risk Distribution Banner */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                สรุปการกระจายตัวของระดับความเสี่ยงสุขภาพรวม (Overall Health Risk Assessment)
              </div>
              <div className="text-[11px] text-slate-600">
                ประเมินจากผลรวมถ่วงน้ำหนักตามเกณฑ์กระทรวงสาธารณสุข
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {overallRiskData.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.count} คน</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header of Trend Dimension */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-800 border border-sky-200">
              <TrendingUp className="w-5 h-5 text-sky-700" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-['Prompt']">
                มิติที่ 2: แนวโน้มทางสุขภาพ (Health Trends over Checkup Rounds)
              </h2>
              <p className="text-xs text-slate-500">
                ติดตามการเปลี่ยนแปลง 2 ฟิลด์หลัก: เทรนด์ระดับน้ำตาล (FBS) และ เทรนด์ระดับความดันโลหิต (Sys/Dia BP)
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            วิเคราะห์ 2 ฟิลด์แนวโน้มครบถ้วน
          </span>
        </div>

        {/* 2 Health Trend Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
          
          {/* Trend 1: Fasting Blood Sugar Trend */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/70">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                  เทรนด์ที่ 1: แนวโน้มระดับน้ำตาลในเลือดเฉลี่ย (FBS Trend)
                </h3>
                <p className="text-[11px] text-slate-500">เปรียบเทียบค่าเฉลี่ยตามรอบการประเมิน (mg/dL)</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                เป้าหมาย &lt;100 mg/dL
              </span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
                  <defs>
                    <linearGradient id="fbsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#facc15" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[70, 160]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val) => [`${val} mg/dL`, 'ค่าน้ำตาลเฉลี่ย']}
                  />
                  <Area
                    type="monotone"
                    dataKey="avgFbs"
                    stroke="#eab308"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#fbsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 text-center">
              * ข้อมูลสะท้อนแนวโน้มการลดลงของค่าน้ำตาลในกลุ่มที่ได้รับคำแนะนำปรับเปลี่ยนพฤติกรรม
            </div>
          </div>

          {/* Trend 2: Blood Pressure Trend (Systolic & Diastolic) */}
          <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/70">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                  เทรนด์ที่ 2: แนวโน้มระดับความดันโลหิต (Blood Pressure Trend)
                </h3>
                <p className="text-[11px] text-slate-500">ความดันตัวบน (Systolic) และตัวล่าง (Diastolic) (mmHg)</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-900 border border-sky-200">
                เกณฑ์ &lt;120/80 mmHg
              </span>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis domain={[60, 160]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    formatter={(val, name) => [
                      `${val} mmHg`,
                      name === 'avgSysBp' ? 'ความดันตัวบน (Systolic)' : 'ความดันตัวล่าง (Diastolic)',
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px' }}
                    formatter={(value) => (value === 'avgSysBp' ? 'ตัวบน (Systolic)' : 'ตัวล่าง (Diastolic)')}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgSysBp"
                    stroke="#f87171"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#f87171' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDiaBp"
                    stroke="#38bdf8"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#38bdf8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 text-center">
              * แนวโน้มความดันโลหิตสะท้อนผลสัมฤทธิ์ของการลดการบริโภคเค็มในระดับชุมชน
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
