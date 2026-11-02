/**
 * The shared subject/topic/subtopic taxonomy. Exams configure which topics they
 * offer (ExamTopic); exams with stages additionally map topics into stages
 * (StageTopic, see sbi-po.ts). A topic lives in exactly one home subject but may
 * be shown under another subject in a stage, which is how Mains Data Analysis
 * reuses the Prelims arithmetic topics instead of duplicating them.
 */

export type SeedSubtopic = {
  name: string;
  /** ADVANCED subtopics only appear in stages with `includesAdvanced` (Mains). */
  tier?: "ADVANCED";
  description?: string;
};

export type SeedTopic = {
  name: string;
  description: string;
  /** DESCRIPTIVE topics are practised through writing tasks, not MCQs. */
  kind?: "DESCRIPTIVE";
  subtopics: (string | SeedSubtopic)[];
  /** Only these exams get this topic in their exam-level configuration. Default: every exam offering the subject. */
  examsOnly?: string[];
};

export type SeedSubject = {
  slug: string;
  name: string;
  topics: SeedTopic[];
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const adv = (name: string): SeedSubtopic => ({ name, tier: "ADVANCED" });

const SBI_PO_ONLY = ["sbi-po"];

export const SUBJECTS: SeedSubject[] = [
  {
    slug: "english",
    name: "English Language",
    topics: [
      {
        name: "Noun",
        description: "Kinds of nouns, number, gender and possession, and the errors examiners build around them.",
        subtopics: [
          "Proper Noun", "Common Noun", "Collective Noun", "Abstract Noun", "Material Noun", "Countable and Uncountable Nouns",
          "Singular and Plural Nouns", "Possessive Nouns", "Gender of Nouns", "Noun Number Rules", "Noun Error Detection",
        ],
      },
      {
        name: "Pronoun",
        description: "Every pronoun class, agreement with its antecedent, and the case errors that follow.",
        subtopics: [
          "Personal Pronouns", "Possessive Pronouns", "Reflexive Pronouns", "Emphatic Pronouns", "Demonstrative Pronouns",
          "Relative Pronouns", "Interrogative Pronouns", "Indefinite Pronouns", "Reciprocal Pronouns", "Antecedent Agreement", "Pronoun Errors",
        ],
      },
      {
        name: "Adjective",
        description: "Types of adjectives, degrees of comparison and the order adjectives take before a noun.",
        subtopics: [
          "Types of Adjectives", "Adjective of Quality", "Adjective of Quantity", "Adjective of Number", "Demonstrative Adjectives",
          "Possessive Adjectives", "Degrees of Comparison", "Order of Adjectives", "Adjective Error Detection",
        ],
      },
      {
        name: "Verb",
        description: "Main, helping and modal verbs, finite and non-finite forms, and verb forms that cause errors.",
        subtopics: [
          "Main Verbs", "Helping Verbs", "Transitive Verbs", "Intransitive Verbs", "Finite Verbs", "Non-Finite Verbs", "Modal Verbs",
          "Regular and Irregular Verbs", "Verb Forms", "Gerunds", "Infinitives", "Participles",
        ],
      },
      {
        name: "Adverb",
        description: "Adverb classes, their position in a sentence, and the adjective-versus-adverb confusion.",
        subtopics: [
          "Types of Adverbs", "Adverb of Time", "Adverb of Place", "Adverb of Manner", "Adverb of Frequency", "Adverb of Degree",
          "Position of Adverbs", "Adjective vs Adverb",
        ],
      },
      {
        name: "Tenses",
        description: "All twelve tenses, when each is used, and the sequence of tenses in complex sentences.",
        subtopics: [
          "Present Simple", "Present Continuous", "Present Perfect", "Present Perfect Continuous", "Past Simple", "Past Continuous",
          "Past Perfect", "Past Perfect Continuous", "Future Simple", "Future Continuous", "Future Perfect", "Future Perfect Continuous",
          "Sequence of Tenses",
        ],
      },
      {
        name: "Subject-Verb Agreement",
        description: "Making the verb agree with its real subject, including the tricky connectors and quantifiers.",
        subtopics: [
          "Basic Subject-Verb Agreement", "Singular and Plural Subjects", "Either/Or", "Neither/Nor", "Each and Every", "Everyone and Somebody",
          "Collective Nouns", "Along With / As Well As", "A Number Of / The Number Of", "Long Sentence Agreement",
        ],
      },
      {
        name: "Articles",
        description: "A, an, the and the zero article, with the usage rules that error-detection questions test.",
        subtopics: ["A and An", "The", "Zero Article", "Definite and Indefinite Articles", "Article Usage Rules", "Article Error Detection"],
      },
      {
        name: "Prepositions",
        description: "Prepositions of time, place, direction and movement, plus dependent prepositions and collocations.",
        subtopics: [
          "Prepositions of Time", "Prepositions of Place", "Prepositions of Direction", "Prepositions of Movement", "Dependent Prepositions",
          "Preposition Collocations", "Preposition Error Detection",
        ],
      },
      {
        name: "Conjunctions",
        description: "Coordinating, subordinating and correlative conjunctions and the pairs that must match.",
        subtopics: [
          "Coordinating Conjunctions", "Subordinating Conjunctions", "Correlative Conjunctions", "Although / Though", "Either / Neither",
          "Not Only / But Also", "Both / And",
        ],
      },
      {
        name: "Voice",
        description: "Active and passive voice, and conversion across tenses, modals and imperatives.",
        subtopics: ["Active Voice", "Passive Voice", "Tense-based Conversion", "Modal-based Conversion", "Imperative Sentences"],
      },
      {
        name: "Narration",
        description: "Direct and indirect speech: reporting verbs and the tense, pronoun and time-word changes.",
        subtopics: [
          "Direct Speech", "Indirect Speech", "Reporting Verbs", "Tense Changes", "Pronoun Changes", "Time and Place Changes", "Interrogative Sentences",
        ],
      },
      {
        name: "Other Grammar",
        description: "Conditionals, question tags, modifiers, parallelism, redundancy and sentence structure.",
        subtopics: ["Conditional Sentences", "Question Tags", "Modifiers", "Parallelism", "Redundancy", "Sentence Structure", "Common Grammar Errors"],
      },
      {
        name: "Vocabulary",
        description: "Synonyms, antonyms, idioms, phrasal verbs, confusables, spellings and words in context.",
        subtopics: [
          "Synonyms", "Antonyms", "One Word Substitution", "Idioms and Phrases", "Phrasal Verbs", "Confusing Words", "Homonyms", "Homophones",
          "Word Usage", "Spelling Correction", "Contextual Vocabulary", "Root Words", "Prefixes and Suffixes",
        ],
      },
      {
        name: "Reading Comprehension",
        description: "Passage-based questions on main idea, tone, inference, facts, vocabulary and critical reasoning.",
        subtopics: [
          "Main Idea", "Central Theme", "Suitable Title", "Author's Tone", "Author's Purpose", "Inference Questions", "Fact-based Questions",
          "Vocabulary in Context", "Conclusion-based Questions", "True/False Statements", "Critical Reasoning", "Strengthening and Weakening Arguments",
        ],
      },
      {
        name: "Verbal Ability",
        description: "The applied question types of the English section: errors, fillers, cloze, jumbles and rearrangement.",
        subtopics: [
          "Error Detection", "Sentence Improvement", "Sentence Correction", "Phrase Replacement", "Single Fillers", "Double Fillers", "Cloze Test",
          "Para Jumbles", "Sentence Rearrangement", "Paragraph Completion", "Word Rearrangement", "Connectors", "Sentence Inference",
        ],
      },
      {
        name: "Advanced Reading Comprehension",
        description: "Long editorial, economy, banking and business passages with inference-heavy and multi-statement questions.",
        examsOnly: SBI_PO_ONLY,
        subtopics: [
          "Long Editorial Passages", "Economy-based Passages", "Banking-based Passages", "Business and Finance Passages", "Inference-based RC",
          "Critical Reasoning RC", "Tone and Purpose", "Vocabulary in Context", "Multiple Statement Questions",
        ],
      },
      {
        name: "Advanced Verbal Ability",
        description: "Mains-level cloze, multiple fillers, connectors, odd sentence out, column matching and word usage.",
        examsOnly: SBI_PO_ONLY,
        subtopics: [
          "Advanced Cloze Test", "Double Fillers", "Multiple Fillers", "Sentence Connectors", "Sentence Rearrangement", "Paragraph Completion",
          "Para Jumbles", "Odd Sentence Out", "Phrase Replacement", "Word Usage", "Column-based Matching", "Sentence-based Error Detection",
        ],
      },
      {
        name: "Advanced Grammar",
        description: "Grammar at Mains depth: agreement, tenses, complex prepositions, parallelism, modifiers and conditionals.",
        examsOnly: SBI_PO_ONLY,
        subtopics: [
          "Advanced Subject-Verb Agreement", "Advanced Tenses", "Complex Prepositions", "Parallelism", "Modifiers", "Conditional Sentences",
          "Advanced Sentence Correction",
        ],
      },
      {
        name: "Mains Descriptive English",
        description: "Email, situation analysis, report and precis writing with model answers and evaluation criteria.",
        kind: "DESCRIPTIVE",
        examsOnly: SBI_PO_ONLY,
        subtopics: [
          "Formal Email Writing", "Professional Email Writing", "Situation Analysis", "Report Writing", "Precis Writing", "Business Communication",
        ],
      },
    ],
  },
  {
    slug: "quant",
    name: "Quantitative Aptitude",
    topics: [
      {
        name: "Number System",
        description: "Classification of numbers, divisibility, factors, LCM and HCF, remainders, unit digits, surds and indices.",
        subtopics: [
          "Natural Numbers", "Whole Numbers", "Integers", "Prime Numbers", "Composite Numbers", "Even and Odd Numbers", "Divisibility Rules",
          "Factors and Multiples", "LCM", "HCF", "Remainders", "Unit Digit", "Last Two Digits", "Fractions", "Decimals", "Square Roots",
          "Cube Roots", "Surds", "Indices",
        ],
      },
      {
        name: "Simplification",
        description: "Exact evaluation of expressions with BODMAS, fractions, decimals, percentages, squares and cubes.",
        subtopics: [
          "BODMAS", "Basic Arithmetic Operations", "Fractions", "Decimals", "Percentage Calculations", "Square and Cube Calculations", "Mixed Operations",
        ],
      },
      {
        name: "Approximation",
        description: "Fast estimation by rounding so the nearest option can be picked without exact arithmetic.",
        subtopics: [
          "Approximate Addition", "Approximate Subtraction", "Approximate Multiplication", "Approximate Division", "Square Root Approximation",
          "Decimal Approximation", "Percentage Approximation",
        ],
      },
      {
        name: "Number Series",
        description: "Missing and wrong number series built on differences, products, squares, cubes and mixed patterns.",
        subtopics: [
          "Missing Number Series", "Wrong Number Series", "Addition-based Series", "Subtraction-based Series", "Multiplication-based Series",
          "Division-based Series", "Square-based Series", "Cube-based Series", "Mixed Pattern Series",
        ],
      },
      {
        name: "Quadratic Equations",
        description: "Solving and comparing roots of two quadratic equations, the standard Prelims format.",
        subtopics: [
          "Basic Quadratic Equations", "Factorisation", "Finding Roots", "Comparing Roots", "Equation Comparison",
          adv("Advanced Roots"), adv("Multiple Equation Comparison"),
        ],
      },
      {
        name: "Percentage",
        description: "Percentage conversion, increase and decrease, successive change and the word problems built on them.",
        subtopics: [
          "Basic Percentage", "Percentage Conversion", "Percentage Increase", "Percentage Decrease", "Successive Percentage Change",
          "Population-based Questions", "Exam Score-based Questions", "Income and Expenditure",
          adv("Percentage Change"), adv("Growth Rate"),
        ],
      },
      {
        name: "Ratio and Proportion",
        description: "Ratios, proportion, compound ratio, direct and inverse variation and partnership-style splits.",
        subtopics: [
          "Basic Ratio", "Equivalent Ratios", "Proportion", "Compound Ratio", "Direct Proportion", "Inverse Proportion", "Partnership-based Ratios",
          adv("Ratio Distribution"), adv("Complex Ratio"), adv("Financial Ratio Questions"),
        ],
      },
      {
        name: "Average",
        description: "Simple and weighted averages, averages of ages, marks and speeds, and missing-value problems.",
        subtopics: [
          "Basic Average", "Weighted Average", "Average Age", "Average Marks", "Average Speed", "Missing Value Questions",
          adv("Combined Average"), adv("Data-based Average"),
        ],
      },
      {
        name: "Profit and Loss",
        description: "Cost, selling and marked price, profit and loss percentages, discounts and dishonest-dealer problems.",
        subtopics: [
          "Cost Price", "Selling Price", "Profit Percentage", "Loss Percentage", "Marked Price", "Discount", "Successive Discounts",
          "Dishonest Shopkeeper", "False Weight Questions",
          adv("Advanced Profit and Loss"), adv("Cost and Revenue Analysis"),
        ],
      },
      {
        name: "Simple and Compound Interest",
        description: "Simple and compound interest for different compounding periods, and the difference between the two.",
        subtopics: [
          "Principal", "Rate", "Time", "Simple Interest", "Compound Interest", "Annual Compounding", "Half-yearly Compounding",
          "Quarterly Compounding", "Difference Between SI and CI",
          adv("Instalments"), adv("Interest Comparison"),
        ],
      },
      {
        name: "Time and Work",
        description: "Individual and combined work, efficiency, wages, alternate days and pipes and cisterns.",
        subtopics: [
          "Individual Work", "Combined Work", "Efficiency", "Work and Wages", "Alternate Days", "Pipes and Cisterns", "Work-based Equations",
          adv("Multiple Workers"),
        ],
      },
      {
        name: "Speed, Time and Distance",
        description: "Speed, average and relative speed, trains, boats and streams, races and circular tracks.",
        subtopics: [
          "Basic Speed", "Average Speed", "Relative Speed", "Trains", "Boats and Streams", "Upstream and Downstream", "Races", "Circular Track",
          adv("Advanced Trains"), adv("Multi-stage Journeys"),
        ],
      },
      {
        name: "Mixture and Alligation",
        description: "Mixing ingredients in ratios, replacement, concentration and the rule of alligation.",
        subtopics: [
          "Basic Mixtures", "Ratio of Ingredients", "Replacement", "Alligation Rule", "Concentration", "Milk and Water Questions",
          adv("Advanced Mixture"), adv("Multiple Ingredient Problems"),
        ],
      },
      {
        name: "Partnership",
        description: "Sharing profit by capital and time invested, including working and sleeping partners.",
        subtopics: [
          "Basic Partnership", "Investment Ratio", "Time-based Investment", "Profit Distribution", "Working and Sleeping Partners",
          adv("Unequal Investment"),
        ],
      },
      {
        name: "Problems on Ages",
        description: "Present, past and future ages, age ratios and combined age equations.",
        subtopics: ["Present Age", "Past Age", "Future Age", "Age Ratios", "Combined Age Problems"],
      },
      {
        name: "Probability",
        description: "Classical probability with coins, dice and cards, independent and complementary events.",
        subtopics: [
          "Basic Probability", "Coins", "Dice", "Cards", "Independent Events", "Complementary Events",
          adv("Advanced Probability"), adv("Conditional Probability Basics"), adv("Multiple Events"),
        ],
      },
      {
        name: "Permutation and Combination",
        description: "Counting arrangements and selections, factorials, circular arrangements and repeated elements.",
        subtopics: [
          "Fundamental Counting Principle", "Arrangements", "Selection", "Factorial", "Circular Arrangements", "Repeated Elements",
          adv("Advanced Arrangements"), adv("Restriction-based Problems"),
        ],
      },
      {
        name: "Data Interpretation",
        description: "Tables, bar, line and pie charts, mixed graphs, caselets and missing-data sets at Prelims level.",
        subtopics: [
          "Table DI", "Bar Graph DI", "Line Graph DI", "Pie Chart DI", "Mixed Graph DI", "Caselet DI", "Missing DI", "Arithmetic-based DI",
          "Approximation-based DI",
        ],
      },
      {
        name: "Data Sufficiency",
        description: "Deciding which of the given statements are enough to answer a quantitative question.",
        subtopics: [
          "Two-statement Questions", "Three-statement Questions", "Quantitative Data Sufficiency", "Arithmetic Data Sufficiency",
          adv("Two-variable Sufficiency"), adv("DI-based Sufficiency"), adv("Comparison-based Sufficiency"),
        ],
      },
      {
        name: "Mensuration and Statistics",
        description: "Area, perimeter and volume of standard shapes and solids, plus mean, median and mode.",
        subtopics: ["Area", "Perimeter", "Rectangle", "Square", "Circle", "Cylinder", "Cone", "Sphere", "Cuboid", "Mean", "Median", "Mode"],
      },
    ],
  },
  {
    slug: "reasoning",
    name: "Reasoning Ability",
    topics: [
      {
        name: "Seating Arrangement",
        description: "Linear, circular, square, rectangular and parallel-row arrangements, including uncertain counts.",
        subtopics: [
          "Linear Seating", "Single Row", "Double Row", "Circular Seating", "Facing Inside", "Facing Outside", "Square Arrangement",
          "Rectangular Arrangement", "Parallel Row", "Uncertain Seating",
          adv("Complex Circular Arrangement"), adv("Variable-based Arrangement"), adv("Multi-condition Arrangement"),
        ],
      },
      {
        name: "Puzzles",
        description: "Floor, box, month, day, scheduling, comparison, age, designation and distribution puzzles.",
        subtopics: [
          "Floor Puzzle", "Flat Puzzle", "Box Puzzle", "Month-based Puzzle", "Day and Date Puzzle", "Scheduling Puzzle", "Comparison Puzzle",
          "Age-based Puzzle", "Designation-based Puzzle", "Variable-based Puzzle", "Distribution Puzzle",
          adv("Month and Year Puzzle"), adv("Uncertain Number of Persons"), adv("Multiple Variable Puzzles"),
        ],
      },
      {
        name: "Syllogism",
        description: "All, some and no statements, possibility and either-or cases, solved with Venn diagrams.",
        subtopics: ["Basic Syllogism", "All / Some / No", "Possibility Cases", "Either-Or Cases", "Venn Diagram Method", "Conclusion-based Questions"],
      },
      {
        name: "Inequality",
        description: "Direct and coded inequalities, combining relations and either-or conclusions.",
        subtopics: ["Basic Inequality", "Coded Inequality", "Direct Inequality", "Indirect Inequality", "Either-Or Cases"],
      },
      {
        name: "Blood Relations",
        description: "Family trees, direct and coded relations and generation-based reasoning.",
        subtopics: ["Family Tree", "Direct Relations", "Coded Relations", "Generation-based Questions", "Mixed Blood Relations"],
      },
      {
        name: "Direction and Distance",
        description: "Tracking turns and movements to find final direction and shortest distance.",
        subtopics: ["Basic Directions", "Distance Calculation", "Shortest Distance", "Turning-based Questions", "Direction-based Puzzles"],
      },
      {
        name: "Coding-Decoding",
        description: "Letter, number and symbol codes, Chinese coding, conditional and new-pattern coding.",
        subtopics: ["Letter Coding", "Number Coding", "Symbol Coding", "Chinese Coding", "Conditional Coding", "New Pattern Coding"],
      },
      {
        name: "Ranking and Order",
        description: "Positions from either end, total count, and ranking by height, weight or marks.",
        subtopics: ["Position from Left", "Position from Right", "Total Number of Persons", "Ranking Comparison", "Height and Weight Ranking"],
      },
      {
        name: "Series",
        description: "Alphabet, number, alphanumeric and mixed series, and missing terms.",
        subtopics: ["Alphabet Series", "Number Series", "Alphanumeric Series", "Mixed Series", "Missing Terms"],
      },
      {
        name: "Other Reasoning",
        description: "Alphabet tests, word formation, input-output, data sufficiency, and verbal and critical reasoning.",
        subtopics: [
          "Alphabet Test", "Word Formation", "Pair Formation", "Odd One Out", "Input-Output", "Data Sufficiency", "Statement and Assumption",
          "Statement and Conclusion", "Cause and Effect", "Course of Action", "Assertion and Reason", "Logical Sequence", "Decision Making",
          "Critical Reasoning", "Arguments",
          adv("Complex Input-Output"), adv("Machine Input-Output"), adv("Advanced Data Sufficiency"), adv("Statement and Inference"),
          adv("Statement and Argument"), adv("Logical Deduction"), adv("Coded Puzzles"),
        ],
      },
    ],
  },
  {
    slug: "dai",
    name: "Data Analysis & Interpretation",
    topics: [
      {
        name: "Advanced Data Interpretation",
        description: "Mains-level tables, charts, caselets, missing and radar data sets with heavy calculation.",
        subtopics: [
          "Advanced Table DI", "Advanced Bar Graph", "Advanced Line Graph", "Advanced Pie Chart", "Mixed Graph DI", "Caselet DI", "Missing DI",
          "Radar Chart", "Comparison DI", "Arithmetic-based DI", "Calculation-intensive DI",
        ],
      },
      {
        name: "Quantity Comparison",
        description: "Work out Quantity I and Quantity II separately and compare them.",
        subtopics: ["Quantity I vs Quantity II", "Arithmetic Comparison", "Equation-based Comparison", "Data-based Comparison"],
      },
      {
        name: "Advanced Statistics",
        description: "Mean, median and mode, missing values, growth and revenue analysis on financial data.",
        subtopics: [
          "Mean", "Median", "Mode", "Missing Values", "Percentage Change", "Growth Analysis", "Revenue and Expenditure", "Financial Data Interpretation",
        ],
      },
    ],
  },
  {
    slug: "reasoning-computer",
    name: "Reasoning & Computer Aptitude",
    topics: [
      {
        name: "Computer Fundamentals",
        description: "What a computer is, its generations and types, hardware, software, memory and storage.",
        subtopics: [
          "Introduction to Computers", "Characteristics", "Generations", "Types of Computers", "Hardware", "Software", "Input Devices", "Output Devices",
          "CPU", "Memory Units", "RAM", "ROM", "Cache", "Storage Devices",
        ],
      },
      {
        name: "Operating Systems",
        description: "Operating system basics, Windows and Linux, file, process and memory management, booting and deadlock.",
        subtopics: [
          "Operating System Fundamentals", "Windows", "Linux", "File Management", "Process Management", "Memory Management", "Multitasking",
          "Multithreading", "Booting", "Deadlock Basics",
        ],
      },
      {
        name: "Computer Networking",
        description: "Network types and topologies, OSI and TCP/IP, addressing, core protocols and network devices.",
        subtopics: [
          "LAN", "MAN", "WAN", "Network Topologies", "OSI Model", "TCP/IP Model", "IPv4", "IPv6", "IP Addressing", "DNS", "DHCP", "HTTP", "HTTPS",
          "TCP", "UDP", "Routers", "Switches", "Hubs", "Modems", "Firewalls", "Network Protocols",
        ],
      },
      {
        name: "Internet and Security",
        description: "Internet services, browsers and email, cloud computing, malware types and the basics of cyber security.",
        subtopics: [
          "Internet and Intranet", "Web Browsers", "Search Engines", "Email", "Cloud Computing", "Malware", "Viruses", "Worms", "Trojans",
          "Ransomware", "Phishing", "Encryption", "Decryption", "Authentication", "Digital Signatures", "Cyber Security",
        ],
      },
      {
        name: "Database",
        description: "DBMS concepts: tables, records, fields, keys, SQL basics and relational databases.",
        subtopics: ["DBMS Fundamentals", "Tables", "Records", "Fields", "Primary Keys", "Foreign Keys", "SQL Basics", "Relational Databases", "Database Operations"],
      },
      {
        name: "Office Applications",
        description: "Word, Excel and PowerPoint essentials, spreadsheet fundamentals, shortcuts and abbreviations.",
        subtopics: ["MS Word", "MS Excel", "MS PowerPoint", "Spreadsheet Fundamentals", "Common Shortcuts", "Computer Abbreviations"],
      },
    ],
  },
  {
    slug: "general-awareness",
    name: "Banking and General Awareness",
    topics: [
      {
        name: "Banking Awareness",
        description: "Structure and history of Indian banking, bank types, accounts, instruments, NPAs, digital banking and terminology.",
        subtopics: [
          "History of Indian Banking", "Structure of Indian Banking", "Public Sector Banks", "Private Sector Banks", "Cooperative Banks",
          "Regional Rural Banks", "Small Finance Banks", "Payments Banks", "Scheduled Banks", "Banking Functions", "Types of Bank Accounts",
          "Savings Account", "Current Account", "Fixed Deposits", "Recurring Deposits", "Cheques", "Demand Drafts", "Negotiable Instruments", "KYC",
          "AML", "NPA", "NPA Classification", "Priority Sector Lending", "Financial Inclusion", "Digital Banking", "UPI", "NEFT", "RTGS", "IMPS",
          "Banking Ombudsman", "Basel Norms", "Banking Terminology", "Banking Regulations",
        ],
      },
      {
        name: "RBI and Monetary Policy",
        description: "The RBI's history, structure and functions, the MPC and every policy rate and reserve ratio.",
        subtopics: [
          "RBI History", "RBI Functions", "RBI Structure", "Monetary Policy", "MPC", "Repo Rate", "Reverse Repo Rate", "SDF", "MSF", "Bank Rate", "CRR",
          "SLR", "OMO", "Inflation Targeting", "Liquidity Management", "RBI Regulations", "RBI Circulars",
        ],
      },
      {
        name: "Indian Economy",
        description: "National income, inflation, fiscal and monetary policy, the budget, deficits, taxation, BoP and growth.",
        subtopics: [
          "Basic Economic Concepts", "GDP", "GNP", "National Income", "Per Capita Income", "Inflation", "Deflation", "Fiscal Policy", "Monetary Policy",
          "Union Budget", "Fiscal Deficit", "Revenue Deficit", "Taxation", "Balance of Payments", "Forex Reserves", "Economic Growth", "Poverty",
          "Unemployment", "Economic Reforms", "Five-Year Plans",
        ],
      },
      {
        name: "Financial Awareness",
        description: "Money and capital markets, securities, insurance, pensions, and the regulators and development institutions.",
        subtopics: [
          "Money Market", "Capital Market", "Primary Market", "Secondary Market", "Stock Exchanges", "Mutual Funds", "Bonds", "Debentures",
          "Treasury Bills", "Government Securities", "Insurance", "Pension Systems", "SEBI", "IRDAI", "PFRDA", "NABARD", "SIDBI", "EXIM Bank", "NPCI",
          "Financial Institutions",
        ],
      },
      {
        name: "Government Schemes",
        description: "Financial inclusion, insurance, pension, credit, agriculture and rural development schemes.",
        subtopics: [
          "PMJDY", "Mudra Yojana", "Stand-Up India", "PMJJBY", "PMSBY", "Atal Pension Yojana", "PM SVANidhi", "Financial Inclusion Schemes",
          "Agriculture Schemes", "Rural Development Schemes", "Government Credit Schemes",
        ],
      },
      {
        name: "Current Affairs",
        description: "Monthly current affairs by category. Questions carry the month they belong to so you can revise by period.",
        subtopics: [
          "Banking and Financial News", "RBI Updates", "Economy", "National Affairs", "International Affairs", "Government Schemes", "Appointments",
          "Awards", "Summits", "Reports and Indexes", "MoUs", "Important Committees", "Important Days", "Sports", "Books and Authors", "Defence",
          "Science and Technology",
        ],
      },
      {
        name: "Static General Awareness",
        description: "Countries, capitals and currencies, organisations and headquarters, geography, and institutions.",
        subtopics: [
          "Countries, Capitals and Currencies", "International Organisations", "Headquarters", "National Parks", "Rivers and Dams", "Airports and Seaports",
          "Indian States and Capitals", "Financial Institutions", "Bank Headquarters",
        ],
      },
    ],
  },
  {
    slug: "professional-knowledge",
    name: "Professional Knowledge (IT)",
    topics: [
      "Database Management Systems", "SQL", "Computer Networks", "Operating Systems", "Data Structures", "Algorithms", "Programming Concepts",
      "Object-Oriented Programming", "Software Engineering", "Cyber Security", "Cryptography", "Computer Architecture", "Cloud Computing",
      "Web Technologies", "Data Communication", "Computer Organization",
    ].map((name) => ({ name, description: `${name} for the IBPS SO IT professional knowledge paper.`, subtopics: [] })),
  },
];

export type SubjectSlug = (typeof SUBJECTS)[number]["slug"];

export const subtopicName = (s: string | SeedSubtopic) => (typeof s === "string" ? s : s.name);

/**
 * How topics that existed in earlier seeds map onto the current taxonomy. The
 * seed applies these before upserting, so an existing database keeps every
 * question, answer and session while the syllabus takes its new shape.
 *  - rename: the topic row keeps its id; slug and name change.
 *  - merge:  questions, subtopics, sessions, answers and progress move to the
 *            target topic (which must exist in SUBJECTS); the old topic is removed.
 * `subtopicForMoved` is the subtopic given to moved questions that had none.
 */
export type TopicMigration =
  | { kind: "rename"; subject: string; from: string; to: string; subtopicForMoved?: string }
  | { kind: "merge"; subject: string; from: string; into: string; subtopicForMoved: string };

export const TOPIC_MIGRATIONS: TopicMigration[] = [
  { kind: "rename", subject: "english", from: "Preposition", to: "Prepositions" },
  { kind: "rename", subject: "english", from: "Conjunction", to: "Conjunctions" },
  { kind: "merge", subject: "english", from: "Error Detection", into: "Verbal Ability", subtopicForMoved: "Error Detection" },
  { kind: "merge", subject: "english", from: "Sentence Improvement", into: "Verbal Ability", subtopicForMoved: "Sentence Improvement" },
  { kind: "merge", subject: "english", from: "Fill in the Blanks", into: "Verbal Ability", subtopicForMoved: "Single Fillers" },
  { kind: "merge", subject: "english", from: "Cloze Test", into: "Verbal Ability", subtopicForMoved: "Cloze Test" },
  { kind: "merge", subject: "english", from: "Para Jumbles", into: "Verbal Ability", subtopicForMoved: "Para Jumbles" },
  { kind: "merge", subject: "english", from: "Phrase Replacement", into: "Verbal Ability", subtopicForMoved: "Phrase Replacement" },
  { kind: "merge", subject: "english", from: "Sentence Rearrangement", into: "Verbal Ability", subtopicForMoved: "Sentence Rearrangement" },
  { kind: "rename", subject: "quant", from: "Simple Interest", to: "Simple and Compound Interest", subtopicForMoved: "Simple Interest" },
  { kind: "merge", subject: "quant", from: "Compound Interest", into: "Simple and Compound Interest", subtopicForMoved: "Compound Interest" },
  { kind: "merge", subject: "quant", from: "Pipes and Cisterns", into: "Time and Work", subtopicForMoved: "Pipes and Cisterns" },
  { kind: "rename", subject: "quant", from: "Mensuration", to: "Mensuration and Statistics", subtopicForMoved: "Area" },
  { kind: "rename", subject: "reasoning", from: "Alphanumeric Series", to: "Series", subtopicForMoved: "Alphanumeric Series" },
  { kind: "merge", subject: "reasoning", from: "Input-Output", into: "Other Reasoning", subtopicForMoved: "Input-Output" },
  { kind: "merge", subject: "reasoning", from: "Data Sufficiency", into: "Other Reasoning", subtopicForMoved: "Data Sufficiency" },
  { kind: "merge", subject: "reasoning", from: "Logical Reasoning", into: "Other Reasoning", subtopicForMoved: "Critical Reasoning" },
  { kind: "merge", subject: "reasoning", from: "Statement and Assumptions", into: "Other Reasoning", subtopicForMoved: "Statement and Assumption" },
  { kind: "merge", subject: "reasoning", from: "Statement and Conclusions", into: "Other Reasoning", subtopicForMoved: "Statement and Conclusion" },
  { kind: "rename", subject: "general-awareness", from: "RBI Functions", to: "RBI and Monetary Policy", subtopicForMoved: "RBI Functions" },
  { kind: "merge", subject: "general-awareness", from: "Monetary Policy", into: "RBI and Monetary Policy", subtopicForMoved: "Monetary Policy" },
  { kind: "merge", subject: "general-awareness", from: "Banking Regulations", into: "Banking Awareness", subtopicForMoved: "Banking Regulations" },
  { kind: "merge", subject: "general-awareness", from: "Financial Institutions", into: "Financial Awareness", subtopicForMoved: "Financial Institutions" },
  { kind: "rename", subject: "general-awareness", from: "Static GK", to: "Static General Awareness" },
];

/** Earlier seeds used informal subtopic names; these become the syllabus names (matched by old slug). */
export const SUBTOPIC_RENAMES: { topic: string; from: string; to: string }[] = [
  { topic: "Puzzles", from: "Floor puzzle", to: "Floor Puzzle" },
  { topic: "Puzzles", from: "Box puzzle", to: "Box Puzzle" },
  { topic: "Seating Arrangement", from: "Linear, mixed facing", to: "Linear Seating" },
  { topic: "Seating Arrangement", from: "Circular", to: "Circular Seating" },
  { topic: "Syllogism", from: "Possibility", to: "Possibility Cases" },
  { topic: "Inequality", from: "Coded inequality", to: "Coded Inequality" },
  { topic: "Blood Relations", from: "Coded relations", to: "Coded Relations" },
  { topic: "Direction and Distance", from: "Turning angles", to: "Turning-based Questions" },
  { topic: "Coding-Decoding", from: "Word coding", to: "Letter Coding" },
  { topic: "Other Reasoning", from: "Inference", to: "Critical Reasoning" },
  { topic: "Other Reasoning", from: "Argument evaluation", to: "Arguments" },
  { topic: "Other Reasoning", from: "Cause and effect", to: "Cause and Effect" },
  { topic: "Other Reasoning", from: "Assertion and reason", to: "Assertion and Reason" },
];

type SeedSection = {
  subject: SubjectSlug;
  name: string;
  questions: number;
  minutes: number;
  marks: number;
  negative: number;
};

export type SeedExam = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  subjects: SubjectSlug[];
  /** Topics this exam leaves out of its practice configuration. */
  excludedTopics?: string[];
  pattern: { name: string; sections: SeedSection[] };
};

export const section = (
  subject: SubjectSlug,
  name: string,
  questions: number,
  minutes: number,
  marks = 1,
  negative = 0.25,
): SeedSection => ({ subject, name, questions, minutes, marks, negative });

/**
 * Starting patterns only. Exam bodies revise these, so every seeded pattern is
 * stored unverified and the UI says so until an admin checks it against the
 * current official notification and marks it verified.
 */
export const EXAMS: SeedExam[] = [
  {
    slug: "rbi-grade-b",
    name: "RBI Grade B",
    shortName: "RBI B",
    description: "Officer-cadre recruitment by the Reserve Bank of India.",
    subjects: ["english", "quant", "reasoning", "general-awareness"],
    pattern: {
      name: "Phase I",
      sections: [
        section("general-awareness", "General Awareness", 80, 25),
        section("reasoning", "Reasoning", 60, 45),
        section("english", "English Language", 30, 25),
        section("quant", "Quantitative Aptitude", 30, 25),
      ],
    },
  },
  {
    slug: "rbi-assistant",
    name: "RBI Assistant",
    shortName: "RBI Asst",
    description: "Assistant-cadre recruitment by the Reserve Bank of India.",
    subjects: ["english", "quant", "reasoning", "general-awareness"],
    pattern: {
      name: "Prelims",
      sections: [
        section("english", "English Language", 30, 20),
        section("quant", "Numerical Ability", 35, 20),
        section("reasoning", "Reasoning Ability", 35, 20),
      ],
    },
  },
  {
    slug: "ibps-po",
    name: "IBPS PO",
    shortName: "IBPS PO",
    description: "Probationary Officer recruitment for participating public sector banks.",
    subjects: ["english", "quant", "reasoning", "general-awareness"],
    pattern: {
      name: "Prelims",
      sections: [
        section("english", "English Language", 30, 20),
        section("quant", "Quantitative Aptitude", 35, 20),
        section("reasoning", "Reasoning Ability", 35, 20),
      ],
    },
  },
  {
    slug: "ibps-clerk",
    name: "IBPS Clerk",
    shortName: "IBPS Clerk",
    description: "Clerical-cadre recruitment for participating public sector banks.",
    subjects: ["english", "quant", "reasoning", "general-awareness"],
    excludedTopics: ["Permutation and Combination"],
    pattern: {
      name: "Prelims",
      sections: [
        section("english", "English Language", 30, 20),
        section("quant", "Numerical Ability", 35, 20),
        section("reasoning", "Reasoning Ability", 35, 20),
      ],
    },
  },
  {
    slug: "ibps-so-it",
    name: "IBPS SO IT Officer",
    shortName: "IBPS SO IT",
    description: "Specialist Officer (IT) recruitment with a professional knowledge paper.",
    subjects: ["professional-knowledge", "english", "quant", "reasoning"],
    pattern: {
      name: "Prelims and Professional Knowledge",
      sections: [
        section("english", "English Language", 50, 40, 0.5),
        section("reasoning", "Reasoning", 50, 40),
        section("quant", "Quantitative Aptitude", 50, 40),
        section("professional-knowledge", "Professional Knowledge", 60, 45),
      ],
    },
  },
  {
    slug: "sbi-po",
    name: "SBI PO",
    shortName: "SBI PO",
    description: "Probationary Officer recruitment by the State Bank of India: Prelims, Mains with a descriptive paper, and Phase III.",
    subjects: ["english", "quant", "reasoning", "general-awareness", "dai", "reasoning-computer"],
    pattern: {
      name: "Prelims",
      sections: [
        section("english", "English Language", 40, 20),
        section("quant", "Quantitative Aptitude", 30, 20),
        section("reasoning", "Reasoning Ability", 30, 20),
      ],
    },
  },
  {
    slug: "sbi-clerk",
    name: "SBI Clerk",
    shortName: "SBI Clerk",
    description: "Junior Associate recruitment by the State Bank of India.",
    subjects: ["english", "quant", "reasoning", "general-awareness"],
    excludedTopics: ["Permutation and Combination"],
    pattern: {
      name: "Prelims",
      sections: [
        section("english", "English Language", 40, 20),
        section("quant", "Numerical Ability", 30, 20),
        section("reasoning", "Reasoning Ability", 30, 20),
      ],
    },
  },
];

export const PATTERN_NOTE =
  "Starting configuration for practice. Exam bodies revise patterns, so check it against the latest official notification before relying on it.";
