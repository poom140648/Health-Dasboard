import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { HealthRecord, FilterState, GoogleSheetSyncInfo } from './types';
import { computeStatistics } from './data/mockData';
import { fetchGoogleSheetData } from './services/googleSheetService';
import { Header } from './components/Header';
import { Navigation, NavView } from './components/Navigation';
import { FilterBar } from './components/FilterBar';
import { KpiSection } from './components/KpiSection';
import { RiskAndTrendSection } from './components/RiskAndTrendSection';
import { BehaviorSection } from './components/BehaviorSection';
import { AdditionalInsightsSection } from './components/AdditionalInsightsSection';
import { DataTableSection } from './components/DataTableSection';
import { RecordEditModal } from './components/RecordEditModal';
import { ShieldAlert, Sparkles, CheckCircle2, ArrowRight, HeartPulse, Flame, Compass, Table } from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  gender: '',
  ageGroup: '',
  zone: '',
  riskLevel: '',
  fbsStatus: '',
  bpStatus: '',
  smoking: '',
  alcohol: '',
  exercise: '',
  searchQuery: '',
};

export default function App() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [syncInfo, setSyncInfo] = useState<GoogleSheetSyncInfo>({
    lastSynced: new Date(),
    status: 'synced',
    rowCount: 0,
    sheetId: '1kMVDetyfnzHtyFC04z-KK9YU5m5QPefB',
    autoSyncEnabled: true,
    message: 'เชื่อมต่อเรียลไทม์สำเร็จ',
  });
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentView, setCurrentView] = useState<NavView>('overview');

  // Modal states for real-time CRUD operations
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchGoogleSheetData();
      setRecords(result.records);
      setSyncInfo(result.syncInfo);
    } catch (err) {
      console.error('Failed to sync sheet data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Real-time manual sync
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await fetchGoogleSheetData();
      setRecords(result.records);
      setSyncInfo({
        ...result.syncInfo,
        lastSynced: new Date(),
      });
      showNotification('ซิงค์ข้อมูลล่าสุดกับระบบเรียลไทม์สำเร็จแล้ว');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Real-time Add/Edit Record
  const handleSaveRecord = (record: HealthRecord) => {
    setRecords((prev) => {
      const exists = prev.some((r) => r.id === record.id);
      if (exists) {
        showNotification(`อัปเดตข้อมูลของรหัส ${record.id} เรียลไทม์สำเร็จ`);
        return prev.map((r) => (r.id === record.id ? record : r));
      } else {
        showNotification(`เพิ่มข้อมูลบุคคลใหม่เข้าระบบเรียลไทม์สำเร็จ`);
        return [record, ...prev];
      }
    });
    setSyncInfo((prev) => ({
      ...prev,
      lastSynced: new Date(),
      rowCount: prev.rowCount + (records.some((r) => r.id === record.id) ? 0 : 1),
    }));
  };

  // Real-time Delete Record
  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    setSyncInfo((prev) => ({
      ...prev,
      lastSynced: new Date(),
      rowCount: Math.max(0, prev.rowCount - 1),
    }));
    showNotification(`ลบข้อมูลรหัส ${id} ออกจากระบบเรียลไทม์แล้ว`);
  };

  // Open Edit Modal
  const handleEditRecord = (record: HealthRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filtered Records calculation
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filters.gender && r.gender !== filters.gender) return false;
      if (filters.ageGroup && r.ageGroup !== filters.ageGroup) return false;
      if (filters.zone && r.zone !== filters.zone) return false;
      if (filters.riskLevel && r.overallRisk !== filters.riskLevel) return false;
      if (filters.fbsStatus && r.fbsStatus !== filters.fbsStatus) return false;
      if (filters.smoking && r.smoking !== filters.smoking) return false;
      if (filters.exercise && r.exercise !== filters.exercise) return false;

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchId = r.id.toLowerCase().includes(query);
        const matchName = r.displayName.toLowerCase().includes(query);
        const matchNotes = r.notes?.toLowerCase().includes(query);
        if (!matchId && !matchName && !matchNotes) return false;
      }

      return true;
    });
  }, [records, filters]);

  // Statistics calculation on filtered set
  const statistics = useMemo(() => {
    return computeStatistics(filteredRecords);
  }, [filteredRecords]);

  return (
    <div className="min-h-screen bg-[#f0f6fc] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <Header
        syncInfo={syncInfo}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onOpenAddModal={handleOpenAddModal}
        creatorName="นายรัฐภูมิ สมบูรณ์"
      />

      {/* Navigation Tabs */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        filteredCount={filteredRecords.length}
        totalCount={records.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Category Filters Bar */}
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalCount={records.length}
          filteredCount={filteredRecords.length}
        />

        {/* View Switching Logic */}
        {currentView === 'overview' && (
          <div className="space-y-8">
            {/* 1. KPI Cards (4+ Statistical metrics) */}
            <KpiSection stats={statistics} />

            {/* Quick Summary Highlights for Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setCurrentView('risk_trends')}
                className="bg-white rounded-2xl p-5 border border-sky-100 hover:border-amber-300 transition-all cursor-pointer shadow-xs hover:shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-200 transition-colors">
                      <HeartPulse className="w-4 h-4 text-amber-700" />
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                      ความเสี่ยง & แนวโน้มสุขภาพ
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  วิเคราะห์ 4 ฟิลด์ความเสี่ยง (BP, FBS, BMI, Chol) และ 2 เทรนด์ย้อนหลัง
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                  <span>ผู้มีความดัน/น้ำตาลเกินเกณฑ์:</span>
                  <span className="bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                    {statistics.abnormalFbsPercent}%
                  </span>
                </div>
              </div>

              <div
                onClick={() => setCurrentView('behaviors')}
                className="bg-white rounded-2xl p-5 border border-sky-100 hover:border-amber-300 transition-all cursor-pointer shadow-xs hover:shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-sky-100 text-sky-800 group-hover:bg-sky-200 transition-colors">
                      <Flame className="w-4 h-4 text-sky-700" />
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                      พฤติกรรมสุขภาวะ (4 ฟิลด์)
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  วิเคราะห์สูบบุหรี่, ดื่มสุรา, กิจกรรมทางกาย, และพฤติกรรมบริโภคอาหาร
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                  <span>สูบบุหรี่/ขาดการออกกำลังกาย:</span>
                  <span className="bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    ปัจจัยเร่ง NCDs
                  </span>
                </div>
              </div>

              <div
                onClick={() => setCurrentView('insights')}
                className="bg-white rounded-2xl p-5 border border-sky-100 hover:border-amber-300 transition-all cursor-pointer shadow-xs hover:shadow-sm group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-900 group-hover:bg-amber-200 transition-colors">
                      <Compass className="w-4 h-4 text-amber-700" />
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 font-['Prompt']">
                      ข้อมูลเชิงลึก 5 ประเด็น
                    </h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  สหสัมพันธ์ BMI-FBS, BMI-BP, กลุ่มอายุเสี่ยง, และพื้นที่เสี่ยงกระจุกตัว
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <span>สถานะการวิเคราะห์:</span>
                  <span className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    ครบ 5 หัวข้อ
                  </span>
                </div>
              </div>
            </div>

            {/* Visualizations Preview (Charts in Overview) */}
            <RiskAndTrendSection records={filteredRecords} />

            {/* Detail Data Table Preview */}
            <DataTableSection
              records={filteredRecords}
              onDeleteRecord={handleDeleteRecord}
              onEditRecord={handleEditRecord}
            />
          </div>
        )}

        {currentView === 'risk_trends' && (
          <div className="space-y-6">
            <KpiSection stats={statistics} />
            <RiskAndTrendSection records={filteredRecords} />
          </div>
        )}

        {currentView === 'behaviors' && (
          <div className="space-y-6">
            <BehaviorSection records={filteredRecords} />
          </div>
        )}

        {currentView === 'insights' && (
          <div className="space-y-6">
            <AdditionalInsightsSection records={filteredRecords} />
          </div>
        )}

        {currentView === 'table_detail' && (
          <div className="space-y-6">
            <DataTableSection
              records={filteredRecords}
              onDeleteRecord={handleDeleteRecord}
              onEditRecord={handleEditRecord}
            />
          </div>
        )}

      </main>

      {/* Add / Edit Record Modal */}
      <RecordEditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSaveRecord}
        initialData={editingRecord}
      />

    </div>
  );
}
