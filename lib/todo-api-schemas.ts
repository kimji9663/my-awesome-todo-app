import { z } from "zod";

export const categorySchema = z.enum(["today", "tomorrow", "week"]);
