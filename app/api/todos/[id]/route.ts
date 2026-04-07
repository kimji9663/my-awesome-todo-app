import { NextResponse } from "next/server";
import { z } from "zod";
import { addDaysYmd, kstTodayYmd, scheduledDateForNewTodo } from "@/lib/kst-dates";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/todo-api-schemas";
import { serializeTodoRow } from "@/lib/todo-serialize";
import { getSession } from "@/lib/session";

const patchSchema = z.object({
  text: z.string().trim().min(1).max(2000).optional(),
  completed: z.boolean().optional(),
  category: categorySchema.optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

async function getOwnedTodoOr404(userId: string, todoId: string) {
  return prisma.todo.findFirst({
    where: { id: todoId, userId },
  });
}

export async function PATCH(request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "입력값을 확인해 주세요." },
      { status: 400 }
    );
  }

  const body = parsed.data;
  if (
    body.text === undefined &&
    body.completed === undefined &&
    body.category === undefined
  ) {
    return NextResponse.json(
      { error: "수정할 항목이 없습니다." },
      { status: 400 }
    );
  }

  const existing = await getOwnedTodoOr404(session.sub, id);
  if (!existing) {
    return NextResponse.json({ error: "할일을 찾을 수 없습니다." }, { status: 404 });
  }

  const todayStr = kstTodayYmd();
  const tomorrowStr = addDaysYmd(todayStr, 1);

  const data: {
    text?: string;
    completed?: boolean;
    category?: string;
    scheduledDate?: string;
  } = {
    ...(body.text !== undefined ? { text: body.text } : {}),
    ...(body.completed !== undefined ? { completed: body.completed } : {}),
  };

  if (body.category !== undefined) {
    data.category = body.category;
    data.scheduledDate = scheduledDateForNewTodo(
      body.category,
      todayStr,
      tomorrowStr
    );
  }

  const updated = await prisma.todo.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    todo: serializeTodoRow(updated, todayStr, tomorrowStr),
  });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const { id } = await context.params;

  const existing = await getOwnedTodoOr404(session.sub, id);
  if (!existing) {
    return NextResponse.json({ error: "할일을 찾을 수 없습니다." }, { status: 404 });
  }

  await prisma.todo.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
