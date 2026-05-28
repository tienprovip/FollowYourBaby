import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export interface OcrExtracted {
  visit_date: string | null;
  facility_name: string | null;
  doctor_name: string | null;
  weight_kg: number | null;
  blood_pressure: string | null;
  fetal_heartbeat: number | null;
  notes: string | null;
  next_visit_date: string | null;
}

export interface OcrResult {
  extracted: OcrExtracted;
  confidence: 'high' | 'medium' | 'low';
  document_url: string | null;
}

export type ImageSource = 'camera' | 'library';

export function useOcrVisit(pregnancyId: string | null) {
  const userId = useAuthStore((s) => s.user?.id);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickAndExtract(source: ImageSource = 'library'): Promise<OcrResult | null> {
    setError(null);

    // Request permissions
    if (source === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setError('Cần cấp quyền truy cập camera.');
        return null;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Cần cấp quyền truy cập thư viện ảnh.');
        return null;
      }
    }

    // Launch picker
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          quality: 0.5,
          base64: true,
          allowsEditing: true,
          aspect: [4, 3],
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          quality: 0.5,
          base64: true,
          allowsEditing: false,
        });

    if (result.canceled || !result.assets[0]) return null;

    const asset = result.assets[0];
    if (!asset.base64) {
      setError('Không thể đọc ảnh. Vui lòng thử lại.');
      return null;
    }

    if (!pregnancyId || !userId) {
      setError('Không tìm thấy thông tin thai kỳ.');
      return null;
    }

    setIsExtracting(true);
    try {
      // Upload image to storage
      let document_url: string | null = null;
      try {
        const ext = asset.uri.split('.').pop()?.toLowerCase() ?? 'jpg';
        const path = `${userId}/${pregnancyId}_${Date.now()}.${ext}`;
        const base64Data = asset.base64;
        const byteArray = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        const { error: uploadError } = await supabase.storage
          .from('medical-docs')
          .upload(path, byteArray, {
            contentType: asset.mimeType ?? 'image/jpeg',
            upsert: false,
          });

        // Store the storage path (not a public URL) — medical-docs is private.
        // Generate signed URLs on-demand when displaying.
        if (!uploadError) {
          document_url = `medical-docs/${path}`;
        }
      } catch {
        // Upload failure is non-fatal — OCR still runs
      }

      // Call OCR edge function
      const { data, error: fnError } = await supabase.functions.invoke('ocr-visit', {
        body: {
          image_base64: asset.base64,
          pregnancy_id: pregnancyId,
          media_type: (asset.mimeType as 'image/jpeg' | 'image/png' | 'image/webp') ?? 'image/jpeg',
        },
      });

      if (fnError) throw new Error(fnError.message);

      return {
        extracted: data.extracted as OcrExtracted,
        confidence: data.confidence as 'high' | 'medium' | 'low',
        document_url,
      };
    } catch (err) {
      setError('Không thể xử lý ảnh. Vui lòng thử lại.');
      return null;
    } finally {
      setIsExtracting(false);
    }
  }

  return { pickAndExtract, isExtracting, error };
}
