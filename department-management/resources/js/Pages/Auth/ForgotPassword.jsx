import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

const translations = {
    en: {
        title: 'Forgot Password',
        description: 'Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.',
        email: 'Email',
        submit: 'Email Password Reset Link',
    },
    th: {
        title: 'ลืมรหัสผ่าน',
        description: 'ลืมรหัสผ่านหรือไม่? ไม่เป็นปัญหา ให้แจ้งอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้คุณเพื่อเลือกรหัสผ่านใหม่',
        email: 'อีเมล',
        submit: 'ส่งลิงก์รีเซ็ตรหัสผ่าน',
    },
};

export default function ForgotPassword({ status }) {
    const { locale } = usePage().props;
    const currentLocale = locale || 'en';
    const t = translations[currentLocale] || translations.en;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title={t.title} />

            <div className="mb-4 text-sm text-gray-600">
                {t.description}
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {t.submit}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
