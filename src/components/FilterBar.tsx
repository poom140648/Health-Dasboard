import React from 'react';
import { Search, Filter, RotateCcw, X, SlidersHorizontal } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalCount,
  filteredCount,
}) => {
  const hasActiveFilters =
    Boolean(filters.searchQuery) ||
    Boolean(filters.gender) ||
    Boolean(filters.ageGroup) ||
    Boolean(filters.zone) ||
    Boolean(filters.riskLevel) ||
    Boolean(filters.fbsStatus) ||
    Boolean(filters.bpStatus) ||
    Boolean(filters.smoking) ||
    Boolean(filters.exercise);

  const update = (key: keyof FilterState, val: string) => {
    onChange({ ...filters, [key]: val });
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-100/90 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col gap-3.5">
        
        {/* Top row: Title, Search, and Reset button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 font-['Prompt']">
                ตัวกรองข้อมูลเชิงหมวดหมู่ (Category Filters)
              </h2>
              <p className="text-xs text-slate-500">
                จำแนกและเจาะลึกกลุ่มเป้าหมายตามเพศ อายุ พื้นที่ ระดับความเสี่ยง และพฤติกรรม
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Box */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="filter-search-input"
                type="text"
                placeholder="ค้นหารหัส หรือ โน้ต..."
                value={filters.searchQuery}
                onChange={(e) => update('searchQuery', e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400 transition-all text-slate-700"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => update('searchQuery', '')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Reset button */}
            {hasActiveFilters && (
              <button
                id="btn-reset-filters"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>ล้างค่า</span>
              </button>
            )}
          </div>
        </div>

        {/* Dropdown selects row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          {/* Gender */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">เพศ (Gender)</label>
            <select
              id="filter-gender-select"
              value={filters.gender}
              onChange={(e) => update('gender', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-sky-50/50 border border-sky-200/70 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="">ทั้งหมด (All)</option>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">กลุ่มอายุ (Age)</label>
            <select
              id="filter-age-select"
              value={filters.ageGroup}
              onChange={(e) => update('ageGroup', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-sky-50/50 border border-sky-200/70 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="">ทั้งหมดทุกช่วงอายุ</option>
              <option value="15-24 ปี (เยาวชน)">15-24 ปี (เยาวชน)</option>
              <option value="25-45 ปี (วัยทำงาน)">25-45 ปี (วัยทำงาน)</option>
              <option value="46-59 ปี (วัยกลางคน)">46-59 ปี (วัยกลางคน)</option>
              <option value="60 ปีขึ้นไป (ผู้สูงอายุ)">60 ปีขึ้นไป (ผู้สูงอายุ)</option>
            </select>
          </div>

          {/* Zone */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">โซนพื้นที่ (Zone)</label>
            <select
              id="filter-zone-select"
              value={filters.zone}
              onChange={(e) => update('zone', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-sky-50/50 border border-sky-200/70 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="">ทุกโซนพื้นที่</option>
              <option value="โซน A (ริมน้ำ)">โซน A (ริมน้ำ)</option>
              <option value="โซน B (ตลาดกลางเมือง)">โซน B (ตลาดกลางเมือง)</option>
              <option value="โซน C (หมู่บ้านพัฒนา)">โซน C (หมู่บ้านพัฒนา)</option>
              <option value="โซน D (รอบสถานีรถไฟ)">โซน D (รอบสถานีรถไฟ)</option>
            </select>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">ระดับความเสี่ยง (Risk)</label>
            <select
              id="filter-risk-select"
              value={filters.riskLevel}
              onChange={(e) => update('riskLevel', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-sky-50/50 border border-sky-200/70 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="">ทุกระดับความเสี่ยง</option>
              <option value="ปกติ">ปกติ</option>
              <option value="เสี่ยงต่ำ">เสี่ยงต่ำ</option>
              <option value="เสี่ยงปานกลาง">เสี่ยงปานกลาง</option>
              <option value="เสี่ยงสูง">เสี่ยงสูง (High Risk)</option>
            </select>
          </div>

          {/* Blood Sugar (FBS) */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">ระดับน้ำตาล (FBS)</label>
            <select
              id="filter-fbs-select"
              value={filters.fbsStatus}
              onChange={(e) => update('fbsStatus', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-sky-50/50 border border-sky-200/70 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="">ทุกระดับน้ำตาล</option>
              <option value="ปกติ (<100)">ปกติ (&lt;100)</option>
              <option value="กลุ่มเสี่ยง (100-125)">กลุ่มเสี่ยง (100-125)</option>
              <option value="เสี่ยงสูง/เบาหวาน (≥126)">เสี่ยงสูง (≥126)</option>
            </select>
          </div>

          {/* Smoking Behavior */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">การสูบบุหรี่ (Smoking)</label>
            <select
              id="filter-smoking-select"
              value={filters.smoking}
              onChange={(e) => update('smoking', e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl bg-sky-50/50 border border-sky-200/70 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <option value="">ทุกสถานะการสูบ</option>
              <option value="ไม่สูบ">ไม่สูบ</option>
              <option value="เคยสูบ (เลิกแล้ว)">เคยสูบ (เลิกแล้ว)</option>
              <option value="สูบเป็นครั้งคราว">สูบเป็นครั้งคราว</option>
              <option value="สูบเป็นประจำ">สูบเป็นประจำ</option>
            </select>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-slate-500 text-[11px]">ตัวกรองที่ใช้งานอยู่:</span>
            {filters.gender && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                เพศ: {filters.gender}
                <button onClick={() => update('gender', '')} className="hover:text-amber-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.ageGroup && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                อายุ: {filters.ageGroup}
                <button onClick={() => update('ageGroup', '')} className="hover:text-amber-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.zone && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                {filters.zone}
                <button onClick={() => update('zone', '')} className="hover:text-amber-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.riskLevel && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                ความเสี่ยง: {filters.riskLevel}
                <button onClick={() => update('riskLevel', '')} className="hover:text-amber-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.fbsStatus && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                น้ำตาล: {filters.fbsStatus}
                <button onClick={() => update('fbsStatus', '')} className="hover:text-amber-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.smoking && (
              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full text-[11px]">
                บุหรี่: {filters.smoking}
                <button onClick={() => update('smoking', '')} className="hover:text-amber-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <span className="text-[11px] text-slate-500 ml-auto">
              (พบ {filteredCount} จาก {totalCount} รายการ)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
