// ============================================================
// components/api-key/ApiKeyForm.tsx
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { KeyDetailInfo, GoodsItem, Services, ServiceOptions } from "@/types/apiKey";
import { useCommonCode } from "@/hooks/useCommonCode";
import { saveApiKey } from "@/hooks/useApiKeyData";
import ProductSettingModal from "./ProductSettingModal";
import ServiceOptionModal from "./ServiceOptionModal";

const PAGE_MODE = {
  REG: "REG",
  EDIT: "EDIT",
} as const;

interface Props {
  id: string;  // 등록이면 PAGE_MODE.REG, 수정이면 keyId 값
}

export default function ApiKeyForm({ id }: Props) {
  const [detailPageMode] = useState(
      id === PAGE_MODE.REG ? PAGE_MODE.REG : PAGE_MODE.EDIT
  );

  // ── 공통코드 ──────────────────────────────────────────────
  const { codes: useYnCodes }     = useCommonCode("USEYN");
  const { codes: limitTypeCodes } = useCommonCode("LIMITTYPE");
  const { codes: monthCodes }     = useCommonCode("MONTH");

  // ── 전체 상품 목록 (ProductSettingModal용) ────────────────
  const [allGoods, setAllGoods] = useState<GoodsItem[]>([]);

  // ── 폼 상태 (services[]가 상품코드 단일 원본) ─────────────
  const [form, setForm] = useState<Partial<KeyDetailInfo>>({});

  // ── 로딩 상태 ─────────────────────────────────────────────
  const [detailLoading, setDetailLoading] = useState(false);
  const [goodsLoading, setGoodsLoading] = useState(false);

  // ── 전체 상품 목록 조회 (등록/수정 공통) ─────────────────
  useEffect(() => {
    const fetchGoods = async () => {
      setGoodsLoading(true);
      try {
        const resultData = await callGetAPI(
            BASE_URL + `/management/group-codes`,
            HTTP_METHOD.GET,
            {},
            {}
        );
        if (resultData.resultCode === ResultCode.ET00) {
          if (resultData.resCode === ServerResCode.OK) {
            // 백엔드 응답을 GoodsItem 형태로 변환
            const goods: GoodsItem[] = (resultData.data as any[]).map((d) => ({
              group_code: d.group_code,
              group_name: d.group_name,
              check: false,
            }));
            setAllGoods(goods);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setGoodsLoading(false);
      }
    };

    fetchGoods();
  }, []);

  // ── 등록 모드: 신청일 현재일로 초기 세팅 ─────────────────
  useEffect(() => {
    if (detailPageMode === PAGE_MODE.REG) {
      setForm({ create_date: formatDate(new Date()) });
    }
  }, [detailPageMode]);

  // ── 상세 조회 (수정 모드) ─────────────────────────────────
  useEffect(() => {
    if (detailPageMode !== PAGE_MODE.EDIT) return;

    const fetchDetail = async () => {
      setDetailLoading(true);
      try {
        const resultData = await callGetAPI(
            BASE_URL + `/management/key/${id}`,
            HTTP_METHOD.GET,
            {},
            {}
        );
        if (resultData.resultCode === ResultCode.ET00) {
          if (resultData.resCode === ServerResCode.OK) {
            // services[] 포함해서 form에 그대로 세팅
            setForm({ ...resultData.data as KeyDetailInfo });
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [detailPageMode]);

  // ── 모달 상태 ─────────────────────────────────────────────
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [serviceOptionModal, setServiceOptionModal] = useState<{
    open: boolean;
    groupCode: string;
    groupName: string;
  }>({ open: false, groupCode: "", groupName: "" });

  // ── 핸들러 ───────────────────────────────────────────────

  const handleFormChange = (field: keyof KeyDetailInfo, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // 허용기간 선택 → due_date 자동 계산
  const dateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const monthCode = e.target.value;
    if (!monthCode) return;

    const base = form.create_date ? new Date(form.create_date) : new Date();
    switch (monthCode) {
      case "3":  base.setMonth(base.getMonth() + 3);       break;
      case "6":  base.setMonth(base.getMonth() + 6);       break;
      case "12": base.setFullYear(base.getFullYear() + 1); break;
    }
    setForm((prev) => ({ ...prev, due_date: formatDate(base) }));
  };

  // form.services → GoodsItem[] 변환 (ProductSettingModal 체크 상태용)
  const toInitialGoods = (): GoodsItem[] => {
    return (form.services ?? []).map((s) => ({
      group_code: s.group_code,
      group_name: s.group_name,
      check: true,
    }));
  };

  // 상품 설정 모달 선택 완료
  // 기존에 있던 상품이면 options/limit_type 유지, 새 상품이면 초기값
  const handleProductConfirm = (selected: GoodsItem[]) => {
    setForm((prev) => ({
      ...prev,
      services: selected.map((g) => {
        const existing = (prev.services ?? []).find(
            (s) => s.group_code === g.group_code
        );
        return existing ?? {
          group_code: g.group_code,
          group_name: g.group_name,
          approve:    prev.approve ?? "",
          limit_type: 0,
          options:    "",
        };
      }),
    }));
  };

  // 상품 행 더블클릭 → 서비스 옵션 모달 열기
  const handleOpenServiceOption = (service: Services) => {
    setServiceOptionModal({
      open:      true,
      groupCode: service.group_code,
      groupName: service.group_name,
    });
  };

  // 서비스 옵션 모달 선택 완료 → form.services 업데이트
  const handleServiceOptionConfirm = (groupCode: string, serviceOptions: ServiceOptions) => {
    setForm((prev) => ({
      ...prev,
      services: (prev.services ?? []).map((s) =>
          s.group_code === groupCode
              ? { ...s, options: serviceOptions.options, limit_type: serviceOptions.limit_size }
              : s
      ),
    }));
  };

  // 저장
  const handleSave = async () => {
    try {
      await saveApiKey(detailPageMode === PAGE_MODE.EDIT ? id : null, form as KeyDetailInfo);
      alert(detailPageMode === PAGE_MODE.EDIT ? "수정되었습니다." : "등록되었습니다.");
    } catch (e) {
      alert("저장 실패");
    }
  };

  if (detailLoading || goodsLoading) {
    return <div className="p-8 text-center text-gray-500">로딩 중...</div>;
  }

  return (
      <div className="p-6 bg-white max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-6">
          ■ API KEY {detailPageMode === PAGE_MODE.EDIT ? "수정" : "등록"}
        </h1>

        <div className="grid grid-cols-2 gap-6">
          {/* ── 담당자 정보 ───────────────────────────── */}
          <section className="space-y-3">
            <h2 className="font-semibold border-b pb-1">담당자 정보</h2>

            {[
              { label: "신청자명 *", field: "u_name" },
              { label: "이메일 *",   field: "u_email" },
              { label: "소속기관 *", field: "u_company" },
              { label: "소속부서 *", field: "u_department" },
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

            {/* 신청일시 - 등록 시 현재일 자동 세팅 */}
            <div className="flex items-center gap-2">
              <label className="text-sm w-24 shrink-0 text-right">신청일시</label>
              <input
                  type="text"
                  value={form.create_date ?? ""}
                  readOnly
                  className="flex-1 border rounded px-2 py-1 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            {/* 허용일시 - MONTH 공통코드 선택 → due_date 자동 계산 */}
            <div className="flex items-center gap-2">
              <label className="text-sm w-24 shrink-0 text-right">허용일시 *</label>
              <select
                  onChange={dateChange}
                  className="w-32 border rounded px-2 py-1 text-sm"
              >
                <option value="">허용기간선택</option>
                {monthCodes.map((c) => (
                    <option key={c.code} value={c.code}>{c.codeName}</option>
                ))}
              </select>
              <input
                  type="text"
                  value={form.due_date ?? ""}
                  readOnly
                  placeholder="yyyy-mm-dd"
                  className="flex-1 border rounded px-2 py-1 text-sm bg-gray-50 text-gray-500"
              />
            </div>

            {/* 사용여부 - USEYN 공통코드 */}
            <div className="flex items-center gap-2">
              <label className="text-sm w-24 shrink-0 text-right">사용여부</label>
              <div className="flex gap-4">
                {useYnCodes.map((c) => (
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
                    onClick={async () => {
                      if (!form.api_key) {
                        alert("복사할 API KEY가 없습니다.");
                        return;
                      }
                      await navigator.clipboard.writeText(form.api_key);
                      alert("API KEY가 복사되었습니다.");
                    }}
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
              { label: "서비스명 *",            field: "service_name" },
              { label: "WEB(도메인주소)",        field: "web_service" },
              { label: "iOS(bundle ID)",         field: "ios_service" },
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

            {/* 애플리케이션 제한 - LIMITTYPE 공통코드 */}
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

            {/* 상품 설정 - form.services[] 직접 렌더링 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm">상품 설정 *</h3>
                <button
                    type="button"
                    onClick={() => setProductModalOpen(true)}
                    disabled={detailLoading}
                    className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  추가/삭제
                </button>
              </div>

              <div className="border rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="py-2 px-2 text-left font-medium">상품코드</th>
                    <th className="py-2 px-2 text-left font-medium">상품명</th>
                    <th className="py-2 px-2 text-center font-medium w-20">옵션여부</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y">
                  {(form.services ?? []).length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-gray-400 py-4">
                          상품을 추가하세요.
                        </td>
                      </tr>
                  ) : (
                      (form.services ?? []).map((service) => (
                          <tr
                              key={service.group_code}
                              onDoubleClick={() => handleOpenServiceOption(service)}
                              className="cursor-pointer hover:bg-gray-50"
                              title="더블클릭 시 서비스 옵션 설정"
                          >
                            <td className="py-2 px-2 text-blue-600">{service.group_code}</td>
                            <td className="py-2 px-2 text-blue-600">{service.group_name}</td>
                            <td className="py-2 px-2 text-center">
                              {service.options
                                  ? <span className="text-green-600">✓</span>
                                  : <span className="text-gray-400">-</span>
                              }
                            </td>
                          </tr>
                      ))
                  )}
                  </tbody>
                </table>
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
            allGoods={allGoods}
            initialGoods={toInitialGoods()}
            onConfirm={handleProductConfirm}
            onClose={() => setProductModalOpen(false)}
        />

        {/* 서비스 옵션 모달 */}
        <ServiceOptionModal
            open={serviceOptionModal.open}
            groupCode={serviceOptionModal.groupCode}
            groupName={serviceOptionModal.groupName}
            initialOptions={
                form.services?.find((s) => s.group_code === serviceOptionModal.groupCode)?.options ?? ""
            }
            onConfirm={handleServiceOptionConfirm}
            onClose={() => setServiceOptionModal({ open: false, groupCode: "", groupName: "" })}
        />
      </div>
  );
}
