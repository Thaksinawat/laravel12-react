import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const translations = {
    en: {
        dashboard: 'Dashboard',
        departments: 'Departments',
        positions: 'Positions',
        employees: 'Employees',
        account: 'Account',
        profile: 'Profile',
        logOut: 'Log Out',
    },
    th: {
        dashboard: 'แดชบอร์ด',
        departments: 'แผนก',
        positions: 'ตำแหน่ง',
        employees: 'พนักงาน',
        account: 'บัญชี',
        profile: 'โปรไฟล์',
        logOut: 'ออกจากระบบ',
    },
};

const navItems = {
    en: [
        { label: 'Dashboard', routeName: 'dashboard', href: route('dashboard') },
        { label: 'Departments', routeName: 'departments.index', href: route('departments.index') },
        { label: 'Positions', routeName: 'positions.index', href: route('positions.index') },
        { label: 'Employees', routeName: 'employees.index', href: route('employees.index') },
    ],
    th: [
        { label: 'แดชบอร์ด', routeName: 'dashboard', href: route('dashboard') },
        { label: 'แผนก', routeName: 'departments.index', href: route('departments.index') },
        { label: 'ตำแหน่ง', routeName: 'positions.index', href: route('positions.index') },
        { label: 'พนักงาน', routeName: 'employees.index', href: route('employees.index') },
    ],
};

const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'th', label: 'ไทย' },
];

export default function AuthenticatedLayout({ header, children }) {
    const { auth, locale } = usePage().props;
    const user = auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const currentLocale = locale || 'en';
    const t = translations[currentLocale] || translations.en;
    const items = navItems[currentLocale] || navItems.en;

    const switchLanguage = (code) => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', code);
        router.visit(url.toString(), { preserveScroll: true, replace: true });
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <nav className="border-b border-slate-200 bg-white/90 shadow-sm backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
                        <div className="flex items-center gap-3">
                            <Link href={route('dashboard')} className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
                                    <ApplicationLogo className="h-6 w-6 fill-current text-white" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Org</div>
                                    <div className="text-lg font-bold text-slate-800">Department Hub</div>
                                </div>
                            </Link>

                            <div className="hidden items-center gap-2 lg:flex">
                                {items.map((item) => (
                                    <NavLink
                                        key={item.routeName}
                                        href={item.href}
                                        active={route().current(item.routeName)}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:gap-3">
                            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-2 py-1.5 shadow-inner">
                                {languageOptions.map((option) => {
                                    const isCurrent = currentLocale === option.code;
                                    return (
                                        <button
                                            key={option.code}
                                            type="button"
                                            onClick={() => switchLanguage(option.code)}
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${isCurrent ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 shadow-inner">
                                {user.name}
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                                        >
                                            {t.account}
                                            <svg className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>{t.profile}</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        {t.logOut}
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="-mr-2 flex items-center lg:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-500 transition hover:text-slate-700"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={showingNavigationDropdown ? 'block lg:hidden' : 'hidden'}>
                    <div className="space-y-1 border-t border-slate-200 bg-white px-4 py-3">
                        {items.map((item) => (
                            <ResponsiveNavLink key={item.routeName} href={item.href} active={route().current(item.routeName)}>
                                {item.label}
                            </ResponsiveNavLink>
                        ))}
                        <ResponsiveNavLink href={route('profile.edit')}>{t.profile}</ResponsiveNavLink>
                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                            {t.logOut}
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 text-white">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
}
