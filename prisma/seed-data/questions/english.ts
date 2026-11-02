import type { SeedQuestionFile } from "../types";

const file: SeedQuestionFile = {
  contexts: [
    {
      key: "english-rc-digital-payments",
      type: "PASSAGE",
      title: "Digital Payments and the Small Trader",
      content:
        "Over the past decade, instant digital payments have changed the way Indians handle money. A street vendor who once dealt only in cash can now accept payment by scanning a code, and the record of those small transactions has begun to serve a purpose nobody planned. Because lenders can see a steady flow of receipts, they are more willing to offer small loans to traders who have no collateral and no formal credit history. In this sense, data is starting to do the work that land and gold once did. Yet the transformation is uneven. Older customers often distrust apps, and those with poor connectivity may find that the technology fails them just when they need it. Fraud has also grown alongside convenience, since criminals find it easier to trick a hurried user than to break into a secure system. Regulators therefore face a delicate task: if they tighten rules too much, they may slow innovation, but if they leave firms unchecked, public confidence could collapse. The lasting measure of success will not be the number of transactions recorded each month, but whether ordinary people feel safer and better served by the system.",
    },
    {
      key: "english-rc-bad-loans",
      type: "PASSAGE",
      title: "The Spreading Cost of Bad Loans",
      content:
        "When a bank's loans turn bad, the damage rarely stops at its own balance sheet. A lender burdened with non-performing assets must set aside more of its earnings as provisions, which leaves less capital to support fresh lending. Managers, anxious to avoid further losses, grow cautious and may refuse credit even to sound borrowers. Businesses that are denied working capital postpone expansion or cut jobs, and the resulting slowdown makes it harder for other borrowers to repay. A problem that began with a few reckless loans can thus feed on itself. For this reason, many economists argue that speedy recognition of bad loans is preferable to concealment. Delay may flatter a bank's results for a quarter or two, but the eventual correction is usually larger and more painful. A credible insolvency process helps by letting creditors recover what they can and allowing viable firms to return to health under new management. Recapitalising weak banks may also be necessary, though critics warn that repeated rescues with public money reward imprudence. The challenge, then, is to clean up the past without encouraging the same behaviour in the future.",
    },
    {
      key: "english-cloze-financial-inclusion",
      type: "PASSAGE",
      title: "Financial Inclusion",
      content:
        "Financial inclusion means that every citizen, irrespective of income, has access to affordable banking services. For decades, large parts of rural India (1) outside the formal banking system, relying on moneylenders who charged heavy interest. The spread of basic savings accounts and mobile banking has begun to change this picture. A farmer can now receive a government subsidy (2) to her account and withdraw it from a nearby business correspondent. However, opening an account is only the first step. Many accounts remain dormant because their holders see little reason to use them, (3) financial literacy programmes are just as important as new branches. When people understand how savings, credit and insurance work, they are less likely to fall (4) to fraudulent schemes. True inclusion will be achieved only when formal finance becomes a daily habit rather than a novelty, and when the poorest customer feels as welcome at a bank counter as the richest.",
    },
  ],
  questions: [
    // ---------------------------------------------------------------- Noun
    {
      topic: "Noun",
      difficulty: "EASY",
      text: "Choose the grammatically correct sentence.",
      options: [
        "The manager gave us useful informations about the new scheme.",
        "The manager gave us useful information about the new scheme.",
        "The manager gave us an useful information about the new scheme.",
        "The manager gave us many useful information about the new scheme.",
      ],
      correct: 1,
      explanation:
        "'Information' is an uncountable noun, so it has no plural form and cannot take 'an' or 'many'. Only the second sentence treats it correctly. The first option looks natural to many learners, but 'informations' does not exist in standard English.",
      tags: ["uncountable nouns"],
    },
    {
      topic: "Noun",
      difficulty: "MEDIUM",
      text: "Which of the following nouns has the same form in both the singular and the plural?",
      options: ["Analysis", "Criterion", "Series", "Branch"],
      correct: 2,
      explanation:
        "'Series' is used unchanged for one or many, as in 'a series' and 'two series'. 'Analysis' and 'criterion' are tempting because they are also irregular, but their plurals change form to 'analyses' and 'criteria'. 'Branch' simply becomes 'branches'.",
      tags: ["plurals"],
    },
    {
      topic: "Noun",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct form of the noun.\nBoth of her ______ work in the treasury department of the bank.",
      options: ["brother-in-laws", "brothers-in-laws", "brother-in-law's", "brothers-in-law"],
      correct: 3,
      explanation:
        "In a compound noun of this kind, the plural marker goes on the main word, 'brother', which gives 'brothers-in-law'. 'Brother-in-laws' is a common error because it pluralises the end of the compound rather than its head noun. 'Brothers-in-laws' marks the plural twice, and 'brother-in-law's' is a possessive form.",
      tags: ["compound nouns", "plurals"],
    },
    {
      topic: "Noun",
      difficulty: "HARD",
      text: "Which of the following sentences uses nouns correctly?",
      options: [
        "She deposited a five-hundred-rupee note and collected her passbook.",
        "The auditors took ten days leave after the year-end closing.",
        "The new branch has installed several machineries for sorting notes.",
        "The cattle was insured under the rural scheme before the floods.",
      ],
      correct: 0,
      explanation:
        "A number and noun joined by hyphens before another noun stay singular, so 'five-hundred-rupee note' is correct. 'Ten days leave' is tempting but needs the possessive apostrophe, 'ten days' leave'. 'Machinery' is uncountable and 'cattle' always takes a plural verb.",
      tags: ["compound adjectives", "possessives"],
    },

    // ------------------------------------------------------------- Pronoun
    {
      topic: "Pronoun",
      difficulty: "EASY",
      text: "Fill in the blank with the correct pronoun.\nBetween you and ______, the proposal is unlikely to be approved.",
      options: ["I", "me", "myself", "mine"],
      correct: 1,
      explanation:
        "A preposition such as 'between' takes the objective case, so 'me' is required. 'I' is the tempting choice because it sounds formal, but it is the subjective form and cannot follow a preposition. 'Myself' has nothing to refer back to in this sentence.",
      tags: ["case", "personal pronouns"],
    },
    {
      topic: "Pronoun",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct relative pronoun.\nThe customer ______ cheque was returned has filed a complaint.",
      options: ["who", "whom", "whose", "which"],
      correct: 2,
      explanation:
        "The blank must show possession, since the cheque belongs to the customer, and 'whose' is the possessive relative pronoun. 'Who' is tempting because it refers to a person, but 'who cheque' leaves the noun with no grammatical link. 'Whom' has the same defect, and 'which' is not used for people.",
      tags: ["relative pronouns"],
    },
    {
      topic: "Pronoun",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct pronoun.\nTo ______ should this application be addressed?",
      options: ["whom", "who", "whose", "whoever"],
      correct: 0,
      explanation:
        "The pronoun directly follows the preposition 'to', so the objective form 'whom' is required. 'Who' is tempting because it is common in casual questions such as 'Who is it for?', but it is not acceptable immediately after a preposition. 'Whose' and 'whoever' do not fit the structure of the question.",
      tags: ["who and whom"],
    },
    {
      topic: "Pronoun",
      difficulty: "HARD",
      text: "Which of the following sentences uses pronouns correctly?",
      options: [
        "The loan was sanctioned to applicants whom the panel believed were eligible.",
        "Let the matter remain between the auditor and I.",
        "This passbook is her's, not mine.",
        "Everyone in the team, including Priya and me, was asked to submit the report.",
      ],
      correct: 3,
      explanation:
        "'Including' works like a preposition here, so the objective 'me' is correct, and 'everyone' rightly takes the singular 'was'. The first option is the trap: the pronoun is the subject of 'were eligible', with 'the panel believed' merely inserted, so it should be 'who'. 'Between the auditor and I' should use 'me', and the possessive 'hers' has no apostrophe.",
      tags: ["case", "who and whom"],
    },

    // ----------------------------------------------------------- Adjective
    {
      topic: "Adjective",
      difficulty: "EASY",
      text: "Fill in the blank with the correct form of the adjective.\nThis savings scheme is ______ than the one launched last year.",
      options: ["better", "best", "more better", "most good"],
      correct: 0,
      explanation:
        "The word 'than' calls for the comparative degree, and the comparative of 'good' is 'better'. 'More better' is the tempting error, but it is a double comparative because 'better' is already comparative. 'Best' is a superlative and does not go with 'than'.",
      tags: ["degrees of comparison"],
    },
    {
      topic: "Adjective",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct form of the adjective.\nOf the two proposals placed before the board, the first is the ______.",
      options: ["good", "better", "best", "most good"],
      correct: 1,
      explanation:
        "When exactly two things are being compared, standard grammar uses the comparative with 'the', as in 'the better of the two'. 'Best' is tempting because of the word 'the', but the superlative is reserved for comparing three or more. 'The good' and 'most good' do not express this comparison.",
      tags: ["degrees of comparison"],
    },
    {
      topic: "Adjective",
      difficulty: "MEDIUM",
      text: "Choose the option with the adjectives in the correct order.\nThe cashier carries ______ bag to work.",
      options: [
        "a leather small black beautiful",
        "a small beautiful leather black",
        "a black leather small beautiful",
        "a beautiful small black leather",
      ],
      correct: 3,
      explanation:
        "English adjectives normally follow the order of opinion, size, colour and then material, which gives 'beautiful small black leather'. 'A small beautiful leather black' is the closest distractor, but it places size before opinion and material before colour. The material word should stand right next to the noun.",
      tags: ["order of adjectives"],
    },
    {
      topic: "Adjective",
      difficulty: "HARD",
      text: "Which of the following sentences is grammatically correct?",
      options: [
        "Our new savings product is superior than the old one.",
        "Fixed deposits are more preferable to equities for such investors.",
        "Her performance this year was far superior to that of her peers.",
        "This is the most unique offer the bank has ever made.",
      ],
      correct: 2,
      explanation:
        "Latin comparatives such as 'superior' take 'to' rather than 'than', and 'far' may properly intensify them, so this sentence is correct. 'More preferable' is the tempting error, but 'preferable' is already comparative and needs no 'more'. 'Superior than' uses the wrong word after the adjective, and 'unique' is an absolute adjective that does not take 'most'.",
      tags: ["latin comparatives", "absolute adjectives"],
    },

    // ---------------------------------------------------------------- Verb
    {
      topic: "Verb",
      difficulty: "EASY",
      text: "Fill in the blank with the correct form of the verb.\nCustomers must ______ their KYC details when they change their address.",
      options: ["update", "updates", "updated", "updating"],
      correct: 0,
      explanation:
        "A modal verb such as 'must' is followed by the base form of the verb, so 'update' is correct. 'Updates' is tempting because it is a present-tense form, but modals never take an inflected verb. 'Updated' and 'updating' are also not possible straight after 'must'.",
      tags: ["modals"],
    },
    {
      topic: "Verb",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct form of the verb.\nThe unsigned forms have been ______ on the manager's desk since morning.",
      options: ["laying", "lay", "lying", "lie"],
      correct: 2,
      explanation:
        "The intransitive verb 'lie' means to rest in a place, and its present participle is 'lying', which completes 'have been lying'. 'Laying' is the tempting choice, but 'lay' is transitive and needs an object, as in 'laying the forms on the desk'. 'Lay' and 'lie' are not the participle that the perfect continuous requires.",
      tags: ["lie and lay", "confusable verbs"],
    },
    {
      topic: "Verb",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct form of the verb.\nThe manager made the clerk ______ the entries again.",
      options: ["to check", "check", "checked", "checking"],
      correct: 1,
      explanation:
        "In the active voice, the causative 'make' is followed by an object and a bare infinitive, so 'made the clerk check' is correct. 'To check' is tempting because many verbs such as 'asked' or 'told' take 'to', but 'make' does not in the active. 'Checked' and 'checking' do not fit this pattern.",
      tags: ["causatives", "bare infinitive"],
    },
    {
      topic: "Verb",
      difficulty: "HARD",
      text: "Which of the following sentences uses the verb form correctly?",
      options: [
        "The auditor suggested to review the accounts again.",
        "She is used to work late at the end of the month.",
        "He avoided to answer the customer's question.",
        "The board insisted that the report be submitted by Friday.",
      ],
      correct: 3,
      explanation:
        "After 'insist that', the subjunctive base form 'be submitted' is correct in formal English. 'Is used to work' is the tempting error, but in 'be used to' the word 'to' is a preposition and so needs the gerund 'working'. 'Suggest' takes a gerund or a 'that' clause and 'avoid' takes a gerund, so neither can be followed by a 'to' infinitive.",
      tags: ["subjunctive", "gerund and infinitive"],
    },

    // -------------------------------------------------------------- Adverb
    {
      topic: "Adverb",
      difficulty: "EASY",
      text: "Fill in the blank with the correct word.\nThe teller counted the notes ______.",
      options: ["careful", "carefully", "care", "carefulness"],
      correct: 1,
      explanation:
        "The blank describes how the action of counting was done, so an adverb is required, and that adverb is 'carefully'. 'Careful' is tempting but it is an adjective, which describes nouns and not verbs. 'Care' and 'carefulness' are nouns.",
      tags: ["adverbs of manner"],
    },
    {
      topic: "Adverb",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct word.\nThere was ______ any money left in the account.",
      options: ["hard", "hardy", "harder", "hardly"],
      correct: 3,
      explanation:
        "'Hardly any' means 'almost no', which is the sense the sentence needs. 'Hard' is the tempting option because it can be an adverb, but it means 'with effort', as in 'work hard', and is not related in meaning to 'hardly'. 'Hardy' means tough, and 'harder' does not fit before 'any' here.",
      tags: ["confusable adverbs"],
    },
    {
      topic: "Adverb",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct word.\nThe auditor was ______ tired to finish the report that evening.",
      options: ["too", "very", "so", "much"],
      correct: 0,
      explanation:
        "The pattern 'too + adjective + to-infinitive' shows that the degree of tiredness prevented the action. 'Very' is the tempting choice, but it only intensifies and cannot link to the infinitive that follows. 'So' would need a 'that' clause, as in 'so tired that he could not finish', and 'much tired' is not standard.",
      tags: ["too and very"],
    },
    {
      topic: "Adverb",
      difficulty: "HARD",
      text: "Choose the pair that correctly completes the sentence.\nRarely ______ the regulator ______ such a strong warning to lenders.",
      options: ["does, issued", "has, issue", "has, issued", "was, issue"],
      correct: 2,
      explanation:
        "A negative adverb such as 'rarely' at the start of a sentence causes inversion, and the perfect 'has issued' pairs the auxiliary with the past participle. 'Does, issued' is the tempting choice because it also inverts, but 'does' must be followed by the base form 'issue'. 'Has, issue' fails for the reverse reason, and 'was, issue' is not a valid verb form.",
      tags: ["inversion", "negative adverbs"],
    },

    // --------------------------------------------------------- Preposition
    {
      topic: "Prepositions",
      difficulty: "EASY",
      text: "Fill in the blank with the correct preposition.\nThe interest is credited ______ the last day of each quarter.",
      options: ["on", "at", "in", "since"],
      correct: 0,
      explanation:
        "Particular days and dates take 'on', so 'on the last day' is correct. 'At' is the tempting option, but it is used for clock times and points such as 'at noon'. 'In' goes with longer periods such as months, and 'since' would require a perfect tense.",
      tags: ["prepositions of time"],
    },
    {
      topic: "Prepositions",
      difficulty: "MEDIUM",
      text: "Fill in the blanks with the correct prepositions.\nSeveral customers complained ______ the branch manager ______ the delay.",
      options: ["with, for", "to, about", "at, on", "about, to"],
      correct: 1,
      explanation:
        "One complains to a person about a problem, so 'to the branch manager about the delay' is the correct pattern. 'About, to' uses both of the right words but reverses them, giving nonsense because the delay is not the person addressed. 'With, for' and 'at, on' are not idiomatic with 'complain'.",
      tags: ["verb collocations"],
    },
    {
      topic: "Prepositions",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct preposition.\nThe borrower was accused ______ concealing his income.",
      options: ["for", "with", "of", "on"],
      correct: 2,
      explanation:
        "The verb 'accuse' takes the preposition 'of', so 'accused of concealing' is correct. 'For' is the tempting option because 'blamed for' and 'charged for' sound similar, but 'accused for' is not standard. 'With' belongs with 'charged', as in 'charged with fraud'.",
      tags: ["verb collocations"],
    },
    {
      topic: "Prepositions",
      difficulty: "HARD",
      text: "Which of the following sentences is free of prepositional errors?",
      options: [
        "The committee comprises of seven members.",
        "The manager discussed about the proposal with the auditors.",
        "The loan officer ordered for a fresh valuation of the property.",
        "The bank has entrusted the new recruit with the task of verifying signatures.",
      ],
      correct: 3,
      explanation:
        "'Entrust someone with something' is the standard pattern, so this sentence is correct. 'Comprises of' is the most tempting error because 'is composed of' is correct, but 'comprise' takes a direct object. 'Discuss' and 'order' are also transitive here and need no preposition.",
      tags: ["superfluous prepositions"],
    },

    // --------------------------------------------------------- Conjunction
    {
      topic: "Conjunctions",
      difficulty: "EASY",
      text: "Fill in the blank with the correct conjunction.\nThe applicant submitted all the documents, ______ his loan was still rejected.",
      options: ["or", "because", "but", "so"],
      correct: 2,
      explanation:
        "The two clauses are in contrast, since a rejection is not the expected result of a complete application, so 'but' is correct. 'So' is the tempting option, yet it signals a result, which clashes with the word 'still'. 'Because' and 'or' do not express the required contrast.",
      tags: ["coordinating conjunctions"],
    },
    {
      topic: "Conjunctions",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct word.\nNot only did the bank reduce its lending rate, ______ it also waived the processing fee.",
      options: ["and", "but", "or", "yet"],
      correct: 1,
      explanation:
        "'Not only' forms a correlative pair with 'but also', so 'but' is required here. 'And' is the tempting choice because two actions are being added together, but it does not pair with 'not only'. 'Or' and 'yet' are likewise not the partner of this correlative.",
      tags: ["correlative conjunctions"],
    },
    {
      topic: "Conjunctions",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct conjunction.\nYou will not get the loan ______ you submit the income certificate.",
      options: ["unless", "though", "if", "lest"],
      correct: 0,
      explanation:
        "'Unless' means 'if not', so the sentence says that without the certificate there will be no loan, which is the intended sense. 'If' is the tempting option, but it reverses the meaning by saying that submitting the certificate would prevent the loan. 'Though' and 'lest' do not state a necessary condition.",
      tags: ["subordinating conjunctions"],
    },
    {
      topic: "Conjunctions",
      difficulty: "HARD",
      text: "Fill in the blank with the correct word.\nScarcely had the auditors arrived ______ the manager handed them the files.",
      options: ["than", "then", "that", "when"],
      correct: 3,
      explanation:
        "'Scarcely' and 'hardly' pair with 'when' to show that one event followed immediately after another. 'Than' is the tempting option, but it pairs with 'no sooner', as in 'No sooner had they arrived than...'. 'Then' and 'that' do not complete this construction.",
      tags: ["correlative conjunctions"],
    },

    // ---------------------------------------------- Subject-Verb Agreement
    {
      topic: "Subject-Verb Agreement",
      difficulty: "EASY",
      text: "Fill in the blank with the correct verb.\nThe list of eligible candidates ______ on the notice board.",
      options: ["are", "is", "were", "have"],
      correct: 1,
      explanation:
        "The subject is the singular noun 'list', so the verb must be the singular 'is'. 'Are' is tempting because the nearby word 'candidates' is plural, but that word is only part of a prepositional phrase and does not govern the verb. 'Were' and 'have' are plural forms as well.",
      tags: ["prepositional phrases"],
    },
    {
      topic: "Subject-Verb Agreement",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct verb.\nNeither the manager nor the clerks ______ aware of the new circular.",
      options: ["was", "is", "were", "has"],
      correct: 2,
      explanation:
        "With 'neither...nor', the verb agrees with the subject nearer to it, and here that is the plural 'clerks', so 'were' is correct. 'Was' is tempting because 'neither' is often treated as singular and 'manager' comes first. It would be right only if the singular noun came last.",
      tags: ["neither nor", "proximity"],
    },
    {
      topic: "Subject-Verb Agreement",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct verb.\nThe Chairman, along with his directors, ______ expected to attend the annual meeting.",
      options: ["is", "are", "were", "have"],
      correct: 0,
      explanation:
        "Phrases such as 'along with', 'as well as' and 'together with' do not change the number of the subject, which remains the singular 'Chairman'. 'Are' is tempting because the sentence mentions several people, but the added phrase does not form a compound subject as 'and' would. So the singular 'is' is required.",
      tags: ["along with"],
    },
    {
      topic: "Subject-Verb Agreement",
      difficulty: "HARD",
      text: "Which of the following sentences shows correct subject-verb agreement?",
      options: [
        "The number of defaulters have risen sharply this year.",
        "A large number of customers has complained about the new charges.",
        "Ten lakh rupees are a large sum for a first-time borrower.",
        "Each of the branches and every regional office has been asked to file a return.",
      ],
      correct: 3,
      explanation:
        "Subjects introduced by 'each' and 'every' take a singular verb even when joined by 'and', so 'has been asked' is correct. The first two options reverse a common rule: 'the number of' takes a singular verb, while 'a number of' takes a plural one. 'Ten lakh rupees' is the other trap, since a sum of money viewed as one amount takes the singular 'is'.",
      tags: ["each and every", "number of"],
    },

    // -------------------------------------------------------------- Tenses
    {
      topic: "Tenses",
      difficulty: "EASY",
      text: "Fill in the blank with the correct form of the verb.\nThe bank ______ its new branch last Monday.",
      options: ["opens", "has opened", "opened", "will open"],
      correct: 2,
      explanation:
        "'Last Monday' names a finished point in past time, so the simple past 'opened' is required. 'Has opened' is the tempting choice, but the present perfect cannot be used with a specific past time expression. 'Opens' and 'will open' do not refer to the past.",
      tags: ["simple past"],
    },
    {
      topic: "Tenses",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct form of the verb.\nBy the time the police arrived, the thieves ______.",
      options: ["have escaped", "had escaped", "are escaping", "will escape"],
      correct: 1,
      explanation:
        "Of two past events, the earlier one takes the past perfect, and the escape came before the arrival, so 'had escaped' is correct. 'Have escaped' is tempting, but the present perfect links to the present and clashes with the past verb 'arrived'. The other two options do not refer to the past at all.",
      tags: ["past perfect"],
    },
    {
      topic: "Tenses",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct form of the verb.\nShe ______ at this branch for six years and hopes to stay longer.",
      options: ["has been working", "worked", "is working", "was working"],
      correct: 0,
      explanation:
        "An action that began in the past and continues into the present, with a stated duration, takes the present perfect continuous. 'Is working' is the tempting choice, but the present continuous cannot be used with 'for six years' in this sense. 'Worked' and 'was working' would suggest that she no longer works there, which contradicts 'hopes to stay longer'.",
      tags: ["present perfect continuous"],
    },
    {
      topic: "Tenses",
      difficulty: "HARD",
      text: "Fill in the blank with the correct form of the verb.\nBy next March, the bank ______ in this town for fifty years.",
      options: [
        "will operate",
        "would operate",
        "has been operating",
        "will have been operating",
      ],
      correct: 3,
      explanation:
        "'By next March' fixes a point in the future, and 'for fifty years' gives the duration of activity up to that point, which calls for the future perfect continuous. 'Has been operating' is the tempting choice because it also expresses duration, but it measures up to the present and not up to a future date. 'Will operate' expresses neither the duration nor the completed span.",
      tags: ["future perfect continuous"],
    },

    // ------------------------------------------------------------ Articles
    {
      topic: "Articles",
      difficulty: "EASY",
      text: "Fill in the blank with the correct article.\nIt took ______ hour to clear the queue at the counter.",
      options: ["a", "an", "the", "no article"],
      correct: 1,
      explanation:
        "The 'h' in 'hour' is silent, so the word begins with a vowel sound and takes 'an'. 'A' is tempting because the word is spelt with a consonant, but the choice of article depends on sound and not spelling. 'The' would need something that identifies a particular hour, and 'hour' as a singular countable noun needs an article.",
      tags: ["a and an"],
    },
    {
      topic: "Articles",
      difficulty: "MEDIUM",
      text: "Fill in the blank with the correct article.\n______ Reserve Bank of India regulates the country's banks.",
      options: ["A", "An", "The", "No article"],
      correct: 2,
      explanation:
        "'The' is used because this name refers to a unique institution and contains a common noun, 'Bank', followed by an 'of' phrase. Leaving out the article is the tempting choice since most proper nouns take none, but institutional names of this form are an exception. 'A' and 'An' would wrongly suggest one of several such institutions.",
      tags: ["definite article"],
    },
    {
      topic: "Articles",
      difficulty: "MEDIUM",
      text: "Choose the pair that correctly completes the sentence.\nShe is ______ university lecturer and also holds ______ MBA degree.",
      options: ["a, an", "an, a", "the, a", "a, a"],
      correct: 0,
      explanation:
        "'University' begins with the consonant sound /j/ as in 'you', so it takes 'a', while 'MBA' begins with the vowel sound of 'em', so it takes 'an'. 'An, a' is the tempting pair because it follows the spelling of the first letters, but articles depend on the sound. The other pairs put 'a' before 'MBA', which is wrong for the same reason.",
      tags: ["a and an"],
    },
    {
      topic: "Articles",
      difficulty: "HARD",
      text: "Which sentence correctly conveys that one person holds both posts?",
      options: [
        "The secretary and the treasurer have arrived.",
        "A secretary and a treasurer have arrived.",
        "The secretary and the treasurer has arrived.",
        "The secretary and treasurer has arrived.",
      ],
      correct: 3,
      explanation:
        "One article before two nouns joined by 'and', together with a singular verb, shows that a single person holds both posts. Repeating the article signals two different people, as the first two options do. The third option is the trap: it has a singular verb, but the repeated article indicates two people, so it fails to agree.",
      tags: ["article repetition"],
    },

    // ----------------------------------------------------- Error Detection
    {
      topic: "Verbal Ability",
      subtopic: "Error Detection",
      difficulty: "EASY",
      text: "Identify the part of the sentence that contains a grammatical error.\n(A) She did not knew\n(B) that her account\n(C) had been frozen\n(D) by the bank.",
      options: ["Part A", "Part B", "Part C", "Part D"],
      correct: 0,
      explanation:
        "The auxiliary 'did' must be followed by the base form of the verb, so Part A should read 'She did not know'. Part C is tempting because it is the only other complex verb form, but the past perfect passive 'had been frozen' is correct here. The freezing happened before the moment of her not knowing.",
      tags: ["auxiliary verbs"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Error Detection",
      difficulty: "MEDIUM",
      text: "Identify the part of the sentence that contains a grammatical error.\n(A) The bank announced\n(B) a modest dividend\n(C) despite of the fall\n(D) in its quarterly profits.",
      options: ["Part A", "Part B", "Part C", "Part D"],
      correct: 2,
      explanation:
        "'Despite' is never followed by 'of', so Part C should read 'despite the fall'. The error arises from confusing it with 'in spite of', which does use 'of'. Part D is tempting because prepositions often cause trouble, but 'fall in profits' is the correct collocation.",
      tags: ["despite", "prepositions"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Error Detection",
      difficulty: "MEDIUM",
      text: "Identify the part of the sentence that contains a grammatical error.\n(A) The bank has extended\n(B) the deadline for\n(C) the submission of\n(D) informations by customers.",
      options: ["Part A", "Part B", "Part C", "Part D"],
      correct: 3,
      explanation:
        "'Information' is uncountable and has no plural, so Part D should read 'information by customers'. Part A is tempting to some candidates, but the present perfect is correct because no finished past time is mentioned. 'Deadline for' and 'submission of' are also the right collocations.",
      tags: ["uncountable nouns"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Error Detection",
      difficulty: "HARD",
      text: "Identify the part of the sentence that contains a grammatical error.\n(A) Not until the inspection was over\n(B) the manager realised\n(C) how serious\n(D) the lapse had been.",
      options: ["Part A", "Part B", "Part C", "Part D"],
      correct: 1,
      explanation:
        "When a sentence opens with 'not until', the main clause must be inverted, so Part B should read 'did the manager realise'. Part A may look faulty because of its unusual opening, but 'Not until the inspection was over' is a correct time clause. The word order of Parts C and D is correct for an indirect expression, with no inversion.",
      tags: ["inversion"],
    },

    // ------------------------------------------------ Sentence Improvement
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Improvement",
      difficulty: "EASY",
      text: "Choose the option that best improves the part in quotation marks.\nThe officer said that he 'will come' to the branch the next day.",
      options: ["would come", "will be coming", "comes", "No improvement"],
      correct: 0,
      explanation:
        "In reported speech with a past reporting verb, 'will' changes to 'would', and 'the next day' confirms that the speech is being reported. 'No improvement' is tempting because 'will come' seems to refer to the future, but the time is being viewed from the past. 'Will be coming' and 'comes' do not fix the sequence of tenses.",
      tags: ["reported speech"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Improvement",
      difficulty: "MEDIUM",
      text: "Choose the option that best improves the part in quotation marks.\nHad I known about the annual fee, I 'would not open' the account.",
      options: ["will not open", "would not have opened", "had not opened", "No improvement"],
      correct: 1,
      explanation:
        "'Had I known' is the inverted form of a third conditional about the unreal past, and it needs 'would have' plus a past participle in the main clause. 'No improvement' is tempting because 'would not open' is a conditional form, but it belongs to the second conditional about the present. 'Had not opened' repeats the if-clause form in the wrong place.",
      tags: ["conditionals"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Improvement",
      difficulty: "MEDIUM",
      text: "Choose the option that best improves the part in quotation marks.\n'Being a rainy day,' the branch saw very few customers.",
      options: ["Being rainy day,", "Having been a rainy day,", "As it was a rainy day,", "No improvement"],
      correct: 2,
      explanation:
        "The original participle dangles, since it implies that the branch was a rainy day, and a clause with its own subject 'it' removes the fault. 'Having been a rainy day' is tempting because it sounds more formal, but it has the same dangling subject. 'Being rainy day' also drops a necessary article.",
      tags: ["dangling participle"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Improvement",
      difficulty: "HARD",
      text: "Choose the option that best improves the part in quotation marks.\nIt is high time the bank 'revised' its service charges.",
      options: ["revises", "should revise", "has revised", "No improvement"],
      correct: 3,
      explanation:
        "'It is high time' is followed by a past-tense form that refers to the present and implies that the action is overdue, so 'revised' is already correct. 'Revises' and 'should revise' are tempting because the sentence looks as though it concerns the present or an obligation, but neither is standard after this expression. 'Has revised' would suggest that the action has already been done.",
      tags: ["unreal past"],
    },

    // -------------------------------------------------- Fill in the Blanks
    {
      topic: "Verbal Ability",
      subtopic: "Single Fillers",
      difficulty: "EASY",
      text: "Choose the word that best fills the blank.\nBanks must keep customer data ______ and must not share it without consent.",
      options: ["confidential", "careless", "visible", "temporary"],
      correct: 0,
      explanation:
        "The second half of the sentence forbids sharing without consent, which points directly to 'confidential', meaning private or secret. 'Temporary' is the tempting choice as it can describe data, but it concerns duration and has no link to sharing. 'Visible' says the opposite of what is needed, and data cannot be 'careless'.",
      tags: ["contextual vocabulary"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Single Fillers",
      difficulty: "MEDIUM",
      text: "Choose the word that best fills the blank.\nRising inflation has ______ the purchasing power of households.",
      options: ["bolstered", "eroded", "endorsed", "replenished"],
      correct: 1,
      explanation:
        "Inflation gradually reduces what money can buy, and 'eroded' means worn away little by little. 'Bolstered' is the tempting option because it collocates well with 'power', but it means strengthened, which is the opposite effect. 'Endorsed' and 'replenished' also do not describe the effect of rising prices.",
      tags: ["contextual vocabulary", "economy"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Double Fillers",
      difficulty: "MEDIUM",
      text: "Choose the pair of words that best fills the blanks.\nThe new norms are intended to ______ risky lending and ______ depositors' money.",
      options: ["encourage, squander", "promote, endanger", "curb, jeopardise", "curb, safeguard"],
      correct: 3,
      explanation:
        "Sensible banking norms aim to restrain risky lending and protect deposits, which is exactly what 'curb' and 'safeguard' convey. 'Curb, jeopardise' is the tempting pair since the first word is right, but putting deposits at risk could not be an aim of such norms. The remaining pairs give both blanks an undesirable meaning.",
      tags: ["double blanks"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Double Fillers",
      difficulty: "HARD",
      text: "Choose the pair of words that best fills the blanks.\nAlthough the reforms were initially greeted with ______, their gradual success turned many critics into ______ supporters.",
      options: ["enthusiasm, ardent", "approval, reluctant", "scepticism, ardent", "scepticism, indifferent"],
      correct: 2,
      explanation:
        "'Although' and the mention of critics point to an initial doubt that later gave way to strong backing, which 'scepticism' and 'ardent' express. 'Scepticism, indifferent' is the tempting pair because its first word fits, but 'indifferent supporters' contradicts itself. 'Enthusiasm' and 'approval' remove the contrast that 'although' requires.",
      tags: ["double blanks", "contrast"],
    },

    // ---------------------------------------------------------- Cloze Test
    {
      topic: "Verbal Ability",
      subtopic: "Cloze Test",
      difficulty: "EASY",
      format: "PASSAGE",
      context: "english-cloze-financial-inclusion",
      text: "Choose the most suitable word for blank (1) in the passage.",
      options: ["remained", "remains", "remaining", "remain"],
      correct: 0,
      explanation:
        "'For decades' describes a past period that the passage contrasts with the recent change, and the plural subject 'large parts' needs a finite verb, so 'remained' fits. 'Remain' is the tempting option as it agrees in number, but the present tense does not suit a period described as having changed. 'Remains' is singular and 'remaining' is not a finite verb.",
      tags: ["cloze", "tense"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Cloze Test",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "english-cloze-financial-inclusion",
      text: "Choose the most suitable word for blank (2) in the passage.",
      options: ["debited", "credited", "withheld", "mortgaged"],
      correct: 1,
      explanation:
        "A subsidy received into an account is added to the balance, and the banking term for this is 'credited'. 'Debited' is the tempting choice because it is also a banking term, but it means taken out of an account, which would leave nothing to withdraw. 'Withheld' and 'mortgaged' do not fit the idea of receiving money.",
      tags: ["cloze", "banking terms"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Cloze Test",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "english-cloze-financial-inclusion",
      text: "Choose the most suitable option for blank (3) in the passage.",
      options: ["unless", "in spite of which", "as if", "which is why"],
      correct: 3,
      explanation:
        "The dormant accounts are the reason that literacy programmes matter, so a linker of cause and effect is required, and 'which is why' provides one. 'In spite of which' is the tempting choice because it has the same relative structure, but it would set the two ideas in opposition when the second follows from the first. 'Unless' and 'as if' make no sense here.",
      tags: ["cloze", "linkers"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Cloze Test",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "english-cloze-financial-inclusion",
      text: "Choose the most suitable word for blank (4) in the passage.",
      options: ["short", "apart", "prey", "behind"],
      correct: 2,
      explanation:
        "The idiom 'fall prey to' means to become a victim of something, which suits the mention of fraudulent schemes. 'Fall short' is the tempting phrase because it is a common idiom, but it means to fail to reach a standard and is followed by 'of', not 'to'. 'Fall apart' and 'fall behind' also do not combine with 'to fraudulent schemes'.",
      tags: ["cloze", "idioms"],
    },

    // -------------------------------------------------------- Para Jumbles
    {
      topic: "Verbal Ability",
      subtopic: "Para Jumbles",
      difficulty: "EASY",
      text: "Rearrange the sentences to form a coherent paragraph.\nA. She first collected a form from the help desk.\nB. Meena decided to open a savings account at her local bank.\nC. After filling it in, she handed it to the officer along with her identity proof.\nD. A few days later, she received her passbook and debit card.",
      options: ["BACD", "BCAD", "ABCD", "BDAC"],
      correct: 0,
      explanation:
        "B introduces Meena by name and her purpose, so it comes first, and 'She first collected' in A follows it. 'It' in C refers to the form in A, and D gives the final outcome, 'A few days later'. BCAD is the tempting order, but C cannot precede A because 'it' would have nothing to refer to.",
      tags: ["sequencing", "pronoun links"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Para Jumbles",
      difficulty: "MEDIUM",
      text: "Rearrange the sentences to form a coherent paragraph.\nA. Within a year, its home loan book had doubled.\nB. The rapid growth, however, soon exposed a problem: many of the new borrowers had overstretched themselves.\nC. A private bank noticed that young salaried professionals were moving to the city in large numbers.\nD. To attract these customers, it introduced home loans at unusually low rates.",
      options: ["CABD", "DCAB", "CDAB", "CDBA"],
      correct: 2,
      explanation:
        "C names the bank and the professionals, D refers back to them as 'these customers', and A reports the result of the new loans. B must then come last because 'the rapid growth' refers to the doubling in A, and 'however' marks a turn. CDBA is the tempting order, but it mentions the growth before stating it.",
      tags: ["sequencing", "cohesion"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Para Jumbles",
      difficulty: "MEDIUM",
      text: "Rearrange the sentences to form a coherent paragraph.\nA. They therefore cut back on non-essential purchases.\nB. This is why central banks watch inflation so closely.\nC. Businesses, in turn, see demand weakening and put off new investment.\nD. When prices rise faster than incomes, households can buy less with the same money.",
      options: ["DCAB", "ADCB", "DABC", "DACB"],
      correct: 3,
      explanation:
        "D states the opening condition, and 'They' in A refers to the households in D. C follows with 'in turn', since the businesses react to the fall in purchases, and B draws the conclusion from the whole chain. DCAB is the tempting order, but it would make 'They' in A refer to something other than the households who are cutting back.",
      tags: ["sequencing", "cause and effect"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Para Jumbles",
      difficulty: "HARD",
      text: "Rearrange the sentences to form a coherent paragraph.\nA. Deposit insurance was designed to break this cycle.\nB. A rumour can therefore start a run, as each depositor rushes to withdraw before the money runs out.\nC. Knowing that their savings are protected up to a limit, small depositors have far less reason to panic.\nD. Banks lend out most of the money they receive and keep only a fraction in liquid form, so they can never repay all depositors at the same moment.\nE. In this way, even a sound bank may fail simply because too many customers demand their money together.",
      options: ["DEBAC", "DBEAC", "BDEAC", "DBACE"],
      correct: 1,
      explanation:
        "D explains the underlying weakness, B draws the consequence with 'therefore', and E sums up the outcome with 'In this way'. A's 'this cycle' then refers to the panic described so far, and C shows how insurance works. DEBAC is the tempting order, but 'In this way' in E needs the run in B to have been described first.",
      tags: ["sequencing", "cohesion"],
    },

    // ----------------------------------------------- Reading Comprehension
    {
      topic: "Reading Comprehension",
      difficulty: "EASY",
      format: "PASSAGE",
      context: "english-rc-digital-payments",
      text: "According to the passage, why are lenders now more willing to give small loans to traders who have no collateral?",
      options: [
        "Regulators have ordered lenders to support street vendors.",
        "The traders have started pledging land and gold.",
        "Digital payment records give lenders evidence of a steady flow of receipts.",
        "Interest rates on small loans have risen steeply.",
      ],
      correct: 2,
      explanation:
        "The passage says directly that lenders are more willing because they 'can see a steady flow of receipts'. The option about land and gold is tempting because those words appear, but the passage says data is doing the work that such assets once did. The other options are not mentioned at all.",
      tags: ["rc", "detail"],
    },
    {
      topic: "Reading Comprehension",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "english-rc-digital-payments",
      text: "What can be inferred from the passage about digital payment fraud?",
      options: [
        "It often succeeds by exploiting rushed users rather than by defeating system security.",
        "It has fallen as payment systems have become more convenient.",
        "It mainly affects older customers with poor connectivity.",
        "It can be eliminated altogether by tighter regulation.",
      ],
      correct: 0,
      explanation:
        "The passage notes that criminals find it 'easier to trick a hurried user than to break into a secure system', which supports this inference. The option about older customers is tempting because they appear in a nearby sentence, but they are linked with distrust and connectivity and not with fraud. The passage says fraud has grown and never suggests that it can be eliminated.",
      tags: ["rc", "inference"],
    },
    {
      topic: "Reading Comprehension",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "english-rc-bad-loans",
      text: "As used in the passage, what does 'flatter' most nearly mean in the phrase 'Delay may flatter a bank's results'?",
      options: [
        "Praise insincerely",
        "Make appear better than they really are",
        "Reduce in size",
        "Publish ahead of schedule",
      ],
      correct: 1,
      explanation:
        "The sentence contrasts short-term results with a later and larger correction, so delay makes the results look better than the real position. 'Praise insincerely' is the tempting choice because it is the everyday meaning of 'flatter', but results are not being praised by anyone here. The other two options have no support in the context.",
      tags: ["rc", "vocabulary in context"],
    },
    {
      topic: "Reading Comprehension",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "english-rc-bad-loans",
      text: "Which of the following statements would the author of the passage most likely agree with?",
      options: [
        "Banks should postpone recognising bad loans until the economy recovers.",
        "Public money should never be used to recapitalise a weak bank.",
        "A good insolvency process is by itself enough to solve the bad-loan problem.",
        "Bad loans should be recognised quickly, and support for weak banks should avoid rewarding careless lending.",
      ],
      correct: 3,
      explanation:
        "The passage favours speedy recognition and closes by asking how to clean up the past without encouraging the same behaviour again, which matches this option. 'Public money should never be used' is the tempting choice because critics' concerns are reported, but the author says recapitalisation 'may also be necessary'. The insolvency process is said only to help, and postponement is explicitly criticised.",
      tags: ["rc", "author's view"],
    },

    // ---------------------------------------------------------- Vocabulary
    {
      topic: "Vocabulary",
      subtopic: "Synonyms",
      difficulty: "EASY",
      text: "Choose the word closest in meaning to RELUCTANT.",
      options: ["Eager", "Unwilling", "Careful", "Ignorant"],
      correct: 1,
      explanation:
        "'Reluctant' describes someone who hesitates to do something because they do not want to, so 'unwilling' is the closest synonym. 'Careful' is the tempting choice since a reluctant person may seem cautious, but caution is not the same as lack of willingness. 'Eager' is the antonym.",
      tags: ["synonyms"],
    },
    {
      topic: "Vocabulary",
      difficulty: "MEDIUM",
      format: "MATCH_THE_FOLLOWING",
      text: "Match the words in Column A with their closest meanings in Column B.",
      formatData: {
        columnA: ["A. Frugal", "B. Lucrative", "C. Prudent", "D. Insolvent"],
        columnB: ["1. Unable to pay debts", "2. Profitable", "3. Thrifty", "4. Careful and sensible"],
      },
      options: ["A-3, B-2, C-4, D-1", "A-4, B-2, C-3, D-1", "A-3, B-1, C-4, D-2", "A-2, B-3, C-4, D-1"],
      correct: 0,
      explanation:
        "'Frugal' means thrifty, 'lucrative' means profitable, 'prudent' means careful and sensible, and 'insolvent' means unable to pay debts. The second option is tempting because both 'frugal' and 'prudent' suggest good judgement with money. However, 'frugal' is specifically about spending little, while 'prudent' refers to wise caution in general.",
      tags: ["synonyms", "matching"],
    },
    {
      topic: "Vocabulary",
      subtopic: "Antonyms",
      difficulty: "MEDIUM",
      format: "MATCH_THE_FOLLOWING",
      text: "Match the words in Column A with their antonyms in Column B.",
      formatData: {
        columnA: ["A. Scarce", "B. Augment", "C. Candid", "D. Transient"],
        columnB: ["1. Permanent", "2. Evasive", "3. Abundant", "4. Diminish"],
      },
      options: ["A-1, B-4, C-2, D-3", "A-3, B-2, C-4, D-1", "A-3, B-4, C-2, D-1", "A-4, B-3, C-2, D-1"],
      correct: 2,
      explanation:
        "'Scarce' is the opposite of 'abundant', 'augment' of 'diminish', 'candid' of 'evasive', and 'transient' of 'permanent'. The first option is tempting because it swaps 'scarce' and 'transient', since both can describe something in short supply or short-lived. But 'scarce' concerns quantity and 'transient' concerns duration, so only 'abundant' opposes the former and 'permanent' the latter.",
      tags: ["antonyms", "matching"],
    },
    {
      topic: "Vocabulary",
      difficulty: "HARD",
      format: "MATCH_THE_FOLLOWING",
      text: "Match the financial expressions in Column A with their meanings in Column B.",
      formatData: {
        columnA: ["A. In the red", "B. Golden handshake", "C. Blue-chip", "D. Shoestring budget"],
        columnB: [
          "1. Relating to shares of reputed, financially sound companies",
          "2. Overdrawn or running at a loss",
          "3. A very limited amount of money",
          "4. A large payment made to a departing employee",
        ],
      },
      options: ["A-2, B-1, C-4, D-3", "A-3, B-4, C-1, D-2", "A-4, B-2, C-1, D-3", "A-2, B-4, C-1, D-3"],
      correct: 3,
      explanation:
        "'In the red' means overdrawn or loss-making, a 'golden handshake' is a large payment to someone leaving a job, 'blue-chip' describes reputed and financially sound companies, and a 'shoestring budget' is a very small one. The first option is tempting because 'golden' suggests wealth, which might be linked with blue-chip shares. A golden handshake, however, is specifically a payment made on departure.",
      tags: ["financial idioms", "matching"],
    },

    // -------------------------------------------------- Phrase Replacement
    {
      topic: "Verbal Ability",
      subtopic: "Phrase Replacement",
      difficulty: "EASY",
      text: "Choose the phrase that should replace the part in quotation marks to make the sentence correct.\nThe customers waited patiently 'in the queue' for their turn.",
      options: ["on the queue", "at the queue", "by the queue", "No replacement required"],
      correct: 3,
      explanation:
        "In British and Indian English, people wait 'in a queue', so the sentence is already correct. 'At the queue' is tempting because people wait 'at the counter', but a queue is something one stands in. 'On' and 'by' also do not express being part of the line.",
      tags: ["prepositional phrases"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Phrase Replacement",
      difficulty: "MEDIUM",
      text: "Choose the phrase that should replace the part in quotation marks to make the sentence correct.\nThe senior officer 'look after' the loan department since last year.",
      options: ["looks after", "has been looking after", "is look after", "No replacement required"],
      correct: 1,
      explanation:
        "'Since last year' shows an action that began in the past and continues now, which calls for the present perfect continuous, 'has been looking after'. 'Looks after' is the tempting option as it corrects the agreement, but the simple present cannot be used with a 'since' phrase of this kind. 'Is look after' is not a valid verb form.",
      tags: ["tense", "phrasal verbs"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Phrase Replacement",
      difficulty: "MEDIUM",
      text: "Choose the phrase that should replace the part in quotation marks to make the sentence correct.\nFacing mounting losses, the bank 'did a decision' to close three of its branches.",
      options: ["was took a decision", "made decision", "took a decision", "No replacement required"],
      correct: 2,
      explanation:
        "The noun 'decision' collocates with 'take' or 'make', and 'took a decision' is the only option that also keeps the article. 'Made decision' is tempting because 'make' is a correct verb here, but 'decision' is a countable noun and needs 'a'. 'Was took' is not a valid verb form, and 'did a decision' is not idiomatic.",
      tags: ["collocations"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Phrase Replacement",
      difficulty: "HARD",
      text: "Choose the phrase that should replace the part in quotation marks to make the sentence correct.\nThe two directors 'were at loggerheads to each other' over the proposed merger.",
      options: [
        "were at loggerheads with each other",
        "were in loggerheads against each other",
        "was at loggerheads on each other",
        "No replacement required",
      ],
      correct: 0,
      explanation:
        "The fixed idiom is 'at loggerheads with', meaning in strong disagreement, and the plural subject 'directors' needs 'were'. 'No replacement required' is tempting because the phrase looks close to correct, but the idiom does not take 'to'. 'In loggerheads against' changes the fixed prepositions, and 'was' does not agree with 'directors'.",
      tags: ["idioms"],
    },

    // ---------------------------------------------- Sentence Rearrangement
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Rearrangement",
      difficulty: "EASY",
      text: "Arrange the sentences into a coherent paragraph and identify the sentence that should come FIRST.\nA. The campaign also reminds customers never to share their PIN or one-time password.\nB. The bank has launched a campaign to warn customers about online fraud.\nC. Those who receive such a call are advised to report it immediately.\nD. Its advertisements explain how fraudsters pose as bank officials over the telephone.",
      options: ["A", "B", "C", "D"],
      correct: 1,
      explanation:
        "B introduces the campaign with the indefinite 'a campaign', so it must open the paragraph, and the order is B, D, C, A. A is tempting because it mentions the campaign, but 'The campaign also' shows that it has already been introduced. D's 'Its' and C's 'such a call' also depend on earlier sentences.",
      tags: ["opening sentence"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Rearrangement",
      difficulty: "MEDIUM",
      text: "Arrange the sentences into a coherent paragraph and identify the sentence that should come THIRD.\nA. Under such schemes, a public fund promises to cover part of the lender's loss if a borrower defaults.\nB. With its risk reduced, a bank becomes more willing to lend to these firms.\nC. Small firms often struggle to obtain credit because they have few assets to pledge.\nD. Credit guarantee schemes try to address this gap.",
      options: ["A", "B", "C", "D"],
      correct: 0,
      explanation:
        "The order is C, D, A, B: C states the problem, D's 'this gap' refers to it, A's 'such schemes' refers to D, and B gives the result. So A comes third. B is tempting because it continues the discussion of lending, but 'its risk reduced' depends on the guarantee explained in A.",
      tags: ["position of sentence"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Rearrangement",
      difficulty: "MEDIUM",
      text: "Arrange the sentences into a coherent paragraph and identify the sentence that should come LAST.\nA. This is because interest earned in one year itself earns interest in the next.\nB. Time is the most valuable ally of a long-term saver.\nC. A person who starts saving at twenty-five therefore often ends up with more than one who saves larger amounts from the age of forty.\nD. Over several decades, this compounding can make even modest sums grow substantially.",
      options: ["A", "B", "C", "D"],
      correct: 2,
      explanation:
        "The order is B, A, D, C: B makes the claim, A explains it, D's 'this compounding' builds on A, and C draws the practical conclusion. C therefore comes last, as its 'therefore' signals. D is tempting as a closing line, but it states the mechanism on which C's conclusion depends.",
      tags: ["position of sentence"],
    },
    {
      topic: "Verbal Ability",
      subtopic: "Sentence Rearrangement",
      difficulty: "HARD",
      text: "Arrange the sentences into a coherent paragraph and identify the sentence that should come FOURTH.\nA. In practice, banks often take months to pass on the reduction.\nB. To speed up the process, regulators have linked many new floating-rate loans to external benchmarks.\nC. When the central bank cuts its policy rate, borrowers expect cheaper loans almost immediately.\nD. Lowering lending rates before deposit costs fall would therefore squeeze their margins.\nE. One reason is that their deposits were raised at older, higher rates, which cannot be changed overnight.",
      options: ["A", "B", "C", "D"],
      correct: 3,
      explanation:
        "The order is C, A, E, D, B: C sets up the expectation, A contrasts it with practice, E gives a reason, D draws its consequence with 'therefore', and B presents the remedy. So D comes fourth. B is tempting because it mentions the process, but it offers a solution and should follow the whole explanation of the delay.",
      tags: ["position of sentence", "monetary policy"],
    },
  ],
};

export default file;
