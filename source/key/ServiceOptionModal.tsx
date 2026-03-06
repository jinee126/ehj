// ============================================================
// components/api-key/ServiceOptionModal.tsx
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { ServiceOptionsItem, OptionInfo, ProductInfo } from "@/types/apiKey";

interface Props {
  open: boolean;
  productInfo: ProductInfo | null;
  initialOptions: string;
  onConfirm: (groupCode: string, selected: ServiceOptionsItem[]) => void;
  onClose: () => void;
}

export default function ServiceOptionModal({
                                             open,
                                             productInfo,
                                             initialOptions,
                                             onConfirm,
                                             onClose,
                                           }: Props) {
  const [optionItems, setOptionItems] = useState<ServiceOptionsItem[]>([]);
  const [limitSize, setLimitSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !productInfo) return;

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const resultData = await callGetAPI(
            BASE_URL + `/management/options/${productInfo.service_group}`,
            HTTP_METHOD.GET,
            {},
            {}
        );
        if (resultData.resultCode === ResultCode.ET00) {
          if (resultData.resCode === ServerResCode.OK) {
            const allOptions = resultData.data as OptionInfo[];

            const existingIds = new Set(
                initialOptions
                    ? initialOptions.split(",").map((o) => o.trim()).filter(Boolean)
                    : []
            );

            setOptionItems(
                allOptions.map((optionInfo) => ({
                  optionInfo,
                  check: existingIds.has(optionInfo.option_id),
                }))
            );
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [open, productInfo, initialOptions]);

  const isAllChecked =
      optionItems.length > 0 && optionItems.every((o) => o.check);

  const handleToggleAll = () => {
    setOptionItems((prev) => prev.map((o) => ({ ...o, check: !isAllChecked })));
  };

  const handleToggle = (option_id: string) => {
    setOptionItems((prev) =>
        prev.map((o) =>
            o.optionInfo.option_id === option_id ? { ...o, check: !o.check } : o
        )
    );
  };

  const handleConfirm = () => {
    if (!productInfo) return;
    // 체크된 ServiceOptionsItem[] 그대로 전달
    const selected = optionItems.filter((o) => o.check);
    onConfirm(productInfo.service_group, selected);
    onClose();
  };

  if (!open || !productInfo) return null;

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
                    value={productInfo.service_group_name}
                    readOnly
                    className="flex-1 border rounded px-2 py-1 text-sm bg-gray-50 text-gray-500"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm w-20 shrink-0 text-gray-600">호출 제한</span>
                <input
                    type="number"
                    value={limitSize}
                    onChange={(e) => setLimitSize(Number(e.target.value))}
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    placeholder="호출 횟수 입력"
                />
              </div>
            </div>

            {/* ② 서비스 옵션 테이블 */}
            <div>
              <p className="text-sm font-medium mb-1">서비스 옵션</p>
              <div className="border rounded overflow-hidden">
                <div className="bg-gray-700 text-white grid grid-cols-[40px_1fr_100px_80px_60px] text-sm">
                  <div className="flex items-center justify-center py-2">
                    <input
                        type="checkbox"
                        checked={isAllChecked}
                        onChange={handleToggleAll}
                        className="w-4 h-4"
                        disabled={loading}
                    />
                  </div>
                  <div className="py-2 px-2 font-medium">서비스 API</div>
                  <div className="py-2 px-2 font-medium">옵션 형식</div>
                  <div className="py-2 px-2 font-medium">값</div>
                  <div className="py-2 px-2 font-medium">키</div>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y">
                  {loading ? (
                      <div className="text-center text-sm text-gray-400 py-6">로딩 중...</div>
                  ) : optionItems.length === 0 ? (
                      <div className="text-center text-sm text-gray-400 py-6">
                        설정 가능한 옵션이 없습니다.
                      </div>
                  ) : (
                      optionItems.map((item) => (
                          <label
                              key={item.optionInfo.option_id}
                              className="grid grid-cols-[40px_1fr_100px_80px_60px] items-center hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="flex items-center justify-center py-2">
                              <input
                                  type="checkbox"
                                  checked={item.check}
                                  onChange={() => handleToggle(item.optionInfo.option_id)}
                                  className="w-4 h-4"
                              />
                            </div>
                            <div className="py-2 px-2 text-sm truncate">{item.optionInfo.service_api}</div>
                            <div className="py-2 px-2 text-sm">{item.optionInfo.option_format}</div>
                            <div className="py-2 px-2 text-sm">{item.optionInfo.value}</div>
                            <div className="py-2 px-2 text-sm">{item.optionInfo.key}</div>
                          </label>
                      ))
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {optionItems.filter((o) => o.check).length}개 선택됨
              </p>
            </div>

            {/* ③ 버튼 */}
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