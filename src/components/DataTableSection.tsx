import React, { useState, useMemo } from 'react';
import { HealthRecord } from '../types';
import {
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  AlertCircle,
  Eye,
  Trash2,
  Edit,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';

interface DataTableSectionProps {
  records: HealthRecord[];
  onDeleteRecord: (id: string) => void;
  onEditRecord: (record: HealthRecord) => void;
}

type SortField = 'id' | 'age' | 'bmi' | 'fbs' | 'systolicBp' | 'overallRisk' | 'checkupDate';
type SortOrder = 'asc' | 'desc';

export const DataTableSection: React.FC<DataTableSectionProps> = ({
  records,
  onDeleteRecord,
  onEditRecord,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('fbs');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  // Sorting
  const sortedRecords = useMemo(() => {
    return [...records].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'overallRisk') {
        const priority: Record<string, number> = { ปกติ: 1, เสี่ยงต่ำ: 2, เสี่ยงปานกลาง: 3, เสี่ยงสูง: 4 };
        valA = priority[a.overallRisk] || 0;
        valB = priority[b.overallRisk] || 0;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [records, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sky-100 shadow-xs p-5 mb-8">
      {/* Table Header & Conditional Formatting Legend */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300/60">
              <TableIcon className="w-5 h-5 text-amber-700" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-800 font-['Prompt']">
                ตารางข้อมูลสุขภาพรายบุคคลเชิงลึก (Detail Data Table & Conditional Formatting)
              </h2>
              <p className="text-xs text-slate-500">
                ประเด็นเจาะลึก: คัดกรองและเฝ้าระวังกลุ่มเสี่ยงโรค NCDs (เบาหวานและความดันโลหิตสูง) ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
              </p>
            </div>
          </div>
        </div>

        {/* Conditional Formatting Legend */}
        <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
          <span className="font-semibold text-slate-600 text-[11px] mr-1">การจัดรูปแบบด้วยสี (Conditional Highlighting):</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            ปกติ (&lt;100 / &lt;120)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            กลุ่มเฝ้าระวัง (100-125 / 120-139)
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-300 font-semibold text-[11px] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            เกินเกณฑ์/ผิดปกติ (FBS &ge; 126 / BP &ge; 140)
          </span>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-sky-50/70 text-slate-700 border-b border-sky-100 font-semibold">
              <th className="py-3 px-3.5 whitespace-nowrap">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                >
                  รหัสบุคคล (PDPA)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-3 whitespace-nowrap">เพศ/อายุ</th>
              <th className="py-3 px-3 whitespace-nowrap">โซนพื้นที่</th>
              <th className="py-3 px-3 whitespace-nowrap">
                <button
                  onClick={() => handleSort('bmi')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                >
                  BMI (กก./ม.²)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-3 whitespace-nowrap">
                <button
                  onClick={() => handleSort('fbs')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                >
                  น้ำตาล FBS (mg/dL)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-3 whitespace-nowrap">
                <button
                  onClick={() => handleSort('systolicBp')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                >
                  ความดัน BP (mmHg)
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-3 whitespace-nowrap">คอเลสเตอรอล</th>
              <th className="py-3 px-3 whitespace-nowrap">พฤติกรรมเสี่ยง</th>
              <th className="py-3 px-3 whitespace-nowrap">
                <button
                  onClick={() => handleSort('overallRisk')}
                  className="flex items-center gap-1 hover:text-slate-900 cursor-pointer"
                >
                  ระดับความเสี่ยง
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </button>
              </th>
              <th className="py-3 px-3 text-center whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-8 text-center text-slate-400">
                  ไม่พบข้อมูลตามเงื่อนไขตัวกรอง
                </td>
              </tr>
            ) : (
              paginatedRecords.map((r) => {
                // Conditional formatting calculations
                const isHighSugar = r.fbs >= 126;
                const isWarningSugar = r.fbs >= 100 && r.fbs < 126;

                const isHighBp = r.systolicBp >= 140 || r.diastolicBp >= 90;
                const isWarningBp = (r.systolicBp >= 120 && r.systolicBp < 140) || (r.diastolicBp >= 80 && r.diastolicBp < 90);

                const isHighBmi = r.bmi >= 25.0;
                const isWarningBmi = r.bmi >= 23.0 && r.bmi < 25.0;

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-sky-50/40 transition-colors group"
                  >
                    {/* Anonymized Masked ID & Name */}
                    <td className="py-3 px-3.5 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {r.id}
                        </span>
                        <span className="text-slate-500 text-[11px] truncate max-w-[120px]">
                          {r.displayName}
                        </span>
                      </div>
                    </td>

                    {/* Gender & Age */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-medium text-slate-800">{r.gender}</span>
                      <span className="text-slate-500 text-[11px]"> ({r.age} ปี)</span>
                    </td>

                    {/* Zone */}
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600 text-[11px]">
                      {r.zone.split(' ')[0]} {r.zone.split(' ')[1]}
                    </td>

                    {/* BMI with Conditional Highlighting */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium text-[11px] ${
                          isHighBmi
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : isWarningBmi
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {r.bmi} ({r.bmiCategory.split(' ')[0]})
                      </span>
                    </td>

                    {/* Fasting Blood Sugar with High-Visibility Conditional Formatting */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs shadow-2xs ${
                          isHighSugar
                            ? 'bg-rose-100 text-rose-900 border border-rose-300 ring-2 ring-rose-200/50'
                            : isWarningSugar
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                        }`}
                        title={
                          isHighSugar
                            ? 'ค่าน้ำตาลในเลือดเกินเกณฑ์มาตรฐานเบาหวาน (≥126 mg/dL)'
                            : isWarningSugar
                            ? 'กลุ่มเสี่ยงเบาหวาน (100-125 mg/dL)'
                            : 'ระดับน้ำตาลปกติ'
                        }
                      >
                        {isHighSugar && <AlertCircle className="w-3.5 h-3.5 text-rose-600" />}
                        {r.fbs} mg/dL
                      </span>
                    </td>

                    {/* Blood Pressure with Conditional Highlighting */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-xs ${
                          isHighBp
                            ? 'bg-rose-100 text-rose-900 border border-rose-300 ring-2 ring-rose-200/50'
                            : isWarningBp
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium'
                        }`}
                        title={
                          isHighBp
                            ? 'ความดันโลหิตสูงเกินเกณฑ์ (≥140/90 mmHg)'
                            : isWarningBp
                            ? 'กลุ่มเฝ้าระวังความดัน (120-139/80-89 mmHg)'
                            : 'ความดันปกติ'
                        }
                      >
                        {r.systolicBp}/{r.diastolicBp}
                      </span>
                    </td>

                    {/* Cholesterol */}
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      <span
                        className={
                          r.cholesterol >= 240
                            ? 'text-rose-700 font-semibold'
                            : r.cholesterol >= 200
                            ? 'text-amber-700 font-medium'
                            : 'text-slate-600'
                        }
                      >
                        {r.cholesterol} mg/dL
                      </span>
                    </td>

                    {/* Behaviors preview */}
                    <td className="py-3 px-3 whitespace-nowrap text-[11px] text-slate-600">
                      <div className="flex flex-col gap-0.5">
                        <span>{r.smoking.split(' ')[0]}</span>
                        <span className="text-[10px] text-slate-400">{r.diet.split('/')[0]}</span>
                      </div>
                    </td>

                    {/* Overall Risk Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.overallRisk === 'เสี่ยงสูง'
                            ? 'bg-rose-100 text-rose-900 border border-rose-300'
                            : r.overallRisk === 'เสี่ยงปานกลาง'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : r.overallRisk === 'เสี่ยงต่ำ'
                            ? 'bg-sky-100 text-sky-900 border border-sky-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {r.overallRisk}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedRecord(r)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-700 hover:bg-sky-100/70 transition-colors"
                          title="ดูคำแนะนำสุขภาพรายบุคคล"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditRecord(r)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-100/70 transition-colors"
                          title="แก้ไขข้อมูล (ทดสอบการอัปเดตแบบเรียลไทม์)"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRecord(r.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-100/70 transition-colors"
                          title="ลบข้อมูล (ทดสอบการลบแบบเรียลไทม์)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>แสดงแถวต่อหน้า:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
          >
            <option value={10}>10 รายการ</option>
            <option value={20}>20 รายการ</option>
            <option value={50}>50 รายการ</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>
            แสดง {sortedRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, sortedRecords.length)} จาก {sortedRecords.length} คน
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2.5 font-medium">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Individual Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-sky-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <ShieldCheck className="w-5 h-5 text-amber-700" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-['Prompt']">
                    ผลการตรวจและคำแนะนำสุขภาพ (PDPA)
                  </h3>
                  <p className="text-xs text-slate-500">
                    รหัสประจำตัว: {selectedRecord.id} | {selectedRecord.displayName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <div><span className="text-slate-500">เพศ/อายุ:</span> <span className="font-semibold text-slate-800">{selectedRecord.gender} / {selectedRecord.age} ปี</span></div>
                <div><span className="text-slate-500">พื้นที่:</span> <span className="font-semibold text-slate-800">{selectedRecord.zone}</span></div>
                <div><span className="text-slate-500">BMI:</span> <span className="font-semibold text-slate-800">{selectedRecord.bmi} ({selectedRecord.bmiCategory})</span></div>
                <div>
                  <span className="text-slate-500">น้ำตาล FBS:</span>{' '}
                  <span className={`font-bold ${selectedRecord.fbs >= 126 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {selectedRecord.fbs} mg/dL
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">ความดัน BP:</span>{' '}
                  <span className={`font-bold ${selectedRecord.systolicBp >= 140 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {selectedRecord.systolicBp}/{selectedRecord.diastolicBp} mmHg
                  </span>
                </div>
                <div><span className="text-slate-500">คอเลสเตอรอล:</span> <span className="font-semibold text-slate-800">{selectedRecord.cholesterol} mg/dL</span></div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 block">พฤติกรรมสุขภาพ & วิถีชีวิต:</span>
                <p className="text-slate-700">• การสูบบุหรี่: {selectedRecord.smoking}</p>
                <p className="text-slate-700">• แอลกอฮอล์: {selectedRecord.alcohol}</p>
                <p className="text-slate-700">• การออกกำลังกาย: {selectedRecord.exercise}</p>
                <p className="text-slate-700">• อาหาร: {selectedRecord.diet} | นอนเฉลี่ย {selectedRecord.sleepHours} ชม./วัน</p>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
                <span className="font-bold text-sky-900 block mb-1">คำแนะนำทางการแพทย์และสาธารณสุข:</span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedRecord.overallRisk === 'เสี่ยงสูง'
                    ? '⚠️ มีความเสี่ยงสูงต่อภาวะแทรกซ้อนหลอดเลือดหัวใจและเบาหวาน แนะนำส่งต่อแพทย์ รพ.สต. เพื่อตรวจยืนยัน ติดตามค่าน้ำตาลสะสม (HbA1c) และปรับเปลี่ยนอาหารทันที'
                    : selectedRecord.overallRisk === 'เสี่ยงปานกลาง'
                    ? '⚡ อยู่ในกลุ่มเฝ้าระวัง ควรเข้าร่วมโครงการส่งเสริมสุขภาพชุมชน ลดหวานมันเค็ม เพิ่มการออกกำลังกายสม่ำเสมอ ตรวจซ้ำใน 3 เดือน'
                    : '✅ สุขภาพอยู่ในเกณฑ์มาตรฐาน แนะนำรักษารูปแบบการดำเนินชีวิตและตรวจคัดกรองประจำปีอย่างต่อเนื่อง'}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
