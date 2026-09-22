import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { HealthRecord } from '../types';
import { Flame, Wine, Dumbbell, Utensils, Moon, CheckCircle2 } from 'lucide-react';

interface BehaviorSectionProps {
  records: HealthRecord[];
}

export const BehaviorSection: React.FC<BehaviorSectionProps> = ({ records }) => {
  // Behavior 1: Smoking status
  const smokingCounts: Record<string, number> = {
    'ไม่สูบ': 0,
    'เคยสูบ (เลิกแล้ว)': 0,
    'สูบเป็นครั้งคราว': 0,
    'สูบเป็นประจำ': 0,
  };

  // Behavior 2: Alcohol consumption
  const alcoholCounts: Record<string, number> = {
    'ไม่ดื่ม': 0,
    'ดื่มเฉพาะเทศกาล': 0,
    'ดื่มสัปดาห์ละ 1-2 ครั้ง': 0,
    'ดื่มเป็นประจำ': 0,
  };

  // Behavior 3: Physical Exercise
  const exerciseCounts: Record<string, number> = {
    'สม่ำเสมอ (≥150 นาที/สัปดาห์)': 0,
    'ปานกลาง (1-2 วัน/สัปดาห์)': 0,
    'นานๆ ครั้ง': 0,
    'ไม่ออกกำลังกาย': 0,
  };

  // Behavior 4: Dietary Habits (Sweet, Salty, Fatty)
  const dietCounts: Record<string, number> = {
    'อาหารสุขภาพ/สมดุล': 0,
    'ชอบรสหวาน': 0,
    'ชอบรสเค็มจัด': 0,
    'ของทอด/ไขมันสูง': 0,
    'หวานมันเค็มสูง': 0,
  };

  // Sleep hours
  const sleepGroups = {
    'น้อยกว่า 6 ชม. (นอนน้อย)': 0,
    '6 - 8 ชม. (เหมาะสม)': 0,
    'มากกว่า 8 ชม.': 0,
  };

  records.forEach((r) => {
    if (smokingCounts[r.smoking] !== undefined) smokingCounts[r.smoking]++;
    if (alcoholCounts[r.alcohol] !== undefined) alcoholCounts[r.alcohol]++;
    if (exerciseCounts[r.exercise] !== undefined) exerciseCounts[r.exercise]++;
    if (dietCounts[r.diet] !== undefined) dietCounts[r.diet]++;

    if (r.sleepHours < 6) sleepGroups['น้อยกว่า 6 ชม. (นอนน้อย)']++;
    else if (r.sleepHours <= 8) sleepGroups['6 - 8 ชม. (เหมาะสม)']++;
    else sleepGroups['มากกว่า 8 ชม.']++;
  });

  const smokingData = Object.entries(smokingCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const alcoholData = Object.entries(alcoholCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const exerciseData = Object.entries(exerciseCounts).map(([name, value]) => ({
    name: name.split(' ')[0],
    fullName: name,
    value,
  }));

  const dietData = Object.entries(dietCounts).map(([name, value]) => ({
    name,
    value,
  }));

  const sleepData = Object.entries(sleepGroups).map(([name, value]) => ({
    name,
    value,
  }));

  const SMOKING_COLORS = ['#34d399', '#38bdf8', '#facc15', '#f87171'];
  const ALCOHOL_COLORS = ['#34d399', '#38bdf8', '#facc15', '#f87171'];
  const EXERCISE_COLORS = ['#34d399', '#38bdf8', '#facc15', '#f87171'];
  const DIET_COLORS = ['#34d399', '#facc15', '#fb923c', '#f87171', '#ef4444'];

  return (
    <div className="space-y-6 mb-8">
      {/* Header of Behavior Section */}
      <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/60">
              <Flame className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-['Prompt']">
                มิติที่ 3: การวิเคราะห์พฤติกรรมสุขภาพ (Health Behaviors Analysis)
              </h2>
              <p className="text-xs text-slate-500">
                วิเคราะห์พฤติกรรมเสี่ยง 4 ฟิลด์หลัก: การสูบบุหรี่ • การดื่มเครื่องดื่มแอลกอฮอล์ • การออกกำลังกาย • พฤติกรรมการบริโภคอาหาร (หวาน มัน เค็ม)
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            วิเคราะห์ 4 ฟิลด์พฤติกรรมครบถ้วน
          </span>
        </div>

        {/* 4 Health Behavior Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          
          {/* Behavior 1: Smoking */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                  1. การสูบบุหรี่ (Smoking)
                </h3>
              </div>
              <span className="text-[10px] text-slate-500">4 กลุ่ม</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={smokingData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={55}
                    paddingAngle={3}
                  >
                    {smokingData.map((entry, index) => (
                      <Cell key={`smoking-cell-${index}`} fill={SMOKING_COLORS[index % SMOKING_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'จำนวน']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 text-[10px] text-slate-600 mt-1 border-t border-slate-200/60 pt-2">
              {smokingData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SMOKING_COLORS[idx] }} />
                    <span className="truncate max-w-[110px]">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value} คน</span>
                </div>
              ))}
            </div>
          </div>

          {/* Behavior 2: Alcohol */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                  2. ดื่มแอลกอฮอล์ (Alcohol)
                </h3>
              </div>
              <span className="text-[10px] text-slate-500">ความถี่</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alcoholData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#475569' }} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'จำนวน']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {alcoholData.map((entry, index) => (
                      <Cell key={`alc-cell-${index}`} fill={ALCOHOL_COLORS[index % ALCOHOL_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 text-center border-t border-slate-200/60 pt-2">
              * แอลกอฮอล์ส่งผลโดยตรงต่อระดับความดันและไขมันในตับ
            </div>
          </div>

          {/* Behavior 3: Exercise */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-sky-600" />
                <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                  3. การออกกำลังกาย
                </h3>
              </div>
              <span className="text-[10px] text-slate-500">กิจกรรมทางกาย</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={exerciseData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'จำนวน']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {exerciseData.map((entry, index) => (
                      <Cell key={`ex-cell-${index}`} fill={EXERCISE_COLORS[index % EXERCISE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 text-center border-t border-slate-200/60 pt-2">
              * เกณฑ์ สธ.: แอคทีฟสะสม ≥ 150 นาที/สัปดาห์
            </div>
          </div>

          {/* Behavior 4: Diet Habits */}
          <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-700 font-['Prompt']">
                  4. พฤติกรรมบริโภคอาหาร
                </h3>
              </div>
              <span className="text-[10px] text-slate-500">หวาน/มัน/เค็ม</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dietData} layout="vertical" margin={{ top: 5, right: 15, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 8.5, fill: '#475569' }} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }}
                    formatter={(val) => [`${val} คน`, 'ประชากร']}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {dietData.map((entry, index) => (
                      <Cell key={`diet-cell-${index}`} fill={DIET_COLORS[index % DIET_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 text-center border-t border-slate-200/60 pt-2">
              * หวานนำเร่งเบาหวาน เค็มนำเร่งความดัน
            </div>
          </div>

        </div>

        {/* Supplemental Lifestyle insight: Sleep Duration */}
        <div className="mt-5 p-4 rounded-xl bg-sky-50/70 border border-sky-200/70 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-sky-700 flex-shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-800">
                พฤติกรรมการนอนหลับเฉลี่ยต่อวัน (Sleep Duration Distribution)
              </div>
              <div className="text-[11px] text-slate-600">
                การนอนน้อยกว่า 6 ชั่วโมงสัมพันธ์กับภาวะดื้อต่ออินซูลินและความดันโลหิตสูง
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {sleepData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs shadow-2xs">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: idx === 0 ? '#f87171' : idx === 1 ? '#34d399' : '#38bdf8' }}
                />
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.value} คน</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
