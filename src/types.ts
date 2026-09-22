export type Gender = 'ชาย' | 'หญิง';

export type AgeGroup = '15-24 ปี (เยาวชน)' | '25-45 ปี (วัยทำงาน)' | '46-59 ปี (วัยกลางคน)' | '60 ปีขึ้นไป (ผู้สูงอายุ)';

export type Zone = 'โซน A (ริมน้ำ)' | 'โซน B (ตลาดกลางเมือง)' | 'โซน C (หมู่บ้านพัฒนา)' | 'โซน D (รอบสถานีรถไฟ)';

export type RiskLevel = 'ปกติ' | 'เสี่ยงต่ำ' | 'เสี่ยงปานกลาง' | 'เสี่ยงสูง';

export type SmokingStatus = 'ไม่สูบ' | 'เคยสูบ (เลิกแล้ว)' | 'สูบเป็นครั้งคราว' | 'สูบเป็นประจำ';

export type AlcoholStatus = 'ไม่ดื่ม' | 'ดื่มเฉพาะเทศกาล' | 'ดื่มสัปดาห์ละ 1-2 ครั้ง' | 'ดื่มเป็นประจำ';

export type ExerciseStatus = 'สม่ำเสมอ (≥150 นาที/สัปดาห์)' | 'ปานกลาง (1-2 วัน/สัปดาห์)' | 'นานๆ ครั้ง' | 'ไม่ออกกำลังกาย';

export type DietHabit = 'อาหารสุขภาพ/สมดุล' | 'ชอบรสหวาน' | 'ชอบรสเค็มจัด' | 'ของทอด/ไขมันสูง' | 'หวานมันเค็มสูง';

export interface HealthRecord {
  id: string; // PDPA Masked (e.g., UID-1029)
  displayName: string; // PDPA Masked name (e.g., คุณ น. พัฒนสุข)
  gender: Gender;
  age: number;
  ageGroup: AgeGroup;
  zone: Zone;
  weight: number; // kg
  height: number; // cm
  bmi: number;
  bmiCategory: 'น้ำหนักน้อย' | 'ปกติ' | 'น้ำหนักเกิน (ท้วม)' | 'อ้วนระดับ 1' | 'อ้วนอันตราย (ระดับ 2)';
  fbs: number; // Fasting Blood Sugar (mg/dL)
  fbsStatus: 'ปกติ (<100)' | 'กลุ่มเสี่ยง (100-125)' | 'เสี่ยงสูง/เบาหวาน (≥126)';
  systolicBp: number; // mmHg
  diastolicBp: number; // mmHg
  bpStatus: 'ปกติ (<120/80)' | 'เฝ้าระวัง (120-139/80-89)' | 'ความดันสูง (≥140/90)';
  cholesterol: number; // mg/dL
  cholesterolStatus: 'ปกติ (<200)' | 'ค่อนข้างสูง (200-239)' | 'สูง (≥240)';
  smoking: SmokingStatus;
  alcohol: AlcoholStatus;
  exercise: ExerciseStatus;
  diet: DietHabit;
  sleepHours: number; // hours/day
  overallRisk: RiskLevel;
  checkupDate: string; // YYYY-MM-DD
  quarter: string; // e.g. Q1, Q2, Q3, Q4
  notes?: string;
}

export interface FilterState {
  searchQuery: string;
  gender: string;
  ageGroup: string;
  zone: string;
  riskLevel: string;
  fbsStatus: string;
  bpStatus: string;
  smoking: string;
  alcohol: string;
  exercise: string;
}

export interface HealthStatistics {
  totalCount: number;
  avgBmi: number;
  minBmi: number;
  maxBmi: number;
  avgFbs: number;
  minFbs: number;
  maxFbs: number;
  avgSystolicBp: number;
  minSystolicBp: number;
  maxSystolicBp: number;
  avgCholesterol: number;
  highRiskCount: number;
  highRiskPercentage: number;
  overweightCount: number;
  overweightPercentage: number;
  genderRatio: { male: number; female: number; malePercent: number; femalePercent: number };
  abnormalFbsCount: number;
  abnormalFbsPercent: number;
  hypertensionCount: number;
  hypertensionPercent: number;
}

export interface GoogleSheetSyncInfo {
  sheetId: string;
  lastSynced: Date;
  status: 'synced' | 'syncing' | 'fallback_active' | 'error';
  rowCount: number;
  autoSyncEnabled: boolean;
  message: string;
}
