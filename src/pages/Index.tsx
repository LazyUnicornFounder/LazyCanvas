import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import HeroPhoneMockup from "@/components/HeroPhoneMockup";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between max-w-[1600px] mx-auto">
          <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
            Lazy Quotes
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => navigate("/pricing")}
              className="text-xs font-heading font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("/create")}
              className="px-4 py-2 bg-foreground text-background font-heading text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
            >
              Create your quote
            </button>
            {user ? (
              <>
                <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
                <button
                  onClick={signOut}
                  className="p-2 hover:bg-accent rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 text-muted-foreground" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-foreground text-background font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
              >
                <User className="w-3.5 h-3.5" />
                Sign up free
              </button>
            )}
          </div>
        </div>
      </header>

      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-10">
        <div className="text-center space-y-3 mb-8">
          <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-normal tracking-tight text-foreground leading-tight max-w-xl mx-auto">
            Create awesome quotes for your socials.
          </h2>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Design beautiful, shareable quote images in seconds. Pick fonts, colors, layouts — download and post.
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center w-full max-h-[70vh]">
          <HeroPhoneMockup />
        </div>
        <p className="text-[11px] text-muted-foreground/60 mt-6">
          Built with{" "}
          <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground transition-colors">Lovable</a>
          . Payments by{" "}
          <a href="https://polar.sh" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground transition-colors">Polar</a>
          .
        </p>
      </section>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Index;
