import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  Flame,
  Info
} from 'lucide-react';
import { StorageService } from '../../services/storage';
import { DailyActivity, DailyGoal } from '../../types';
import { cn, formatMinutes } from '../../lib/utils';

export const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [activeGoal, setActiveGoal] = useState<DailyGoal | null>(null);

  const loadData = () => {
    setActivities(StorageService.getActivities());
    setActiveGoal(StorageService.getGoal(selectedDate));
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Calculate days for the calendar grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    daysArray.push({ dayNumber: d, dateStr: dStr });
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Activity classification for each day
  const getDayStatus = (dateStr: string) => {
    const dayActs = activities.filter((a) => a.date === dateStr);
    if (dayActs.length === 0) return 'none';

    const totalMinutes = dayActs.reduce((acc, curr) => acc + (curr.minutesSpent || 0), 0);
    const completedCount = dayActs.reduce((acc, curr) => acc + (curr.topicsCompleted || 0), 0);

    if (totalMinutes >= 120 || completedCount >= 2) return 'completed';
    return 'partial';
  };

  const selectedDateActivities = activities.filter((a) => a.date === selectedDate);
  const selectedDateMinutes = selectedDateActivities.reduce(
    (acc, curr) => acc + (curr.minutesSpent || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Learning Calendar</h1>
        <p className="text-sm text-slate-500 mt-1">
          Visual activity heatmap and day-wise preparation consistency tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid Box */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-800">{monthName}</h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Today
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysArray.map((item, idx) => {
              if (!item) {
                return <div key={`empty-${idx}`} className="h-14 rounded-lg bg-transparent" />;
              }

              const status = getDayStatus(item.dateStr);
              const isSelected = item.dateStr === selectedDate;
              const isToday = item.dateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={item.dateStr}
                  onClick={() => setSelectedDate(item.dateStr)}
                  className={cn(
                    'h-14 rounded-lg border p-1.5 flex flex-col justify-between cursor-pointer transition-all select-none',
                    isSelected
                      ? 'ring-2 ring-sky-500 border-sky-500 bg-sky-50/50'
                      : 'border-slate-100 hover:border-slate-300 bg-white',
                    status === 'completed' && 'bg-emerald-50/60 border-emerald-200',
                    status === 'partial' && 'bg-amber-50/60 border-amber-200'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'text-xs font-medium',
                        isToday ? 'w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold' : 'text-slate-700'
                      )}
                    >
                      {item.dayNumber}
                    </span>
                    {status === 'completed' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                    {status === 'partial' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {status === 'completed' && 'Goal Hit'}
                    {status === 'partial' && 'Partial'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Heatmap Legend */}
          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>Target Achieved (120m+ or 2+ topics)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              <span>Partially Studied</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-white border border-slate-200" />
              <span>Rest / No Log</span>
            </div>
          </div>
        </div>

        {/* Selected Date Inspector Sidebar */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-sky-600" />
                <span>Date: {selectedDate}</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {formatMinutes(selectedDateMinutes)} Total
              </span>
            </div>

            {selectedDateActivities.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No activity recorded on this date.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>{act.topicTitle}</span>
                      <span className="text-emerald-600">{act.minutesSpent}m</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {act.trackName}
                    </div>
                    {act.remarks && (
                      <div className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-200/50">
                        "{act.remarks}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-medium text-slate-700 mb-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Daily Target Configuration</span>
            </div>
            <span>Standard target is 120 minutes and 2 completed placement topics.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
