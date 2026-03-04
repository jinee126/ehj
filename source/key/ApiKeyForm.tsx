// ============================================================
// components/api-key/ApiKeyForm.tsx
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { KeyDetailInfo, GoodsItem, GroupCodeInfo } from "@/types/apiKey";
import { useAllGroupCodes, useApiKeyDetail, saveApiKey } from "@/hooks/useApiKeyData";
import { useCommonCode } from "@/hooks/useCommonCode";
import ProductSettingModal from "./ProductSettingModal";
import ServiceOptionModal from "./ServiceOptionModal";

interface Props {
  keyId?: string;  // 없으면 등록 모드, 있으면 수정 모드
}

const defaultForm: Omit<KeyDetailInfo, "api_key" | "device_id" | "serial_no" | "create_user" | "update_user" | "create_date" | "update_date"> = {
  approve: "",
  u_name: "",
  u_email: "",
  u_company: "",
  u_department: "",
  service_name: "",
  due_date: "",
  web_service: "",
  ios_service: "",
  aos_service: "",
  limit_type: "",
  ip_address: "",
  token: "",
  telemetry: false,
  services: [],
};

export default function ApiKeyForm({ keyId }: Props) {
  const isEditMode = !!keyId;

  // ── 데이터 로딩 ───────────────────────────────────────────
  const { groupCodes: allGroupCodes, loading: groupCodesLoading } = useAllGroupCodes();
  const { detail, loading: detailLoading } = useApiKeyDetail(isEditMode ? keyId : null);

  // 공통코드
  const { codes: approveCodes } = useCommonCode("APPROVE");       // 권한 승인 여부
  const { codes: limitTypeCodes } = useCommonCode("LIMIT_TYPE");  // 서비스 제한 형식

  // ── 폼 상태 ───────────────────────────────────────────────
  const [form, setForm] = useState<Partial<KeyDetailInfo>>(defaultForm);

  // 상품 설정 상태 (모달용 GoodsItem 목록)
  // services[]와 별도로 관리하다가 저장 시 변환
  const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);

  // 수정 모드: API 응답이 오면 폼 데이터 채우기
  useEffect(() => {
    if (!isEditMode || !detail) return;

    setForm({
      approve:      detail.approve,
      u_name:       detail.u_name,
      u_email:      detail.u_email,
      u_company:    detail.u_company,
      u_department: detail.u_department,
      service_name: detail.service_name,
      due_date:     detail.due_date,
      web_service:  detail.web_service,
      ios_service:  detail.ios_service,
      aos_service:  detail.aos_service,
      limit_type:   detail.limit_type,
      ip_address:   detail.ip_address,
      token:        detail.token,
      telemetry:    detail.telemetry,
      api_key:      detail.api_key,
    });

    // services[] → GoodsItem[] 변환 (수정 모드 초기 체크 상태 복원용)
    const mapped: GoodsItem[] = detail.services.map((s) => {
      const groupCodeInfo = allGroupCodes.find((g) => g.group_code === s.group_code);
      return {
        groupCodeInfo: groupCodeInfo ?? { group_code: s.group_code, group_name: s.group_code, group_type: "" },
        check: true,
        serviceOptions: {
          options: s.options,
          limit_size: s.limit_type,
        },
      };
    });
    setGoodsList(mapped);
  }, [isEditMode, detail, allGroupCodes]);

  // ── 모달 상태 ─────────────────────────────────────────────
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [serviceOptionModal, setServiceOptionModal] = useState<{
    open: boolean;
    goods: GoodsItem | null;
  }>({ open: false, goods: null });

  // ── 핸들러 ───────────────────────────────────────────────

  const handleFormChange = (field: keyof KeyDetailInfo, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /** 상품 설정 모달에서 선택 완료 */
  const handleProductConfirm = (selected: GoodsItem[]) => {
    setGoodsList(selected);
  };

  /** 서비스 옵션 모달 열기 */
  const handleOpenServiceOption = (goods: GoodsItem) => {
    setServiceOptionModal({ open: true, goods });
  };

  /** 서비스 옵션 모달에서 선택 완료 → 해당 상품의 serviceOptions 업데이트 */
  const handleServiceOptionConfirm = (updated: GoodsItem) => {
    setGoodsList((prev) =>
        prev.map((g) =>
            g.groupCodeInfo.group_code === updated.groupCodeInfo.group_code ? updated : g
        )
    );
  };

  /** 저장 - GoodsItem[] → services[] 변환 후 전송 */
  const handleSave = async () => {
    const payload: KeyDetailInfo = {
      ...(form as KeyDetailInfo),
      services: goodsList.map((g) => ({
        group_code: g.groupCodeInfo.group_code,
        approve:    form.approve ?? "",
        limit_type: g.serviceOptions.limit_size,
        options:    g.serviceOptions.options,
      })),
    };

    try {
      await saveApiKey(isEditMode ? keyId : null, payload);
      alert(isEditMode ? "수정되었습니다." : "등록되었습니다.");
    } catch (e) {
      alert("저장 실패");
    }
  };

  if ((isEditMode && detailLoading) || groupCodesLoading) {
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
              { label: "신청자명 *",  field: "u_name" },
              { label: "이메일 *",    field: "u_email" },
              { label: "소속기관 *",  field: "u_company" },
              { label: "소속부서 *",  field: "u_department" },
            ].map(({ label, field }) => (
                <div key={field} className="flex items-center gap-2">
                  <label className="text-sm w-24 shrink-0 text-right">{label}</label>
                  <input
                      type="text"
                      value={(form as any)[field] ?? ""}
                      onChange={(e) => handleFormChange(field as keyof KeyDetailInfo, e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                </div>
            ))}

            <div className="flex items-center gap-2">
              <label className="text-sm w-24 shrink-0 text-right">허용일시 *</label>
              <input
                  type="date"
                  value={form.due_date ?? ""}
                  onChange={(e) => handleFormChange("due_date", e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm"
              />
            </div>

            {/* 승인 여부 - 공통코드 */}
            <div className="flex items-center gap-2">
              <label className="text-sm w-24 shrink-0 text-right">사용여부</label>
              <div className="flex gap-4">
                {approveCodes.map((c) => (
                    <label key={c.code} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                          type="radio"
                          name="approve"
                          value={c.code}
                          checked={form.approve === c.code}
                          onChange={() => handleFormChange("approve", c.code)}
                          className="accent-blue-600"
                      />
                      {c.codeName}
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
                    value={form.api_key ?? ""}
                    readOnly
                    placeholder="API KEY"
                    className="flex-1 border rounded px-2 py-1 text-sm bg-gray-50 text-gray-500"
                />
                <button
                    type="button"
                    className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                    onClick={() => navigator.clipboard.writeText(form.api_key ?? "")}
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
              { label: "서비스명 *",           field: "service_name" },
              { label: "WEB(도메인주소)",       field: "web_service" },
              { label: "iOS(bundle ID)",        field: "ios_service" },
              { label: "Android(Package Name)", field: "aos_service" },
            ].map(({ label, field }) => (
                <div key={field} className="flex items-center gap-2">
                  <label className="text-sm w-36 shrink-0">{label}</label>
                  <input
                      type="text"
                      value={(form as any)[field] ?? ""}
                      onChange={(e) => handleFormChange(field as keyof KeyDetailInfo, e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                </div>
            ))}

            {/* 서비스 제한 형식 - 공통코드 */}
            <div>
              <h3 className="font-medium text-sm mb-2">애플리케이션 제한</h3>
              <div className="space-y-1">
                {limitTypeCodes.map((c) => (
                    <label key={c.code} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                          type="radio"
                          name="limit_type"
                          value={c.code}
                          checked={form.limit_type === c.code}
                          onChange={() => handleFormChange("limit_type", c.code)}
                          className="accent-blue-600"
                      />
                      {c.codeName}
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

              {/* 선택된 상품 테이블 */}
              <div className="border rounded overflow-hidden">
                <div className="bg-gray-700 text-white grid grid-cols-[1fr_1fr_80px] text-xs">
                  <div className="py-2 px-2">상품 그룹</div>
                  <div className="py-2 px-2">상품 그룹명</div>
                  <div className="py-2 px-2 text-center">옵션여부</div>
                </div>

                <div className="max-h-40 overflow-y-auto divide-y">
                  {goodsList.length === 0 ? (
                      <div className="text-center text-xs text-gray-400 py-4">
                        상품을 추가하세요.
                      </div>
                  ) : (
                      goodsList.map((goods) => (
                          <button
                              key={goods.groupCodeInfo.group_code}
                              type="button"
                              onClick={() => handleOpenServiceOption(goods)}
                              className="w-full grid grid-cols-[1fr_1fr_80px] items-center hover:bg-gray-50 text-left"
                          >
                            <div className="py-2 px-2 text-xs text-blue-600">
                              {goods.groupCodeInfo.group_type}
                            </div>
                            <div className="py-2 px-2 text-xs text-blue-600">
                              {goods.groupCodeInfo.group_name}
                            </div>
                            <div className="py-2 px-2 text-xs text-center">
                              {goods.serviceOptions.options
                                  ? <span className="text-green-600">✓</span>
                                  : <span className="text-gray-400">-</span>
                              }
                            </div>
                          </button>
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
            allGroupCodes={allGroupCodes}
            initialGoods={goodsList}
            onConfirm={handleProductConfirm}
            onClose={() => setProductModalOpen(false)}
        />

        {/* 서비스 옵션 모달 */}
        <ServiceOptionModal
            open={serviceOptionModal.open}
            goods={serviceOptionModal.goods}
            onConfirm={handleServiceOptionConfirm}
            onClose={() => setServiceOptionModal({ open: false, goods: null })}
        />
      </div>
  );
}
