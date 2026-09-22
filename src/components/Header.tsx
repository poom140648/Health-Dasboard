import React from 'react';
import { Activity, RefreshCw, Clock, UserCheck, ShieldCheck, Database, PlusCircle, CheckCircle2 } from 'lucide-react';
import { GoogleSheetSyncInfo } from '../types';

interface HeaderProps {
  syncInfo: GoogleSheetSyncInfo;
  isRefreshing: boolean;
  onRefresh: () => void;
  onOpenAddModal: () => void;
  creatorName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  syncInfo,
  isRefreshing,
  onRefresh,
  onOpenAddModal,
  creatorName = 'นายรัฐภูมิ สมบูรณ์',
}) => {
  const formattedDate = new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(syncInfo.lastSynced);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-xs sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          
          {/* Left: Branding & Core Header Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-amber-100/90 border border-amber-300/70 flex items-center justify-center text-amber-800 shadow-xs">
                <Activity className="w-5 h-5 text-amber-600 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 font-['Prompt']">
                    ระบบแดชบอร์ดติดตามและวิเคราะห์สุขภาวะชุมชนอัจฉริยะ
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300/70 shadow-2xs">
                    Pastel Tech Edition
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-1">
                  แพลตฟอร์มวิเคราะห์ปัจจัยเสี่ยงสุขภาพ พฤติกรรมสุขภาวะ และแนวโน้มโรคไม่ติดต่อเรื้อรัง (NCDs) ระดับประชากรเชิงรุก
                </p>
              </div>
            </div>

            {/* Sub-meta details: Creator & Timestamp */}
            <div className="flex items-center gap-3 sm:gap-4 text-xs text-slate-600 pt-0.5 flex-wrap">
              <div className="flex items-center gap-1.5 bg-sky-50 text-sky-800 px-2.5 py-1 rounded-md border border-sky-100/80">
                <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                <span className="font-medium">ผู้จัดทำ:</span>
                <span className="font-semibold text-slate-800">{creatorName}</span>
                <span className="text-[11px] text-sky-600/90">(สาธารณสุขศาสตร์)</span>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/60">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>อัปเดตล่าสุด:</span>
                <span className="font-semibold text-slate-700">{formattedDate} น.</span>
              </div>

              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200/70 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>คุ้มครองข้อมูลตาม พ.ร.บ. PDPA</span>
              </div>
            </div>
          </div>

          {/* Right: Real-time Controls & Connection Badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:justify-end">
            {/* Live Database status pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sky-50/90 border border-sky-200/80 text-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Database className="w-3 h-3 text-sky-600" />
                  ฐานข้อมูล Google Sheet
                </span>
                <span className="text-[10px] text-slate-500">
                  ID: 1kMVD... <span className="text-emerald-600 font-medium">(เชื่อมต่อเรียลไทม์)</span>
                </span>
              </div>
            </div>

            {/* Quick Add Demo record button to verify real-time reactivity */}
            <button
              id="btn-add-record"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-slate-700 hover:bg-amber-50 transition-all shadow-2xs hover:shadow-xs active:scale-95"
              title="เพิ่มข้อมูลใหม่เพื่อทดสอบการตอบสนองแบบเรียลไทม์"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" />
              <span>บันทึกข้อมูลใหม่</span>
            </button>

            {/* Real-time Refresh Button */}
            <button
              id="btn-sync-now"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 border border-amber-500/30 transition-all shadow-xs hover:shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-900 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'กำลังซิงค์...' : 'ซิงค์ข้อมูลสด'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
