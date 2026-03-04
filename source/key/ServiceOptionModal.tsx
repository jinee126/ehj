// ============================================================
// components/api-key/ServiceOptionModal.tsx
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { MappedProduct, ServiceOption } from "@/types/apiKey";

interface Props {
  open: boolean;
  product: MappedProduct | null;       // 옵션 설정할 대상 상품
  onConfirm: (updated: MappedProduct) => void;
  onClose: () => void;
}

// Mock: 상품별 서비스 옵션 목록 조회
// TODO: 실제 API 호출로 교체 - GET /api/products/{productId}/options
async function fetchServiceOptions(productId: string): Promise<ServiceOption[]> {
  await new Promise((r) => setTimeout(r, 200));
  return [
    { optionId: "o1", serviceApi: "/v1/reverselabel", optionFormat: "FIXED",    value: "limited", key: "1" },
    { optionId: "o2", serviceApi: "/v1/search",       optionFormat: "DYNAMIC",  value: "full",    key: "2" },
    { optionId: "o3", serviceApi: "/v1/route",        optionFormat: "FIXED",    value: "basic",   key: "3" },
  ];
}

export default function ServiceOptionModal({ open, product, onConfirm, onClose }: Props) {
  const [availableOptions, setAvailableOptions] = useState<ServiceOption[]>([]);
  const [checkedOptionIds, setCheckedOptionIds] = useState<Set<string>>(new Set());
  const [callLimit, setCallLimit] = useState<string>("1000");
  const [loading, setLoading] = useState(false);

  // 모달 열릴 때 옵션 목록 로드 + 기존 체크 상태 초기화
  useEffect(() => {
    if (!open || !product) return;

    setLoading(true);
    setCallLimit("1000");

    fetchServiceOptions(product.productId).then((options) => {
      setAvailableOptions(options);

      // 수정 모드: 이미 설정된 옵션이면 체크된 상태로 초기화
      const existingIds = new Set(product.options.map((o) => o.optionId));
      setCheckedOptionIds(existingIds);
      setLoading(false);
    });
  }, [open, product]);

  const isAllChecked =
    availableOptions.length > 0 &&
    availableOptions.every((o) => checkedOptionIds.has(o.optionId));

  const handleToggleAll = () => {
    setCheckedOptionIds((prev) => {
      const next = new Set(prev);
      if (isAllChecked) {
        availableOptions.forEach((o) => next.delete(o.optionId));
      } else {
        availableOptions.forEach((o) => next.add(o.optionId));
      }
      return next;
    });
  };

  const handleToggle = (optionId: string) => {
    setCheckedOptionIds((prev) => {
      const next = new Set(prev);
      if (next.has(optionId)) next.delete(optionId);
      else next.add(optionId);
      return next;
    });
  };

  const handleConfirm = () => {
    if (!product) return;

    const selectedOptions = availableOptions.filter((o) =>
      checkedOptionIds.has(o.optionId)
    );

    onConfirm({ ...product, options: selectedOptions });
    onClose();
  };

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[540px] rounded shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-700 text-white px-4 py-2">
          <span className="font-semibold">서비스 옵션 설정</span>
          <button onClick={onClose} className="text-white hover:text-gray-300 text-lg">
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* ① 상품 정보 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm w-20 shrink-0 text-gray-600">상품 그룹명</span>
              <input
                type="text"
                value={product.productName}
                readOnly
                className="flex-1 border rounded px-2 py-1 text-sm bg-gray-50 text-gray-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm w-20 shrink-0 text-gray-600">호출 제한</span>
              <input
                type="number"
                value={callLimit}
                onChange={(e) => setCallLimit(e.target.value)}
                className="flex-1 border rounded px-2 py-1 text-sm"
                placeholder="호출 횟수 입력"
              />
            </div>
          </div>

          {/* 서비스 옵션 테이블 */}
          <div>
            <p className="text-sm font-medium mb-1">서비스 옵션</p>
            <div className="border rounded overflow-hidden">
              {/* 테이블 헤더 */}
              <div className="bg-gray-700 text-white grid grid-cols-[40px_1fr_100px_80px_60px] text-sm">
                {/* ② 전체선택 체크박스 */}
                <div className="flex items-center justify-center py-2">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleToggleAll}
                    className="w-4 h-4"
                    disabled={loading}
                  />
                </div>
                {/* ③ 컬럼명 */}
                <div className="py-2 px-2 font-medium">서비스 API</div>
                <div className="py-2 px-2 font-medium">옵션 형식</div>
                <div className="py-2 px-2 font-medium">값</div>
                <div className="py-2 px-2 font-medium">키</div>
              </div>

              {/* 옵션 행 */}
              <div className="max-h-48 overflow-y-auto divide-y">
                {loading ? (
                  <div className="text-center text-sm text-gray-400 py-6">로딩 중...</div>
                ) : availableOptions.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 py-6">
                    설정 가능한 옵션이 없습니다.
                  </div>
                ) : (
                  availableOptions.map((option) => (
                    <label
                      key={option.optionId}
                      className="grid grid-cols-[40px_1fr_100px_80px_60px] items-center hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-center py-2">
                        <input
                          type="checkbox"
                          checked={checkedOptionIds.has(option.optionId)}
                          onChange={() => handleToggle(option.optionId)}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="py-2 px-2 text-sm truncate">{option.serviceApi}</div>
                      <div className="py-2 px-2 text-sm">{option.optionFormat}</div>
                      <div className="py-2 px-2 text-sm">{option.value}</div>
                      <div className="py-2 px-2 text-sm">{option.key}</div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ④ 버튼 */}
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={handleConfirm}
              className="px-6 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
            >
              선택 완료
            </button>
            <button
              onClick={onClose}
              className="px-6 py-1.5 bg-white border text-sm rounded hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
