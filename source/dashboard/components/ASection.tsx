import SectionCard from "./SectionCard";
import { getOverview } from "@/lib/data";

export default async function ASection() {
    const data = await getOverview(); // 서버에서 fetch
    return (
        <SectionCard title="A: 개요">
            <ul className="text-sm leading-6">
                <li>총 사용자: {data.totalUsers.toLocaleString()}</li>
                <li>오늘 활성: {data.activeToday.toLocaleString()}</li>
                <li>에러율: {data.errorRate}%</li>
            </ul>
        </SectionCard>
    );
}
