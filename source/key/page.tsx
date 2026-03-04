// ============================================================
// app/api-key/page.tsx  → 등록 모드
// app/api-key/[keyId]/page.tsx  → 수정 모드
// ============================================================

// [등록] app/api-key/page.tsx
import ApiKeyForm from "@/components/api-key/ApiKeyForm";

export default function ApiKeyCreatePage() {
  return <ApiKeyForm />;
}

// ============================================================

// [수정] app/api-key/[keyId]/page.tsx
// import ApiKeyForm from "@/components/api-key/ApiKeyForm";
//
// export default function ApiKeyEditPage({ params }: { params: { keyId: string } }) {
//   return <ApiKeyForm keyId={params.keyId} />;
// }
