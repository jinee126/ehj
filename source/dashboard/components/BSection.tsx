"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import SectionCard from "./SectionCard";

// 예: ApexCharts를 클라에서만 로드
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BSection() {
    const [series, setSeries] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        // 클라이언트 전용 API 호출(필요 시 /api/*)
        fetch("/api/metrics")
            .then((r) => r.json())
            .then((res) => {
                setSeries(res.values);
                setLabels(res.labels);
            });
    }, []);

    return (
        <SectionCard title="B: 트래픽 추이(클라이언트)">
            {series.length === 0 ? (
                <div className="text-sm text-gray-500">차트를 불러오는 중...</div>
            ) : (
                <ReactApexChart
                    type="line"
                    height={260}
                    series={[{ name: "Requests", data: series }]}
                    options={{ xaxis: { categories: labels } }}
                />
            )}
        </SectionCard>
    );
}
