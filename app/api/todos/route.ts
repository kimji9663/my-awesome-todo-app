import { NextResponse } from "next/server";
import { z } from "zod";
import { addDaysYmd, kstTodayYmd, scheduledDateForNewTodo } from "@/lib/kst-dates";
import { prisma } from "@/lib/prisma";
import { rollTodosForUser } from "@/lib/todo-roll";
import { getSession } from "@/lib/session";
import { categorySchema } from "@/lib/todo-api-schemas";
import { serializeTodoRow } from "@/lib/todo-serialize";

const createSchema = z.object({
  text: z.string().trim().min(1, "할일 내용을 입력해 주세요.").max(2000),
  category: categorySchema,
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  await rollTodosForUser(session.sub);

  const todayStr = kstTodayYmd();
  const tomorrowStr = addDaysYmd(todayStr, 1);

  const rows = await prisma.todo.findMany({
    where: { userId: session.sub },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  const todos = rows.map((t) => serializeTodoRow(t, todayStr, tomorrowStr));

  return NextResponse.json({ todos });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().fieldErrors.text?.[0] ??
      parsed.error.flatten().fieldErrors.category?.[0] ??
      "입력값을 확인해 주세요.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { text, category } = parsed.data;

  const todayStr = kstTodayYmd();
  const tomorrowStr = addDaysYmd(todayStr, 1);
  const scheduledDate = scheduledDateForNewTodo(category, todayStr, tomorrowStr);

  const created = await prisma.todo.create({
    data: {
      userId: session.sub,
      text,
      category,
      scheduledDate,
    },
  });

  return NextResponse.json({
    todo: serializeTodoRow(created, todayStr, tomorrowStr),
  });
}
