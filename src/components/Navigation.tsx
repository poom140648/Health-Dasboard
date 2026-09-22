import React from 'react';
import { LayoutDashboard, HeartPulse, Flame, Compass, Table, Sparkles } from 'lucide-react';

export type NavView = 'overview' | 'risk_trends' | 'behaviors' | 'insights' | 'table_detail';

interface NavigationProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  filteredCount: number;
  totalCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  filteredCount,
  totalCount,
}) => {
  const navItems: Array<{
    id: NavView;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'overview',
      label: 'ภาพรวม & KPI',
      sublabel: 'สถิติประชากรและตัวชี้วัด',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'risk_trends',
      label: 'ปัจจัยเสี่ยง & แนวโน้ม',
      sublabel: 'วิเคราะห์ 4 เสี่ยง + 2 เทรนด์',
      icon: <HeartPulse className="w-4 h-4" />,
      badge: '4+2 ฟิลด์',
    },
    {
      id: 'behaviors',
      label: 'พฤติกรรมสุขภาพ',
      sublabel: 'สูบบุหรี่, สุรา, กิจกรรม, อาหาร',
      icon: <Flame className="w-4 h-4" />,
      badge: '4 ฟิลด์',
    },
    {
      id: 'insights',
      label: 'ข้อมูลเชิงลึก 5 ประเด็น',
      sublabel: 'ความสัมพันธ์ & โซนเสี่ยงสูง',
      icon: <Compass className="w-4 h-4" />,
      badge: 'Deep Insights',
    },
    {
      id: 'table_detail',
      label: 'ตารางข้อมูลเจาะลึก',
      sublabel: 'ไฮไลต์สีตามเกณฑ์สุขภาพ (PDPA)',
      icon: <Table className="w-4 h-4" />,
      badge: `${filteredCount}/${totalCount}`,
    },
  ];

  return (
    <nav className="bg-sky-50/70 border-b border-sky-100 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none py-1">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`group relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-amber-300 font-semibold ring-1 ring-amber-200/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                }`}
              >
                <span
                  className={`p-1 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-sky-100/60 text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  {item.icon}
                </span>

                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                          isActive
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Quick status on the right */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 pl-4 border-l border-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>แสดงผลข้อมูล:</span>
          <span className="font-semibold text-slate-800">{filteredCount} จาก {totalCount} รายการ</span>
        </div>
      </div>
    </nav>
  );
};
