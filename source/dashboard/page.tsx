// 서버 컴포넌트
import { Suspense } from "react";
import ASection from "./components/ASection";
import BSection from "./components/BSection";
import CSection from "./components/CSection";
import DSection from "./components/DSection";

export default async function DashboardPage() {
    return (
        <main className="p-6 grid gap-6 lg:grid-cols-2">
            {/* 섹션별 Suspense로 부분 로딩 */}
            <Suspense fallback={<SectionSkeleton title="A Section" />}>
                {/* 서버에서 바로 렌더링 */}
                <ASection />
            </Suspense>

            {/* 클라이언트 섹션 (예: 차트/필터) */}
            <Suspense fallback={<SectionSkeleton title="B Section" />}>
                <BSection />
            </Suspense>

            {/* 태그 기반 revalidate 예시 */}
            <Suspense fallback={<SectionSkeleton title="C Section" />}>
                <CSection />
            </Suspense>

            {/* 병렬 로딩/조합 예시 */}
            <Suspense fallback={<SectionSkeleton title="D Section" />}>
                <DSection />
            </Suspense>
        </main>
    );
}

function SectionSkeleton({ title }: { title: string }) {
    return (
        <div className="rounded-2xl border p-4 animate-pulse">
            <div className="h-6 w-40 mb-3 bg-gray-200 rounded" />
            <div className="h-4 w-full mb-2 bg-gray-200 rounded" />
            <div className="h-4 w-5/6 mb-2 bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
        </div>
    );
}
