import {
  addDaysYmd,
  kstTodayYmd,
  scheduledDateForNewTodo,
  weekBucketDate,
} from "@/lib/kst-dates";
import { prisma } from "@/lib/prisma";

/** 레거시 category만 있는 행에 scheduledDate 채움 */
async function backfillScheduledDate(
  userId: string,
  todayStr: string,
  tomorrowStr: string
) {
  const rows = await prisma.todo.findMany({
    where: { userId, scheduledDate: null },
  });
  for (const t of rows) {
    const tab =
      t.category === "tomorrow"
        ? "tomorrow"
        : t.category === "week"
          ? "week"
          : "today";
    const sd = scheduledDateForNewTodo(tab, todayStr, tomorrowStr);
    await prisma.todo.update({
      where: { id: t.id },
      data: { scheduledDate: sd },
    });
  }
}

/**
 * - 오늘(KST) 이전 날짜로 완료된 항목 삭제(어제 완료분 포함)
 * - 어제(KST) 미완료 → 오늘 날짜로(오늘 할일)
 * - 전전일(KST) 이전 미완료 → 이번주 할일용 날짜로 이동
 * - 내일로 잡힌 항목은 날짜가 지나면 scheduledDate === 오늘이 되어 오늘 탭에 표시됨
 */
export async function rollTodosForUser(userId: string) {
  const todayStr = kstTodayYmd();
  const yesterdayStr = addDaysYmd(todayStr, -1);
  const twoDaysAgoStr = addDaysYmd(todayStr, -2);
  const tomorrowStr = addDaysYmd(todayStr, 1);
  const weekTarget = weekBucketDate(todayStr, tomorrowStr);

  await backfillScheduledDate(userId, todayStr, tomorrowStr);

  await prisma.todo.deleteMany({
    where: {
      userId,
      completed: true,
      scheduledDate: { lt: todayStr },
    },
  });

  await prisma.todo.updateMany({
    where: {
      userId,
      completed: false,
      scheduledDate: yesterdayStr,
    },
    data: { scheduledDate: todayStr },
  });

  await prisma.todo.updateMany({
    where: {
      userId,
      completed: false,
      scheduledDate: { lte: twoDaysAgoStr },
    },
    data: { scheduledDate: weekTarget },
  });
}
