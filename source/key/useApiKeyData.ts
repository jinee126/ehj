// ============================================================
// hooks/useApiKeyData.ts
// ============================================================
import { useState, useEffect } from "react";
import { ApiKeyDetail, ApiKeyFormData, Product } from "@/types/apiKey";

// ── Mock 데이터 ──────────────────────────────────────────────

const MOCK_ALL_PRODUCTS: Product[] = [
  { productId: "p1", productName: "경로탐색(DIRECTION_PLUS)", productCode: "DIRECTION_PLUS", productGroup: "자동차그룹사" },
  { productId: "p2", productName: "통합검색(PLACE_PLUS)",     productCode: "PLACE_PLUS",     productGroup: "자동차그룹사" },
  { productId: "p3", productName: "지도(MAPS_PLUS)",          productCode: "MAPS_PLUS",      productGroup: "그룹사" },
  { productId: "p4", productName: "Geocoding(GEOCODING_PLUS)",productCode: "GEOCODING_PLUS", productGroup: "그룹사" },
  { productId: "p5", productName: "SDK(SDK)",                 productCode: "SDK",            productGroup: "그룹사 외" },
  { productId: "p6", productName: "MATRIX 경로탐색(MATRIX)",  productCode: "MATRIX",         productGroup: "그룹사 외" },
];

const MOCK_KEY_DETAIL: ApiKeyDetail = {
  keyId: "key-001",
  requesterName: "홍길동",
  email: "hong@example.com",
  organization: "현대오토에버",
  department: "지도서비스팀",
  requestDate: "2024-01-15",
  expiryDate: "2025-01-15",
  useYn: "Y",
  serviceName: "내비게이션 서비스",
  webDomain: "https://example.com",
  iosBundleId: "com.example.app",
  androidPackageName: "com.example.app",
  appRestriction: "없음",
  apiKey: "abc123-def456-ghi789",
  // 수정 모드: p1, p3이 이미 매핑된 상태
  mappedProducts: [
    {
      productId: "p1",
      productName: "경로탐색(DIRECTION_PLUS)",
      productCode: "DIRECTION_PLUS",
      productGroup: "자동차그룹사",
      useYn: "Y",
      options: [],
    },
    {
      productId: "p3",
      productName: "지도(MAPS_PLUS)",
      productCode: "MAPS_PLUS",
      productGroup: "그룹사",
      useYn: "Y",
      options: [
        { optionId: "o1", serviceApi: "/v1/reverselabel", optionFormat: "FIXED", value: "limited", key: "1" },
      ],
    },
  ],
  createdAt: "2024-01-15T09:00:00",
  updatedAt: "2024-06-01T12:00:00",
};

// ── Hooks ────────────────────────────────────────────────────

/** 전체 상품 목록 조회 */
export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 호출로 교체
    // const res = await fetch("/api/products")
    setTimeout(() => {
      setProducts(MOCK_ALL_PRODUCTS);
      setLoading(false);
    }, 300);
  }, []);

  return { products, loading };
}

/** 키 상세 조회 (수정 모드) */
export function useApiKeyDetail(keyId: string | null) {
  const [detail, setDetail] = useState<ApiKeyDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!keyId) return;

    setLoading(true);
    // TODO: 실제 API 호출로 교체
    // const res = await fetch(`/api/keys/${keyId}`)
    setTimeout(() => {
      setDetail(MOCK_KEY_DETAIL);
      setLoading(false);
    }, 400);
  }, [keyId]);

  return { detail, loading };
}

/** 저장 (등록/수정) */
export async function saveApiKey(keyId: string | null, data: ApiKeyFormData): Promise<void> {
  if (keyId) {
    // TODO: PUT /api/keys/${keyId}
    console.log("[수정]", keyId, data);
  } else {
    // TODO: POST /api/keys
    console.log("[등록]", data);
  }
  await new Promise((r) => setTimeout(r, 500)); // mock delay
}
