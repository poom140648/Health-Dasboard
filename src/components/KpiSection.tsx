import React from 'react';
import { Users, Scale, Droplet, Heart, AlertTriangle, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { HealthStatistics } from '../types';

interface KpiSectionProps {
  stats: HealthStatistics;
}

export const KpiSection: React.FC<KpiSectionProps> = ({ stats }) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-amber-200 text-amber-900">
            <Activity className="w-4 h-4 text-amber-700" />
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 font-['Prompt']">
            ภาพรวมตัวชี้วัดสุขภาพสำคัญ (Health Overview & KPIs)
          </h2>
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline-block">
          ประมวลผลสถิติ: จำนวนรวม • ค่าเฉลี่ย • ต่ำสุด/สูงสุด • ร้อยละ/สัดส่วน
        </span>
      </div>

      {/* Grid of KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Count (จำนวนรวม & สัดส่วนเพศ) */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              1. จำนวนรวมประชากร (Total Count)
            </span>
            <div className="w-9 h-9 rounded-xl bg-sky-100/70 border border-sky-200/80 flex items-center justify-center text-sky-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 font-['Prompt']">
              {stats.totalCount.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-slate-500">คน</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>สัดส่วนเพศ:</span>
            <span className="font-medium text-slate-700">
              ชาย {stats.genderRatio.malePercent}% | หญิง {stats.genderRatio.femalePercent}%
            </span>
          </div>
        </div>

        {/* Card 2: Average BMI + Min/Max Range + Overweight % */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              2. ดัชนีมวลกายเฉลี่ย (Avg BMI)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100/80 border border-amber-300/80 flex items-center justify-center text-amber-800">
              <Scale className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 font-['Prompt']">
              {stats.avgBmi || '0.0'}
            </span>
            <span className="text-xs font-medium text-slate-500">กก./ม.²</span>
            <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-800 border border-amber-200">
              เกณฑ์ท้วม
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>ต่ำสุด-สูงสุด (Min/Max):</span>
            <span className="font-semibold text-slate-700">
              {stats.minBmi} - {stats.maxBmi}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>น้ำหนักเกิน (BMI ≥ 23):</span>
            <span className="font-medium text-amber-700">{stats.overweightPercentage}%</span>
          </div>
        </div>

        {/* Card 3: Fasting Blood Sugar (FBS) + Min/Max + Abnormal % */}
        <div className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              3. น้ำตาลในเลือดเฉลี่ย (Avg FBS)
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-700">
              <Droplet className="w-4 h-4 text-rose-600" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-800 font-['Prompt']">
              {stats.avgFbs || 0}
            </span>
            <span className="text-xs font-medium text-slate-500">mg/dL</span>
            <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200">
              เฝ้าระวัง NCDs
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>ต่ำสุด-สูงสุด (Min/Max):</span>
            <span className="font-semibold text-slate-700">
              {stats.minFbs} - {stats.maxFbs} mg/dL
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>น้ำตาลเกินเกณฑ์ (≥100):</span>
            <span className="font-medium text-rose-600">{stats.abnormalFbsPercent}%</span>
          </div>
        </div>

        {/* Card 4: Ratio & Percentage of High Risk (สัดส่วน & ร้อยละกลุ่มเสี่ยงสูง) */}
        <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-xs hover:shadow-sm transition-all relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              4. สัดส่วนกลุ่มเสี่ยงสูง (High Risk %)
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-900 font-['Prompt']">
              {stats.highRiskPercentage}%
            </span>
            <span className="text-xs font-medium text-slate-500">
              ({stats.highRiskCount} จาก {stats.totalCount} คน)
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>ความดันสูงเฉลี่ย (Sys BP):</span>
            <span className="font-semibold text-slate-700">{stats.avgSystolicBp} mmHg</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span>ภาวะความดันสูง (≥140):</span>
            <span className="font-medium text-rose-600">{stats.hypertensionPercent}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
