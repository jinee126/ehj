import { getOverview } from "@/lib/data";

export default async function ASection() {
    const data = await getOverview();
    return (
        <section className="rounded-2xl border p-4 bg-white">
            <h2 className="text-lg font-semibold mb-3">A: 개요</h2>
            <ul className="text-sm leading-6">
                <li>총 사용자: {data.totalUsers.toLocaleString()}</li>
                <li>오늘 활성: {data.activeToday.toLocaleString()}</li>
                <li>에러율: {data.errorRate}%</li>
            </ul>
        </section>
    );
}