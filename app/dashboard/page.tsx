// app/dashboard/page.tsx - Dashboard overview
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, HeartPulse, LineChart, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, fetchProfile, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      fetchProfile().catch(() => router.push("/login"));
    }
  }, [user, fetchProfile, router]);

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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-700">Tani Cerdas Palopo</h1>
          <button
            onClick={logout}
            className="text-gray-600 hover:text-gray-800"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          Selamat datang, {user.name}!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            onClick={() => router.push("/chatbot")}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-blue-600" />
                Chatbot Pertanian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Konsultasi pertanian 24/7 untuk kakao dan padi
              </p>
            </CardContent>
          </Card>

          <Card
            onClick={() => router.push("/disease")}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="h-6 w-6 text-red-600" />
                Deteksi Penyakit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Deteksi hama dan penyakit dari foto tanaman
              </p>
            </CardContent>
          </Card>

          <Card
            onClick={() => router.push("/price")}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-6 w-6 text-green-600" />
                Prediksi Harga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Prediksi harga kakao dan padi 1-4 minggu ke depan
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
