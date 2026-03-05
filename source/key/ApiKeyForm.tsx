// ============================================================
// components/api-key/ApiKeyForm.tsx
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { KeyDetailInfo, GoodsItem, GroupCodeInfo } from "@/types/apiKey";
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

const defaultForm: Partial<KeyDetailInfo> = {
  approve:      "",
  u_name:       "",
  u_email:      "",
  u_company:    "",
  u_department: "",
  service_name: "",
  due_date:     "",
  web_service:  "",
  ios_service:  "",
  aos_service:  "",
  limit_type:   "",
  ip_address:   "",
  token:        "",
  telemetry:    false,
  api_key:      "",
  services:     [],
};

export default function ApiKeyForm({ id }: Props) {
  const [detailPageMode, setDetailPageMode] = useState(
      id === PAGE_MODE.REG ? PAGE_MODE.REG : PAGE_MODE.EDIT
  );

  // ── 공통코드 ──────────────────────────────────────────────
  const { codes: useYnCodes }     = useCommonCode("USEYN");
  const { codes: limitTypeCodes } = useCommonCode("LIMITTYPE");
  const { codes: monthCodes }     = useCommonCode("MONTH");

  // ── 전체 상품 목록 ────────────────────────────────────────
  const [allGroupCodes, setAllGroupCodes] = useState<GroupCodeInfo[]>([]);
  const [groupCodesLoading, setGroupCodesLoading] = useState(false);

  // ── 폼 상태 ───────────────────────────────────────────────
  const [form, setForm] = useState<Partial<KeyDetailInfo>>(defaultForm);
  const [goodsList, setGoodsList] = useState<GoodsItem[]>([]);

  // ── 로딩 상태 ─────────────────────────────────────────────
  const [detailLoading, setDetailLoading] = useState(false);

  // ── 전체 상품 목록 조회 (등록/수정 공통) ─────────────────
  useEffect(() => {
    const fetchGroupCodes = async () => {
      setGroupCodesLoading(true);
      try {
        const resultData = await callGetAPI(
            BASE_URL + `/management/group-codes`,
            HTTP_METHOD.GET,
            {},
            {}
        );
        if (resultData.resultCode === ResultCode.ET00) {
          if (resultData.resCode === ServerResCode.OK) {
            setAllGroupCodes(resultData.data as GroupCodeInfo[]);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setGroupCodesLoading(false);
      }
    };

    fetchGroupCodes();
  }, []);

  // ── 등록 모드: 신청일 현재일로 초기 세팅 ─────────────────
  useEffect(() => {
    if (detailPageMode === PAGE_MODE.REG) {
      setForm((prev) => ({
        ...prev,
        create_date: formatDate(new Date()),
      }));
    }
  }, [detailPageMode]);

  // ── 상세 조회 (수정 모드 + allGroupCodes 로딩 완료 후) ────
  useEffect(() => {
    if (detailPageMode !== PAGE_MODE.EDIT) return;
    if (allGroupCodes.length === 0) return;  // groupCodes 준비 후 실행

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
            const detailData = resultData.data as KeyDetailInfo;

            // 폼 데이터 세팅
            setForm({ ...detailData });

            // services[] → GoodsItem[] 변환 (모달 체크 상태 복원)
            const mapped: GoodsItem[] = detailData.services.map((s) => {
              const groupCodeInfo = allGroupCodes.find((g) => g.group_code === s.group_code);
              return {
                groupCodeInfo: groupCodeInfo ?? {
                  group_code: s.group_code,
                  group_name: s.group_code,
                  group_type: "",
                },
                check: true,
                serviceOptions: {
                  options:    s.options,
                  limit_size: s.limit_type,
                },
              };
            });
            setGoodsList(mapped);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setDetailLoading(false);
      }
    };

    fetchDetail();
  }, [detailPageMode, allGroupCodes]);

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

  const handleProductConfirm = (selected: GoodsItem[]) => {
    setGoodsList(selected);
  };

  const handleOpenServiceOption = (goods: GoodsItem) => {
    setServiceOptionModal({ open: true, goods });
  };

  const handleServiceOptionConfirm = (updated: GoodsItem) => {
    setGoodsList((prev) =>
        prev.map((g) =>
            g.groupCodeInfo.group_code === updated.groupCodeInfo.group_code ? updated : g
        )
    );
  };

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
      await saveApiKey(detailPageMode === PAGE_MODE.EDIT ? id : null, payload);
      alert(detailPageMode === PAGE_MODE.EDIT ? "수정되었습니다." : "등록되었습니다.");
    } catch (e) {
      alert("저장 실패");
    }
  };

  if (detailLoading || groupCodesLoading) {
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

            {/* 허용일시 - MONTH 공통코드 */}
            <div className="flex items-center gap-2">
              <label className="text-sm w-24 shrink-0 text-right">허용일시 *</label>
              <select
                  value={form.due_date ?? ""}
                  onChange={(e) => handleFormChange("due_date", e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm"
              >
                <option value="">허용기간선택</option>
                {monthCodes.map((c) => (
                    <option key={c.code} value={c.code}>{c.codeName}</option>
                ))}
              </select>
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

              <div className="border rounded overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="py-2 px-2 text-left font-medium">상품 그룹</th>
                    <th className="py-2 px-2 text-left font-medium">상품 그룹명</th>
                    <th className="py-2 px-2 text-center font-medium w-20">옵션여부</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y max-h-40 overflow-y-auto">
                  {goodsList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="text-center text-gray-400 py-4">
                          상품을 추가하세요.
                        </td>
                      </tr>
                  ) : (
                      goodsList.map((goods) => (
                          <tr
                              key={goods.groupCodeInfo.group_code}
                              onDoubleClick={() => handleOpenServiceOption(goods)}
                              className="cursor-pointer hover:bg-gray-50"
                          >
                            <td className="py-2 px-2 text-xs text-blue-600">
                              {goods.groupCodeInfo.group_type}
                            </td>
                            <td className="py-2 px-2 text-xs text-blue-600">
                              {goods.groupCodeInfo.group_name}
                            </td>
                            <td className="py-2 px-2 text-xs text-center">
                              {goods.serviceOptions.options
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
        <ProductSettingModal
            open={productModalOpen}
            allGroupCodes={allGroupCodes}
            initialGoods={goodsList}
            onConfirm={handleProductConfirm}
            onClose={() => setProductModalOpen(false)}
        />

        <ServiceOptionModal
            open={serviceOptionModal.open}
            goods={serviceOptionModal.goods}
            onConfirm={handleServiceOptionConfirm}
            onClose={() => setServiceOptionModal({ open: false, goods: null })}
        />
      </div>
  );
}
