// ============================================================
// components/api-key/ServiceOptionModal.tsx
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { GoodsItem, ServiceOptionsItem, OptionInfo } from "@/types/apiKey";

interface Props {
  open: boolean;
  goods: GoodsItem | null;
  onConfirm: (updated: GoodsItem) => void;
  onClose: () => void;
}

export default function ServiceOptionModal({ open, goods, onConfirm, onClose }: Props) {
  const [optionItems, setOptionItems] = useState<ServiceOptionsItem[]>([]);
  const [limitSize, setLimitSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  // 모달 열릴 때마다 옵션 목록 조회 + 기존 체크 상태 복원
  useEffect(() => {
    if (!open || !goods) return;

    // 기존 limit_size 세팅
    setLimitSize(goods.serviceOptions.limit_size);

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const resultData = await callGetAPI(
            BASE_URL + `/management/options/${goods.groupCodeInfo.group_code}`,
            HTTP_METHOD.GET,
            {},
            {}
        );

        if (resultData.resultCode === ResultCode.ET00) {
          if (resultData.resCode === ServerResCode.OK) {
            const allOptions = resultData.data as OptionInfo[];

            // 기존에 선택된 option_id 목록 (','로 구분된 string → Set)
            const existingIds = new Set(
                goods.serviceOptions.options
                    ? goods.serviceOptions.options.split(",").map((o) => o.trim())
                    : []
            );

            // 전체 옵션을 ServiceOptionsItem으로 변환
            // 기존에 선택된 옵션이면 check: true
            const items: ServiceOptionsItem[] = allOptions.map((optionInfo) => ({
              optionInfo,
              check: existingIds.has(optionInfo.option_id),
            }));

            setOptionItems(items);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [open, goods]);

  // 전체 선택 여부
  const isAllChecked =
      optionItems.length > 0 && optionItems.every((o) => o.check);

  const handleToggleAll = () => {
    setOptionItems((prev) =>
        prev.map((o) => ({ ...o, check: !isAllChecked }))
    );
  };

  const handleToggle = (option_id: string) => {
    setOptionItems((prev) =>
        prev.map((o) =>
            o.optionInfo.option_id === option_id ? { ...o, check: !o.check } : o
        )
    );
  };

  const handleConfirm = () => {
    if (!goods) return;

    // 체크된 option_id들을 ','로 join해서 저장
    const selectedIds = optionItems
        .filter((o) => o.check)
        .map((o) => o.optionInfo.option_id)
        .join(",");

    onConfirm({
      ...goods,
      serviceOptions: {
        options:    selectedIds,
        limit_size: limitSize,
      },
    });
    onClose();
  };

  if (!open || !goods) return null;

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
                    value={goods.groupCodeInfo.group_name}
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
                {/* 테이블 헤더 */}
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

                {/* 옵션 행 */}
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
