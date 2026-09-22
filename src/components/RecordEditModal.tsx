import React, { useState, useEffect } from 'react';
import {
  HealthRecord,
  Gender,
  AgeGroup,
  Zone,
  RiskLevel,
  SmokingStatus,
  AlcoholStatus,
  ExerciseStatus,
  DietHabit,
} from '../types';
import {
  calculateBmiCategory,
  calculateFbsStatus,
  calculateBpStatus,
  calculateCholesterolStatus,
  calculateOverallRisk,
} from '../data/mockData';
import { PlusCircle, Edit3, X, Check, Activity, ShieldCheck } from 'lucide-react';

interface RecordEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: HealthRecord) => void;
  initialData?: HealthRecord | null;
}

export const RecordEditModal: React.FC<RecordEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const isEditing = Boolean(initialData);

  const [gender, setGender] = useState<Gender>('ชาย');
  const [age, setAge] = useState<number>(45);
  const [zone, setZone] = useState<Zone>('โซน A (ริมน้ำ)');
  const [bmi, setBmi] = useState<number>(24.2);
  const [fbs, setFbs] = useState<number>(110);
  const [systolicBp, setSystolicBp] = useState<number>(130);
  const [diastolicBp, setDiastolicBp] = useState<number>(85);
  const [cholesterol, setCholesterol] = useState<number>(205);
  const [smoking, setSmoking] = useState<SmokingStatus>('ไม่สูบ');
  const [alcohol, setAlcohol] = useState<AlcoholStatus>('ดื่มเฉพาะเทศกาล');
  const [exercise, setExercise] = useState<ExerciseStatus>('ปานกลาง (1-2 วัน/สัปดาห์)');
  const [diet, setDiet] = useState<DietHabit>('อาหารสุขภาพ/สมดุล');
  const [sleepHours, setSleepHours] = useState<number>(7);

  useEffect(() => {
    if (initialData) {
      setGender(initialData.gender);
      setAge(initialData.age);
      setZone(initialData.zone);
      setBmi(initialData.bmi);
      setFbs(initialData.fbs);
      setSystolicBp(initialData.systolicBp);
      setDiastolicBp(initialData.diastolicBp);
      setCholesterol(initialData.cholesterol);
      setSmoking(initialData.smoking);
      setAlcohol(initialData.alcohol);
      setExercise(initialData.exercise);
      setDiet(initialData.diet);
      setSleepHours(initialData.sleepHours);
    } else {
      // Defaults for new entry
      setGender('ชาย');
      setAge(45);
      setZone('โซน B (ตลาดกลางเมือง)');
      setBmi(24.5);
      setFbs(115);
      setSystolicBp(130);
      setDiastolicBp(85);
      setCholesterol(210);
      setSmoking('ไม่สูบ');
      setAlcohol('ไม่ดื่ม');
      setExercise('ปานกลาง (1-2 วัน/สัปดาห์)');
      setDiet('อาหารสุขภาพ/สมดุล');
      setSleepHours(7);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine age group
    let ageGroup: AgeGroup = '25-45 ปี (วัยทำงาน)';
    if (age < 25) ageGroup = '15-24 ปี (เยาวชน)';
    else if (age <= 45) ageGroup = '25-45 ปี (วัยทำงาน)';
    else if (age <= 59) ageGroup = '46-59 ปี (วัยกลางคน)';
    else ageGroup = '60 ปีขึ้นไป (ผู้สูงอายุ)';

    const bmiCategory = calculateBmiCategory(bmi);
    const fbsStatus = calculateFbsStatus(fbs);
    const bpStatus = calculateBpStatus(systolicBp, diastolicBp);
    const cholesterolStatus = calculateCholesterolStatus(cholesterol);
    const overallRisk = calculateOverallRisk(bmiCategory, fbsStatus, bpStatus, smoking, exercise);

    const estHeight = 165;
    const estWeight = Number((bmi * ((estHeight / 100) ** 2)).toFixed(1));

    const record: HealthRecord = {
      id: initialData ? initialData.id : `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      displayName: initialData ? initialData.displayName : `คุณ *** (รหัส ${Math.floor(100 + Math.random() * 900)})`,
      gender,
      age,
      ageGroup,
      zone,
      weight: initialData?.weight ?? estWeight,
      height: initialData?.height ?? estHeight,
      bmi: Number(bmi.toFixed(1)),
      bmiCategory,
      fbs,
      fbsStatus,
      systolicBp,
      diastolicBp,
      bpStatus,
      cholesterol,
      cholesterolStatus,
      smoking,
      alcohol,
      exercise,
      diet,
      sleepHours,
      overallRisk,
      checkupDate: new Date().toISOString().split('T')[0],
      quarter: '2026-Q3',
      notes: 'บันทึกอัปเดตผ่านระบบแดชบอร์ดสด',
    };

    onSave(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-sky-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
              {isEditing ? <Edit3 className="w-5 h-5 text-amber-700" /> : <PlusCircle className="w-5 h-5 text-amber-700" />}
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-800 font-['Prompt']">
                {isEditing ? 'แก้ไขข้อมูลคัดกรองสุขภาพ' : 'เพิ่มข้อมูลสุขภาพใหม่ (Real-time Sync)'}
              </h3>
              <p className="text-xs text-slate-500">
                ข้อมูลจะอัปเดตตัวเลข KPI กราฟ และตารางแบบเรียลไทม์ทันทีโดยอัตโนมัติ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Row 1: Gender, Age, Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">เพศ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">อายุ (ปี)</label>
              <input
                type="number"
                min={15}
                max={100}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">โซนพื้นที่</label>
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value as Zone)}
                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200"
              >
                <option value="โซน A (ริมน้ำ)">โซน A (ริมน้ำ)</option>
                <option value="โซน B (ตลาดกลางเมือง)">โซน B (ตลาดกลางเมือง)</option>
                <option value="โซน C (หมู่บ้านพัฒนา)">โซน C (หมู่บ้านพัฒนา)</option>
                <option value="โซน D (รอบสถานีรถไฟ)">โซน D (รอบสถานีรถไฟ)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Vitals & Lab Measurements */}
          <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-100 space-y-3">
            <span className="font-bold text-sky-900 block text-xs">ข้อมูลทางกายภาพและผลแล็บ (4 ฟิลด์ความเสี่ยง):</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">BMI (กก./ม.²)</label>
                <input
                  type="number"
                  step="0.1"
                  min={14}
                  max={45}
                  value={bmi}
                  onChange={(e) => setBmi(Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">น้ำตาล FBS (mg/dL)</label>
                <input
                  type="number"
                  min={60}
                  max={350}
                  value={fbs}
                  onChange={(e) => setFbs(Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">ความดันตัวบน (Sys)</label>
                <input
                  type="number"
                  min={80}
                  max={240}
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">ความดันตัวล่าง (Dia)</label>
                <input
                  type="number"
                  min={50}
                  max={150}
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(Number(e.target.value))}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1">คอเลสเตอรอลรวม (mg/dL)</label>
              <input
                type="number"
                min={100}
                max={400}
                value={cholesterol}
                onChange={(e) => setCholesterol(Number(e.target.value))}
                className="w-full sm:w-1/2 p-1.5 rounded-lg bg-white border border-slate-200"
                required
              />
            </div>
          </div>

          {/* Row 3: 4 Behaviors */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-3">
            <span className="font-bold text-amber-900 block text-xs">พฤติกรรมสุขภาพ (4 ฟิลด์พฤติกรรม):</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 mb-1">การสูบบุหรี่</label>
                <select
                  value={smoking}
                  onChange={(e) => setSmoking(e.target.value as SmokingStatus)}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                >
                  <option value="ไม่สูบ">ไม่สูบ</option>
                  <option value="เคยสูบ (เลิกแล้ว)">เคยสูบ (เลิกแล้ว)</option>
                  <option value="สูบเป็นครั้งคราว">สูบเป็นครั้งคราว</option>
                  <option value="สูบเป็นประจำ">สูบเป็นประจำ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">เครื่องดื่มแอลกอฮอล์</label>
                <select
                  value={alcohol}
                  onChange={(e) => setAlcohol(e.target.value as AlcoholStatus)}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                >
                  <option value="ไม่ดื่ม">ไม่ดื่ม</option>
                  <option value="ดื่มเฉพาะเทศกาล">ดื่มเฉพาะเทศกาล</option>
                  <option value="ดื่มสัปดาห์ละ 1-2 ครั้ง">ดื่มสัปดาห์ละ 1-2 ครั้ง</option>
                  <option value="ดื่มเป็นประจำ">ดื่มเป็นประจำ</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">กิจกรรมทางกาย / ออกกำลังกาย</label>
                <select
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value as ExerciseStatus)}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                >
                  <option value="สม่ำเสมอ (≥150 นาที/สัปดาห์)">สม่ำเสมอ (≥150 นาที/สัปดาห์)</option>
                  <option value="ปานกลาง (1-2 วัน/สัปดาห์)">ปานกลาง (1-2 วัน/สัปดาห์)</option>
                  <option value="นานๆ ครั้ง">นานๆ ครั้ง</option>
                  <option value="ไม่ออกกำลังกาย">ไม่ออกกำลังกาย</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">พฤติกรรมการกินอาหาร</label>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value as DietHabit)}
                  className="w-full p-1.5 rounded-lg bg-white border border-slate-200"
                >
                  <option value="อาหารสุขภาพ/สมดุล">อาหารสุขภาพ/สมดุล</option>
                  <option value="ชอบรสหวาน">ชอบรสหวาน</option>
                  <option value="ชอบรสเค็มจัด">ชอบรสเค็มจัด</option>
                  <option value="ของทอด/ไขมันสูง">ของทอด/ไขมันสูง</option>
                  <option value="หวานมันเค็มสูง">หวานมันเค็มสูง</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick preset buttons to quickly test real-time updates */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] text-slate-500">ทดสอบเพิ่มตัวอย่าง:</span>
            <button
              type="button"
              onClick={() => {
                setBmi(31.2);
                setFbs(168);
                setSystolicBp(155);
                setDiastolicBp(98);
                setSmoking('สูบเป็นประจำ');
                setDiet('หวานมันเค็มสูง');
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
            >
              + ตัวอย่างเคสเสี่ยงสูง (High Risk)
            </button>
            <button
              type="button"
              onClick={() => {
                setBmi(21.5);
                setFbs(88);
                setSystolicBp(115);
                setDiastolicBp(75);
                setSmoking('ไม่สูบ');
                setDiet('อาหารสุขภาพ/สมดุล');
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
            >
              + ตัวอย่างเคสปกติ (Normal)
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'บันทึกการแก้ไข' : 'บันทึกข้อมูลเข้าระบบ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
