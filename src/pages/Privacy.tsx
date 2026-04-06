import { useNavigate } from "react-router-dom";
import { MainNav, LogoWithTagline } from "@/components/MainNav";
import { SiteFooter } from "@/components/SiteFooter";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <LogoWithTagline />
            <MainNav />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: April 6, 2026</p>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>When you create an account, we collect your email address. When you use the Service, we may collect usage data such as designs created, features used, and session information to improve the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve the Service, process payments, communicate with you about your account, and ensure the security of the platform.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">3. Data Storage</h2>
            <p>Your data is stored securely using industry-standard encryption and security practices. Your designs and account data are stored on secure cloud infrastructure.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">4. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pexels — for background images (subject to Pexels privacy policy)</li>
              <li>Polar/Stripe — for payment processing (subject to their privacy policies)</li>
              <li>Cloud hosting — for infrastructure and data storage</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">5. Cookies</h2>
            <p>We use essential cookies to maintain your session and preferences. We do not use third-party tracking cookies for advertising purposes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">6. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share data only when required by law or to protect our rights.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">7. Your Rights</h2>
            <p>You have the right to access, update, or delete your personal data. You can delete your account at any time by contacting us. Upon deletion, your data will be permanently removed within 30 days.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">8. Data Retention</h2>
            <p>We retain your data for as long as your account is active. If you delete your account, we will delete your data within 30 days, except where we are required to retain it by law.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">9. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of significant changes via email or a notice on the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">10. Contact</h2>
            <p>For privacy-related questions, contact us at <a href="mailto:lazy@lazyunicorn.ai" className="text-foreground underline underline-offset-4 hover:opacity-80">lazy@lazyunicorn.ai</a>.</p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Privacy;
