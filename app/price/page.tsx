// app/price/page.tsx - Prediksi harga komoditas
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

export default function PricePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [commodity, setCommodity] = useState<"kakao" | "padi">("kakao");
  const [loading, setLoading] = useState(false);
  const [forecastData, setForecastData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/price/forecast?commodity=${commodity}&weeks=4`);
      setForecastData(res.data);
    } catch (err: any) {
      setForecastData({ error: err?.response?.data?.detail || "Gagal memuat prediksi." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [commodity]);

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
          <h1 className="text-xl font-bold text-green-700">Prediksi Harga Komoditas</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex gap-4">
            <Button
              variant={commodity === "kakao" ? "default" : "outline"}
              onClick={() => setCommodity("kakao")}
            >
              Kakao
            </Button>
            <Button
              variant={commodity === "padi" ? "default" : "outline"}
              onClick={() => setCommodity("padi")}
            >
              Padi
            </Button>
          </div>

          {loading && (
            <p className="text-gray-500">Memuat prediksi harga...</p>
          )}

          {forecastData?.error && (
            <p className="text-red-500">{forecastData.error}</p>
          )}

          {forecastData && !forecastData.error && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Prediksi Harga {commodity === "kakao" ? "Kakao" : "Padi"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={forecastData.forecasts || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={["dataMin", "dataMax"]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="predicted_price"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="confidence_lower"
                          stroke="#9ca3af"
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="confidence_upper"
                          stroke="#9ca3af"
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {forecastData.recommendation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Rekomendasi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3">
                      {forecastData.recommendation.action === "sell_now" ? (
                        <TrendingDown className="h-6 w-6 text-green-600" />
                      ) : (
                        <TrendingUp className="h-6 w-6 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {forecastData.recommendation.action === "sell_now"
                            ? "Jual Sekarang"
                            : "Tunda Penjualan"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {forecastData.recommendation.reason}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
