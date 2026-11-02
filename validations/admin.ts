import { z } from "zod";

const name = z.string().trim().min(2, "Enter a name.").max(120);

export const examSchema = z.object({
  name,
  shortName: z.string().trim().min(2, "Enter a short name.").max(30),
  description: z.string().trim().max(500).optional(),
});

export const nameSchema = z.object({ name });

const number = (message: string, min: number, max: number) => z.coerce.number().min(min, message).max(max, message);

export const patternSchema = z
  .object({
    examId: z.string().min(1),
    name,
    sectionalTiming: z.boolean(),
    compositeMinutes: z.coerce.number().int().min(1).max(600).nullable(),
    notes: z.string().trim().max(1000).nullable().optional(),
    sections: z
      .array(
        z.object({
          id: z.string().optional(),
          subjectId: z.string().min(1, "Choose a subject for every section."),
          name,
          questionCount: number("Question count must be 1 to 300.", 1, 300).int(),
          durationMinutes: number("Duration must be 1 to 300 minutes.", 1, 300).int(),
          marksPerQuestion: number("Marks must be between 0.25 and 10.", 0.25, 10),
          negativeMarks: number("Negative marks must be between 0 and 10.", 0, 10),
        }),
      )
      .min(1, "A pattern needs at least one section."),
  })
  .refine((p) => p.sectionalTiming || p.compositeMinutes !== null, {
    message: "Enter the total time for a test without sectional timing.",
    path: ["compositeMinutes"],
  });

export const mockTestSchema = z.object({
  patternId: z.string().min(1, "Choose a pattern."),
  title: z.string().trim().min(3, "Enter a title.").max(120),
  description: z.string().trim().max(500).optional(),
  scalePercent: z.coerce.number().int().min(5, "Scale must be 5 to 100%.").max(100, "Scale must be 5 to 100%."),
});

/** Table text is one row per line, comma separated; the first line holds the column names. */
export function parseTableText(text: string): { columns: string[]; rows: (string | number)[][] } | null {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return null;
  const cells = lines.map((line) => line.split(",").map((cell) => cell.trim()));
  const columns = cells[0];
  const rows = cells.slice(1);
  if (rows.length === 0) throw new Error("A table needs a header line and at least one row.");
  if (rows.some((row) => row.length !== columns.length)) throw new Error("Every table row needs the same number of columns as the header.");
  return { columns, rows: rows.map((row) => row.map((cell) => (cell !== "" && !Number.isNaN(Number(cell)) ? Number(cell) : cell))) };
}

export const contextSchema = z.object({
  type: z.enum(["PASSAGE", "DATA_SET"]),
  title: z.string().trim().min(3, "Enter a title.").max(200),
  content: z.string().trim().min(10, "Enter the passage or description.").max(10000),
  tableText: z.string().max(10000).default(""),
});
