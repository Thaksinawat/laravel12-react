import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const initialForm = {
    name: '',
    level: 1,
    description: '',
};

const translations = {
    en: {
        structure: 'Structure',
        positions: 'Positions',
        addPosition: 'Add Position',
        editPosition: 'Edit Position',
        positionName: 'Position name',
        level: 'Level',
        description: 'Description',
        cancel: 'Cancel',
        createPosition: 'Create Position',
        updatePosition: 'Update Position',
        positionList: 'Position List',
        searchPosition: 'Search position...',
        name: 'Name',
        employees: 'Employees',
        actions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        confirmDelete: 'Delete this position?',
        levelLabel: 'Level',
    },
    th: {
        structure: 'โครงสร้าง',
        positions: 'ตำแหน่ง',
        addPosition: 'เพิ่มตำแหน่ง',
        editPosition: 'แก้ไขตำแหน่ง',
        positionName: 'ชื่อตำแหน่ง',
        level: 'ระดับ',
        description: 'คำอธิบาย',
        cancel: 'ยกเลิก',
        createPosition: 'สร้างตำแหน่ง',
        updatePosition: 'อัปเดตตำแหน่ง',
        positionList: 'รายการตำแหน่ง',
        searchPosition: 'ค้นหาตำแหน่ง...',
        name: 'ชื่อ',
        employees: 'พนักงาน',
        actions: 'การดำเนินการ',
        edit: 'แก้ไข',
        delete: 'ลบ',
        confirmDelete: 'ลบตำแหน่งนี้หรือไม่?',
        levelLabel: 'ระดับ',
    },
};

export default function PositionIndex({ positions }) {
    const { locale } = usePage().props;
    const currentLocale = locale || 'en';
    const t = translations[currentLocale] || translations.en;
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');

    const filteredPositions = useMemo(
        () => positions.filter((position) => position.name.toLowerCase().includes(search.toLowerCase())),
        [positions, search],
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...form, level: Number(form.level) };

        if (editingId) {
            router.put(route('positions.update', editingId), payload, {
                onSuccess: () => {
                    setForm(initialForm);
                    setEditingId(null);
                    router.reload({ only: ['positions'] });
                },
            });
            return;
        }

        router.post(route('positions.store'), payload, {
            onSuccess: () => {
                setForm(initialForm);
                router.reload({ only: ['positions'] });
            },
        });
    };

    const handleEdit = (position) => {
        setEditingId(position.id);
        setForm({
            name: position.name,
            level: position.level,
            description: position.description || '',
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm(t.confirmDelete)) return;
        router.delete(route('positions.destroy', id), {
            onSuccess: () => router.reload({ only: ['positions'] }),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-300">{t.structure}</p>
                        <h2 className="mt-1 text-2xl font-bold text-white">{t.positions}</h2>
                    </div>
                </div>
            }
        >
            <Head title={t.positions} />

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.7fr]">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h3 className="mb-4 text-xl font-semibold text-slate-800">
                        {editingId ? t.editPosition : t.addPosition}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.positionName}</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-500 focus:bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.level}</label>
                            <input
                                type="number"
                                min="1"
                                value={form.level}
                                onChange={(e) => setForm({ ...form, level: e.target.value })}
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-500 focus:bg-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-slate-700">{t.description}</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows="4"
                                className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-violet-500 focus:bg-white"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="submit" className="rounded-2xl bg-violet-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-violet-700">
                                {editingId ? t.updatePosition : t.createPosition}
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
                            <h3 className="text-xl font-semibold text-slate-800">{t.positionList}</h3>
                            <p className="text-sm text-slate-500">{t.searchPosition}</p>
                        </div>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.searchPosition}
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-violet-500 focus:bg-white sm:w-64"
                        />
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.name}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.levelLabel}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.employees}</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPositions.map((position) => (
                                    <tr key={position.id} className="border-t border-slate-200 bg-white">
                                        <td className="px-4 py-4 font-semibold text-slate-800">{position.name}</td>
                                        <td className="px-4 py-4">
                                            <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                                                {t.levelLabel} {position.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">{position.employee_count}</td>
                                        <td className="px-4 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(position)} className="rounded-xl bg-amber-100 px-2.5 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-200">
                                                    {t.edit}
                                                </button>
                                                <button onClick={() => handleDelete(position.id)} className="rounded-xl bg-rose-100 px-2.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-200">
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
