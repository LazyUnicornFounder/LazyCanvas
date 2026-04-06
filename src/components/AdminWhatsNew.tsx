import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Eye, EyeOff } from "lucide-react";

interface WhatsNewPost {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const AdminWhatsNew = () => {
  const [posts, setPosts] = useState<WhatsNewPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<WhatsNewPost | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("whats_new_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load posts");
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setContent("");
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);

    if (editing) {
      const { error } = await supabase
        .from("whats_new_posts")
        .update({ title: title.trim(), content: content.trim() })
        .eq("id", editing.id);
      if (error) toast.error("Failed to update");
      else { toast.success("Post updated"); resetForm(); fetchPosts(); }
    } else {
      const { error } = await supabase
        .from("whats_new_posts")
        .insert({ title: title.trim(), content: content.trim() });
      if (error) toast.error("Failed to create post");
      else { toast.success("Post created"); resetForm(); fetchPosts(); }
    }
    setSaving(false);
  };

  const togglePublish = async (post: WhatsNewPost) => {
    const newState = !post.is_published;
    const { error } = await supabase
      .from("whats_new_posts")
      .update({
        is_published: newState,
        published_at: newState ? new Date().toISOString() : null,
      })
      .eq("id", post.id);
    if (error) toast.error("Failed to update");
    else { toast.success(newState ? "Published" : "Unpublished"); fetchPosts(); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("whats_new_posts").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Deleted"); fetchPosts(); }
  };

  const startEdit = (post: WhatsNewPost) => {
    setEditing(post);
    setTitle(post.title);
    setContent(post.content);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Form */}
      <div className="border border-border rounded-lg p-4 space-y-3 bg-card">
        <h3 className="font-heading text-sm font-semibold">
          {editing ? "Edit Post" : "New Post"}
        </h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <textarea
          placeholder="Content (supports plain text)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-foreground text-background rounded-md text-xs font-heading font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : editing ? "Update" : "Create"}
          </button>
          {editing && (
            <button onClick={resetForm} className="px-4 py-2 border border-border rounded-md text-xs font-heading text-muted-foreground hover:text-foreground">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post.id} className="border border-border rounded-lg p-4 bg-card flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-heading text-sm font-semibold truncate">{post.title}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${post.is_published ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{post.content}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => togglePublish(post)} className="p-1.5 rounded hover:bg-accent" title={post.is_published ? "Unpublish" : "Publish"}>
                  {post.is_published ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
                </button>
                <button onClick={() => startEdit(post)} className="p-1.5 rounded hover:bg-accent" title="Edit">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded hover:bg-accent" title="Delete">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWhatsNew;
