import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import QuotePreview, {
  type AspectRatio,
  type QuoteFont,
  type QuoteTheme,
  type TextShadow,
  type AuthorPosition,
  type SocialPlatform,
} from "@/components/QuotePreview";
import QuoteEditor, {
  type QuoteEditorState,
  DEFAULT_EDITOR_STATE,
  SOCIAL_PLATFORMS,
} from "@/components/QuoteEditor";
import { Trash2, LogOut, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface SlideshowQuote {
  id: string;
  quote: string;
  author_name: string | null;
  font: string | null;
  theme: string | null;
  aspect_ratio: string | null;
  text_color: string | null;
  background_color: string | null;
  font_size: number | null;
  text_align: string | null;
  letter_spacing: number | null;
  line_height: number | null;
  author_font_size: number | null;
  author_color: string | null;
  author_font: string | null;
  text_shadow: string | null;
  author_position: string | null;
  is_bold: boolean | null;
  is_italic: boolean | null;
  background_opacity: number | null;
  background_image_url: string | null;
  socials: string | null;
  social_platform: string | null;
  website: string | null;
  author_photo_url: string | null;
  display_order: number | null;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const [editorState, setEditorState] = useState<QuoteEditorState>(DEFAULT_EDITOR_STATE);
  const [savedQuotes, setSavedQuotes] = useState<SlideshowQuote[]>([]);
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAdmin) loadQuotes();
  }, [isAdmin]);

  const loadQuotes = async () => {
    const { data } = await supabase
      .from("slideshow_quotes")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setSavedQuotes(data);
  };

  const handleSave = async () => {
    if (!editorState.quote.trim()) {
      toast.error("Please enter a quote");
      return;
    }
    setSaving(true);

    const socials = [
      editorState.socialUsername
        ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
        : "",
      editorState.website,
    ].filter(Boolean).join(" · ");

    const { error } = await supabase.from("slideshow_quotes").insert({
      quote: editorState.quote,
      author_name: editorState.authorName,
      font: editorState.font,
      theme: editorState.theme,
      font_size: editorState.fontSize,
      text_align: editorState.textAlign,
      text_color: editorState.textColor,
      background_color: editorState.backgroundColor,
      text_shadow: editorState.textShadow,
      is_bold: editorState.isBold,
      is_italic: editorState.isItalic,
      letter_spacing: editorState.letterSpacing,
      line_height: editorState.lineHeight,
      author_font_size: editorState.authorFontSize,
      author_color: editorState.authorColor,
      author_font: editorState.authorFont,
      author_position: editorState.authorPosition,
      aspect_ratio: editorState.aspectRatio,
      background_opacity: editorState.backgroundOpacity,
      socials,
      social_platform: editorState.socialPlatform,
      website: editorState.website,
      display_order: savedQuotes.length,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to save quote");
      console.error(error);
    } else {
      toast.success("Quote saved to slideshow!");
      setEditorState(DEFAULT_EDITOR_STATE);
      loadQuotes();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("slideshow_quotes").delete().eq("id", id);
    if (!error) {
      toast.success("Quote deleted");
      loadQuotes();
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/admin",
      extraParams: { prompt: "select_account" },
    });
    if (result.error) toast.error("Sign in failed");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-heading font-semibold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground text-sm">Sign in with Google to access admin panel</p>
          <button
            onClick={handleGoogleSignIn}
            className="px-6 py-3 bg-foreground text-background rounded-md font-heading text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Sign in with Google
          </button>
          <div className="pt-4">
            <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground">← Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-heading font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-sm">You don't have admin privileges.</p>
          <button onClick={signOut} className="text-xs text-muted-foreground hover:text-foreground">Sign out</button>
        </div>
      </div>
    );
  }

  const socials = [
    editorState.socialUsername
      ? `${SOCIAL_PLATFORMS.find((p) => p.value === editorState.socialPlatform)?.prefix || ""}${editorState.socialUsername}`
      : "",
    editorState.website,
  ].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h1 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Admin — Slideshow Quotes
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{user.email}</span>
            <button onClick={signOut} className="p-2 hover:bg-accent rounded-md transition-colors">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">
          {/* Editor */}
          <div className="flex-1 min-w-0 space-y-4">
            <QuoteEditor state={editorState} onChange={setEditorState} />

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-heading text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? "Saving..." : "Add to Slideshow"}
            </button>

            {/* Saved quotes list */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-heading font-semibold uppercase tracking-widest text-foreground">
                Slideshow Quotes ({savedQuotes.length})
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {savedQuotes.map((sq) => (
                  <div key={sq.id} className="relative group">
                    <div className="w-full">
                      <QuotePreview
                        quote={sq.quote}
                        authorName={sq.author_name || ""}
                        authorPhoto={sq.author_photo_url || null}
                        socials={sq.socials || ""}
                        aspectRatio={(sq.aspect_ratio as AspectRatio) || "square"}
                        font={(sq.font as QuoteFont) || "playfair"}
                        theme={(sq.theme as QuoteTheme) || "dark"}
                        backgroundImage={sq.background_image_url || null}
                        backgroundOpacity={sq.background_opacity || 0.4}
                        fontSize={sq.font_size || 1.4}
                        textAlign={(sq.text_align as "left" | "center" | "right") || "center"}
                        letterSpacing={sq.letter_spacing || 0}
                        lineHeight={sq.line_height || 1.6}
                        textColor={sq.text_color || ""}
                        authorFontSize={sq.author_font_size || 0.875}
                        authorColor={sq.author_color || ""}
                        authorFont={(sq.author_font as QuoteFont) || "playfair"}
                        textShadow={(sq.text_shadow as TextShadow) || "none"}
                        authorPosition={(sq.author_position as AuthorPosition) || "below-quote"}
                        backgroundColor={sq.background_color || ""}
                        isBold={sq.is_bold || false}
                        isItalic={sq.is_italic || false}
                      />
                    </div>
                    <button
                      onClick={() => handleDelete(sq.id)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="hidden lg:block sticky top-4 flex-shrink-0" style={{ width: "clamp(280px, 28vw, 400px)" }}>
            <div className="flex justify-center items-start">
              <div className="shadow-xl w-full">
                <QuotePreview
                  ref={previewRef}
                  quote={editorState.quote}
                  authorName={editorState.authorName}
                  authorPhoto={editorState.authorPhoto}
                  socialPlatform={editorState.socialUsername ? editorState.socialPlatform as SocialPlatform : undefined}
                  socials={socials}
                  aspectRatio={editorState.aspectRatio}
                  font={editorState.font}
                  theme={editorState.theme}
                  backgroundImage={editorState.backgroundImage}
                  backgroundOpacity={editorState.backgroundOpacity}
                  fontSize={editorState.fontSize}
                  textAlign={editorState.textAlign}
                  letterSpacing={editorState.letterSpacing}
                  lineHeight={editorState.lineHeight}
                  textColor={editorState.textColor}
                  authorFontSize={editorState.authorFontSize}
                  authorColor={editorState.authorColor}
                  authorFont={editorState.authorFont}
                  textShadow={editorState.textShadow}
                  authorPosition={editorState.authorPosition}
                  backgroundColor={editorState.backgroundColor}
                  isBold={editorState.isBold}
                  isItalic={editorState.isItalic}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
