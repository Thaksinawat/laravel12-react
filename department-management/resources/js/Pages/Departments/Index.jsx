import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const initialForm = {
    name: '',
    manager_name: '',
    description: '',
};

const translations = {
    en: {
        management: 'Management',
        departments: 'Departments',
        addDepartment: 'Add Department',
        editDepartment: 'Edit Department',
        departmentName: 'Department name',
        manager: 'Manager',
        description: 'Description',
        cancel: 'Cancel',
        createDepartment: 'Create Department',
        updateDepartment: 'Update Department',
        departmentList: 'Department List',
        searchDepartment: 'Search department...',
        name: 'Name',
        employees: 'Employees',
        actions: 'Actions',
        noDescription: 'No description',
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Delete this department?',
    },
    th: {
        management: 'การจัดการ',
        departments: 'แผนก',
        addDepartment: 'เพิ่มแผนก',
        editDepartment: 'แก้ไขแผนก',
        departmentName: 'ชื่อแผนก',
        manager: 'ผู้จัดการ',
        description: 'คำอธิบาย',
        cancel: 'ยกเลิก',
        createDepartment: 'สร้างแผนก',
        updateDepartment: 'อัปเดตแผนก',
        departmentList: 'รายการแผนก',
        searchDepartment: 'ค้นหาแผนก...',
        name: 'ชื่อ',
        employees: 'พนักงาน',
        actions: 'การดำเนินการ',
        noDescription: 'ไม่มีคำอธิบาย',
        edit: 'แก้ไข',
        delete: 'ลบ',
        confirmDelete: 'ลบแผนกนี้หรือไม่?',
    },
};

export default function DepartmentIndex({ departments }) {
    const { locale } = usePage().props;
    const currentLocale = locale || 'en';
    const t = translations[currentLocale] || translations.en;
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');

    const filteredDepartments = useMemo(
        () =>
            departments.filter(
                (department) =>
                    department.name.toLowerCase().includes(search.toLowerCase()) ||
                    (department.manager_name || '').toLowerCase().includes(search.toLowerCase()),
            ),
        [departments, search],
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form };

        if (editingId) {
            router.put(route('departments.update', editingId), payload, {
                onSuccess: () => {
                    setForm(initialForm);
                    setEditingId(null);
                    router.reload({ only: ['departments'] });
                },
            });
            return;
        }

        router.post(route('departments.store'), payload, {
            onSuccess: () => {
                setForm(initialForm);
                router.reload({ only: ['departments'] });
            },
        });
    };

    const handleEdit = (department) => {
        setEditingId(department.id);
        setForm({
            name: department.name,
            manager_name: department.manager_name || '',
            description: department.description || '',
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm(t.confirmDelete)) return;

        router.delete(route('departments.destroy', id), {
            onSuccess: () => router.reload({ only: ['departments'] }),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{t.management}</p>
                        <h2 className="mt-1 text-2xl font-bold text-white">{t.departments}</h2>
                    </div>
                </div>
            }
        >
            <Head title={t.departments} />

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.7fr]">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 className="mb-4 text-xl font-semibold text-slate-800">
                        {editingId ? t.editDepartment : t.addDepartment}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.departmentName}</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.manager}</label>
                            <input
                                value={form.manager_name}
                                onChange={(e) => setForm({ ...form, manager_name: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.description}</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows="4"
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500 focus:bg-white"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="rounded-2xl bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700">
                                {editingId ? t.updateDepartment : t.createDepartment}
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
                            <h3 className="text-xl font-semibold text-slate-800">{t.departmentList}</h3>
                            <p className="text-sm text-slate-500">{t.searchDepartment}</p>
                        </div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.searchDepartment}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:bg-white sm:w-64"
                        />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.name}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.manager}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.employees}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDepartments.map((department) => (
                                    <tr key={department.id} className="border-t border-slate-200 bg-white">
                                        <td className="px-4 py-4">
                                            <div className="font-semibold text-slate-800">{department.name}</div>
                                            <div className="mt-1 text-xs text-slate-500">{department.description || t.noDescription}</div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">{department.manager_name || '-'}</td>
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                                {department.employee_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(department)} className="rounded-xl bg-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200">
                                                    {t.edit}
                                                </button>
                                                <button onClick={() => handleDelete(department.id)} className="rounded-xl bg-rose-100 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200">
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
