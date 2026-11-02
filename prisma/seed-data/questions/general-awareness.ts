import type { SeedQuestionFile } from "../types";

const file: SeedQuestionFile = {
  contexts: [],
  questions: [
    // ---------------------------------------------------------------- Banking Awareness
    {
      topic: "Banking Awareness",
      difficulty: "EASY",
      text: "Which payment system settles each fund transfer individually and continuously, on a gross basis, in the books of the Reserve Bank of India?",
      options: ["NEFT", "RTGS", "ECS", "Cheque Truncation System"],
      correct: 1,
      explanation:
        "RTGS (Real Time Gross Settlement) settles every instruction one by one, without netting, in the books of the RBI. It is meant for large-value transfers, whereas NEFT settles in batches on a deferred net basis.",
      tags: ["payment systems", "rtgs"],
    },
    {
      topic: "Banking Awareness",
      difficulty: "MEDIUM",
      text: "Under the RBI directive effective from 1 April 2012, a cheque, draft or pay order is valid for payment for what period from its date?",
      options: ["One month", "Six months", "Three months", "Twelve months"],
      correct: 2,
      explanation:
        "The RBI reduced the validity of cheques, drafts, pay orders and banker's cheques from six months to three months with effect from 1 April 2012. An instrument presented after this period is treated as stale and is returned unpaid.",
      tags: ["cheque", "instruments"],
    },
    {
      topic: "Banking Awareness",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about scheduled banks in India. Which of them is/are correct?",
      formatData: {
        statements: [
          "A scheduled bank is a bank included in the Second Schedule of the RBI Act, 1934.",
          "Every co-operative bank in India is automatically a scheduled bank.",
          "Scheduled banks must maintain a cash reserve with the RBI under Section 42 of the RBI Act, 1934.",
        ],
      },
      options: ["Only I", "I and II", "II and III", "I and III"],
      correct: 3,
      explanation:
        "Scheduled status comes from inclusion in the Second Schedule of the RBI Act, 1934, and carries the Section 42 obligation to keep cash reserves with the RBI. Many co-operative banks are not in that Schedule, so statement II is wrong.",
      tags: ["scheduled banks", "rbi act"],
    },
    {
      topic: "Banking Awareness",
      difficulty: "MEDIUM",
      text: "Which section of the Negotiable Instruments Act, 1881 defines a cheque?",
      options: ["Section 6", "Section 4", "Section 5", "Section 138"],
      correct: 0,
      explanation:
        "Section 6 defines a cheque as a bill of exchange drawn on a specified banker and payable on demand. Section 4 covers promissory notes, Section 5 covers bills of exchange, and Section 138 makes dishonour of a cheque for insufficient funds an offence.",
      tags: ["ni act", "cheque"],
    },
    {
      topic: "Banking Awareness",
      difficulty: "MEDIUM",
      text: "With effect from 4 February 2020, deposit insurance cover provided by the DICGC was raised to what amount per depositor, per bank?",
      options: ["₹1 lakh", "₹2 lakh", "₹5 lakh", "₹10 lakh"],
      correct: 2,
      explanation:
        "The Deposit Insurance and Credit Guarantee Corporation, a wholly owned subsidiary of the RBI, raised the cover from ₹1 lakh to ₹5 lakh from 4 February 2020. The limit covers principal and interest together for each depositor in each bank.",
      tags: ["dicgc", "deposit insurance"],
    },
    {
      topic: "Banking Awareness",
      difficulty: "HARD",
      text: "Under Section 13(2) of the SARFAESI Act, 2002, how long does a borrower whose account is classified as an NPA get to discharge the liabilities after the secured creditor's notice?",
      options: ["30 days", "45 days", "90 days", "60 days"],
      correct: 3,
      explanation:
        "Section 13(2) requires the secured creditor to give written notice allowing 60 days to discharge the debt. If the borrower fails to pay, Section 13(4) lets the creditor take measures such as possession of the secured asset without court intervention.",
      tags: ["sarfaesi", "npa recovery"],
    },

    // ---------------------------------------------------------------- RBI Functions
    {
      topic: "RBI and Monetary Policy",
      subtopic: "RBI Functions",
      difficulty: "EASY",
      text: "On which date did the Reserve Bank of India commence operations?",
      options: ["1 April 1935", "1 April 1934", "15 August 1947", "1 January 1949"],
      correct: 0,
      explanation:
        "The RBI began operations on 1 April 1935 under the Reserve Bank of India Act, 1934. It was nationalised later, on 1 January 1949.",
      tags: ["rbi history"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "RBI Functions",
      difficulty: "MEDIUM",
      text: "The one-rupee note differs from other Indian currency notes in that it is",
      options: [
        "issued by the RBI and signed by the RBI Governor",
        "issued by the State Bank of India on behalf of the RBI",
        "issued by the Government of India and signed by the Finance Secretary",
        "issued by the Security Printing Corporation and signed by its Chairman",
      ],
      correct: 2,
      explanation:
        "Section 22 of the RBI Act, 1934 gives the RBI the sole right to issue bank notes, and these carry the Governor's signature. The one-rupee note is a Government of India currency note and carries the Finance Secretary's signature.",
      tags: ["currency", "note issue"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "RBI Functions",
      difficulty: "MEDIUM",
      text: "The RBI's Central Office was first established in Calcutta. In which year was it permanently moved to Bombay?",
      options: ["1935", "1949", "1947", "1937"],
      correct: 3,
      explanation:
        "The RBI's Central Office was initially at Calcutta and moved permanently to Bombay (now Mumbai) in 1937. The Central Office is where the Governor sits and policy is formulated.",
      tags: ["rbi history"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "RBI Functions",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Which of the following statements about the functions of the RBI is/are correct?",
      formatData: {
        statements: [
          "The RBI regulates insurance companies in India.",
          "The RBI acts as banker to the Central Government.",
          "The RBI manages the public debt of the Central Government.",
        ],
      },
      options: ["II and III", "Only II", "I and II", "I, II and III"],
      correct: 0,
      explanation:
        "Sections 20 and 21 of the RBI Act, 1934 make the RBI banker to the Central Government and entrust it with managing public debt. Insurance companies are regulated by the IRDAI, so statement I is wrong.",
      tags: ["rbi functions", "public debt"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "RBI Functions",
      difficulty: "HARD",
      text: "Under the Minimum Reserve System in Section 33 of the RBI Act, 1934, the Issue Department must hold gold and foreign securities of at least what aggregate value, with what minimum in gold?",
      options: [
        "₹515 crore in aggregate, with at least ₹400 crore in gold",
        "₹200 crore in aggregate, with at least ₹115 crore in gold",
        "₹200 crore in aggregate, with at least ₹85 crore in gold",
        "₹115 crore in aggregate, with at least ₹85 crore in gold",
      ],
      correct: 1,
      explanation:
        "Section 33 requires the assets of the Issue Department to include gold and foreign securities worth at least ₹200 crore, of which at least ₹115 crore must be gold. This minimum reserve approach replaced the earlier proportional reserve method and allows note issue beyond the fixed reserve.",
      tags: ["minimum reserve system", "rbi act"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "RBI Functions",
      difficulty: "HARD",
      format: "MATCH_THE_FOLLOWING",
      text: "Match the sections of the RBI Act, 1934 in Column A with their subject matter in Column B.",
      formatData: {
        columnA: ["Section 22", "Section 24", "Section 26", "Section 42"],
        columnB: [
          "Cash reserves of scheduled banks",
          "Denominations of notes",
          "Right to issue bank notes",
          "Legal tender character of notes",
        ],
      },
      options: [
        "A-1, B-3, C-4, D-2",
        "A-3, B-4, C-2, D-1",
        "A-3, B-2, C-4, D-1",
        "A-4, B-2, C-3, D-1",
      ],
      correct: 2,
      explanation:
        "In the RBI Act, 1934, Section 22 gives the sole right to issue bank notes, Section 24 deals with denominations, and Section 26 with legal tender character. Section 42 requires scheduled banks to keep cash reserves with the RBI, which is the basis of CRR.",
      tags: ["rbi act", "sections"],
    },

    // ---------------------------------------------------------------- Monetary Policy
    {
      topic: "RBI and Monetary Policy",
      subtopic: "Monetary Policy",
      difficulty: "EASY",
      text: "The repo rate is the rate at which",
      options: [
        "commercial banks lend to their prime customers",
        "the RBI borrows from commercial banks against no security",
        "state governments borrow from the Central Government",
        "the RBI lends to banks against government securities with an agreement to repurchase",
      ],
      correct: 3,
      explanation:
        "In a repo, a bank sells government securities to the RBI to obtain funds and agrees to buy them back at a later date. The rate charged is the repo rate, the RBI's key policy rate under the Liquidity Adjustment Facility.",
      tags: ["repo", "laf"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "Monetary Policy",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about reserve requirements. Which of them is/are correct?",
      formatData: {
        statements: [
          "CRR is maintained as a balance with the RBI and is calculated on a bank's net demand and time liabilities.",
          "SLR is prescribed under Section 24 of the Banking Regulation Act, 1949.",
          "The RBI pays banks interest on their CRR balances.",
        ],
      },
      options: ["I and II", "Only I", "II and III", "I, II and III"],
      correct: 0,
      explanation:
        "CRR is held with the RBI under Section 42 of the RBI Act, 1934, on net demand and time liabilities, and earns no interest. SLR is held by banks in liquid assets such as cash, gold and approved securities under Section 24 of the Banking Regulation Act, 1949.",
      tags: ["crr", "slr"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "Monetary Policy",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Which of the following statements about the Monetary Policy Committee constituted under Section 45ZB of the RBI Act, 1934 is/are correct?",
      formatData: {
        statements: [
          "It has six members.",
          "All its members are nominated by the Central Government.",
          "The RBI Governor has a second or casting vote in the event of a tie.",
        ],
      },
      options: ["Only I", "I and III", "II and III", "I and II"],
      correct: 1,
      explanation:
        "The MPC has six members: three from the RBI, including the Governor as chairperson, and three nominated by the Central Government. Decisions are by majority, and the Governor has a casting vote if votes are tied.",
      tags: ["mpc", "rbi act"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "Monetary Policy",
      difficulty: "MEDIUM",
      text: "Which of the following is a qualitative (selective) instrument of credit control?",
      options: ["Cash Reserve Ratio", "Open Market Operations", "Moral suasion", "Statutory Liquidity Ratio"],
      correct: 2,
      explanation:
        "Quantitative tools such as CRR, SLR and open market operations affect the overall volume of credit in the economy. Qualitative tools such as moral suasion and margin requirements influence the direction and use of credit.",
      tags: ["credit control"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "Monetary Policy",
      difficulty: "HARD",
      text: "Under Section 45ZN of the RBI Act, 1934 and the framework notified in 2016, when is the RBI considered to have failed to meet the inflation target?",
      options: [
        "Average inflation stays outside the tolerance band for any three consecutive quarters",
        "Monthly inflation exceeds the upper tolerance level in any single month",
        "Annual average inflation exceeds the target for two consecutive years",
        "Average inflation stays above the target for any two consecutive quarters",
      ],
      correct: 0,
      explanation:
        "Failure is defined as average inflation above the upper tolerance level or below the lower tolerance level for any three consecutive quarters. The RBI must then report to the Central Government the reasons, the remedial actions proposed and the estimated time to return to target.",
      tags: ["inflation targeting", "rbi act"],
    },
    {
      topic: "RBI and Monetary Policy",
      subtopic: "Monetary Policy",
      difficulty: "HARD",
      text: "The Standing Deposit Facility introduced by the RBI in April 2022 is distinctive because it allows the RBI to",
      options: [
        "lend to banks without collateral",
        "absorb liquidity from banks without providing collateral",
        "buy government securities outright from banks",
        "lend to non-bank financial companies at the bank rate",
      ],
      correct: 1,
      explanation:
        "Under a reverse repo, the RBI must give banks government securities as collateral when it absorbs funds. The SDF, enabled by a 2018 amendment to Section 17 of the RBI Act, 1934, absorbs liquidity without collateral and became the floor of the LAF corridor in April 2022.",
      tags: ["sdf", "liquidity"],
    },

    // ---------------------------------------------------------------- Financial Institutions
    {
      topic: "Financial Awareness",
      subtopic: "Financial Institutions",
      difficulty: "EASY",
      text: "Which institution, established in 1982, is the apex development bank for agriculture and rural development in India?",
      options: ["SIDBI", "NHB", "EXIM Bank", "NABARD"],
      correct: 3,
      explanation:
        "NABARD was set up on 12 July 1982 under the NABARD Act, 1981, following the recommendations of the Sivaraman Committee. It is headquartered in Mumbai and supports agricultural and rural credit, including through refinance.",
      tags: ["nabard"],
    },
    {
      topic: "Financial Awareness",
      subtopic: "Financial Institutions",
      difficulty: "MEDIUM",
      text: "SIDBI, the principal financial institution for micro, small and medium enterprises, was established under an Act of Parliament passed in which year?",
      options: ["1981", "1989", "1990", "1964"],
      correct: 1,
      explanation:
        "SIDBI was established under the Small Industries Development Bank of India Act, 1989 and began operations on 2 April 1990. It started as a wholly owned subsidiary of IDBI, and its head office is in Lucknow.",
      tags: ["sidbi"],
    },
    {
      topic: "Financial Awareness",
      subtopic: "Financial Institutions",
      difficulty: "MEDIUM",
      format: "MATCH_THE_FOLLOWING",
      text: "Match the financial institutions in Column A with the cities of their head offices in Column B.",
      formatData: {
        columnA: ["SEBI", "SIDBI", "IRDAI", "PFRDA"],
        columnB: ["Lucknow", "New Delhi", "Mumbai", "Hyderabad"],
      },
      options: [
        "A-3, B-1, C-2, D-4",
        "A-1, B-3, C-4, D-2",
        "A-4, B-1, C-3, D-2",
        "A-3, B-1, C-4, D-2",
      ],
      correct: 3,
      explanation:
        "SEBI is headquartered in Mumbai, SIDBI in Lucknow, IRDAI in Hyderabad and PFRDA in New Delhi. These bodies respectively regulate securities markets, finance MSMEs, regulate insurance and regulate pension funds.",
      tags: ["headquarters", "regulators"],
    },
    {
      topic: "Financial Awareness",
      subtopic: "Financial Institutions",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about the National Housing Bank (NHB). Which of them is/are correct?",
      formatData: {
        statements: [
          "Its head office is located in Mumbai.",
          "It was established in 1988 under the National Housing Bank Act, 1987.",
          "The Finance (No. 2) Act, 2019 transferred the regulation of housing finance companies from the NHB to the RBI.",
        ],
      },
      options: ["Only II", "I and II", "II and III", "I, II and III"],
      correct: 2,
      explanation:
        "The NHB was set up in 1988 under the National Housing Bank Act, 1987, and its head office is in New Delhi, so statement I is wrong. The Finance (No. 2) Act, 2019 moved regulation of housing finance companies to the RBI, while the NHB retains supervision.",
      tags: ["nhb", "hfc"],
    },
    {
      topic: "Financial Awareness",
      subtopic: "Financial Institutions",
      difficulty: "MEDIUM",
      text: "The National Payments Corporation of India (NPCI) was set up as an initiative of the RBI and the Indian Banks' Association under the provisions of which Act?",
      options: [
        "Payment and Settlement Systems Act, 2007",
        "Banking Regulation Act, 1949",
        "Information Technology Act, 2000",
        "Securities Contracts (Regulation) Act, 1956",
      ],
      correct: 0,
      explanation:
        "NPCI is an umbrella organisation for retail payments in India, created under the Payment and Settlement Systems Act, 2007. It was incorporated in 2008 as a not-for-profit company, and it operates systems such as IMPS and UPI.",
      tags: ["npci", "payments"],
    },
    {
      topic: "Financial Awareness",
      subtopic: "Financial Institutions",
      difficulty: "HARD",
      text: "SEBI was first set up as a non-statutory body in April 1988. In which year did it acquire statutory status under its own Act?",
      options: ["1988", "1996", "1992", "2002"],
      correct: 2,
      explanation:
        "SEBI was constituted by a government resolution in 1988 and became a statutory body under the Securities and Exchange Board of India Act, 1992. The Act empowers it to protect investors and to develop and regulate the securities market.",
      tags: ["sebi"],
    },

    // ---------------------------------------------------------------- Banking Regulations
    {
      topic: "Banking Awareness",
      subtopic: "Banking Regulations",
      difficulty: "EASY",
      text: "Under the RBI's income recognition and asset classification norms, a term loan becomes a non-performing asset when interest or instalment of principal remains overdue for more than",
      options: ["30 days", "60 days", "90 days", "180 days"],
      correct: 2,
      explanation:
        "Under the RBI's IRAC norms, a term loan is classified as an NPA when interest or principal remains overdue for more than 90 days. A bank stops recognising income on an NPA on an accrual basis and must make provisions against it.",
      tags: ["npa", "irac"],
    },
    {
      topic: "Banking Awareness",
      subtopic: "Banking Regulations",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements on the classification of non-performing assets under RBI norms. Which of them is/are correct?",
      formatData: {
        statements: [
          "A sub-standard asset is one that has remained an NPA for a period of up to 12 months.",
          "A doubtful asset is one that has remained in the sub-standard category for 12 months.",
          "A loss asset is one where loss has been identified but the amount has not been written off wholly.",
        ],
      },
      options: ["Only I", "I and II", "II and III", "I, II and III"],
      correct: 3,
      explanation:
        "The RBI classifies NPAs as sub-standard, doubtful and loss according to the age of the default and the prospects of recovery. All three statements reflect the norms, and provisioning requirements rise as an asset moves down these categories.",
      tags: ["npa", "asset classification"],
    },
    {
      topic: "Banking Awareness",
      subtopic: "Banking Regulations",
      difficulty: "MEDIUM",
      text: "Which section of the Banking Regulation Act, 1949 defines 'banking'?",
      options: ["Section 5(b)", "Section 22", "Section 24", "Section 35A"],
      correct: 0,
      explanation:
        "Section 5(b) defines banking as accepting deposits of money from the public for lending or investment, repayable on demand or otherwise and withdrawable by cheque, draft or order. Section 5(c) then defines a banking company on that basis.",
      tags: ["br act", "definitions"],
    },
    {
      topic: "Banking Awareness",
      subtopic: "Banking Regulations",
      difficulty: "MEDIUM",
      text: "Under which section of the Banking Regulation Act, 1949 must a company obtain a licence from the RBI to carry on banking business in India?",
      options: ["Section 5", "Section 22", "Section 24", "Section 49"],
      correct: 1,
      explanation:
        "Section 22 of the Banking Regulation Act, 1949 prohibits a company from carrying on banking business in India without a licence from the RBI. The RBI may also cancel a licence under the same section if conditions are not met.",
      tags: ["br act", "licensing"],
    },
    {
      topic: "Banking Awareness",
      subtopic: "Banking Regulations",
      difficulty: "MEDIUM",
      text: "Which pillar of the Basel II framework relies on public disclosure by banks to promote market discipline?",
      options: ["Pillar 1", "Pillar 3", "Pillar 2", "None of the three pillars"],
      correct: 1,
      explanation:
        "Basel II rests on three pillars: minimum capital requirements (Pillar 1), supervisory review (Pillar 2) and market discipline through disclosure (Pillar 3). The framework was issued by the Basel Committee on Banking Supervision, which is hosted by the Bank for International Settlements in Basel.",
      tags: ["basel", "market discipline"],
    },
    {
      topic: "Banking Awareness",
      subtopic: "Banking Regulations",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements on the Basel III framework. Which of them is/are correct?",
      formatData: {
        statements: [
          "The Liquidity Coverage Ratio compares high-quality liquid assets with total net cash outflows over the next 30 calendar days under stress.",
          "The Net Stable Funding Ratio compares available stable funding with required stable funding over a one-year horizon.",
          "The Capital Conservation Buffer must be met using Tier 2 capital.",
        ],
      },
      options: ["I and II", "Only II", "I and III", "II and III"],
      correct: 0,
      explanation:
        "The LCR addresses short-term liquidity over 30 days, while the NSFR addresses longer-term funding stability over one year. The Capital Conservation Buffer must be met with Common Equity Tier 1 capital, so statement III is wrong.",
      tags: ["basel iii", "lcr", "nsfr"],
    },

    // ---------------------------------------------------------------- Indian Economy
    {
      topic: "Indian Economy",
      difficulty: "EASY",
      text: "NITI Aayog, which came into existence on 1 January 2015, replaced which body?",
      options: ["Finance Commission", "National Development Council", "Inter-State Council", "Planning Commission"],
      correct: 3,
      explanation:
        "NITI Aayog was created by a Union Cabinet resolution and replaced the Planning Commission, which had been set up in 1950. It functions as a policy think tank of the Government of India.",
      tags: ["niti aayog", "planning"],
    },
    {
      topic: "Indian Economy",
      difficulty: "MEDIUM",
      text: "The economic reforms of 1991 in India, often summarised as liberalisation, privatisation and globalisation, were triggered most directly by",
      options: [
        "a severe balance of payments crisis",
        "the nationalisation of major banks",
        "the introduction of GST",
        "a surplus in the current account",
      ],
      correct: 0,
      explanation:
        "In 1991 India's foreign exchange reserves fell so low that they could barely finance a few weeks of imports, creating a balance of payments crisis. The New Economic Policy that followed liberalised trade, foreign investment and industrial licensing.",
      tags: ["1991 reforms", "bop"],
    },
    {
      topic: "Indian Economy",
      difficulty: "MEDIUM",
      text: "Primary deficit in a government budget is calculated as",
      options: [
        "revenue expenditure minus revenue receipts",
        "total expenditure minus total receipts including borrowings",
        "fiscal deficit minus interest payments",
        "fiscal deficit minus revenue deficit",
      ],
      correct: 2,
      explanation:
        "Fiscal deficit measures the government's total borrowing requirement for the year. Subtracting interest payments gives the primary deficit, which shows borrowing needed for purposes other than servicing past debt.",
      tags: ["fiscal deficit", "budget"],
    },
    {
      topic: "Indian Economy",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about economic bodies in India. Which of them is/are correct?",
      formatData: {
        statements: [
          "The Planning Commission was a constitutional body.",
          "The Finance Commission is constituted under Article 280 of the Constitution.",
          "The GST Council is constituted under Article 279A of the Constitution.",
        ],
      },
      options: ["Only II", "I and II", "II and III", "I, II and III"],
      correct: 2,
      explanation:
        "The Planning Commission was created by a Cabinet resolution in 1950 and had no constitutional or statutory basis, so statement I is wrong. The Finance Commission (Article 280) and the GST Council (Article 279A) are constitutional bodies.",
      tags: ["constitution", "fiscal federalism"],
    },
    {
      topic: "Indian Economy",
      difficulty: "MEDIUM",
      text: "Gross National Product (GNP) is obtained from Gross Domestic Product (GDP) by",
      options: [
        "subtracting depreciation",
        "adding net factor income from abroad",
        "adding indirect taxes and subtracting subsidies",
        "subtracting net exports",
      ],
      correct: 1,
      explanation:
        "GDP measures output produced within a country's borders, whereas GNP measures income earned by its residents. Adding net factor income from abroad to GDP gives GNP, and subtracting depreciation from GNP gives NNP.",
      tags: ["national income"],
    },
    {
      topic: "Indian Economy",
      difficulty: "HARD",
      text: "In the RBI's monetary aggregates, broad money (M3) is equal to",
      options: [
        "M1 plus savings deposits with post office savings banks",
        "currency with the public plus demand deposits with banks",
        "M1 plus all post office deposits",
        "M1 plus time deposits with the banking system",
      ],
      correct: 3,
      explanation:
        "M1 (narrow money) comprises currency with the public, demand deposits with the banking system and other deposits with the RBI. M3 adds time deposits with the banking system to M1, whereas M2 adds post office savings deposits to M1 and M4 adds total post office deposits to M3.",
      tags: ["money supply", "m3"],
    },

    // ---------------------------------------------------------------- Government Schemes
    {
      topic: "Government Schemes",
      difficulty: "EASY",
      text: "In which year was the Pradhan Mantri Jan Dhan Yojana launched?",
      options: ["2011", "2014", "2015", "2016"],
      correct: 1,
      explanation:
        "The Pradhan Mantri Jan Dhan Yojana was launched on 28 August 2014 as a national mission for financial inclusion. It aims to give households access to basic bank accounts along with related services such as RuPay debit cards.",
      tags: ["pmjdy", "financial inclusion"],
    },
    {
      topic: "Government Schemes",
      difficulty: "MEDIUM",
      text: "The Stand-Up India scheme launched in April 2016 facilitates bank loans of what size for greenfield enterprises set up by SC/ST and women entrepreneurs?",
      options: [
        "Up to ₹50,000",
        "₹1 lakh to ₹10 lakh",
        "₹1 crore to ₹5 crore",
        "₹10 lakh to ₹1 crore",
      ],
      correct: 3,
      explanation:
        "Stand-Up India facilitates bank loans between ₹10 lakh and ₹1 crore for greenfield enterprises. It aims for at least one SC/ST borrower and at least one woman borrower per bank branch.",
      tags: ["stand-up india", "entrepreneurship"],
    },
    {
      topic: "Government Schemes",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about two social security schemes as launched in May 2015. Which of them is/are correct?",
      formatData: {
        statements: [
          "PMSBY offered accident insurance at an annual premium of ₹12.",
          "PMJJBY offered life insurance at an annual premium of ₹330.",
          "Both schemes were pension schemes administered by the PFRDA.",
        ],
      },
      options: ["Only I", "I and II", "II and III", "I and III"],
      correct: 1,
      explanation:
        "At launch, the Pradhan Mantri Suraksha Bima Yojana provided accident cover for ₹12 a year, and the Pradhan Mantri Jeevan Jyoti Bima Yojana provided life cover for ₹330 a year. Both are insurance schemes, so statement III is wrong; premiums were revised upward in 2022.",
      tags: ["pmsby", "pmjjby"],
    },
    {
      topic: "Government Schemes",
      difficulty: "MEDIUM",
      text: "At its launch in 2019, the PM-KISAN scheme provided eligible farmer families income support of how much per year, paid in three equal instalments?",
      options: ["₹2,000", "₹6,000", "₹10,000", "₹12,000"],
      correct: 1,
      explanation:
        "PM-KISAN, launched in February 2019, gives eligible farmer families ₹6,000 a year in three instalments of ₹2,000. The money is paid directly into beneficiaries' bank accounts through direct benefit transfer.",
      tags: ["pm-kisan", "dbt"],
    },
    {
      topic: "Government Schemes",
      difficulty: "HARD",
      text: "When the Pradhan Mantri Mudra Yojana was launched in April 2015, what was the loan range under its 'Tarun' category?",
      options: [
        "Up to ₹50,000",
        "₹50,000 to ₹5 lakh",
        "₹5 lakh to ₹10 lakh",
        "₹10 lakh to ₹20 lakh",
      ],
      correct: 2,
      explanation:
        "At launch, PMMY had three categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 lakh) and Tarun (₹5 lakh to ₹10 lakh). MUDRA, a subsidiary of SIDBI, refinances lending institutions rather than lending directly to borrowers.",
      tags: ["mudra", "msme"],
    },
    {
      topic: "Government Schemes",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about the Atal Pension Yojana as launched in May 2015. Which of them is/are correct?",
      formatData: {
        statements: [
          "It is administered by the Pension Fund Regulatory and Development Authority.",
          "The guaranteed pension begins at the age of 50.",
          "It is open only to employees of the organised sector.",
        ],
      },
      options: ["Only I", "I and II", "I and III", "II and III"],
      correct: 0,
      explanation:
        "The Atal Pension Yojana is administered by the PFRDA and focuses on workers in the unorganised sector. It offers a guaranteed minimum monthly pension of ₹1,000 to ₹5,000 starting at age 60, so statements II and III are wrong.",
      tags: ["apy", "pfrda"],
    },

    // ---------------------------------------------------------------- Current Affairs
    {
      topic: "Current Affairs",
      difficulty: "EASY",
      text: "In the demonetisation announced on 8 November 2016, the legal tender status of notes of which denominations was withdrawn?",
      options: ["₹100 and ₹500", "₹500 and ₹1,000", "₹1,000 and ₹2,000", "₹500 and ₹2,000"],
      correct: 1,
      explanation:
        "The Government of India, acting under Section 26(2) of the RBI Act, 1934, withdrew the legal tender status of ₹500 and ₹1,000 notes of the then existing series. New ₹500 and ₹2,000 notes were subsequently introduced.",
      tags: ["dated", "demonetisation"],
    },
    {
      topic: "Current Affairs",
      difficulty: "MEDIUM",
      text: "At the G20 summit held in New Delhi in September 2023, which organisation was admitted as a permanent member of the G20?",
      options: ["ASEAN", "SAARC", "The African Union", "The Gulf Cooperation Council"],
      correct: 2,
      explanation:
        "The African Union was admitted as a permanent member of the G20 at the New Delhi summit held on 9-10 September 2023 under India's presidency. The summit's theme was 'One Earth, One Family, One Future'.",
      tags: ["dated", "g20"],
    },
    {
      topic: "Current Affairs",
      difficulty: "MEDIUM",
      text: "The Goods and Services Tax, rolled out across India on 1 July 2017, was enabled by which Constitutional Amendment Act?",
      options: ["The 101st Amendment Act", "The 73rd Amendment Act", "The 86th Amendment Act", "The 103rd Amendment Act"],
      correct: 0,
      explanation:
        "The Constitution (One Hundred and First Amendment) Act, 2016 gave Parliament and the states concurrent power to levy GST and inserted Article 279A on the GST Council. GST replaced many central and state indirect taxes.",
      tags: ["dated", "gst"],
    },
    {
      topic: "Current Affairs",
      difficulty: "MEDIUM",
      text: "Under the public sector bank consolidation announced on 30 August 2019 and effective from 1 April 2020, Syndicate Bank was merged into which bank?",
      options: ["Union Bank of India", "Punjab National Bank", "Indian Bank", "Canara Bank"],
      correct: 3,
      explanation:
        "Under this consolidation, Syndicate Bank merged into Canara Bank, Andhra Bank and Corporation Bank into Union Bank of India, and Allahabad Bank into Indian Bank. Oriental Bank of Commerce and United Bank of India merged into Punjab National Bank.",
      tags: ["dated", "bank mergers"],
    },
    {
      topic: "Current Affairs",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about the RBI's announcement of 19 May 2023 on ₹2,000 notes. Which of them is/are correct?",
      formatData: {
        statements: [
          "The notes were withdrawn from circulation in pursuance of the RBI's Clean Note Policy.",
          "The notes ceased to be legal tender with immediate effect.",
          "The public was initially given until 30 September 2023 to deposit or exchange the notes.",
        ],
      },
      options: ["Only I", "I and II", "II and III", "I and III"],
      correct: 3,
      explanation:
        "The RBI withdrew ₹2,000 notes from circulation under its Clean Note Policy, but they retained their legal tender status, so statement II is wrong. The window for deposit or exchange was initially set to end on 30 September 2023.",
      tags: ["dated", "currency"],
    },
    {
      topic: "Current Affairs",
      difficulty: "HARD",
      text: "On 2 January 2023, by what majority did a Constitution Bench of the Supreme Court uphold the 2016 demonetisation decision?",
      options: ["3:2", "5:0", "4:1", "6:1"],
      correct: 2,
      explanation:
        "In Vivek Narayan Sharma v. Union of India, a five-judge bench upheld the decision-making process by a 4:1 majority. Justice B.V. Nagarathna dissented, holding that the exercise should have been carried out through legislation rather than a notification under Section 26(2) of the RBI Act, 1934.",
      tags: ["dated", "demonetisation", "supreme court"],
    },

    // ---------------------------------------------------------------- Static GK
    {
      topic: "Static General Awareness",
      difficulty: "EASY",
      text: "What is the currency of Japan?",
      options: ["Won", "Yuan", "Yen", "Baht"],
      correct: 2,
      explanation:
        "The yen is the currency of Japan, and the Bank of Japan is its central bank. The won belongs to South Korea, the yuan to China and the baht to Thailand.",
      tags: ["currencies"],
    },
    {
      topic: "Static General Awareness",
      difficulty: "MEDIUM",
      text: "Where is the headquarters of the New Development Bank, established by the BRICS countries?",
      options: ["Shanghai", "New Delhi", "Moscow", "Johannesburg"],
      correct: 0,
      explanation:
        "The New Development Bank, created under an agreement signed at the 2014 BRICS summit in Fortaleza, is headquartered in Shanghai. It finances infrastructure and sustainable development projects in emerging economies.",
      tags: ["ndb", "headquarters"],
    },
    {
      topic: "Static General Awareness",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about international financial institutions. Which of them is/are correct?",
      formatData: {
        statements: [
          "The IMF and the World Bank trace their origin to the Bretton Woods Conference of 1944.",
          "The IMF is headquartered in Washington, D.C.",
          "The Asian Development Bank is headquartered in Tokyo.",
        ],
      },
      options: ["Only I", "II and III", "I and III", "I and II"],
      correct: 3,
      explanation:
        "The IMF and the World Bank were conceived at the 1944 Bretton Woods Conference, and both are headquartered in Washington, D.C. The Asian Development Bank is headquartered in Manila, so statement III is wrong.",
      tags: ["imf", "world bank", "adb"],
    },
    {
      topic: "Static General Awareness",
      difficulty: "MEDIUM",
      text: "Which of the following country-currency pairs is incorrectly matched?",
      options: ["Bhutan - Ngultrum", "Bangladesh - Taka", "Thailand - Baht", "Myanmar - Ringgit"],
      correct: 3,
      explanation:
        "The ringgit is the currency of Malaysia, while Myanmar uses the kyat. The other three pairs are correct.",
      tags: ["currencies"],
    },
    {
      topic: "Static General Awareness",
      difficulty: "MEDIUM",
      text: "The World Trade Organization, which replaced the GATT framework on 1 January 1995, has its headquarters in",
      options: ["New York", "Geneva", "Brussels", "Washington, D.C."],
      correct: 1,
      explanation:
        "The WTO was established on 1 January 1995 under the Marrakesh Agreement and is headquartered in Geneva. It succeeded the General Agreement on Tariffs and Trade as the framework for multilateral trade rules.",
      tags: ["wto", "headquarters"],
    },
    {
      topic: "Static General Awareness",
      difficulty: "HARD",
      text: "Which Article of the Constitution of India deals with the Contingency Fund of India?",
      options: ["Article 112", "Article 266", "Article 267", "Article 280"],
      correct: 2,
      explanation:
        "Article 267 provides for the Contingency Fund, which is placed at the disposal of the President to meet unforeseen expenditure. Article 266 covers the Consolidated Fund and the Public Accounts, while Article 112 covers the Annual Financial Statement.",
      tags: ["constitution", "public finance"],
    },

    // ---------------------------------------------------------------- Financial Awareness
    {
      topic: "Financial Awareness",
      difficulty: "EASY",
      text: "The Sensex, a benchmark index of the BSE, is based on how many stocks?",
      options: ["30", "50", "100", "500"],
      correct: 0,
      explanation:
        "The Sensex tracks 30 large, actively traded companies listed on the BSE, whereas the Nifty 50 tracks 50 stocks on the NSE. The BSE was established in 1875 and is among the oldest stock exchanges in Asia.",
      tags: ["sensex", "stock market"],
    },
    {
      topic: "Financial Awareness",
      difficulty: "EASY",
      text: "If a bank raises its lending rate from 9.50% by 25 basis points, what is the new rate?",
      options: ["9.75%", "12.00%", "9.525%", "10.00%"],
      correct: 0,
      explanation:
        "One basis point equals 0.01 percentage point, so 25 basis points equal 0.25 percentage point. Adding this to 9.50% gives 9.75%.",
      tags: ["basis point"],
    },
    {
      topic: "Financial Awareness",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the following statements about Treasury Bills in India. Which of them is/are correct?",
      formatData: {
        statements: [
          "They are issued by state governments.",
          "They are issued at a discount and redeemed at face value.",
          "They pay interest through half-yearly coupons.",
        ],
      },
      options: ["Only II", "Only I", "I and II", "II and III"],
      correct: 0,
      explanation:
        "Treasury Bills are short-term instruments issued by the RBI on behalf of the Central Government in tenors of 91, 182 and 364 days. They carry no coupon, and the investor's return is the difference between the discounted issue price and the face value.",
      tags: ["t-bills", "money market"],
    },
    {
      topic: "Financial Awareness",
      difficulty: "MEDIUM",
      text: "Which money market instrument is an unsecured promissory note issued by eligible corporates?",
      options: ["Treasury Bill", "Certificate of Deposit", "Commercial Paper", "Repo"],
      correct: 2,
      explanation:
        "Commercial Paper is an unsecured money market instrument issued as a promissory note, allowing eligible corporates to raise short-term funds. Certificates of Deposit, by contrast, are issued by banks and financial institutions against deposited funds.",
      tags: ["commercial paper", "money market"],
    },
    {
      topic: "Financial Awareness",
      difficulty: "MEDIUM",
      text: "If market interest rates rise, what generally happens to the price of an existing fixed-coupon bond?",
      options: [
        "It rises because the coupon becomes more valuable",
        "It falls so that its yield moves in line with market rates",
        "It stays unchanged until maturity",
        "It rises because its yield falls",
      ],
      correct: 1,
      explanation:
        "A bond's price and yield move in opposite directions. When market rates rise, an existing bond's fixed coupon is less attractive, so its price falls until its yield matches the market.",
      tags: ["bonds", "yield"],
    },
    {
      topic: "Financial Awareness",
      difficulty: "HARD",
      text: "A bank has Tier 1 capital of ₹60 crore and Tier 2 capital of ₹20 crore. Its risk-weighted assets are ₹500 crore for credit risk, ₹200 crore for market risk and ₹100 crore for operational risk. What is its capital to risk-weighted assets ratio (CRAR)?",
      options: ["7.5%", "11.4%", "16%", "10%"],
      correct: 3,
      explanation:
        "CRAR equals total capital (Tier 1 plus Tier 2) divided by total risk-weighted assets, a measure used in the Basel framework. Here it is (60 + 20) / (500 + 200 + 100) = 80 / 800 = 10%.",
      tags: ["crar", "basel"],
    },
  ],
};

export default file;
