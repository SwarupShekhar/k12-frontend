export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-24 px-6 md:px-12 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold">Privacy Policy</h1>
                <p className="text-lg opacity-80">Last updated: {new Date().toLocaleDateString()}</p>

                <hr className="border-gray-200 dark:border-gray-800" />

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">1. Introduction</h2>
                    <p>Welcome to K12 Tutoring. We value your privacy and are committed to protecting your personal data.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">2. Data Collection</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">3. How We Use Your Data</h2>
                    <p>We use your data to provide, maintain, and improve our services, including processing transactions and sending you related information.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-semibold">4. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us at support@k12tutoring.com.</p>
                </section>
            </div>
        </div>
    );
}
