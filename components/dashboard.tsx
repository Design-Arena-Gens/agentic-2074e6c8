'use client';

import { useMemo, useState } from 'react';
import { format, isAfter, isWithinInterval, parseISO } from 'date-fns';
import type { Activity, ActivityCategory, ActivityStatus } from '@/lib/activities';
import { activities } from '@/lib/activities';

type FilterState = {
  className: string;
  type: ActivityCategory | 'All';
  status: ActivityStatus | 'All';
  search: string;
  window: '7d' | '30d' | 'All';
};

const initialFilters: FilterState = {
  className: 'All',
  type: 'All',
  status: 'All',
  search: '',
  window: 'All',
};

const filterWindowToInterval = (window: FilterState['window']) => {
  if (window === 'All') {
    return undefined;
  }

  const now = new Date();
  const days = window === '7d' ? 7 : 30;

  return {
    start: now,
    end: new Date(now.getTime() + days * 24 * 60 * 60 * 1000),
  };
};

const statusColorStyles: Record<ActivityStatus, string> = {
  Scheduled: 'bg-blue-100 text-blue-700 ring-blue-200',
  'In Progress': 'bg-amber-100 text-amber-700 ring-amber-200',
  Completed: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  Cancelled: 'bg-rose-100 text-rose-700 ring-rose-200',
};

const timelineAccent: Record<ActivityCategory, string> = {
  Academics: 'border-blue-500 bg-blue-50',
  Sports: 'border-orange-500 bg-orange-50',
  Arts: 'border-purple-500 bg-purple-50',
  Clubs: 'border-emerald-500 bg-emerald-50',
  Community: 'border-sky-500 bg-sky-50',
  Administration: 'border-slate-500 bg-slate-50',
};

const filterActivities = (list: Activity[], filters: FilterState) => {
  const dateInterval = filterWindowToInterval(filters.window);

  return list.filter((activity) => {
    const matchesClass = filters.className === 'All' || activity.className === filters.className;
    const matchesType = filters.type === 'All' || activity.type === filters.type;
    const matchesStatus = filters.status === 'All' || activity.status === filters.status;
    const matchesSearch =
      filters.search.trim().length === 0 ||
      [activity.title, activity.description, activity.staffLead, activity.focusArea]
        .join(' ')
        .toLowerCase()
        .includes(filters.search.trim().toLowerCase());

    if (!matchesClass || !matchesType || !matchesStatus || !matchesSearch) {
      return false;
    }

    if (!dateInterval) {
      return true;
    }

    const activityDate = parseISO(activity.start);
    return isWithinInterval(activityDate, dateInterval);
  });
};

const computeSummary = (list: Activity[]) => {
  const totalParticipants = list.reduce((sum, activity) => sum + activity.participants, 0);
  const statusCounts = list.reduce(
    (acc, activity) => {
      acc[activity.status] = (acc[activity.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<ActivityStatus, number>,
  );

  const upcoming = list.filter((activity) => isAfter(parseISO(activity.start), new Date())).length;

  return {
    total: list.length,
    totalParticipants,
    scheduled: statusCounts.Scheduled ?? 0,
    inProgress: statusCounts['In Progress'] ?? 0,
    upcoming,
  };
};

const focusAreaTotals = (list: Activity[]) => {
  const grouped = list.reduce(
    (acc, activity) => {
      acc[activity.focusArea] = (acc[activity.focusArea] ?? 0) + activity.participants;
      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(grouped)
    .map(([focusArea, value]) => ({ focusArea, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

const unique = <T extends string>(values: T[]) =>
  Array.from(new Set<T>(values)).sort((a, b) => a.localeCompare(b)) as T[];

export function Dashboard() {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredActivities = useMemo(() => filterActivities(activities, filters), [filters]);
  const summary = useMemo(() => computeSummary(filteredActivities), [filteredActivities]);
  const focusAreas = useMemo(() => focusAreaTotals(filteredActivities), [filteredActivities]);

  const classOptions = useMemo(
    () => ['All', ...unique(activities.map((activity) => activity.className))],
    [],
  );
  const typeOptions = useMemo<(ActivityCategory | 'All')[]>(() => {
    const categories = unique<ActivityCategory>(activities.map((activity) => activity.type));
    return ['All', ...categories];
  }, []);
  const statusOptions = useMemo<(ActivityStatus | 'All')[]>(() => {
    const statuses = unique<ActivityStatus>(activities.map((activity) => activity.status));
    return ['All', ...statuses];
  }, []);

  const nextActivities = useMemo(
    () =>
      [...activities]
        .filter((activity) => activity.status === 'Scheduled' || activity.status === 'In Progress')
        .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime())
        .slice(0, 5),
    [],
  );
  const maxFocusValue = focusAreas[0]?.value ?? 1;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              Westview Charter School
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">
              Activity Operations Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitor academic, athletic, and community programming across classes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
              Download Report
            </button>
            <button className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700">
              Add Activity
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total Activities"
            value={summary.total}
            description={`${summary.upcoming} upcoming this month`}
          />
          <SummaryCard
            title="Scheduled"
            value={summary.scheduled}
            description="Across all divisions"
          />
          <SummaryCard
            title="Participants"
            value={summary.totalParticipants}
            description="Student & faculty involvement"
          />
          <SummaryCard
            title="Active Sessions"
            value={summary.inProgress}
            description="Currently running on campus"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <FilterBar
              classOptions={classOptions}
              typeOptions={typeOptions}
              statusOptions={statusOptions}
              filters={filters}
              onChange={setFilters}
            />
            <ActivityTable activities={filteredActivities} />
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Schedule</h2>
              <p className="mt-1 text-sm text-slate-500">
                Prioritized list for the next school week.
              </p>
              <div className="mt-5 space-y-4">
                {nextActivities.map((activity) => {
                  const accent = timelineAccent[activity.type];
                  return (
                    <div
                      key={activity.id}
                      className={`rounded-2xl border-l-4 ${accent} px-4 py-3`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                            {format(parseISO(activity.start), 'EEE • MMM d, p')}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-900">
                            {activity.title}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusColorStyles[activity.status]}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{activity.location}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Focus Areas</h2>
              <p className="mt-1 text-sm text-slate-500">
                Ranked by participating students for the current period.
              </p>
              <div className="mt-5 space-y-4">
                {focusAreas.map((item, index) => (
                  <div key={item.focusArea} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{item.focusArea}</span>
                      <span className="text-slate-500">{item.value} students</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-slate-900 transition-all"
                        style={{
                          width: `${Math.max(12, Math.min(100, (item.value / maxFocusValue) * 100))}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">Rank {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
};

function SummaryCard({ title, value, description }: SummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

type FilterBarProps = {
  classOptions: string[];
  typeOptions: (ActivityCategory | 'All')[];
  statusOptions: (ActivityStatus | 'All')[];
  filters: FilterState;
  onChange: (value: FilterState) => void;
};

function FilterBar({
  classOptions,
  typeOptions,
  statusOptions,
  filters,
  onChange,
}: FilterBarProps) {
  const handleChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <Select
          label="Class"
          value={filters.className}
          options={classOptions}
          onChange={(value) => handleChange('className', value)}
        />
        <Select
          label="Type"
          value={filters.type}
          options={typeOptions}
          onChange={(value) => handleChange('type', value as FilterState['type'])}
        />
        <Select
          label="Status"
          value={filters.status}
          options={statusOptions}
          onChange={(value) => handleChange('status', value as FilterState['status'])}
        />
        <Select
          label="Window"
          value={filters.window}
          options={['All', '7d', '30d']}
          onChange={(value) => handleChange('window', value as FilterState['window'])}
        />
      </div>
      <div className="w-full sm:w-72">
        <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          Search
          <input
            value={filters.search}
            onChange={(event) => handleChange('search', event.target.value)}
            placeholder="Search title, focus area, staff..."
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-inner outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>
    </div>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-wide text-slate-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-36 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

type ActivityTableProps = {
  activities: Activity[];
};

function ActivityTable({ activities }: ActivityTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Activity</th>
            <th className="px-4 py-3 font-medium">Class</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Schedule</th>
            <th className="px-4 py-3 font-medium">Participants</th>
            <th className="px-4 py-3 font-medium">Staff Lead</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {activities.map((activity) => (
            <tr key={activity.id} className="hover:bg-slate-50">
              <td className="max-w-[240px] px-4 py-3">
                <p className="font-medium text-slate-900">{activity.title}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{activity.description}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{activity.className}</td>
              <td className="px-4 py-3 text-slate-600">{activity.type}</td>
              <td className="px-4 py-3 text-slate-600">
                <span className="block text-xs text-slate-400">
                  {format(parseISO(activity.start), 'MMM d, yyyy')}
                </span>
                {format(parseISO(activity.start), 'p')} – {format(parseISO(activity.end), 'p')}
              </td>
              <td className="px-4 py-3 text-slate-600">{activity.participants}</td>
              <td className="px-4 py-3 text-slate-600">{activity.staffLead}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusColorStyles[activity.status]}`}
                >
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
          {activities.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-sm text-slate-500">
                No activities match the selected filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
