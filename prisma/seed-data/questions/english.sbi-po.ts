import type { SeedQuestionFile } from "../types";

const SBI_PO = ["sbi-po"];

const file: SeedQuestionFile = {
  contexts: [
    {
      key: "english-advrc-credit-growth",
      type: "PASSAGE",
      title: "The Two Faces of Rapid Credit Growth",
      content:
        "Few numbers please a finance minister more than a rising curve of bank credit. Loans to households finance homes, vehicles and education; loans to firms finance factories and inventories; and both feed the consumption and investment on which growth statistics depend. Yet economists who study banking crises have noticed an uncomfortable regularity: the fastest periods of credit growth are the most reliable predictors of trouble a few years later. The reason is not that lending is harmful but that the quality of lending deteriorates precisely when its quantity is celebrated. In a boom, collateral values rise, borrowers who would have been refused a year earlier are approved, and loan officers under pressure to meet targets stop asking awkward questions. When the cycle turns, the loans made in the final, exuberant phase default first. Regulators have responded with counter-cyclical tools: higher capital requirements when credit grows faster than output, limits on loan-to-value ratios for property, and closer inspection of sectors where lending has clustered. These tools work best when they are unpopular, which is exactly when they are hardest to apply. A central bank that tightens standards in the middle of a boom will be accused of strangling growth; one that waits for proof of excess will usually find that the proof arrives as a crisis. The practical lesson for a bank is simpler than the policy debate. Growth that outruns the capacity to assess borrowers is not an achievement but a liability that has not yet been recognised, and the time to build provisions is when profits make it painless to do so.",
    },
  ],
  questions: [
    // ----------------------------------------------------------------- Voice
    {
      topic: "Voice",
      subtopic: "Tense-based Conversion",
      difficulty: "EASY",
      text: "Choose the correct passive form of the sentence.\nThe cashier counted the notes twice.",
      options: [
        "The notes were counted twice by the cashier.",
        "The notes are counted twice by the cashier.",
        "The notes had been counted twice by the cashier.",
        "The notes were being counted twice by the cashier.",
      ],
      correct: 0,
      explanation:
        "The active sentence is in the past simple, so the passive needs 'was/were + past participle': 'were counted'. The third option shifts to the past perfect and the fourth to the past continuous, both changing the time of the action.",
      tags: ["passive voice", "past simple"],
    },
    {
      topic: "Voice",
      subtopic: "Modal-based Conversion",
      difficulty: "MEDIUM",
      text: "Choose the correct passive form of the sentence.\nThe committee must submit the report before Friday.",
      options: [
        "The report must have been submitted before Friday by the committee.",
        "The report must be submitted before Friday by the committee.",
        "The report must submitted before Friday by the committee.",
        "The report is to be submit before Friday by the committee.",
      ],
      correct: 1,
      explanation:
        "With a modal, the passive is 'modal + be + past participle': 'must be submitted'. 'Must have been submitted' refers to a completed past action, which changes the meaning, and the other two options are ungrammatical.",
      tags: ["passive voice", "modals"],
    },
    {
      topic: "Voice",
      subtopic: "Imperative Sentences",
      difficulty: "MEDIUM",
      text: "Choose the correct passive form of the sentence.\nPlease submit your KYC documents at the counter.",
      options: [
        "Your KYC documents are requested to submit at the counter.",
        "You are requested to submit your KYC documents at the counter.",
        "Your KYC documents should submit at the counter.",
        "Let your KYC documents submit at the counter.",
      ],
      correct: 1,
      explanation:
        "A polite imperative with 'please' becomes 'You are requested to + infinitive'. 'Let your documents be submitted' would also be acceptable, but the fourth option omits 'be'. The first option wrongly makes the documents the ones doing the requesting.",
      tags: ["passive voice", "imperative"],
    },
    {
      topic: "Voice",
      subtopic: "Active Voice",
      difficulty: "HARD",
      text: "Choose the correct active form of the sentence.\nThe branch is being renovated by a contractor appointed by the regional office.",
      options: [
        "A contractor appointed by the regional office renovates the branch.",
        "A contractor appointed by the regional office has been renovating the branch.",
        "A contractor appointed by the regional office is renovating the branch.",
        "A contractor appointed by the regional office was renovating the branch.",
      ],
      correct: 2,
      explanation:
        "'Is being renovated' is the present continuous passive, so the active form is the present continuous: 'is renovating'. The phrase 'appointed by the regional office' is a participle describing the contractor and stays as it is.",
      tags: ["active voice", "present continuous"],
    },

    // ------------------------------------------------------------- Narration
    {
      topic: "Narration",
      subtopic: "Tense Changes",
      difficulty: "EASY",
      text: "Choose the correct indirect form.\nShe said, \"I am waiting for the manager.\"",
      options: [
        "She said that she is waiting for the manager.",
        "She said that she was waiting for the manager.",
        "She said that she has been waiting for the manager.",
        "She said that I was waiting for the manager.",
      ],
      correct: 1,
      explanation:
        "With a past reporting verb, the present continuous becomes the past continuous, and 'I' becomes 'she' because the speaker is being reported. The fourth option keeps 'I', which would make the reporter the one waiting.",
      tags: ["indirect speech", "tense change"],
    },
    {
      topic: "Narration",
      subtopic: "Interrogative Sentences",
      difficulty: "MEDIUM",
      text: "Choose the correct indirect form.\nThe officer asked me, \"Have you brought your passbook?\"",
      options: [
        "The officer asked me that I had brought my passbook.",
        "The officer asked me whether I had brought my passbook.",
        "The officer asked me whether had I brought my passbook.",
        "The officer asked me if I have brought my passbook.",
      ],
      correct: 1,
      explanation:
        "A yes-no question is reported with 'whether' or 'if' and the normal statement order (subject before verb). The present perfect 'have brought' moves back to the past perfect 'had brought'. 'That' cannot introduce a reported question.",
      tags: ["indirect speech", "questions"],
    },
    {
      topic: "Narration",
      subtopic: "Time and Place Changes",
      difficulty: "MEDIUM",
      text: "Choose the correct indirect form.\nHe said, \"I will return the file tomorrow.\"",
      options: [
        "He said that he would return the file the next day.",
        "He said that he will return the file tomorrow.",
        "He said that he would return the file tomorrow.",
        "He said that he would have returned the file the next day.",
      ],
      correct: 0,
      explanation:
        "'Will' becomes 'would' after a past reporting verb, and 'tomorrow' becomes 'the next day' or 'the following day' because the time reference has shifted. The fourth option introduces a perfect form that was not in the original.",
      tags: ["indirect speech", "time words"],
    },
    {
      topic: "Narration",
      subtopic: "Reporting Verbs",
      difficulty: "HARD",
      text: "Choose the correct indirect form.\nThe manager said to the clerk, \"Do not leave the counter unattended.\"",
      options: [
        "The manager told the clerk to not leaving the counter unattended.",
        "The manager said to the clerk that do not leave the counter unattended.",
        "The manager told the clerk not to leave the counter unattended.",
        "The manager asked the clerk that he should not leave the counter unattended.",
      ],
      correct: 2,
      explanation:
        "A negative command is reported with 'told/ordered + object + not to + infinitive'. 'Said to' changes to 'told' in indirect speech, and 'that' is not used before an infinitive.",
      tags: ["indirect speech", "commands"],
    },

    // --------------------------------------------------------- Other Grammar
    {
      topic: "Other Grammar",
      subtopic: "Conditional Sentences",
      difficulty: "EASY",
      text: "Choose the grammatically correct sentence.",
      options: [
        "If the branch will open early, the queue would be shorter.",
        "If the branch opened early, the queue would be shorter.",
        "If the branch would open early, the queue will be shorter.",
        "If the branch opens early, the queue would have been shorter.",
      ],
      correct: 1,
      explanation:
        "A second conditional (an unreal present situation) takes the past simple in the 'if' clause and 'would + verb' in the main clause. 'Will' or 'would' never appears in the 'if' clause of a standard conditional.",
      tags: ["conditionals"],
    },
    {
      topic: "Other Grammar",
      subtopic: "Question Tags",
      difficulty: "MEDIUM",
      text: "Choose the correct question tag.\nNobody has applied for the loan yet, ______?",
      options: ["has he", "have they", "hasn't he", "haven't they"],
      correct: 1,
      explanation:
        "'Nobody' is negative in meaning, so the tag is positive, and indefinite pronouns referring to people take 'they' in a tag. Hence 'have they'.",
      tags: ["question tags"],
    },
    {
      topic: "Other Grammar",
      subtopic: "Modifiers",
      difficulty: "MEDIUM",
      text: "Choose the sentence that is free of a misplaced or dangling modifier.",
      options: [
        "Walking into the branch, the new signboard caught my attention.",
        "Having reviewed the application, the loan was sanctioned by the officer.",
        "Having reviewed the application, the officer sanctioned the loan.",
        "After reviewing the application, the loan was sanctioned.",
      ],
      correct: 2,
      explanation:
        "A participle phrase must describe the subject that follows it. Only in the third option is the person who reviewed the application (the officer) the subject of the main clause. In the others, a signboard or a loan appears to have done the walking or reviewing.",
      tags: ["modifiers", "dangling participle"],
    },
    {
      topic: "Other Grammar",
      subtopic: "Parallelism",
      difficulty: "HARD",
      text: "Choose the sentence with correct parallel structure.",
      options: [
        "The training covered opening accounts, how to verify documents, and the handling of complaints.",
        "The training covered opening accounts, verifying documents, and handling complaints.",
        "The training covered to open accounts, verifying documents, and complaint handling.",
        "The training covered opening accounts, verification of documents, and to handle complaints.",
      ],
      correct: 1,
      explanation:
        "Items in a list must share one grammatical form. Only the second option uses three gerund phrases. The others mix gerunds with 'how to' clauses, infinitives or noun phrases.",
      tags: ["parallelism"],
    },
    {
      topic: "Other Grammar",
      subtopic: "Redundancy",
      difficulty: "MEDIUM",
      text: "Identify the sentence that contains a redundant expression.",
      options: [
        "Please return the signed form by Monday.",
        "The two banks merged in April.",
        "The customer asked us to repeat the terms again.",
        "The auditor summarised the findings in one page.",
      ],
      correct: 2,
      explanation:
        "'Repeat' already means to say again, so 'repeat again' doubles the idea. Standard English drops 'again' unless something is being repeated for a second time after an earlier repetition.",
      tags: ["redundancy"],
    },

    // ------------------------------------------------ Advanced Reading Comprehension
    {
      topic: "Advanced Reading Comprehension",
      subtopic: "Inference-based RC",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "english-advrc-credit-growth",
      text: "Which of the following can be inferred from the passage about lending in the final phase of a credit boom?",
      options: [
        "It is usually directed at households rather than firms.",
        "It is made to borrowers whose quality has not been adequately assessed.",
        "It is discouraged by finance ministers who fear a crisis.",
        "It carries lower interest rates than earlier lending.",
      ],
      correct: 1,
      explanation:
        "The passage says that in a boom borrowers who would earlier have been refused are approved and loan officers 'stop asking awkward questions', and that these late loans default first. That supports the inference about inadequate assessment. Nothing is said about households versus firms, ministers discouraging lending, or interest rates.",
      tags: ["inference"],
      exams: SBI_PO,
    },
    {
      topic: "Advanced Reading Comprehension",
      subtopic: "Tone and Purpose",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "english-advrc-credit-growth",
      text: "The author's attitude towards counter-cyclical regulatory tools can best be described as",
      options: ["dismissive, because they strangle growth", "supportive, while acknowledging that they are politically difficult", "neutral, presenting them without judgement", "sceptical, because they arrive only after a crisis"],
      correct: 1,
      explanation:
        "The author says the tools 'work best when they are unpopular' and criticises central banks that wait for proof of excess, which shows support for using them early while recognising that they attract accusations of strangling growth. That is support tempered by an acknowledgement of difficulty.",
      tags: ["tone"],
      exams: SBI_PO,
    },
    {
      topic: "Advanced Reading Comprehension",
      subtopic: "Multiple Statement Questions",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "english-advrc-credit-growth",
      formatData: {
        statements: [
          "Rapid credit growth is itself harmful to an economy.",
          "Rising collateral values during a boom make it easier for weaker borrowers to obtain loans.",
          "A bank should build provisions when it is profitable rather than when losses appear.",
        ],
      },
      text: "Which of the following statements is/are in agreement with the passage?",
      options: ["Only II", "I and II", "II and III", "I and III"],
      correct: 2,
      explanation:
        "The author explicitly denies statement I ('not that lending is harmful'). Statement II restates the sentence about collateral values rising and marginal borrowers being approved. Statement III restates the closing advice that 'the time to build provisions is when profits make it painless'.",
      tags: ["multiple statements"],
      exams: SBI_PO,
    },
    {
      topic: "Advanced Reading Comprehension",
      subtopic: "Vocabulary in Context",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "english-advrc-credit-growth",
      text: "As used in the passage, the word 'exuberant' most nearly means",
      options: ["cautious", "profitable", "unrestrained", "regulated"],
      correct: 2,
      explanation:
        "The 'final, exuberant phase' of the cycle is the one in which standards slip and lending runs ahead of assessment, so 'exuberant' carries the sense of excessive, unrestrained enthusiasm. 'Cautious' and 'regulated' are the opposite of the context.",
      tags: ["vocabulary in context"],
      exams: SBI_PO,
    },
    {
      topic: "Advanced Reading Comprehension",
      subtopic: "Critical Reasoning RC",
      difficulty: "ADVANCED",
      format: "PASSAGE",
      context: "english-advrc-credit-growth",
      text: "Which of the following, if true, would most weaken the author's claim that growth outrunning assessment capacity is 'a liability that has not yet been recognised'?",
      options: [
        "Banks that grew fastest in the last decade recorded the lowest default rates in the subsequent downturn.",
        "Regulators in several countries have adopted counter-cyclical capital buffers.",
        "Loan officers report that targets are set annually by head office.",
        "Collateral values fell sharply in the most recent downturn.",
      ],
      correct: 0,
      explanation:
        "The claim predicts that fast growth leads to later losses. Evidence that the fastest-growing banks suffered the fewest defaults directly contradicts that prediction. The other options are consistent with, or irrelevant to, the author's argument.",
      tags: ["weaken"],
      exams: SBI_PO,
    },

    // -------------------------------------------------- Advanced Verbal Ability
    {
      topic: "Advanced Verbal Ability",
      subtopic: "Multiple Fillers",
      difficulty: "HARD",
      text: "Choose the set of words that best fills the blanks in order.\nThe regulator's ______ to act early was ______ by critics as caution, but within a year the ______ of several lenders proved the decision right.",
      options: [
        "reluctance, praised, recovery",
        "decision, dismissed, collapse",
        "refusal, welcomed, expansion",
        "decision, applauded, failure",
      ],
      correct: 1,
      explanation:
        "The sentence contrasts criticism with later vindication. A 'decision' to act early 'dismissed' as mere caution, followed by the 'collapse' of lenders that proved the decision right, is the only option in which all three words fit the logic. 'Reluctance to act early' contradicts the regulator having acted, and 'praised' or 'applauded' does not fit 'critics'.",
      tags: ["fillers"],
      exams: SBI_PO,
    },
    {
      topic: "Advanced Verbal Ability",
      subtopic: "Sentence Connectors",
      difficulty: "MEDIUM",
      text: "Choose the connector that best joins the two sentences.\nThe bank cut its lending rate. Loan applications did not rise.",
      options: ["Consequently", "Nevertheless", "Moreover", "Likewise"],
      correct: 1,
      explanation:
        "A rate cut would be expected to increase applications, so the second sentence is an unexpected outcome. 'Nevertheless' signals that contrast. 'Consequently' would wrongly present the lack of rise as a result, and 'moreover' and 'likewise' add rather than contrast.",
      tags: ["connectors"],
      exams: SBI_PO,
    },
    {
      topic: "Advanced Verbal Ability",
      subtopic: "Odd Sentence Out",
      difficulty: "HARD