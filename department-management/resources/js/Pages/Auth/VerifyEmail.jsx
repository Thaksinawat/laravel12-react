import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const translations = {
    en: {
        title: 'Email Verification',
        description: 'Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you did not receive the email, we will gladly send you another.',
        sent: 'A new verification link has been sent to the email address you provided during registration.',
        resend: 'Resend Verification Email',
        logout: 'Log Out',
    },
    th: {
        title: 'ยืนยันอีเมล',
        description: 'ขอบคุณที่ลงทะเบียน! ก่อนเริ่มใช้งาน กรุณายืนยันอีเมลของคุณโดยคลิกลิงก์ที่เราเพิ่งส่งไปให้คุณ หากคุณไม่ได้รับอีเมล เราจะส่งอีกอันให้คุณด้วยความยินดี',
        sent: 'ลิงก์ยืนยันใหม่ได้ถูกส่งไปยังอีเมลที่คุณระบุไว้ในการลงทะเบียนแล้ว',
        resend: 'ส่งอีเมลยืนยันอีกครั้ง',
        logout: 'ออกจากระบบ',
    },
};

export default function VerifyEmail({ status }) {
    const { locale } = usePage().props;
    const currentLocale = locale || 'en';
    const t = translations[currentLocale] || translations.en;
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title={t.title} />

            <div className="mb-4 text-sm text-gray-600">
                {t.description}
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {t.sent}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {t.resend}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {t.logout}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
