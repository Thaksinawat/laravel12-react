import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const statCards = {
    en: [
        { label: 'Departments', key: 'department_count', color: 'bg-blue-500', icon: '🏢' },
        { label: 'Employees', key: 'employee_count', color: 'bg-emerald-500', icon: '👥' },
        { label: 'Positions', key: 'position_count', color: 'bg-violet-500', icon: '📌' },
        { label: 'Active', key: 'active_employee_count', color: 'bg-amber-500', icon: '✅' },
    ],
    th: [
        { label: 'แผนก', key: 'department_count', color: 'bg-blue-500', icon: '🏢' },
        { label: 'พนักงาน', key: 'employee_count', color: 'bg-emerald-500', icon: '👥' },
        { label: 'ตำแหน่ง', key: 'position_count', color: 'bg-violet-500', icon: '📌' },
        { label: 'ใช้งาน', key: 'active_employee_count', color: 'bg-amber-500', icon: '✅' },
    ],
};

export default function Dashboard({ stats, departments, department_breakdown, status_breakdown }) {
    const { locale } = usePage().props;
    const currentLocale = locale || 'en';
    const cards = statCards[currentLocale] || statCards.en;
    const chartColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6'];
    const maxDepartmentCount = Math.max(...(department_breakdown?.map((item) => item.count) || [1]), 1);
    const maxStatusCount = Math.max(...(status_breakdown?.map((item) => item.count) || [1]), 1);

    const texts = {
        en: {
            overview: 'Overview',
            organizationDashboard: 'Organization Dashboard',
            updatedToday: 'Updated today',
            live: 'Live',
            departmentSummary: 'Department Summary',
            teamOverview: 'Team and staffing overview',
            manageDepartments: 'Manage departments',
            manager: 'Manager',
            notAssigned: 'Not assigned',
            employees: 'employees',
            quickActions: 'Quick Actions',
            departments: 'Departments',
            positions: 'Positions',
            employeesLabel: 'Employees',
            departmentBreakdown: 'Department Allocation',
            statusBreakdown: 'Employee Status',
            active: 'Active',
            inactive: 'Inactive',
            onLeave: 'On Leave',
        },
        th: {
            overview: 'ภาพรวม',
            organizationDashboard: 'แผงควบคุมองค์กร',
            updatedToday: 'อัปเดตวันนี้',
            live: 'สด',
            departmentSummary: 'สรุปแผนก',
            teamOverview: 'ภาพรวมทีมและกำลังคน',
            manageDepartments: 'จัดการแผนก',
            manager: 'ผู้จัดการ',
            notAssigned: 'ยังไม่ได้กำหนด',
            employees: 'คน',
            quickActions: 'การดำเนินการด่วน',
            departments: 'แผนก',
            positions: 'ตำแหน่ง',
            employeesLabel: 'พนักงาน',
            departmentBreakdown: 'การกระจายแผนก',
            statusBreakdown: 'สถานะพนักงาน',
            active: 'ใช้งาน',
            inactive: 'ไม่ใช้งาน',
            onLeave: 'ลาพัก',
        },
    };
    const t = texts[currentLocale] || texts.en;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{t.overview}</p>
                        <h2 className="mt-1 text-2xl font-bold text-white">{t.organizationDashboard}</h2>
                    </div>
                    <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-slate-200">
                        {t.updatedToday}
                    </div>
                </div>
            }
        >
            <Head title={currentLocale === 'th' ? 'แดชบอร์ด' : 'Dashboard'} />

            <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => (
                        <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="mb-4 flex items-center justify-between">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${card.color} text-white`}>
                                    {card.icon}
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{t.live}</span>
                            </div>
                            <div className="text-sm text-slate-500">{card.label}</div>
                            <div className="mt-2 text-3xl font-bold text-slate-800">{stats[card.key]}</div>
                        </div>
                    ))}
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-slate-800">{t.departmentBreakdown}</h3>
                        </div>
                        <div className="space-y-4">
                            {(department_breakdown || []).map((item, index) => (
                                <div key={item.name}>
                                    <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                                        <span className="font-medium">{item.name}</span>
                                        <span>{item.count}</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(item.count / maxDepartmentCount) * 100}%`,
                                                backgroundColor: chartColors[index % chartColors.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-slate-800">{t.statusBreakdown}</h3>
                        </div>
                        <div className="space-y-4">
                            {(status_breakdown || []).map((item, index) => (
                                <div key={item.name}>
                                    <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                                        <span className="font-medium">{t[item.name] || item.label}</span>
                                        <span>{item.count}</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${(item.count / maxStatusCount) * 100}%`,
                                                backgroundColor: chartColors[(index + 2) % chartColors.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">{t.departmentSummary}</h3>
                                <p className="text-sm text-slate-500">{t.teamOverview}</p>
                            </div>
                            <Link href={route('departments.index')} className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100">
                                {t.manageDepartments}
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {departments.map((department) => (
                                <div key={department.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <div>
                                        <div className="font-semibold text-slate-800">{department.name}</div>
                                        <div className="text-xs text-slate-500">{t.manager}: {department.manager_name || t.notAssigned}</div>
                                    </div>
                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                                        {department.employee_count} {t.employees}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h3 className="mb-5 text-lg font-semibold text-slate-800">{t.quickActions}</h3>
                        <div className="space-y-3">
                            <Link href={route('departments.index')} className="block rounded-2xl bg-slate-100 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-200">{t.departments}</Link>
                            <Link href={route('positions.index')} className="block rounded-2xl bg-slate-100 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-200">{t.positions}</Link>
                            <Link href={route('employees.index')} className="block rounded-2xl bg-slate-100 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-200">{t.employeesLabel}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
