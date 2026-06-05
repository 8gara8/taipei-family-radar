// 追蹤「本次頁面載入後」的站內導覽次數，供活動詳情的返回鈕判斷能否安全 router.back()。
// 模組層級的記憶體狀態：硬導覽（重新整理／外部深連結）會重置為 0，
// 站內 client 端導覽則每次遞增。只在 client 端元件中讀寫。

let inAppNavigations = 0;

/** 由 NavHistoryTracker 在每次 pathname 變動時呼叫（含初次掛載）。 */
export function recordNavigation(): void {
  inAppNavigations += 1;
}

/**
 * 上一個歷史項目是否為站內頁面（可安全返回而不離開 App）。
 * 初次載入後計數為 1（僅有當前頁）；發生過至少一次站內導覽才會 > 1。
 */
export function canGoBackInApp(): boolean {
  return inAppNavigations > 1;
}
