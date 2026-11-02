export type SeedDifficulty = "EASY" | "MEDIUM" | "HARD";

export type SeedFormat =
  | "MCQ"
  | "MULTIPLE_STATEMENTS"
  | "ASSERTION_REASON"
  | "MATCH_THE_FOLLOWING"
  | "PASSAGE"
  | "DATA_INTERPRETATION";

/** A passage or data set shared by several questions (RC, cloze, DI). */
export type SeedContext = {
  key: string;
  type: "PASSAGE" | "DATA_SET";
  title: string;
  content: string;
  /** Optional table rendered under `content`, mainly for DI. */
  table?: { columns: string[]; rows: (string | number)[][] };
};

export type SeedFormatData =
  | { statements: string[] }
  | { assertion: string; reason: string }
  | { columnA: string[]; columnB: string[] };

export type SeedQuestion = {
  /** Must exactly match a topic name in catalog.ts for this subject. */
  topic: string;
  subtopic?: string;
  difficulty: SeedDifficulty;
  /** Defaults to MCQ. */
  format?: SeedFormat;
  text: string;
  /** Exactly four distinct options. */
  options: [string, string, string, string];
  /** Zero-based index of the single correct option. */
  correct: 0 | 1 | 2 | 3;
  explanation: string;
  tags: string[];
  /** Exam slugs this is relevant to. Omit for every exam that offers the subject. */
  exams?: string[];
  /** Key of a SeedContext in the same file. */
  context?: string;
  formatData?: SeedFormatData;
};

export type SeedQuestionFile = {
  contexts: SeedContext[];
  questions: SeedQuestion[];
};
