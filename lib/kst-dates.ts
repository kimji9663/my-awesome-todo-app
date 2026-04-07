/** 한국(Asia/Seoul) 달력 기준 YYYY-MM-DD */

const TZ = "Asia/Seoul";

export function kstTodayYmd(): string {
  return formatYmdKst(new Date());
}

export function formatYmdKst(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: TZ });
}

/** KST 해당 날짜 자정의 에포크(ms) */
export function kstYmdToMs(ymd: string): number {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(
    `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}T00:00:00+09:00`
  ).getTime();
}

export function addDaysYmd(ymd: string, deltaDays: number): string {
  const ms = kstYmdToMs(ymd) + deltaDays * 24 * 60 * 60 * 1000;
  return formatYmdKst(new Date(ms));
}

function weekdayShortKst(ymd: string): string {
  return new Date(kstYmdToMs(ymd)).toLocaleDateString("en-US", {
    timeZone: TZ,
    weekday: "short",
  });
}

/** ymd가 속한 주의 일요일( KST ) YYYY-MM-DD */
export function kstSundayOfSameWeek(ymd: string): string {
  for (let i = 0; i < 7; i++) {
    const cand = addDaysYmd(ymd, i);
    if (weekdayShortKst(cand) === "Sun") return cand;
  }
  return addDaysYmd(ymd, 6);
}

/** 이번주 할일로 옮길 때 사용: 내일 다음날 이후, 같은 주 일요일 이내가 있으면 그날, 아니면 그 다음날(차주 월요일 등) */
export function weekBucketDate(todayStr: string, tomorrowStr: string): string {
  const sun = kstSundayOfSameWeek(todayStr);
  const afterTomorrow = addDaysYmd(tomorrowStr, 1);
  if (afterTomorrow <= sun) return afterTomorrow;
  return afterTomorrow;
}

export function scheduledDateForNewTodo(
  tab: "today" | "tomorrow" | "week",
  todayStr: string,
  tomorrowStr: string
): string {
  if (tab === "today") return todayStr;
  if (tab === "tomorrow") return tomorrowStr;
  return weekBucketDate(todayStr, tomorrowStr);
}
