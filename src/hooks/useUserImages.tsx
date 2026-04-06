import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface UserImage {
  id: string;
  file_url: string;
  file_name: string;
  created_at: string;
}

export function useUserImages() {
  const { user } = useAuth();
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchImages = useCallback(async () => {
    if (!user) { setImages([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from("user_images")
      .select("id, file_url, file_name, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setImages((data as unknown as UserImage[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const uploadImage = useCallback(async (file: File) => {
    if (!user) return null;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("user-images")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("user-images")
        .getPublicUrl(filePath);

      const fileUrl = urlData.publicUrl;

      await supabase.from("user_images").insert({
        user_id: user.id,
        file_path: filePath,
        file_name: file.name,
        file_url: fileUrl,
      });

      await fetchImages();
      return fileUrl;
    } catch (err) {
      console.error("Upload error:", err);
      const { toast } = await import("sonner");
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  }, [user, fetchImages]);

  const deleteImage = useCallback(async (id: string, filePath?: string) => {
    if (!user) return;
    // Find file_path if not provided
    if (!filePath) {
      const img = images.find((i) => i.id === id);
      if (!img) return;
      // Extract path from URL
      const url = img.file_url;
      const bucketPath = url.split("/user-images/")[1];
      if (bucketPath) {
        await supabase.storage.from("user-images").remove([decodeURIComponent(bucketPath)]);
      }
    } else {
      await supabase.storage.from("user-images").remove([filePath]);
    }
    await supabase.from("user_images").delete().eq("id", id).eq("user_id", user.id);
    await fetchImages();
  }, [user, images, fetchImages]);

  return { images, loading, uploading, uploadImage, deleteImage, refetch: fetchImages };
}
