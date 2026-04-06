import { useNavigate } from "react-router-dom";
import { MainNav, LogoWithTagline } from "@/components/MainNav";
import { SiteFooter } from "@/components/SiteFooter";

const Terms = () => {
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
          Terms of Service
        </h1>

        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p className="text-sm text-muted-foreground">Last updated: April 6, 2026</p>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using LazyFaceless.com ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">2. Description of Service</h2>
            <p>LazyFaceless provides an online tool for creating quote images and visual content for social media, print, and personal use. The Service is provided "as is" and "as available."</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">3. User Accounts</h2>
            <p>You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">4. User Content</h2>
            <p>You retain ownership of any content you create using the Service. You grant us a limited license to store and process your content solely to provide the Service. We do not claim ownership of your designs.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">5. Prohibited Use</h2>
            <p>You agree not to use the Service to create content that is illegal, defamatory, infringing, or harmful. We reserve the right to remove any content or terminate accounts that violate these terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">6. Payments & Subscriptions</h2>
            <p>Pro subscriptions are billed monthly or annually. You may cancel at any time. Refunds are handled on a case-by-case basis. Payments are processed securely through our payment partners (Polar/Stripe).</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">7. Intellectual Property</h2>
            <p>The Service, including its design, code, and branding, is owned by LazyUnicorn. Background images sourced from Pexels are subject to the Pexels license. Fonts are licensed under their respective open-source licenses.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">8. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, LazyFaceless shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">9. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">10. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:lazy@lazyunicorn.ai" className="text-foreground underline underline-offset-4 hover:opacity-80">lazy@lazyunicorn.ai</a>.</p>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Terms;
