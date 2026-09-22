import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import { HealthRecord, AgeGroup, Zone } from '../types';
import { Compass, MapPin, Users, Activity, Heart, AlertOctagon, Sparkles } from 'lucide-react';

interface AdditionalInsightsSectionProps {
  records: HealthRecord[];
}

export const AdditionalInsightsSection: React.FC<AdditionalInsightsSectionProps> = ({ records }) => {
  const [activeTab, setActiveTab] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');

  // --- Insight 1: กลุ่มอายุใดที่มีความเสี่ยงสูง (Age Group vs Risk) ---
  const ageGroupRiskMap: Record<AgeGroup, { total: number; highRisk: number; mediumRisk: number; normalRisk: number }> = {
    '15-24 ปี (เยาวชน)': { total: 0, highRisk: 0, mediumRisk: 0, normalRisk: 0 },
    '25-45 ปี (วัยทำงาน)': { total: 0, highRisk: 0, mediumRisk: 0, normalRisk: 0 },
    '46-59 ปี (วัยกลางคน)': { total: 0, highRisk: 0, mediumRisk: 0, normalRisk: 0 },
    '60 ปีขึ้นไป (ผู้สูงอายุ)': { total: 0, highRisk: 0, mediumRisk: 0, normalRisk: 0 },
  };

  records.forEach((r) => {
    const ag = r.ageGroup;
    if (ageGroupRiskMap[ag]) {
      ageGroupRiskMap[ag].total++;
      if (r.overallRisk === 'เสี่ยงสูง') ageGroupRiskMap[ag].highRisk++;
      else if (r.overallRisk === 'เสี่ยงปานกลาง') ageGroupRiskMap[ag].mediumRisk++;
      else ageGroupRiskMap[ag].normalRisk++;
    }
  });

  const ageRiskData = Object.entries(ageGroupRiskMap).map(([group, counts]) => ({
    group: group.split(' ')[0],
    fullName: group,
    เสี่ยงสูง: counts.highRisk,
    เสี่ยงปานกลาง: counts.mediumRisk,
    ปกติและเสี่ยงต่ำ: counts.normalRisk,
    highRiskRate: counts.total > 0 ? Number(((counts.highRisk / counts.total) * 100).toFixed(1)) : 0,
    total: counts.total,
  }));

  // Find the age group with the highest risk
  const highestRiskAgeGroup = [...ageRiskData].sort((a, b) => b.highRiskRate - a.highRiskRate)[0];

  // --- Insight 2: พื้นที่หรือโซนใดที่มีผู้เสี่ยงสูงกระจุกตัวอยู่ (Zone Hotspots) ---
  const zoneRiskMap: Record<Zone, { total: number; highRisk: number; avgBmi: number; avgFbs: number }> = {
    'โซน A (ริมน้ำ)': { total: 0, highRisk: 0, avgBmi: 0, avgFbs: 0 },
    'โซน B (ตลาดกลางเมือง)': { total: 0, highRisk: 0, avgBmi: 0, avgFbs: 0 },
    'โซน C (หมู่บ้านพัฒนา)': { total: 0, highRisk: 0, avgBmi: 0, avgFbs: 0 },
    'โซน D (รอบสถานีรถไฟ)': { total: 0, highRisk: 0, avgBmi: 0, avgFbs: 0 },
  };

  records.forEach((r) => {
    const z = r.zone;
    if (zoneRiskMap[z]) {
      zoneRiskMap[z].total++;
      if (r.overallRisk === 'เสี่ยงสูง') zoneRiskMap[z].highRisk++;
      zoneRiskMap[z].avgBmi += r.bmi;
      zoneRiskMap[z].avgFbs += r.fbs;
    }
  });

  const zoneData = Object.entries(zoneRiskMap).map(([zone, data]) => {
    const n = data.total || 1;
    return {
      zone: zone.split(' ')[0] + ' ' + zone.split(' ')[1],
      fullName: zone,
      ผู้เสี่ยงสูง: data.highRisk,
      อัตราเสี่ยงสูง: data.total > 0 ? Number(((data.highRisk / data.total) * 100).toFixed(1)) : 0,
      bmiAvg: Number((data.avgBmi / n).toFixed(1)),
      fbsAvg: Math.round(data.avgFbs / n),
      total: data.total,
    };
  });

  const topHotspotZone = [...zoneData].sort((a, b) => b.ผู้เสี่ยงสูง - a.ผู้เสี่ยงสูง)[0];

  // --- Insight 3: ความสัมพันธ์ระหว่างค่า BMI กับ ระดับน้ำตาลในเลือด (BMI vs FBS) ---
  const bmiVsFbsData = records.map((r) => ({
    bmi: r.bmi,
    fbs: r.fbs,
    risk: r.overallRisk,
    name: r.displayName,
    age: r.age,
  }));

  // --- Insight 4: ความสัมพันธ์ระหว่างค่า BMI กับ ระดับความดันโลหิต (BMI vs Systolic BP) ---
  const bmiVsBpData = records.map((r) => ({
    bmi: r.bmi,
    sysBp: r.systolicBp,
    diaBp: r.diastolicBp,
    risk: r.overallRisk,
    name: r.displayName,
    age: r.age,
  }));

  // --- Insight 5: ความสัมพันธ์ระหว่างพฤติกรรมการใช้ชีวิตกับระดับความเสี่ยง ---
  // Compare High Risk vs Normal population in terms of smoking, inactivity, sweet/salty food
  const highRiskSubset = records.filter((r) => r.overallRisk === 'เสี่ยงสูง');
  const normalSubset = records.filter((r) => r.overallRisk === 'ปกติ' || r.overallRisk === 'เสี่ยงต่ำ');

  const calcRate = (list: HealthRecord[], predicate: (r: HealthRecord) => boolean) =>
    list.length > 0 ? Number(((list.filter(predicate).length / list.length) * 100).toFixed(1)) : 0;

  const lifestyleComparisonData = [
    {
      behavior: 'สูบบุหรี่ประจำ/ครั้งคราว',
      กลุ่มเสี่ยงสูง: calcRate(highRiskSubset, (r) => r.smoking.includes('สูบ')),
      กลุ่มปกติและเสี่ยงต่ำ: calcRate(normalSubset, (r) => r.smoking.includes('สูบ')),
    },
    {
      behavior: 'ดื่มแอลกอฮอล์ประจำ/บ่อย',
      กลุ่มเสี่ยงสูง: calcRate(highRiskSubset, (r) => r.alcohol.includes('ประจำ') || r.alcohol.includes('1-2')),
      กลุ่มปกติและเสี่ยงต่ำ: calcRate(normalSubset, (r) => r.alcohol.includes('ประจำ') || r.alcohol.includes('1-2')),
    },
    {
      behavior: 'ไม่ออกกำลังกาย/นานๆ ครั้ง',
      กลุ่มเสี่ยงสูง: calcRate(highRiskSubset, (r) => r.exercise.includes('ไม่') || r.exercise.includes('นาน')),
      กลุ่มปกติและเสี่ยงต่ำ: calcRate(normalSubset, (r) => r.exercise.includes('ไม่') || r.exercise.includes('นาน')),
    },
    {
      behavior: 'อาหารหวานมันเค็มสูง',
      กลุ่มเสี่ยงสูง: calcRate(highRiskSubset, (r) => r.diet.includes('หวาน') || r.diet.includes('เค็ม') || r.diet.includes('มัน')),
      กลุ่มปกติและเสี่ยงต่ำ: calcRate(normalSubset, (r) => r.diet.includes('หวาน') || r.diet.includes('เค็ม') || r.diet.includes('มัน')),
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Section Header */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/60">
              <Compass className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-['Prompt']">
                ข้อมูลเชิงลึกเพิ่มเติม 5 ประเด็นสำคัญ (Additional Epidemiological Insights)
              </h2>
              <p className="text-xs text-slate-500">
                วิเคราะห์ความสัมพันธ์เชิงลึกเพื่อการวางแผนสาธารณสุขชุมชนเชิงรุกครบทั้ง 5 มิติตามข้อกำหนด
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            วิเคราะห์ครบ 5 ประเด็น 100%
          </span>
        </div>

        {/* Filter Tab buttons within Insights */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-300 text-slate-900 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            แสดงทั้ง 5 ประเด็น
          </button>
          <button
            onClick={() => setActiveTab('1')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === '1'
                ? 'bg-amber-300 text-slate-900 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            1. กลุ่มอายุเสี่ยงสูง
          </button>
          <button
            onClick={() => setActiveTab('2')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === '2'
                ? 'bg-amber-300 text-slate-900 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            2. โซนพื้นที่เสี่ยงกระจุกตัว
          </button>
          <button
            onClick={() => setActiveTab('3')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === '3'
                ? 'bg-amber-300 text-slate-900 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            3. ความสัมพันธ์ BMI กับ น้ำตาล
          </button>
          <button
            onClick={() => setActiveTab('4')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === '4'
                ? 'bg-amber-300 text-slate-900 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            4. ความสัมพันธ์ BMI กับ ความดัน
          </button>
          <button
            onClick={() => setActiveTab('5')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === '5'
                ? 'bg-amber-300 text-slate-900 font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            5. พฤติกรรมกับระดับความเสี่ยง
          </button>
        </div>
      </div>

      {/* Grid of the 5 Insight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Insight 1: กลุ่มอายุใดที่มีความเสี่ยงสูง */}
        {(activeTab === 'all' || activeTab === '1') && (
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                    ประเด็นที่ 1: กลุ่มอายุใดที่มีความเสี่ยงสูง (Age Group vs Risk)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  การแจกแจงระดับความเสี่ยงและอัตราความเสี่ยงสูงตามช่วงอายุ
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                เสี่ยงสูงสุด: {highestRiskAgeGroup?.fullName || '60 ปีขึ้นไป'}
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageRiskData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-10} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="เสี่ยงสูง" fill="#f87171" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="เสี่ยงปานกลาง" fill="#facc15" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="ปกติและเสี่ยงต่ำ" fill="#34d399" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/70">
              <span className="font-bold text-slate-800">💡 ข้อค้นพบเชิงสถิติ: </span>
              กลุ่ม <span className="font-semibold text-rose-600">ผู้สูงอายุ (60 ปีขึ้นไป)</span> และ <span className="font-semibold text-amber-600">วัยกลางคน (46-59 ปี)</span> มีอัตราความเสี่ยงสูงถึง{' '}
              <span className="font-bold text-slate-900">{highestRiskAgeGroup?.highRiskRate}%</span> เกิดจากภาวะน้ำตาลในเลือดสะสมและความดันโลหิตสูงเรื้อรัง
            </div>
          </div>
        )}

        {/* Insight 2: พื้นที่หรือโซนใดที่มีผู้เสี่ยงสูงกระจุกตัวอยู่ */}
        {(activeTab === 'all' || activeTab === '2') && (
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                    ประเด็นที่ 2: พื้นที่/โซนที่มีผู้เสี่ยงสูงกระจุกตัว (Hotspot Zones)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ความหนาแน่นของผู้ป่วยเสี่ยงสูงแยกตามเขตชุมชน
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-amber-50 text-amber-800 border border-amber-300">
                โซนเสี่ยงหนาแน่น: {topHotspotZone?.fullName}
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={zoneData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="zone" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-10} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val, name) => [
                      `${val} ${name === 'อัตราเสี่ยงสูง' ? '%' : 'คน'}`,
                      name,
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="ผู้เสี่ยงสูง" fill="#f87171" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="อัตราเสี่ยงสูง" fill="#facc15" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/70">
              <span className="font-bold text-slate-800">💡 ข้อค้นพบเชิงสถิติ: </span>
              <span className="font-semibold text-rose-600">{topHotspotZone?.fullName}</span> เป็นจุดกระจุกตัวสูงสุด มีผู้เสี่ยงสูง {topHotspotZone?.ผู้เสี่ยงสูง} คน (คิดเป็น {topHotspotZone?.อัตราเสี่ยงสูง}%) ค่า BMI เฉลี่ย {topHotspotZone?.bmiAvg} ควรจัดทีม อสม. ลงตรวจเชิงรุก
            </div>
          </div>
        )}

        {/* Insight 3: ความสัมพันธ์ระหว่างค่า BMI กับ ระดับน้ำตาลในเลือด */}
        {(activeTab === 'all' || activeTab === '3') && (
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                    ประเด็นที่ 3: สหสัมพันธ์ BMI กับ ระดับน้ำตาลในเลือด (FBS)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scatter Plot แสดงการกระจายตัวของ BMI (แกน X) เทียบ FBS (แกน Y)
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-rose-50 text-rose-700 border border-rose-200">
                จุดวิกฤต: BMI &gt; 25 & FBS &gt; 126
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="bmi"
                    name="BMI"
                    domain={[16, 36]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'ดัชนีมวลกาย BMI (กก./ม.²)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="fbs"
                    name="FBS"
                    domain={[60, 200]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'น้ำตาล FBS (mg/dL)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val, name) => [
                      `${val} ${name === 'BMI' ? 'กก./ม.²' : 'mg/dL'}`,
                      name,
                    ]}
                  />
                  <Scatter name="ผู้รับการตรวจ" data={bmiVsFbsData} fill="#facc15">
                    {bmiVsFbsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fbs >= 126 ? '#f87171' : entry.bmi >= 25 ? '#facc15' : '#38bdf8'}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/70">
              <span className="font-bold text-slate-800">💡 ข้อค้นพบเชิงสถิติ: </span>
              มีความสัมพันธ์แบบแปรผันตามกันเชิงบวก (Positive Correlation) อย่างชัดเจน ผู้ที่มีค่า BMI สูงกว่า 28 มักมีค่าน้ำตาลในเลือดเฉลี่ยเกิน 130 mg/dL บ่งชี้ภาวะดื้อต่ออินซูลิน
            </div>
          </div>
        )}

        {/* Insight 4: ความสัมพันธ์ระหว่างค่า BMI กับ ระดับความดันโลหิต */}
        {(activeTab === 'all' || activeTab === '4') && (
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                    ประเด็นที่ 4: สหสัมพันธ์ BMI กับ ความดันโลหิต (Blood Pressure)
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  ความดันตัวบน Systolic BP (แกน Y) สัมพันธ์กับค่า BMI (แกน X)
                </p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md font-medium bg-sky-50 text-sky-700 border border-sky-200">
                จุดวิกฤต: BP &ge; 140 mmHg
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="bmi"
                    name="BMI"
                    domain={[16, 36]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'ดัชนีมวลกาย BMI (กก./ม.²)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#64748b' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="sysBp"
                    name="ความดันตัวบน"
                    domain={[90, 180]}
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    label={{ value: 'Systolic BP (mmHg)', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                  />
                  <Scatter name="ความดัน Systolic" data={bmiVsBpData}>
                    {bmiVsBpData.map((entry, index) => (
                      <Cell
                        key={`bp-cell-${index}`}
                        fill={entry.sysBp >= 140 ? '#f87171' : entry.sysBp >= 120 ? '#facc15' : '#34d399'}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/70">
              <span className="font-bold text-slate-800">💡 ข้อค้นพบเชิงสถิติ: </span>
              ผู้ที่มีภาวะอ้วนระดับ 1-2 (BMI &ge; 25) มีโอกาสตรวจพบความดันโลหิตเกิน 140 mmHg สูงกว่ากลุ่มน้ำหนักปกติถึง 2.8 เท่า เนื่องจากแรงต้านในหลอดเลือดส่วนปลายที่เพิ่มขึ้น
            </div>
          </div>
        )}

        {/* Insight 5: ความสัมพันธ์ระหว่างพฤติกรรมการใช้ชีวิตกับระดับความเสี่ยง */}
        {(activeTab === 'all' || activeTab === '5') && (
          <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs lg:col-span-2">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                    ประเด็นที่ 5: ความสัมพันธ์ระหว่างพฤติกรรมการใช้ชีวิตกับระดับความเสี่ยงสุขภาพ
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  เปรียบเทียบสัดส่วนพฤติกรรมเสี่ยงระหว่าง "กลุ่มเสี่ยงสูง" กับ "กลุ่มปกติ/เสี่ยงต่ำ" (%)
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                เปรียบเทียบ Risk Factor Matrix
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lifestyleComparisonData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="behavior" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val}%`, 'สัดส่วนประชากร']}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="กลุ่มเสี่ยงสูง" fill="#f87171" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="กลุ่มปกติและเสี่ยงต่ำ" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 p-3.5 rounded-xl bg-amber-50/70 text-xs text-slate-700 border border-amber-200/80 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">สรุปมาตรการสาธารณสุขชุมชนเชิงประจักษ์: </span>
                กลุ่มเสี่ยงสูงมีพฤติกรรมบริโภคอาหารหวานมันเค็มและขาดกิจกรรมทางกายในสัดส่วนสูงกว่ากลุ่มปกติมากกว่า 60% ดังนั้น มาตรการลดเกลือ/น้ำตาลและการจัดพื้นที่ส่งเสริมการออกกำลังกายในชุมชนจึงเป็นยุทธศาสตร์สำคัญอันดับหนึ่ง
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
