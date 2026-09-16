import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const initialForm = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    hire_date: '',
    status: 'active',
};

const translations = {
    en: {
        team: 'Team',
        employees: 'Employees',
        addEmployee: 'Add Employee',
        editEmployee: 'Edit Employee',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
        department: 'Department',
        position: 'Position',
        hireDate: 'Hire date',
        status: 'Status',
        selectDepartment: 'Select department',
        selectPosition: 'Select position',
        active: 'Active',
        inactive: 'Inactive',
        onLeave: 'On Leave',
        cancel: 'Cancel',
        createEmployee: 'Create Employee',
        updateEmployee: 'Update Employee',
        employeeList: 'Employee List',
        searchEmployee: 'Search employee...',
        name: 'Name',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Delete this employee?',
        exportCsv: 'Export CSV',
        exportPdf: 'Export PDF',
    },
    th: {
        team: 'ทีมงาน',
        employees: 'พนักงาน',
        addEmployee: 'เพิ่มพนักงาน',
        editEmployee: 'แก้ไขพนักงาน',
        firstName: 'ชื่อจริง',
        lastName: 'นามสกุล',
        email: 'อีเมล',
        phone: 'เบอร์โทรศัพท์',
        department: 'แผนก',
        position: 'ตำแหน่ง',
        hireDate: 'วันที่เริ่มงาน',
        status: 'สถานะ',
        selectDepartment: 'เลือกแผนก',
        selectPosition: 'เลือกตำแหน่ง',
        active: 'ใช้งาน',
        inactive: 'ไม่ใช้งาน',
        onLeave: 'ลาพัก',
        cancel: 'ยกเลิก',
        createEmployee: 'สร้างพนักงาน',
        updateEmployee: 'อัปเดตพนักงาน',
        employeeList: 'รายชื่อพนักงาน',
        searchEmployee: 'ค้นหาพนักงาน...',
        name: 'ชื่อ',
        actions: 'การดำเนินการ',
        edit: 'แก้ไข',
        delete: 'ลบ',
        confirmDelete: 'ลบพนักงานคนนี้หรือไม่?',
        exportCsv: 'ส่งออก CSV',
        exportPdf: 'ส่งออก PDF',
    },
};

const downloadCsv = (filename, rows) => {
    const csvContent = [
        Object.keys(rows[0] || {}).join(','),
        ...rows.map((row) => Object.values(row).map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

export default function EmployeeIndex({ employees, departments, positions }) {
    const { locale } = usePage().props;
    const currentLocale = locale || 'en';
    const t = translations[currentLocale] || translations.en;
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');

    const filteredEmployees = useMemo(
        () =>
            employees.filter(
                (employee) =>
                    employee.full_name.toLowerCase().includes(search.toLowerCase()) ||
                    employee.department_name?.toLowerCase().includes(search.toLowerCase()),
            ),
        [employees, search],
    );

    const exportRows = filteredEmployees.map((employee) => ({
        name: employee.full_name,
        email: employee.email,
        department: employee.department_name || '-',
        position: employee.position_name || '-',
        status: employee.status,
    }));

    const handleExportCsv = () => {
        downloadCsv('employees.csv', exportRows);
    };

    const handleExportPdf = () => {
        window.print();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            router.put(route('employees.update', editingId), form, {
                onSuccess: () => {
                    setForm(initialForm);
                    setEditingId(null);
                    router.reload({ only: ['employees'] });
                },
            });
            return;
        }

        router.post(route('employees.store'), form, {
            onSuccess: () => {
                setForm(initialForm);
                router.reload({ only: ['employees'] });
            },
        });
    };

    const handleEdit = (employee) => {
        setEditingId(employee.id);
        setForm({
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            phone: employee.phone || '',
            department_id: employee.department_id,
            position_id: employee.position_id,
            hire_date: employee.hire_date,
            status: employee.status,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm(t.confirmDelete)) return;
        router.delete(route('employees.destroy', id), {
            onSuccess: () => router.reload({ only: ['employees'] }),
        });
    };

    const statusLabels = {
        en: { active: 'Active', inactive: 'Inactive', on_leave: 'On Leave' },
        th: { active: 'ใช้งาน', inactive: 'ไม่ใช้งาน', on_leave: 'ลาพัก' },
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{t.team}</p>
                        <h2 className="mt-1 text-2xl font-bold text-white">{t.employees}</h2>
                    </div>
                </div>
            }
        >
            <Head title={t.employees} />

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.75fr]">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 className="mb-4 text-xl font-semibold text-slate-800">
                        {editingId ? t.editEmployee : t.addEmployee}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.firstName}</label>
                                <input
                                    value={form.first_name}
                                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.lastName}</label>
                                <input
                                    value={form.last_name}
                                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.email}</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.phone}</label>
                            <input
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.department}</label>
                                <select
                                    value={form.department_id}
                                    onChange={(e) => setForm({ ...form, department_id: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                                    required
                                >
                                    <option value="">{t.selectDepartment}</option>
                                    {departments.map((department) => (
                                        <option key={department.id} value={department.id}>{department.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.position}</label>
                                <select
                                    value={form.position_id}
                                    onChange={(e) => setForm({ ...form, position_id: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                                    required
                                >
                                    <option value="">{t.selectPosition}</option>
                                    {positions.map((position) => (
                                        <option key={position.id} value={position.id}>{position.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.hireDate}</label>
                                <input
                                    type="date"
                                    value={form.hire_date}
                                    onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.status}</label>
                                <select
                                    value={form.status}
                                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-emerald-500 focus:bg-white"
                                >
                                    <option value="active">{statusLabels[currentLocale].active}</option>
                                    <option value="inactive">{statusLabels[currentLocale].inactive}</option>
                                    <option value="on_leave">{statusLabels[currentLocale].on_leave}</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="rounded-2xl bg-emerald-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700">
                                {editingId ? t.updateEmployee : t.createEmployee}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setForm(initialForm);
                                    }}
                                    className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
                                >
                                    {t.cancel}
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-slate-800">{t.employeeList}</h3>
                            <p className="text-sm text-slate-500">{t.searchEmployee}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={handleExportCsv}
                                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            >
                                {t.exportCsv}
                            </button>
                            <button
                                type="button"
                                onClick={handleExportPdf}
                                className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-100"
                            >
                                {t.exportPdf}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.searchEmployee}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
                        />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.name}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.department}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.position}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.status}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee) => (
                                    <tr key={employee.id} className="border-t border-slate-200 bg-white">
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-slate-800">{employee.full_name}</div>
                                            <div className="mt-1 text-xs text-slate-500">{employee.email}</div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">{employee.department_name || '-'}</td>
                                        <td className="px-4 py-4 text-slate-600">{employee.position_name || '-'}</td>
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                {statusLabels[currentLocale][employee.status] || employee.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(employee)} className="rounded-xl bg-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200">
                                                    {t.edit}
                                                </button>
                                                <button onClick={() => handleDelete(employee.id)} className="rounded-xl bg-rose-100 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200">
                                                    {t.delete}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
