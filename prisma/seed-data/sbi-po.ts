/**
 * SBI PO stage configuration. Everything here is exam metadata that an admin can
 * edit later in Admin -> Syllabus; nothing in the UI hardcodes these numbers.
 */

export type SeedStageSubject = {
  subject: string;
  displayName?: string;
  questions?: number;
  marks?: number;
  minutes?: number;
  /**
   * Topics shown under this subject in this stage, as "<homeSubjectSlug>/<topicName>".
   * "*" means every non-Mains-only topic of the subject itself. Omit to use "*".
   */
  topics?: string[];
};

export type SeedGuide = { slug: string; title: string; summary: string; content: string };

export type SeedDescriptiveTask = {
  type: "EMAIL" | "SITUATION_ANALYSIS" | "REPORT" | "PRECIS";
  subtopic: string;
  title: string;
  prompt: string;
  sourceText?: string;
  modelAnswer: string;
  evaluationCriteria: string[];
  wordLimit: number;
  timeLimitMinutes: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
};

export type SeedStage = {
  slug: string;
  name: string;
  shortName: string;
  kind: "OBJECTIVE" | "DESCRIPTIVE" | "INTERVIEW";
  description: string;
  notes?: string;
  totalQuestions?: number;
  totalMarks?: number;
  durationMinutes?: number;
  includesAdvanced?: boolean;
  preferredDifficulties?: ("EASY" | "MEDIUM" | "HARD" | "ADVANCED")[];
  taskTypes?: ("EMAIL" | "SITUATION_ANALYSIS" | "REPORT" | "PRECIS" | "ESSAY" | "LETTER")[];
  /** Name of the ExamPattern (mock tests) that mirrors this stage, created if missing. */
  pattern?: { name: string; sections: { subject: string; name: string; questions: number; minutes: number; marks: number; negative: number }[] };
  subjects: SeedStageSubject[];
  guides?: SeedGuide[];
  descriptiveTasks?: SeedDescriptiveTask[];
};

/** Topics Mains English shares with Prelims (every objective English topic). */
const ENGLISH_SHARED = [
  "english/Noun", "english/Pronoun", "english/Adjective", "english/Verb", "english/Adverb", "english/Tenses", "english/Subject-Verb Agreement",
  "english/Articles", "english/Prepositions", "english/Conjunctions", "english/Voice", "english/Narration", "english/Other Grammar",
  "english/Vocabulary", "english/Reading Comprehension", "english/Verbal Ability",
];

export const SBI_PO_STAGES: SeedStage[] = [
  {
    slug: "prelims",
    name: "Phase I: Preliminary Examination",
    shortName: "Prelims",
    kind: "OBJECTIVE",
    description:
      "An online objective test of 100 questions in 60 minutes with three separately timed sections. It shortlists candidates for Mains; its marks are not added to the final merit.",
    notes:
      "Each section has its own 20-minute timer. One-fourth of the marks assigned to a question are deducted for a wrong answer. Check the current SBI notification for cut-off and sectional rules.",
    totalQuestions: 100,
    totalMarks: 100,
    durationMinutes: 60,
    includesAdvanced: false,
    preferredDifficulties: ["EASY", "MEDIUM", "HARD"],
    pattern: {
      name: "Prelims",
      sections: [
        { subject: "english", name: "English Language", questions: 40, minutes: 20, marks: 1, negative: 0.25 },
        { subject: "quant", name: "Quantitative Aptitude", questions: 30, minutes: 20, marks: 1, negative: 0.25 },
        { subject: "reasoning", name: "Reasoning Ability", questions: 30, minutes: 20, marks: 1, negative: 0.25 },
      ],
    },
    subjects: [
      { subject: "english", displayName: "English Language", questions: 40, marks: 40, minutes: 20 },
      { subject: "quant", displayName: "Quantitative Aptitude", questions: 30, marks: 30, minutes: 20 },
      { subject: "reasoning", displayName: "Reasoning Ability", questions: 30, marks: 30, minutes: 20 },
    ],
  },
  {
    slug: "mains",
    name: "Phase II: Main Examination (Objective)",
    shortName: "Mains",
    kind: "OBJECTIVE",
    description:
      "An online objective test of 170 questions for 200 marks in 180 minutes, with sectional timing. Mains marks count towards the final selection.",
    notes:
      "Marks per question differ by section (1.5 for Reasoning & Computer Aptitude, 2 for Data Analysis & Interpretation, 1 for General Awareness, 0.5 for English). One-fourth of a question's marks is deducted for a wrong answer. Verify against the current notification.",
    totalQuestions: 170,
    totalMarks: 200,
    durationMinutes: 180,
    includesAdvanced: true,
    preferredDifficulties: ["MEDIUM", "HARD", "ADVANCED"],
    pattern: {
      name: "Mains Objective",
      sections: [
        { subject: "reasoning-computer", name: "Reasoning & Computer Aptitude", questions: 40, minutes: 50, marks: 1.5, negative: 0.375 },
        { subject: "dai", name: "Data Analysis & Interpretation", questions: 30, minutes: 45, marks: 2, negative: 0.5 },
        { subject: "general-awareness", name: "General Awareness / Economy / Banking Knowledge", questions: 60, minutes: 45, marks: 1, negative: 0.25 },
        { subject: "english", name: "English Language", questions: 40, minutes: 40, marks: 0.5, negative: 0.125 },
      ],
    },
    subjects: [
      {
        subject: "reasoning-computer",
        displayName: "Reasoning & Computer Aptitude",
        questions: 40,
        marks: 60,
        minutes: 50,
        topics: [
          "reasoning/Seating Arrangement",
          "reasoning/Puzzles",
          "reasoning/Other Reasoning",
          "reasoning-computer/Computer Fundamentals",
          "reasoning-computer/Operating Systems",
          "reasoning-computer/Computer Networking",
          "reasoning-computer/Internet and Security",
          "reasoning-computer/Database",
          "reasoning-computer/Office Applications",
        ],
      },
      {
        subject: "dai",
        displayName: "Data Analysis & Interpretation",
        questions: 30,
        marks: 60,
        minutes: 45,
        topics: [
          "dai/Advanced Data Interpretation",
          "quant/Data Sufficiency",
          "quant/Percentage",
          "quant/Ratio and Proportion",
          "quant/Average",
          "quant/Profit and Loss",
          "quant/Simple and Compound Interest",
          "quant/Time and Work",
          "quant/Speed, Time and Distance",
          "quant/Mixture and Alligation",
          "quant/Partnership",
          "quant/Probability",
          "quant/Permutation and Combination",
          "quant/Quadratic Equations",
          "dai/Quantity Comparison",
          "dai/Advanced Statistics",
        ],
      },
      {
        subject: "general-awareness",
        displayName: "General Awareness / Economy / Banking Knowledge",
        questions: 60,
        marks: 60,
        minutes: 45,
      },
      {
        subject: "english",
        displayName: "English Language",
        questions: 40,
        marks: 20,
        minutes: 40,
        topics: [...ENGLISH_SHARED, "english/Advanced Reading Comprehension", "english/Advanced Verbal Ability", "english/Advanced Grammar"],
      },
    ],
  },
  {
    slug: "mains-descriptive",
    name: "Phase II: Descriptive Test",
    shortName: "Descriptive",
    kind: "DESCRIPTIVE",
    description: "A 30-minute descriptive paper of 30 marks, typed on the computer, held with the objective Mains. It tests written English.",
    notes:
      "The task choices offered (email, situation analysis, report, precis, essay, letter) change with each notification. Admins configure the active task types for the current cycle under Admin -> Syllabus.",
    totalMarks: 30,
    durationMinutes: 30,
    taskTypes: ["EMAIL", "SITUATION_ANALYSIS", "REPORT", "PRECIS"],
    subjects: [{ subject: "english", displayName: "Descriptive English", marks: 30, minutes: 30, topics: ["english/Mains Descriptive English"] }],
    descriptiveTasks: [
      {
        type: "EMAIL",
        subtopic: "Formal Email Writing",
        title: "Email to a customer about a delayed cheque clearance",
        prompt:
          "You are the branch manager of a public sector bank. A customer, Mr. Arvind Rao, has complained that a cheque he deposited eight days ago has still not been credited. Write an email apologising for the delay, explaining the likely cause, stating what you have done, and telling him when he can expect the credit.",
        modelAnswer:
          "Subject: Update on your cheque deposited on 3 March\n\nDear Mr. Rao,\n\nThank you for writing to us, and please accept my apologies for the delay in crediting the cheque you deposited on 3 March.\n\nOn checking, I found that the cheque was drawn on an outstation branch and was sent for collection through the clearing house, which takes longer than a local clearing. The paying bank has now confirmed the payment, and I have asked our clearing section to post the credit to your account today.\n\nThe amount will reflect in your account by the end of business today, and you will receive an SMS confirmation. If you do not see the credit by tomorrow morning, please call me directly on the branch number below.\n\nWe value your relationship with the bank and regret the inconvenience caused.\n\nYours sincerely,\nPriya Menon\nBranch Manager, Koramangala Branch",
        evaluationCriteria: [
          "Subject line that states the matter clearly",
          "Appropriate salutation and closing",
          "Apology, cause, action taken and timeline all present",
          "Formal, courteous tone with no slang",
          "Grammar, spelling and punctuation",
          "Within the word limit",
        ],
        wordLimit: 150,
        timeLimitMinutes: 15,
        difficulty: "EASY",
      },
      {
        type: "EMAIL",
        subtopic: "Professional Email Writing",
        title: "Email to the regional office requesting additional staff",
        prompt:
          "As branch manager, write an email to your Regional Manager requesting two additional clerical staff for your branch. Give the reasons (footfall, new accounts under a government scheme, pending work), the impact on customer service, and what you have already tried.",
        modelAnswer:
          "Subject: Request for two additional clerical staff at Rajajinagar Branch\n\nDear Sir,\n\nI write to request the posting of two additional clerical staff to the Rajajinagar branch.\n\nSince the Jan Dhan account drive began in January, daily footfall has risen from about 220 to over 400 customers, and we open close to 60 accounts a day. With one clerk on long leave, the remaining four handle both the cash counters and account opening, so waiting time at peak hours now exceeds 40 minutes and KYC updates are two weeks behind.\n\nWe have already extended counter hours, moved routine enquiries to the help desk and encouraged customers to use the mobile app. These steps have helped, but the volume is beyond what the present team can clear.\n\nTwo additional clerks would let us run a dedicated account-opening counter and bring KYC updates back on schedule within a month. I would be grateful if the request could be considered at the earliest.\n\nYours faithfully,\nS. Iyer\nBranch Manager, Rajajinagar",
        evaluationCriteria: [
          "Clear subject line and purpose stated in the first line",
          "Specific, quantified reasons",
          "Shows what has already been tried",
          "States the expected benefit",
          "Respectful, concise professional tone",
          "Grammar and word limit",
        ],
        wordLimit: 180,
        timeLimitMinutes: 15,
        difficulty: "MEDIUM",
      },
      {
        type: "SITUATION_ANALYSIS",
        subtopic: "Situation Analysis",
        title: "Senior citizen pressured into buying an insurance policy",
        prompt:
          "Situation: A 72-year-old pensioner visits your branch to renew a fixed deposit. A junior officer persuades him to put the money into a long-term insurance policy instead, without explaining the lock-in and surrender charges. His son complains the next day. As branch manager, analyse the situation: identify the problem, the stakeholders, the immediate steps you would take, and how you would prevent a repeat.",
        modelAnswer:
          "The core problem is mis-selling: a product unsuitable for the customer's age and need was sold without disclosure, which breaches the bank's conduct rules and the regulator's expectations on fair treatment of customers.\n\nStakeholders are the customer and his family, the junior officer, the branch, the insurance partner and the bank's reputation.\n\nImmediate steps: meet the customer and his son, listen and apologise; check whether the policy is within its free-look period and, if so, initiate cancellation and a full refund; if not, escalate to the insurer for cancellation on grounds of mis-selling; restore the fixed deposit at the original rate; record the complaint in the bank's grievance system; and speak to the officer to establish the facts.\n\nPrevention: brief all staff on suitability and disclosure, require a signed need-analysis form for third-party products sold to senior citizens, have a second officer confirm such sales, and review sales incentives that reward volume over suitability.",
        evaluationCriteria: [
          "Identifies the real problem, not just the complaint",
          "Names the stakeholders",
          "Immediate, practical corrective steps in a logical order",
          "Preventive measures that address the cause",
          "Balanced, professional tone",
          "Structure and word limit",
        ],
        wordLimit: 200,
        timeLimitMinutes: 15,
        difficulty: "MEDIUM",
      },
      {
        type: "REPORT",
        subtopic: "Report Writing",
        title: "Report on a digital banking awareness camp",
        prompt:
          "Your branch organised a digital banking awareness camp for customers in a semi-urban area. Write a short report for the Regional Manager covering the objective, arrangements, participation, outcomes and recommendations.",
        modelAnswer:
          "Report on the Digital Banking Awareness Camp, Hosur Branch\n\nObjective: To help customers, especially senior citizens and small traders, use the mobile app, UPI and ATMs safely, and to reduce routine counter visits.\n\nArrangements: The camp was held on 14 February in the branch premises from 10 a.m. to 2 p.m. Two officers demonstrated the app on a projector, three clerks assisted customers individually, and printed guides in Tamil and English were distributed.\n\nParticipation: 146 customers attended, of whom 58 were senior citizens and 41 were traders. 97 customers activated the mobile app and 63 made their first UPI transaction during the camp.\n\nOutcomes: In the following fortnight, counter transactions for balance enquiry and fund transfer fell by about 18 per cent, and 34 traders started accepting QR payments.\n\nRecommendations: Repeat the camp quarterly, add a session on recognising phishing calls, and set up a permanent help desk with one trained clerk during peak hours.\n\nSubmitted by: R. Kumar, Branch Manager, 20 February",
        evaluationCriteria: [
          "Title and clear headings",
          "Objective, arrangements, participation, outcomes and recommendations covered",
          "Facts and figures rather than general statements",
          "Objective, impersonal tone",
          "Grammar and word limit",
        ],
        wordLimit: 200,
        timeLimitMinutes: 15,
        difficulty: "MEDIUM",
      },
      {
        type: "PRECIS",
        subtopic: "Precis Writing",
        title: "Precis on financial literacy",
        prompt: "Write a precis of the passage in about one-third of its length and give it a suitable title.",
        sourceText:
          "Financial literacy is often described as the ability to read a balance sheet or to understand compound interest, but for most households it is something far more ordinary: knowing how much comes in, how much goes out, and what to do with the difference. A family that keeps even a rough monthly budget is less likely to borrow from a moneylender when a medical bill arrives, because it will usually have set aside a small cushion. Surveys across India show that people who have been taught these basics, whether by a school teacher, a self-help group or a bank's business correspondent, save more regularly and are far less likely to fall for schemes that promise impossible returns. The lesson is not that everyone must become an investor, but that everyone should be able to recognise a bad deal and to plan for a predictable emergency. Banks have a direct interest in this. Customers who understand their accounts complain less, default less and use more services. Yet many branches still treat literacy camps as a compliance chore rather than as the cheapest form of customer acquisition they will ever find. (190 words)",
        modelAnswer:
          "Title: Everyday Financial Literacy\n\nFinancial literacy, for most households, means knowing income, expenses and how to use the balance, not reading balance sheets. Families that budget keep a small cushion and avoid moneylenders in emergencies. Indian surveys show that people taught these basics save regularly and resist fraudulent schemes. The aim is not to make everyone an investor but to help people spot bad deals and plan for foreseeable needs. Banks benefit directly, since informed customers complain and default less and use more services, yet many branches still treat literacy camps as a formality rather than as their cheapest way to win customers. (63 words)",
        evaluationCriteria: [
          "About one-third of the original length",
          "Suitable title",
          "All main ideas kept, examples and repetition dropped",
          "Written in your own words, in the third person",
          "Single coherent paragraph with no personal opinion added",
          "Grammar and spelling",
        ],
        wordLimit: 70,
        timeLimitMinutes: 15,
        difficulty: "HARD",
      },
    ],
  },
  {
    slug: "phase-3",
    name: "Phase III: Psychometric Test, Group Exercise and Interview",
    shortName: "Phase III",
    kind: "INTERVIEW",
    description:
      "Candidates shortlisted from Mains take a psychometric test and then a group exercise and personal interview. These are preparation guides, not MCQ practice.",
    notes: "Weightage of the group exercise and interview, and whether the psychometric test is qualifying, are set by each notification. Verify before relying on them.",
    subjects: [],
    guides: [
      {
        slug: "psychometric-test",
        title: "Psychometric Test",
        summary: "An online personality and behaviour questionnaire. There are no right answers, but there are inconsistent ones.",
        content:
          "The psychometric test asks you to rate statements about how you behave, decide and work with others. It is usually taken online before the interview round and is used as an input for the interview panel rather than as a scored paper.\n\nWhat it measures\n- Consistency: the same trait is asked about in several ways; contradictory answers stand out.\n- Work style: planning versus improvising, working alone versus in teams, comfort with rules and targets.\n- Interpersonal behaviour: how you handle conflict, criticism and pressure.\n\nHow to prepare\n- Answer honestly and quickly; over-thinking produces contradictions.\n- Think in advance about real examples from your studies or work that show responsibility, teamwork and handling pressure. The interview often probes the profile the test produced.\n- Read each statement fully. Some are phrased negatively.\n- Do not try to guess an ideal banker personality. Panels are looking for a coherent picture, not a perfect one.\n\nOn the day\n- Make sure of a stable internet connection and a quiet room if the test is remote.\n- Keep to the time; unanswered items weaken the profile.",
      },
      {
        slug: "group-exercise",
        title: "Group Exercise",
        summary: "A short group task or discussion observed by a panel. You are assessed on contribution, listening and reasoning, not on winning.",
        content:
          "In the group exercise, eight to ten candidates receive a case, a topic or a problem and are given a few minutes to think and then around twenty minutes to work on it together, while a panel observes.\n\nWhat the panel notes\n- Whether you understood the task and added relevant points.\n- How you listen: building on others, inviting quiet members in, not interrupting.\n- Clarity and structure of what you say.\n- Behaviour under disagreement: firm on reasoning, polite in manner.\n\nPreparation\n- Follow banking, economic and social news daily; most topics come from recent events or everyday banking situations.\n- Practise speaking for 45 to 60 seconds on a topic with one clear point and one supporting fact.\n- Rehearse with friends: take turns opening, summarising and moderating.\n- Learn to summarise a discussion in three sentences; the person who closes well is remembered.\n\nAvoid\n- Speaking first just to be first, or repeating what someone already said.\n- Dominating the time, or staying silent until the end.\n- Personal remarks, raised voices and pointing at other candidates.",
      },
      {
        slug: "personal-interview",
        title: "Personal Interview",
        summary: "A panel interview on your background, banking awareness, the economy and your fit for the role of a probationary officer.",
        content:
          "The interview typically lasts fifteen to twenty-five minutes with a panel of three to five members, including senior bankers.\n\nTypical areas\n- You: education, work experience, hometown, hobbies and why banking.\n- Banking: the bank's products, recent RBI policy, NPAs, digital payments, financial inclusion, and current rates and ratios.\n- Economy and current affairs: the budget, inflation, growth, major reforms and news of the last six months.\n- Situations: how you would handle an angry customer, a target you cannot meet, or a colleague's wrongdoing.\n\nPreparation plan\n- Prepare a two-minute introduction and know every line of your application form.\n- Revise the Banking Awareness, RBI and Monetary Policy, and Indian Economy topics in the Mains syllabus; the interview reuses them.\n- Read about the bank itself: history, size, schemes, recent news and your likely first posting.\n- Prepare honest answers for weak spots such as gaps, low scores or a non-commerce background.\n\nIn the room\n- Greet the panel, sit when asked, keep an upright, relaxed posture and look at the member who asked the question.\n- Answer in two or three sentences, then stop. Say \"I do not know\" rather than guessing facts.\n- Keep documents in the order the call letter lists them.",
      },
    ],
  },
];
