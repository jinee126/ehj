// ============================================================
// components/api-key/ApiKeyForm.tsx
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { ApiKeyFormData, MappedProduct, AppRestriction } from "@/types/apiKey";
import { useAllProducts, useApiKeyDetail, saveApiKey } from "@/hooks/useApiKeyData";
import ProductSettingModal from "./ProductSettingModal";
import ServiceOptionModal from "./ServiceOptionModal";

interface Props {
  keyId?: string;  // 없으면 등록 모드, 있으면 수정 모드
}

const APP_RESTRICTIONS: AppRestriction[] = ["없음", "HTTP(Referer)", "IP(서버)", "Android", "iOS"];

const defaultForm: ApiKeyFormData = {
  requesterName: "",
  email: "",
  organization: "",
  department: "",
  requestDate: "",
  expiryDate: "",
  useYn: "Y",
  serviceName: "",
  webDomain: "",
  iosBundleId: "",
  androidPackageName: "",
  appRestriction: "없음",
  mappedProducts: [],
};

export default function ApiKeyForm({ keyId }: Props) {
  const isEditMode = !!keyId;

  // ── 데이터 로딩 ───────────────────────────────────────────
  const { products: allProducts, loading: productsLoading } = useAllProducts();
  const { detail, loading: detailLoading } = useApiKeyDetail(isEditMode ? keyId : null);

  // ── 폼 상태 ───────────────────────────────────────────────
  const [form, setForm] = useState<ApiKeyFormData>(defaultForm);

  // 수정 모드: API 응답이 오면 폼 데이터 채우기
  useEffect(() => {
    if (isEditMode && detail) {
      setForm({
        requesterName:      detail.requesterName,
        email:              detail.email,
        organization:       detail.organization,
        department:         detail.department,
        requestDate:        detail.requestDate,
        expiryDate:         detail.expiryDate,
        useYn:              detail.useYn,
        serviceName:        detail.serviceName,
        webDomain:          detail.webDomain,
        iosBundleId:        detail.iosBundleId,
        androidPackageName: detail.androidPackageName,
        appRestriction:     detail.appRestriction,
        mappedProducts:     detail.mappedProducts,  // ← 기존 매핑 상품 목록
        apiKey:             detail.apiKey,
      });
    }
  }, [isEditMode, detail]);

  // ── 모달 상태 ─────────────────────────────────────────────
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [serviceOptionModal, setServiceOptionModal] = useState<{
    open: boolean;
    product: MappedProduct | null;
  }>({ open: false, product: null });

  // ── 핸들러 ───────────────────────────────────────────────

  const handleFormChange = (field: keyof ApiKeyFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /** 상품 설정 모달에서 선택 완료 */
  const handleProductConfirm = (selected: MappedProduct[]) => {
    setForm((prev) => ({ ...prev, mappedProducts: selected }));
  };

  /** 서비스 옵션 모달 열기 (상품 행 클릭) */
  const handleOpenServiceOption = (product: MappedProduct) => {
    setServiceOptionModal({ open: true, product });
  };

  /** 서비스 옵션 모달에서 선택 완료 → 해당 상품의 options 업데이트 */
  const handleServiceOptionConfirm = (updated: MappedProduct) => {
    setForm((prev) => ({
      ...prev,
      mappedProducts: prev.mappedProducts.map((p) =>
        p.productId === updated.productId ? updated : p
      ),
    }));
  };

  /** 상품 행 삭제 */
  const handleRemoveProduct = (productId: string) => {
    setForm((prev) => ({
      ...prev,
      mappedProducts: prev.mappedProducts.filter((p) => p.productId !== productId),
    }));
  };

  /** 저장 */
  const handleSave = async () => {
    try {
      await saveApiKey(isEditMode ? keyId : null, form);
      alert(isEditMode ? "수정되었습니다." : "등록되었습니다.");
    } catch (e) {
      alert("저장 실패");
    }
  };

  if ((isEditMode && detailLoading) || productsLoading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  }

  return (
    <div className="p-6 bg-white max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">
        ■ API KEY {isEditMode ? "수정" : "등록"}
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* ── 담당자 정보 ───────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-semibold border-b pb-1">담당자 정보</h2>

          {[
            { label: "신청자명 *", field: "requesterName" },
            { label: "이메일 *",   field: "email" },
            { label: "소속기관 *", field: "organization" },
            { label: "소속부서 *", field: "department" },
            { label: "신청일시",   field: "requestDate" },
          ].map(({ label, field }) => (
            <div key={field} className="flex items-center gap-2">
              <label className="text-sm w-24 shrink-0 text-right">{label}</label>
              <input
                type="text"
                value={(form as any)[field]}
                onChange={(e) => handleFormChange(field as keyof ApiKeyFormData, e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
            </div>
          ))}

          <div className="flex items-center gap-2">
            <label className="text-sm w-24 shrink-0 text-right">허용일시 *</label>
            <input
              type="date"
              value={form.expiryDate}
              onChange={(e) => handleFormChange("expiryDate", e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm w-24 shrink-0 text-right">사용여부</label>
            <div className="flex gap-4">
              {["Y", "N"].map((v) => (
                <label key={v} className="flex items-center gap-1 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="useYn"
                    value={v}
                    checked={form.useYn === v}
                    onChange={() => handleFormChange("useYn", v)}
                    className="accent-blue-600"
                  />
                  {v === "Y" ? "사용" : "미사용"}
                </label>
              ))}
            </div>
          </div>

          {/* API KEY 발급 */}
          <div className="pt-2 space-y-2">
            <h3 className="font-medium text-sm">API KEY 발급</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.apiKey ?? ""}
                readOnly
                placeholder="API KEY"
                className="flex-1 border rounded px-2 py-1 text-sm bg-gray-50 text-gray-500"
              />
              <button
                type="button"
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                onClick={() => alert("KEY 복사")}
              >
                KEY 복사
              </button>
            </div>
          </div>
        </section>

        {/* ── 서비스 정보 ───────────────────────────── */}
        <section className="space-y-3">
          <h2 className="font-semibold border-b pb-1">서비스 정보</h2>

          {[
            { label: "서비스명 *",             field: "serviceName" },
            { label: "WEB(도메인주소)",         field: "webDomain" },
            { label: "iOS(bundle ID)",          field: "iosBundleId" },
            { label: "Android(Package Name)",   field: "androidPackageName" },
          ].map(({ label, field }) => (
            <div key={field} className="flex items-center gap-2">
              <label className="text-sm w-36 shrink-0">{label}</label>
              <input
                type="text"
                value={(form as any)[field]}
                onChange={(e) => handleFormChange(field as keyof ApiKeyFormData, e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
            </div>
          ))}

          {/* 애플리케이션 제한 */}
          <div>
            <h3 className="font-medium text-sm mb-2">애플리케이션 제한</h3>
            <div className="space-y-1">
              {APP_RESTRICTIONS.map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="appRestriction"
                    value={r}
                    checked={form.appRestriction === r}
                    onChange={() => handleFormChange("appRestriction", r)}
                    className="accent-blue-600"
                  />
                  {r}
                </label>
              ))}
            </div>
          </div>

          {/* 상품 설정 */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-sm">상품 설정 *</h3>
              <button
                type="button"
                onClick={() => setProductModalOpen(true)}
                className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
              >
                추가/삭제
              </button>
            </div>

            {/* 매핑된 상품 테이블 */}
            <div className="border rounded overflow-hidden">
              <div className="bg-gray-700 text-white grid grid-cols-[1fr_1fr_80px_40px] text-xs">
                <div className="py-2 px-2">상품 그룹</div>
                <div className="py-2 px-2">상품 그룹명</div>
                <div className="py-2 px-2">옵션여부</div>
                <div className="py-2 px-2"></div>
              </div>

              <div className="max-h-40 overflow-y-auto divide-y">
                {form.mappedProducts.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-4">
                    상품을 추가하세요.
                  </div>
                ) : (
                  form.mappedProducts.map((product) => (
                    <div
                      key={product.productId}
                      className="grid grid-cols-[1fr_1fr_80px_40px] items-center hover:bg-gray-50"
                    >
                      {/* 상품 그룹 / 그룹명 클릭 → 서비스 옵션 모달 */}
                      <button
                        type="button"
                        onClick={() => handleOpenServiceOption(product)}
                        className="py-2 px-2 text-xs text-left text-blue-600 hover:underline"
                      >
                        {product.productGroup}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenServiceOption(product)}
                        className="py-2 px-2 text-xs text-left text-blue-600 hover:underline"
                      >
                        {product.productName}
                      </button>
                      <div className="py-2 px-2 text-xs text-center">
                        {product.options.length > 0 ? (
                          <span className="text-green-600">✓ {product.options.length}개</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                      {/* 삭제 버튼 */}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.productId)}
                        className="py-2 px-2 text-xs text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 하단 버튼 ───────────────────────────────── */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          저장
        </button>
        <button
          type="button"
          onClick={() => history.back()}
          className="px-8 py-2 bg-white border rounded hover:bg-gray-50"
        >
          취소
        </button>
      </div>

      {/* ── 모달 ────────────────────────────────────── */}

      {/* 상품 설정 모달 */}
      <ProductSettingModal
        open={productModalOpen}
        allProducts={allProducts}
        initialMapped={form.mappedProducts}   // ← 수정모드면 기존 매핑 상품 전달
        onConfirm={handleProductConfirm}
        onClose={() => setProductModalOpen(false)}
      />

      {/* 서비스 옵션 모달 */}
      <ServiceOptionModal
        open={serviceOptionModal.open}
        product={serviceOptionModal.product}
        onConfirm={handleServiceOptionConfirm}
        onClose={() => setServiceOptionModal({ open: false, product: null })}
      />
    </div>
  );
}
