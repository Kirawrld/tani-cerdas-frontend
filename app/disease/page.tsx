// app/disease/page.tsx - Deteksi penyakit tanaman
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Camera, HeartPulse } from "lucide-react";

export default function DiseasePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [commodity, setCommodity] = useState<"kakao" | "padi">("kakao");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDetect = async () => {
    if (!selectedImage) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("commodity", commodity);

    try {
      const res = await api.post("/api/disease/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err: any) {
      setResult({ error: err?.response?.data?.detail || "Gagal mendeteksi." });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-green-700">Deteksi Penyakit Tanaman</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload Foto Tanaman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Pilih Komoditas</Label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="commodity"
                        checked={commodity === "kakao"}
                        onChange={() => setCommodity("kakao")}
                      />
                      <span>Kakao</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="commodity"
                        checked={commodity === "padi"}
                        onChange={() => setCommodity("padi")}
                      />
                      <span>Padi</span>
                    </label>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-48 max-w-full mx-auto rounded"
                    />
                  ) : (
                    <Camera className="h-12 w-12 mx-auto text-gray-400" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4"
                  />
                </div>

                {selectedImage && (
                  <Button
                    onClick={handleDetect}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Memproses..." : "Deteksi Penyakit"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hasil Deteksi</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                result.error ? (
                  <p className="text-red-500">{result.error}</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="font-medium">Penyakit Terdeteksi:</Label>
                      <p className="text-lg">{result.detected_disease}</p>
                    </div>
                    <div>
                      <Label className="font-medium">Confidence:</Label>
                      <p className="text-lg">{Math.round(result.confidence * 100)}%</p>
                    </div>
                    <div>
                      <Label className="font-medium">Rekomendasi Pengobatan:</Label>
                      <p className="text-sm">{result.treatment_recommendation}</p>
                    </div>
                    {result.image_url && (
                      <div>
                        <Label className="font-medium">Gambar Tanaman:</Label>
                        <img
                          src={result.image_url}
                          alt="Tanaman"
                          className="max-w-full rounded"
                        />
                      </div>
                    )}
                  </div>
                )
              ) : (
                <p className="text-gray-500">
                  Upload foto tanaman dan klik "Deteksi Penyakit" untuk memulai.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
