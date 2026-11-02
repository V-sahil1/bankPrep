/**
 * Learning material per topic, keyed "<subjectSlug>/<Topic name>". Introductions
 * and concept lists exist for every objective topic; formula sheets and worked
 * examples for the quantitative ones. Admins can extend all of it in Admin -> Syllabus.
 */

export type SeedFormula = { title: string; expression: string; description?: string };
export type SeedExample = { title: string; content: string };

export type SeedTopicContent = {
  intro: string;
  concepts?: string[];
  formulas?: SeedFormula[];
  shortcuts?: string[];
  mistakes?: string[];
  examples?: SeedExample[];
};

const f = (title: string, expression: string, description?: string): SeedFormula => ({ title, expression, description });

export const TOPIC_CONTENT: Record<string, SeedTopicContent> = {
  // ----------------------------------------------------------------- English
  "english/Noun": {
    intro:
      "A noun names a person, place, thing or idea. Exam questions rarely ask you to label a noun; they test whether you know which nouns can be counted, which take a plural form, and how the verb and articles change with them.",
    concepts: [
      "Uncountable nouns (information, advice, furniture, luggage, news, scenery) have no plural and take a singular verb.",
      "Some nouns are plural in form but singular in sense (news, mathematics, physics); others are always plural (scissors, trousers, spectacles).",
      "Collective nouns (team, committee, jury) take a singular verb when the group acts as one and a plural verb when members act separately.",
      "Compound nouns usually pluralise the main word: brothers-in-law, passers-by.",
      "Possession: add 's to singular nouns and to plurals not ending in s; add only an apostrophe to plurals ending in s.",
    ],
    mistakes: ["Writing 'informations', 'advices' or 'furnitures'.", "Using 'a' before an uncountable noun: 'an advice' should be 'a piece of advice'."],
  },
  "english/Pronoun": {
    intro:
      "A pronoun stands in for a noun. Errors come from mismatching it with its antecedent in number, gender or person, and from using the wrong case after prepositions and comparisons.",
    concepts: [
      "Subject case (I, he, they) before the verb; object case (me, him, them) after verbs and prepositions: 'between you and me'.",
      "Reflexive pronouns need a subject to reflect: 'myself' cannot be the subject of a sentence.",
      "Each, every, either, neither, anyone, someone are singular and take singular pronouns in formal English.",
      "Relative pronouns: who for people, which for things, that for both in defining clauses; whom is the object form.",
      "Reciprocal pronouns: each other for two, one another for more than two.",
    ],
  },
  "english/Adjective": {
    intro:
      "Adjectives describe nouns. Questions test degrees of comparison, the correct comparative forms, and the fixed order adjectives follow before a noun.",
    concepts: [
      "Comparative compares two; superlative compares three or more. Do not double them: 'more better' is wrong.",
      "Use 'than' after a comparative, but 'to' after senior, junior, superior, inferior, prior, preferable.",
      "Some adjectives have no degrees: unique, perfect, complete, round, square.",
      "Order before a noun: opinion, size, age, shape, colour, origin, material, purpose.",
      "Little/a little/the little for quantity; few/a few/the few for number.",
    ],
  },
  "english/Verb": {
    intro:
      "The verb carries the action and the time of a sentence. You need the three forms of common irregular verbs, the difference between finite and non-finite forms, and how modals behave.",
    concepts: [
      "Modals (can, could, may, might, shall, should, will, would, must, ought to) take the bare infinitive and do not change for person.",
      "Gerund (-ing noun) after enjoy, avoid, mind, suggest, consider, postpone, look forward to.",
      "Infinitive after want, decide, hope, agree, refuse, manage, afford.",
      "Transitive verbs need an object; intransitive verbs do not and cannot be made passive.",
      "Common irregular forms: lie-lay-lain, lay-laid-laid, rise-rose-risen, raise-raised-raised.",
    ],
  },
  "english/Adverb": {
    intro: "Adverbs modify verbs, adjectives or other adverbs. Errors involve the adjective-adverb confusion and the position of words like only, even and frequency adverbs.",
    concepts: [
      "Adverbs of frequency (always, often, never) go before the main verb but after 'be'.",
      "'Hardly', 'scarcely', 'seldom' are already negative; do not add 'not'.",
      "After sense verbs (look, feel, taste, smell, sound) use an adjective: 'it tastes good', not 'well'.",
      "'Only' modifies the word that follows it; moving it changes the meaning.",
    ],
  },
  "english/Tenses": {
    intro: "Tenses locate an action in time and show whether it is complete, continuing or habitual. Most errors are sequence errors: mixing times within one sentence.",
    concepts: [
      "Present perfect connects past to present and never takes a finished-time word: 'has visited yesterday' is wrong.",
      "Past perfect marks the earlier of two past actions: 'The train had left before we arrived.'",
      "Time clauses (when, after, before, as soon as, until) take the present, not 'will', for future meaning.",
      "Stative verbs (know, believe, own, belong, seem) are not normally used in continuous forms.",
      "Reported speech shifts tenses back one step unless the reported fact is still true.",
    ],
  },
  "english/Subject-Verb Agreement": {
    intro: "The verb agrees with its subject in number. Questions hide the real subject behind phrases, connectors and quantifiers.",
    concepts: [
      "Phrases between subject and verb do not change agreement: 'The quality of the loans is poor.'",
      "Either/or, neither/nor: the verb agrees with the nearer subject.",
      "With 'as well as', 'along with', 'together with', the verb agrees with the first subject.",
      "'A number of' takes a plural verb; 'the number of' takes a singular verb.",
      "Each, every, everyone, somebody, nobody take singular verbs; 'none' may take either.",
      "Amounts of money, time and distance as a unit are singular: 'Ten lakh rupees is a large sum.'",
    ],
  },
  "english/Articles": {
    intro: "A and an are indefinite; the is definite; many nouns take no article at all. The choice depends on sound, countability and whether the noun is specific.",
    concepts: [
      "'An' before a vowel sound, not a vowel letter: an hour, an MBA, a university, a European.",
      "'The' with superlatives, ordinals, unique things, rivers, oceans, newspapers and plural country names.",
      "No article before most proper nouns, languages, meals, abstract nouns used generally, and uncountable nouns used generally.",
      "'The' is needed when a noun is made specific by a phrase or clause that follows it.",
    ],
  },
  "english/Prepositions": {
    intro: "Prepositions link nouns to the rest of the sentence. Beyond time and place, banking exams test dependent prepositions fixed by usage.",
    concepts: [
      "Time: at (clock time), on (days, dates), in (months, years, parts of day); since (point) versus for (duration).",
      "Place: at (point), in (enclosed space), on (surface); between (two) versus among (more than two).",
      "Dependent prepositions: accused of, comply with, consist of, depend on, insist on, prefer to, superior to, different from.",
      "No preposition after discuss, enter, reach, resemble, order, request (as verbs).",
    ],
  },
  "english/Conjunctions": {
    intro: "Conjunctions join words, phrases and clauses. Correlative pairs must be kept together and followed by parallel structures.",
    concepts: [
      "Not only ... but also; either ... or; neither ... nor; both ... and; hardly ... when; no sooner ... than; scarcely ... when.",
      "Although/though is not used with 'but' in the same sentence; 'because' is not used with 'so'.",
      "'Unless' means 'if not' and does not take another negative.",
      "'Lest' is followed by 'should'; 'as if' takes the past subjunctive ('as if he were').",
    ],
  },
  "english/Voice": {
    intro: "Active voice puts the doer first; passive voice puts the receiver first. Conversion changes the verb form and may drop the agent.",
    concepts: [
      "Passive = form of 'be' in the same tense + past participle; the object becomes the subject.",
      "Modals: 'can do' becomes 'can be done'; perfect modals: 'should have done' becomes 'should have been done'.",
      "Imperatives: 'Close the door' becomes 'Let the door be closed' or 'You are requested to close the door'.",
      "Intransitive verbs and present/past perfect continuous tenses are not normally made passive.",
    ],
  },
  "english/Narration": {
    intro: "Indirect speech reports what was said without quoting. The reporting verb, tense, pronouns, time and place words all change according to fixed rules.",
    concepts: [
      "If the reporting verb is in the past, shift tenses back: present to past, past to past perfect, will to would.",
      "Universal truths and habitual facts keep the present tense.",
      "Questions become statements with 'if/whether' (yes-no) or the question word; the auxiliary 'do' disappears.",
      "Commands use 'told/ordered/asked + to-infinitive'; requests use 'requested'; suggestions use 'suggested + that ... should'.",
      "Here becomes there, now becomes then, today becomes that day, tomorrow becomes the next day, ago becomes before.",
    ],
  },
  "english/Other Grammar": {
    intro: "A set of structures that appear in error detection and sentence correction: conditionals, question tags, modifiers, parallelism and redundancy.",
    concepts: [
      "Conditionals: zero (if + present, present), first (if + present, will), second (if + past, would), third (if + past perfect, would have).",
      "Question tags reverse the polarity and reuse the auxiliary: 'She can swim, can't she?'",
      "A modifier must attach to the word it describes; a dangling participle is a frequent error.",
      "Items in a list or comparison must share the same grammatical form.",
      "Redundancy: 'return back', 'repeat again', 'reason because' and 'cope up with' are wrong.",
    ],
  },
  "english/Vocabulary": {
    intro: "Vocabulary questions test meaning in and out of context: synonyms, antonyms, idioms, phrasal verbs, confusable pairs and spellings. Read editorials daily and note words with their sentence.",
    concepts: [
      "For synonym and antonym items, eliminate options with the wrong part of speech first.",
      "Phrasal verbs change meaning with the particle: put off (postpone), put up with (tolerate), put down (suppress).",
      "Confusables: affect/effect, principal/principle, stationary/stationery, complement/compliment, elicit/illicit.",
      "Prefixes and roots give the meaning of unfamiliar words: bene- (good), mal- (bad), -cide (kill), -phobia (fear).",
    ],
  },
  "english/Reading Comprehension": {
    intro: "A passage of 350 to 600 words followed by questions on its main idea, facts, inferences, tone and vocabulary. Read the questions first, then the passage with purpose.",
    concepts: [
      "The main idea is what the whole passage argues, not a detail from one paragraph.",
      "An inference must be supported by the passage but is not stated in it; a fact question is answered word for word.",
      "Tone words: critical, analytical, sceptical, optimistic, neutral, sarcastic. Match the author's attitude, not the subject.",
      "Vocabulary in context: substitute each option into the sentence; the one that keeps the meaning wins.",
      "Strengthen or weaken questions ask what new fact would make the author's argument more or less convincing.",
    ],
  },
  "english/Verbal Ability": {
    intro:
      "The applied formats of the English section. Error detection, sentence improvement and phrase replacement test grammar; fillers and cloze tests test vocabulary and logic; jumbles test paragraph structure.",
    concepts: [
      "Error detection: check the subject and verb first, then tense sequence, then prepositions and articles.",
      "Fillers: decide the part of speech needed, then use the tone and connectors of the sentence to choose.",
      "Cloze test: read the whole passage once before filling any blank; later sentences often decide earlier blanks.",
      "Para jumbles: find the opening sentence (introduces the topic, no pronouns referring back) and connect pronoun and connector links.",
      "Paragraph completion: the missing sentence must agree with both the sentence before and the one after.",
    ],
  },
  "english/Advanced Reading Comprehension": {
    intro: "Mains passages are longer and drawn from editorials on the economy, banking, business and policy. Questions are mostly inference-based and may have multiple correct statements.",
    concepts: [
      "Map the passage: one line per paragraph on what it says and why it is there.",
      "Multiple-statement questions: test each statement separately against the passage; do not stop at the first match.",
      "Critical reasoning items (assumption, strengthen, weaken, paradox) follow the passage's argument, not your own view.",
      "Timing: around eight minutes per passage at Mains; skip a question rather than re-read the whole passage.",
    ],
  },
  "english/Advanced Verbal Ability": {
    intro: "Mains variants of fillers, cloze, connectors, odd-sentence-out, column matching and word usage, usually with longer sentences and more subtle distinctions.",
    concepts: [
      "Multiple fillers: all blanks must fit; eliminate an option as soon as one word fails.",
      "Connectors: identify the relation (contrast, cause, addition, sequence) before choosing the word.",
      "Odd sentence out: the odd sentence breaks the topic or the chain of references.",
      "Column matching: form each sentence fully and check grammar as well as sense.",
    ],
  },
  "english/Advanced Grammar": {
    intro: "Grammar at Mains depth: long-sentence agreement, mixed tenses, complex prepositions, parallelism and modifiers in sentences built to hide the error.",
    concepts: [
      "Strip a long sentence to subject and verb before judging agreement.",
      "Inversion after negative adverbs: 'Not only did the bank ..., but it also ...'.",
      "Subjunctive after demand, insist, recommend, suggest: 'The regulator insisted that the bank disclose ...'.",
      "Parallelism across correlatives: the same structure must follow both parts of 'not only ... but also'.",
    ],
  },
  "english/Mains Descriptive English": {
    intro:
      "The descriptive paper tests clear, structured writing under time. Each task has a format (email, report, precis, situation analysis), a word limit and marking criteria. Practise with the tasks below; each has a model answer and a self-evaluation checklist.",
    concepts: [
      "Plan for two minutes: purpose, reader, three main points, closing.",
      "Emails: subject line, salutation, purpose in the first sentence, one idea per paragraph, courteous close.",
      "Reports: title, headings (objective, facts, findings, recommendations), impersonal tone, figures where possible.",
      "Precis: one-third of the length, third person, all main ideas, no examples or opinions.",
      "Situation analysis: problem, stakeholders, immediate action, prevention; stay balanced and practical.",
    ],
  },

  // ------------------------------------------------------------------- Quant
  "quant/Number System": {
    intro: "Properties of integers and their operations. Divisibility rules, factors, LCM and HCF, remainders and unit digits appear directly and inside simplification and series questions.",
    concepts: [
      "Divisibility: by 3 and 9 (digit sum), by 4 and 8 (last two or three digits), by 11 (alternating digit sum).",
      "HCF x LCM = product of two numbers.",
      "Unit digit of powers cycles with period 4 (2, 3, 7, 8) or is fixed (0, 1, 5, 6); 4 and 9 alternate.",
      "Number of factors of p^a q^b = (a + 1)(b + 1).",
    ],
    formulas: [
      f("HCF and LCM", "HCF(a, b) x LCM(a, b) = a x b"),
      f("LCM of fractions", "LCM of numerators / HCF of denominators"),
      f("HCF of fractions", "HCF of numerators / LCM of denominators"),
      f("Sum of first n natural numbers", "n(n + 1) / 2"),
      f("Sum of squares", "n(n + 1)(2n + 1) / 6"),
      f("Sum of cubes", "[n(n + 1) / 2]^2"),
      f("Laws of indices", "a^m x a^n = a^(m+n); (a^m)^n = a^(mn); a^(-m) = 1/a^m"),
    ],
    examples: [
      {
        title: "Largest number dividing two numbers leaving the same remainder",
        content:
          "Find the largest number that divides 245 and 1029 leaving a remainder of 5 in each case.\n\nSubtract the remainder: 240 and 1024. The answer is HCF(240, 1024).\n240 = 2^4 x 15; 1024 = 2^10. HCF = 2^4 = 16.\n\nCheck: 245 = 16 x 15 + 5 and 1029 = 16 x 64 + 5.",
      },
    ],
  },
  "quant/Simplification": {
    intro: "Exact evaluation of an expression with a blank. Speed comes from BODMAS discipline, fraction-percentage equivalents and memorised squares and cubes.",
    concepts: [
      "BODMAS: brackets, orders (powers and roots), division and multiplication left to right, then addition and subtraction left to right.",
      "Convert percentages to fractions: 12.5% = 1/8, 16.67% = 1/6, 33.33% = 1/3, 37.5% = 3/8, 62.5% = 5/8.",
      "Know squares to 40 and cubes to 15 by heart.",
    ],
    formulas: [
      f("Difference of squares", "a^2 - b^2 = (a - b)(a + b)"),
      f("Square of a sum", "(a + b)^2 = a^2 + 2ab + b^2"),
      f("Squares ending in 5", "(10a + 5)^2 = 100 x a(a + 1) + 25", "e.g. 65^2 = 100 x 6 x 7 + 25 = 4225"),
    ],
    shortcuts: ["To multiply by 25, multiply by 100 and divide by 4.", "a% of b = b% of a, so 16% of 25 = 25% of 16 = 4."],
  },
  "quant/Approximation": {
    intro: "Approximation questions want the nearest option, not an exact value. Round each term to a convenient number, keep errors small and in opposite directions where possible.",
    concepts: [
      "Round to two significant figures unless options are close together.",
      "Estimate square roots from the nearest perfect squares: sqrt(630) is just over 25.",
      "Percentages: 29.8% of 1,201 is about 30% of 1,200 = 360.",
    ],
    shortcuts: ["Compare options before computing; if they are far apart, round aggressively."],
  },
  "quant/Number Series": {
    intro: "Find the missing or wrong term in a sequence. Start by taking differences; if they are not constant, look for products, squares, cubes or alternating patterns.",
    concepts: [
      "First differences constant: arithmetic. Second differences constant: quadratic (squares involved).",
      "Ratios constant: geometric. Ratios increasing by one: x2, x3, x4 patterns.",
      "Mixed: x2 + 1, x2 + 3, x2 + 5 or alternating operations.",
      "Wrong number series: find the pattern that fits all but one term.",
    ],
    examples: [
      {
        title: "Mixed operations",
        content: "5, 11, 23, 47, 95, ?\n\nEach term = 2 x previous + 1: 5 -> 11 -> 23 -> 47 -> 95 -> 191. Answer 191.",
      },
    ],
  },
  "quant/Quadratic Equations": {
    intro: "Two quadratic equations are given, one in x and one in y. Find the roots of each and compare them to pick x > y, x < y, x >= y, x <= y, or no relation.",
    concepts: [
      "Factorise: find two numbers with product ac and sum b.",
      "If one root of x is greater and the other is smaller than the roots of y, the relation cannot be determined.",
      "Sum of roots = -b/a; product of roots = c/a.",
    ],
    formulas: [f("Quadratic formula", "x = [-b +/- sqrt(b^2 - 4ac)] / 2a"), f("Sum and product of roots", "x1 + x2 = -b/a, x1 x2 = c/a")],
    examples: [
      {
        title: "Comparing roots",
        content:
          "I. x^2 - 7x + 12 = 0; II. y^2 - 5y + 6 = 0.\n\nI: (x - 3)(x - 4) = 0, so x = 3 or 4.\nII: (y - 2)(y - 3) = 0, so y = 2 or 3.\nEvery x is >= every y (3 >= 3, 4 > 2). Relation: x >= y.",
      },
    ],
  },
  "quant/Percentage": {
    intro: "Percent means per hundred. Almost every arithmetic topic (profit, interest, DI) is percentage in disguise, so fraction equivalents and the successive-change formula pay off everywhere.",
    concepts: [
      "To find what percent a is of b: (a / b) x 100.",
      "A rises by r% then falls by r%: net change is -(r^2 / 100)%.",
      "If price rises by r%, consumption must fall by 100r / (100 + r) % to keep spending constant.",
    ],
    formulas: [
      f("Percentage change", "(New - Old) / Old x 100"),
      f("Successive changes a% then b%", "Net % = a + b + ab / 100", "Use negative values for decreases"),
      f("Multiplying factor", "Increase of r% = x (1 + r/100); decrease of r% = x (1 - r/100)"),
      f("Population after n years", "P (1 + r/100)^n"),
    ],
    shortcuts: ["Memorise 1/8 = 12.5%, 1/6 = 16.67%, 1/7 = 14.28%, 1/9 = 11.11%, 1/11 = 9.09%, 1/12 = 8.33%."],
    mistakes: ["Taking the percentage of the new value instead of the original.", "Adding successive percentages instead of using a + b + ab/100."],
    examples: [
      {
        title: "Successive change",
        content:
          "A price is raised by 20% and then cut by 25%. What is the net change?\n\nNet = 20 + (-25) + (20)(-25)/100 = -5 - 5 = -10%. The price falls by 10%.\nCheck with 100: 100 -> 120 -> 90.",
      },
    ],
  },
  "quant/Ratio and Proportion": {
    intro: "A ratio compares quantities of the same kind; a proportion states two ratios are equal. Ratios combine, split and scale in almost every word problem.",
    concepts: [
      "To combine a : b and b : c, make the b terms equal.",
      "In a proportion a : b :: c : d, product of means = product of extremes (bc = ad).",
      "Direct proportion: y = kx; inverse proportion: xy = k.",
    ],
    formulas: [
      f("Dividing an amount in ratio a : b", "Shares = a/(a+b) x Total and b/(a+b) x Total"),
      f("Mean proportional", "sqrt(ab)"),
      f("Third proportional to a and b", "b^2 / a"),
      f("Fourth proportional to a, b, c", "bc / a"),
    ],
    examples: [
      {
        title: "Combining ratios",
        content: "A : B = 2 : 3 and B : C = 4 : 5. Find A : B : C.\n\nMake B equal: multiply the first by 4 and the second by 3. A : B = 8 : 12, B : C = 12 : 15. So A : B : C = 8 : 12 : 15.",
      },
    ],
  },
  "quant/Average": {
    intro: "The average is the total divided by the count. Most questions are about totals: convert every statement about averages into a total before you reason.",
    concepts: [
      "When one person joins and the average changes, the newcomer's value = new average + (old count x change).",
      "Weighted average weights each group's average by its size.",
      "Average speed for equal distances at u and v = 2uv / (u + v), not (u + v)/2.",
    ],
    formulas: [
      f("Average", "Sum / Count"),
      f("Weighted average", "(n1 a1 + n2 a2 + ...) / (n1 + n2 + ...)"),
      f("Average speed, equal distances", "2uv / (u + v)"),
      f("Average of first n natural numbers", "(n + 1) / 2"),
    ],
    examples: [
      {
        title: "Change in average when one member is replaced",
        content:
          "The average weight of 8 persons increases by 2.5 kg when a person weighing 65 kg is replaced. Find the newcomer's weight.\n\nTotal rises by 8 x 2.5 = 20 kg. Newcomer = 65 + 20 = 85 kg.",
      },
    ],
  },
  "quant/Profit and Loss": {
    intro: "Profit or loss is always measured on the cost price unless stated otherwise. Marked price, discount and dishonest-dealer problems extend the same percentage ideas.",
    concepts: [
      "Profit % = Profit / CP x 100; discount % is on the marked price.",
      "Two articles sold at the same price, one at x% gain and one at x% loss, always give a net loss of x^2/100 %.",
      "A false weight of w grams per kilogram gives a gain of (1000 - w) / w x 100 %.",
    ],
    formulas: [
      f("Selling price", "SP = CP x (100 + P%) / 100"),
      f("Cost price from SP", "CP = SP x 100 / (100 + P%)"),
      f("Marked price and discount", "SP = MP x (100 - D%) / 100"),
      f("Successive discounts a%, b%", "Single discount = a + b - ab / 100"),
      f("Gain from false weight", "Error / (True weight - Error) x 100"),
    ],
    examples: [
      {
        title: "Marked price",
        content:
          "A shopkeeper marks goods 40% above cost and gives a 15% discount. Find the profit percentage.\n\nLet CP = 100. MP = 140. SP = 140 x 0.85 = 119. Profit = 19%.",
      },
    ],
  },
  "quant/Simple and Compound Interest": {
    intro: "Simple interest grows linearly; compound interest grows on the accumulated amount. Know the amount formulas and the shortcut for the difference between the two over two or three years.",
    concepts: [
      "For half-yearly compounding halve the rate and double the time; for quarterly, quarter the rate and multiply time by 4.",
      "The difference between CI and SI for 2 years is the interest on the first year's interest.",
      "Instalment problems: the present value of all instalments equals the loan.",
    ],
    formulas: [
      f("Simple interest", "SI = P x R x T / 100"),
      f("Compound amount", "A = P (1 + R/100)^T"),
      f("CI - SI for 2 years", "P (R/100)^2"),
      f("CI - SI for 3 years", "P (R/100)^2 x (3 + R/100)"),
      f("Equal annual instalment x on loan L at r% CI", "L = x/(1 + r/100) + x/(1 + r/100)^2 + ..."),
    ],
    examples: [
      {
        title: "Difference between CI and SI",
        content:
          "Find the difference between CI and SI on Rs. 8,000 at 5% for 2 years.\n\nDifference = P (R/100)^2 = 8000 x (0.05)^2 = 8000 x 0.0025 = Rs. 20.",
      },
    ],
  },
  "quant/Time and Work": {
    intro: "Work problems are rate problems: a person who finishes in n days does 1/n of the work per day. Taking the total work as the LCM of the given times avoids fractions. Pipes and cisterns are the same idea with filling and emptying rates.",
    concepts: [
      "Rates add: together A and B do 1/a + 1/b per day.",
      "Efficiency is inversely proportional to time taken.",
      "Wages are shared in the ratio of work done, which equals the ratio of efficiencies when time is equal.",
      "An emptying pipe has a negative rate.",
    ],
    formulas: [
      f("Two workers together", "ab / (a + b) days"),
      f("Work done", "Rate x Time"),
      f("Men-days", "M1 D1 H1 / W1 = M2 D2 H2 / W2"),
      f("Pipe with leak", "Net rate = 1/fill time - 1/empty time"),
    ],
    examples: [
      {
        title: "LCM method",
        content:
          "A does a job in 12 days and B in 18 days. How long together?\n\nTake total work = LCM(12, 18) = 36 units. A does 3/day, B does 2/day, together 5/day. Time = 36 / 5 = 7.2 days.",
      },
    ],
  },
  "quant/Speed, Time and Distance": {
    intro: "Distance = speed x time. Trains add their lengths, boats add or subtract the stream speed, and relative speed decides when two moving objects meet.",
    concepts: [
      "Convert km/h to m/s by multiplying by 5/18.",
      "Relative speed: subtract for the same direction, add for opposite directions.",
      "A train crossing a platform covers its own length plus the platform's.",
      "Downstream speed = boat + stream; upstream = boat - stream; stream = (down - up) / 2.",
    ],
    formulas: [
      f("Speed", "Distance / Time"),
      f("km/h to m/s", "x km/h = x * 5/18 m/s"),
      f("Boat and stream", "Boat speed = (D + U)/2, Stream speed = (D - U)/2"),
      f("Meeting time, opposite directions", "Distance / (u + v)"),
      f("Circular track, same direction", "First meeting after L / (u - v)"),
    ],
    examples: [
      {
        title: "Train crossing a platform",
        content:
          "A 150 m train at 54 km/h crosses a platform in 20 s. Find the platform length.\n\n54 km/h = 15 m/s. Distance covered = 15 x 20 = 300 m. Platform = 300 - 150 = 150 m.",
      },
    ],
  },
  "quant/Mixture and Alligation": {
    intro: "Mixtures combine quantities of different concentration or price. The rule of alligation gives the ratio in which two ingredients must be mixed to hit a target mean.",
    concepts: [
      "Alligation: (dearer - mean) : (mean - cheaper) = quantity of cheaper : quantity of dearer.",
      "Replacement: after removing x from V and refilling, the original ingredient left = V (1 - x/V)^n after n operations.",
      "Concentration = quantity of the ingredient / total quantity.",
    ],
    formulas: [
      f("Alligation rule", "Cheaper : Dearer = (Dearer price - Mean price) : (Mean price - Cheaper price)"),
      f("Repeated replacement", "Remaining = V (1 - x/V)^n"),
    ],
    examples: [
      {
        title: "Alligation",
        content:
          "In what ratio must rice at Rs. 40/kg be mixed with rice at Rs. 55/kg so the mixture costs Rs. 49/kg?\n\n(55 - 49) : (49 - 40) = 6 : 9 = 2 : 3 (cheaper : dearer).",
      },
    ],
  },
  "quant/Partnership": {
    intro: "Profit is shared in the ratio of capital x time for each partner. A working partner may first receive a salary or a fixed share before the rest is divided.",
    formulas: [f("Profit share ratio", "C1 T1 : C2 T2 : C3 T3")],
    examples: [
      {
        title: "Time-based investment",
        content:
          "A invests Rs. 20,000 for 12 months and B invests Rs. 30,000 for 8 months. Share a profit of Rs. 18,000.\n\nRatio = 20,000 x 12 : 30,000 x 8 = 240 : 240 = 1 : 1. Each gets Rs. 9,000.",
      },
    ],
  },
  "quant/Problems on Ages": {
    intro: "Age problems are linear equations in disguise. Write each statement as an equation in present ages; remember that every person ages by the same number of years.",
    concepts: [
      "If the ratio of ages now is a : b, take the ages as ax and bx.",
      "'n years ago' subtracts n from every age; 'after n years' adds n to every age.",
      "The difference between two people's ages never changes.",
    ],
    examples: [
      {
        title: "Ratio now and later",
        content:
          "The ages of A and B are in the ratio 3 : 5. After 6 years the ratio becomes 2 : 3. Find A's present age.\n\nLet ages be 3x and 5x. (3x + 6)/(5x + 6) = 2/3 -> 9x + 18 = 10x + 12 -> x = 6. A is 18.",
      },
    ],
  },
  "quant/Probability": {
    intro: "Probability = favourable outcomes / total outcomes, for equally likely outcomes. Count carefully with coins, dice and cards, and use the complement for 'at least one' questions.",
    concepts: [
      "A deck has 52 cards, 4 suits of 13, 26 red and 26 black, 12 face cards, 4 aces.",
      "P(A or B) = P(A) + P(B) - P(A and B); for independent events P(A and B) = P(A) P(B).",
      "P(at least one) = 1 - P(none).",
    ],
    formulas: [
      f("Probability", "P(E) = n(E) / n(S)"),
      f("Complement", "P(not E) = 1 - P(E)"),
      f("Independent events", "P(A and B) = P(A) x P(B)"),
      f("Conditional probability", "P(A | B) = P(A and B) / P(B)"),
    ],
    examples: [
      {
        title: "Two dice",
        content: "Two dice are thrown. Probability that the sum is 9?\n\nFavourable: (3,6), (4,5), (5,4), (6,3) = 4 of 36. P = 4/36 = 1/9.",
      },
    ],
  },
  "quant/Permutation and Combination": {
    intro: "Permutations count arrangements where order matters; combinations count selections where it does not. Decide which one the question needs before computing.",
    concepts: [
      "Arrangements of n distinct items: n!. With p alike of one kind and q of another: n! / (p! q!).",
      "Circular arrangements of n people: (n - 1)!; necklaces: (n - 1)! / 2.",
      "Vowels together: treat them as one block, arrange the block internally.",
    ],
    formulas: [
      f("Permutations", "nPr = n! / (n - r)!"),
      f("Combinations", "nCr = n! / [r! (n - r)!]"),
      f("Useful identity", "nCr = nC(n-r); nC0 + nC1 + ... + nCn = 2^n"),
    ],
    examples: [
      {
        title: "Committee selection",
        content:
          "From 6 men and 4 women, how many committees of 5 have exactly 2 women?\n\nChoose 2 women from 4 and 3 men from 6: 4C2 x 6C3 = 6 x 20 = 120.",
      },
    ],
  },
  "quant/Data Interpretation": {
    intro: "A table or chart with four or five questions on percentages, ratios, averages and differences. Read the units and headings first; most errors are reading errors, not arithmetic.",
    concepts: [
      "Scan the whole set once and note totals you will reuse.",
      "For 'what percent more' questions, the base is the quantity after 'than'.",
      "Pie charts: a degree value converts to a share by dividing by 360.",
      "Approximate when options are far apart; compute exactly only when they are close.",
    ],
    formulas: [f("Share from a pie chart", "Value = Total x (degrees / 360)"), f("Percent more or less", "(Difference / Base) x 100")],
  },
  "quant/Data Sufficiency": {
    intro: "You do not solve the problem; you decide which statements are enough to solve it. Test each statement alone, then together, and never use information from the options.",
    concepts: [
      "Check statement I alone, then II alone, then both together, in that order.",
      "A statement is sufficient if it leads to one unique answer, even if you do not calculate it.",
      "Do not combine the statements before you have tested each alone.",
    ],
  },
  "quant/Mensuration and Statistics": {
    intro: "Perimeter, area, surface area and volume of common shapes and solids, plus the three averages: mean, median and mode.",
    formulas: [
      f("Rectangle", "Area = l x b; Perimeter = 2(l + b)"),
      f("Square", "Area = a^2; Diagonal = a sqrt(2)"),
      f("Circle", "Area = pi r^2; Circumference = 2 pi r"),
      f("Cylinder", "CSA = 2 pi r h; TSA = 2 pi r (r + h); Volume = pi r^2 h"),
      f("Cone", "CSA = pi r l; Volume = (1/3) pi r^2 h; l = sqrt(r^2 + h^2)"),
      f("Sphere", "Surface = 4 pi r^2; Volume = (4/3) pi r^3"),
      f("Cuboid", "TSA = 2(lb + bh + hl); Volume = l b h; Diagonal = sqrt(l^2 + b^2 + h^2)"),
      f("Median", "Middle value when sorted; mean of the two middle values for an even count"),
      f("Mode", "The most frequent value"),
    ],
    examples: [
      {
        title: "Recasting a solid",
        content:
          "A sphere of radius 6 cm is melted into a cylinder of radius 3 cm. Find the height.\n\n(4/3) pi 6^3 = pi 3^2 h -> 288 = 9h -> h = 32 cm.",
      },
    ],
  },

  // -------------------------------------------------------------------- DAI
  "dai/Advanced Data Interpretation": {
    intro:
      "Mains DI sets combine two charts or a chart and a paragraph, leave cells blank, and ask arithmetic questions (interest, mixtures, time and work) on the data. Expect five questions per set and plan about ten minutes.",
    concepts: [
      "Missing DI: fill the blanks from totals and ratios given in the questions or caselet before answering.",
      "Caselets: convert the paragraph into a table or Venn diagram before touching a question.",
      "Radar charts read like line charts wrapped in a circle; note the axis scale for each spoke.",
      "Skip the one calculation-heavy question in a set if the other four are quick.",
    ],
    formulas: [f("Percent of total", "Part / Total x 100"), f("Ratio of two shares", "Share A : Share B, simplified")],
  },
  "dai/Quantity Comparison": {
    intro: "Each question gives Quantity I and Quantity II, each a short arithmetic problem. Solve both and mark whether I > II, I < II, I >= II, I <= II, I = II or the relation cannot be determined.",
    concepts: [
      "Solve the two quantities independently; do not assume they share variables unless stated.",
      "If a quantity has two possible values (quadratic roots), compare every pair.",
      "When options include 'cannot be determined', check whether the data fixes a unique value.",
    ],
  },
  "dai/Advanced Statistics": {
    intro: "Mean, median and mode on financial data, growth rates year over year, and revenue, expenditure and profit relationships drawn from tables.",
    formulas: [
      f("Mean", "Sum of values / Number of values"),
      f("Growth rate", "(This year - Last year) / Last year x 100"),
      f("Compound annual growth", "(Final / Initial)^(1/n) - 1"),
      f("Profit percent on revenue", "(Revenue - Expenditure) / Expenditure x 100"),
    ],
  },

  // -------------------------------------------------------------- Reasoning
  "reasoning/Seating Arrangement": {
    intro: "People sit in a line, around a table or in parallel rows under a set of conditions. Draw the arrangement, place the fixed clues first, then the relative ones, and keep alternative cases side by side.",
    concepts: [
      "Fix the most constrained clue first (a person with a named position or an immediate neighbour).",
      "Facing outside reverses left and right; facing each other in parallel rows pairs positions.",
      "Keep two or three possible diagrams until a clue eliminates all but one.",
      "Uncertain seating: the number of people is unknown, so count carefully from both ends.",
    ],
  },
  "reasoning/Puzzles": {
    intro: "Floor, box, month, day and scheduling puzzles place items in order under conditions. Use a table with one column per variable and fill the definite information first.",
    concepts: [
      "Translate 'lives above' and 'lives immediately above' differently: the first allows gaps.",
      "Month puzzles often hinge on days in a month (31, 30, 28); day puzzles on the order of weekdays.",
      "Variable-based puzzles mix two or three attributes (city, profession, colour); add a column for each.",
    ],
  },
  "reasoning/Syllogism": {
    intro: "Two or more statements are given as true; decide which conclusions definitely follow. Draw Venn diagrams covering all possible cases and accept a conclusion only if it holds in every case.",
    concepts: [
      "'Some A are B' does not imply 'Some A are not B'.",
      "'All A are B' allows 'Some B are A' and 'Some A are B'.",
      "Possibility conclusions follow if at least one valid diagram allows them.",
      "Either-or: two conclusions with the same subject and predicate that are complementary (some / no, all / some not), neither following individually.",
    ],
  },
  "reasoning/Inequality": {
    intro: "Statements relate elements with >, <, >=, <= and =; decide which conclusions follow. In coded inequalities, first decode the symbols into standard signs.",
    concepts: [
      "A chain of the same direction gives a definite relation: A > B >= C gives A > C.",
      "Opposite signs in a chain (A > B < C) give no relation between the ends.",
      "Either-or: two conclusions on the same pair covering all possibilities, such as A >= B and A < B.",
    ],
  },
  "reasoning/Blood Relations": {
    intro: "Build a family tree from the clues using symbols for gender and generation. Coded relations describe each relation with a symbol; decode step by step.",
    concepts: ["Mark gender only when it is stated; 'child' or 'spouse' may be either.", "Count generations carefully: a grandfather's brother is a grand-uncle, not an uncle."],
  },
  "reasoning/Direction and Distance": {
    intro: "Track a person's movements on a grid and find the final direction or distance. Draw every leg; use Pythagoras for the shortest distance.",
    concepts: ["Right turn from north faces east; left turn from north faces west.", "Shortest distance between start and end = sqrt(dx^2 + dy^2)."],
  },
  "reasoning/Coding-Decoding": {
    intro: "Words or sentences are coded by letter shifts, number mapping, symbol substitution or by word-for-word codes in a made-up language. Find the rule from the examples given.",
    concepts: [
      "Letter positions A = 1 to Z = 26 and their reverses (A = 26) are the two most common shifts.",
      "Chinese coding: compare sentences sharing a word to isolate its code.",
      "New pattern coding usually combines a letter rule, a number rule and a symbol rule based on word length or vowels.",
    ],
  },
  "reasoning/Ranking and Order": {
    intro: "Positions in a row from the left or right, total counts, and comparison of height, weight or marks among a few people.",
    formulas: [
      f("Total persons", "Position from left + Position from right - 1"),
      f("Between two people", "Larger position - smaller position - 1"),
    ],
  },
  "reasoning/Series": {
    intro: "Alphabet, number and alphanumeric series ask for the next term or count elements in a long arrangement under conditions.",
    concepts: ["Write the alphabet with positions 1 to 26 before starting.", "For arrangement questions, mark each element's type (letter, digit, symbol) above it."],
  },
  "reasoning/Other Reasoning": {
    intro: "Shorter question types: alphabet and word formation, odd one out, input-output machines, data sufficiency and the verbal reasoning family (assumptions, conclusions, arguments, course of action).",
    concepts: [
      "Input-output: compare consecutive steps to find what moves and by what rule (alphabetical, numerical, word length).",
      "An assumption is something the speaker must take for granted; it is never stated and not a restatement of the statement itself.",
      "A conclusion must follow necessarily from the statement, not merely be likely.",
      "A course of action must be practical and address the problem in the statement.",
    ],
  },

  // -------------------------------------------------------- Computer aptitude
  "reasoning-computer/Computer Fundamentals": {
    intro: "The basics every bank officer is expected to know: what a computer is, its generations, the main hardware units and the kinds of software and memory.",
    concepts: [
      "Generations: vacuum tubes, transistors, integrated circuits, microprocessors, AI and parallel processing.",
      "The CPU has the ALU, the control unit and registers; cache sits between the CPU and RAM.",
      "RAM is volatile working memory; ROM holds firmware and is non-volatile.",
      "System software (operating system, utilities) versus application software (word processors, browsers).",
      "Storage units: 8 bits = 1 byte; KB, MB, GB, TB each 1024 times the previous.",
    ],
  },
  "reasoning-computer/Operating Systems": {
    intro: "The operating system manages hardware, files, processes and memory and provides the interface. Questions cover Windows and Linux basics and core OS concepts.",
    concepts: [
      "Booting loads the OS from storage into RAM; BIOS/UEFI runs first.",
      "Multitasking runs several programs by time-sharing; multithreading splits one program into threads.",
      "Deadlock: processes wait for each other's resources forever; the four conditions are mutual exclusion, hold and wait, no pre-emption, circular wait.",
      "Virtual memory uses disk space to extend RAM; paging and segmentation are the schemes.",
    ],
  },
  "reasoning-computer/Computer Networking": {
    intro: "Network types, topologies, the OSI and TCP/IP layers, IP addressing and the devices that move data.",
    concepts: [
      "OSI layers from bottom: physical, data link, network, transport, session, presentation, application.",
      "IPv4 addresses are 32-bit (four octets); IPv6 addresses are 128-bit.",
      "TCP is connection-oriented and reliable; UDP is connectionless and faster.",
      "Hubs broadcast to all ports, switches forward by MAC address, routers forward by IP address between networks.",
      "DNS translates names to addresses; DHCP assigns addresses automatically; HTTPS is HTTP over TLS.",
    ],
  },
  "reasoning-computer/Internet and Security": {
    intro: "Internet services and the threats that come with them: malware types, phishing, encryption and authentication.",
    concepts: [
      "A virus attaches to files and needs a host; a worm self-replicates over networks; a Trojan disguises itself as useful software; ransomware encrypts data for payment.",
      "Phishing uses fake messages to steal credentials; vishing uses phone calls; smishing uses SMS.",
      "Encryption turns plaintext into ciphertext; a digital signature proves origin and integrity using the sender's private key.",
      "Two-factor authentication combines something you know with something you have or are.",
      "Cloud models: IaaS, PaaS, SaaS; deployment: public, private, hybrid.",
    ],
  },
  "reasoning-computer/Database": {
    intro: "A database management system stores data in tables of rows (records) and columns (fields). Keys link tables, and SQL queries them.",
    concepts: [
      "A primary key uniquely identifies a row and cannot be null; a foreign key refers to a primary key in another table.",
      "SQL groups: DDL (CREATE, ALTER, DROP), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE).",
      "Normalisation removes redundancy; a relational database follows the relational model proposed by E. F. Codd.",
    ],
  },
  "reasoning-computer/Office Applications": {
    intro: "Day-to-day office software: Word for documents, Excel for spreadsheets, PowerPoint for presentations, with the shortcuts and abbreviations that appear in exams.",
    concepts: [
      "Excel: a cell is named by column letter and row number (B7); a formula starts with =; a workbook holds worksheets.",
      "Common shortcuts: Ctrl+C copy, Ctrl+V paste, Ctrl+Z undo, Ctrl+S save, Ctrl+P print, F7 spell check in Word, F5 slideshow in PowerPoint.",
      "File types: .docx (Word), .xlsx (Excel), .pptx (PowerPoint), .pdf (portable document format).",
    ],
  },

  // ------------------------------------------------------ General awareness
  "general-awareness/Banking Awareness": {
    intro: "The structure of Indian banking, bank types and their regulators, accounts and instruments, asset classification and the digital payment systems. Static facts that recur every year.",
    concepts: [
      "Scheduled banks are listed in the Second Schedule of the RBI Act, 1934.",
      "A loan becomes an NPA when interest or principal is overdue for more than 90 days; sub-standard up to 12 months, then doubtful, then loss asset.",
      "Priority sector lending target for domestic commercial banks is 40% of adjusted net bank credit, with sub-targets for agriculture and weaker sections.",
      "NEFT settles in batches around the clock; RTGS is real-time for large values; IMPS and UPI are instant 24x7 retail systems run by NPCI.",
      "Basel III sets minimum capital ratios, a leverage ratio and liquidity ratios (LCR, NSFR).",
    ],
  },
  "general-awareness/RBI and Monetary Policy": {
    intro: "The RBI's origin, structure and functions, and the monetary policy toolkit: repo, reverse repo, SDF, MSF, bank rate, CRR, SLR and open market operations, set by the six-member MPC.",
    concepts: [
      "The RBI began operations on 1 April 1935 and was nationalised in 1949.",
      "Repo rate: the rate at which banks borrow from the RBI against securities; reverse repo: the rate the RBI pays banks for parking funds.",
      "SDF is the floor and MSF the ceiling of the liquidity adjustment corridor.",
      "CRR is held as cash with the RBI; SLR is held as liquid assets (cash, gold, approved securities).",
      "The MPC targets CPI inflation of 4% with a band of 2% to 6%.",
    ],
  },
  "general-awareness/Indian Economy": {
    intro: "National income concepts, inflation, fiscal policy and the budget, deficits, taxation, balance of payments and the reform milestones since 1991.",
    concepts: [
      "GDP measures output within the country; GNP adds net factor income from abroad.",
      "Fiscal deficit = total expenditure - total receipts excluding borrowings; revenue deficit = revenue expenditure - revenue receipts.",
      "CPI measures retail inflation; WPI measures wholesale prices.",
      "Balance of payments has the current account (trade, services, transfers) and the capital account.",
      "NITI Aayog replaced the Planning Commission in 2015; the twelfth plan (2012-17) was the last five-year plan.",
    ],
  },
  "general-awareness/Financial Awareness": {
    intro: "Money and capital markets, the instruments traded in them, insurance and pensions, and the alphabet of regulators and development institutions.",
    concepts: [
      "Money market: short-term funds (treasury bills, commercial paper, certificates of deposit, call money); capital market: long-term (shares, bonds).",
      "SEBI regulates securities markets; IRDAI regulates insurance; PFRDA regulates pensions; RBI regulates banks and NBFCs.",
      "NABARD (1982) for agriculture and rural development; SIDBI (1990) for MSMEs; EXIM Bank (1982) for foreign trade; NHB (1988) for housing finance.",
      "Treasury bills are issued at a discount for 91, 182 and 364 days.",
    ],
  },
  "general-awareness/Government Schemes": {
    intro: "Financial inclusion, insurance, pension and credit schemes that banks deliver, with their launch years, eligibility and benefits.",
    concepts: [
      "PMJDY (2014): basic savings accounts with RuPay debit card and overdraft facility.",
      "PMJJBY: life cover of Rs. 2 lakh for ages 18 to 50; PMSBY: accident cover of Rs. 2 lakh for ages 18 to 70.",
      "Atal Pension Yojana: guaranteed pension of Rs. 1,000 to Rs. 5,000 a month after 60 for unorganised-sector workers.",
      "MUDRA loans: Shishu up to Rs. 50,000, Kishore up to Rs. 5 lakh, Tarun up to Rs. 10 lakh; Tarun Plus up to Rs. 20 lakh added later.",
      "Stand-Up India: loans of Rs. 10 lakh to Rs. 1 crore to SC/ST and women entrepreneurs for greenfield enterprises.",
    ],
  },
  "general-awareness/Current Affairs": {
    intro: "Events of roughly the last six months before the exam, grouped by category. Each question carries the month it belongs to; revise month by month and focus on banking, RBI and economy news first.",
    concepts: [
      "Banking news: mergers, licences, new products, penalties, and changes to rates and limits.",
      "RBI updates: policy rate decisions, circulars, committees and reports.",
      "Appointments, awards, summits and reports: who, where, which edition, and India's rank.",
    ],
  },
  "general-awareness/Static General Awareness": {
    intro: "Facts that do not change quickly: countries, capitals and currencies, international organisations and their headquarters, national parks, rivers and dams, and the headquarters of Indian banks and institutions.",
    concepts: [
      "IMF and World Bank: Washington DC; WTO, WHO, ILO: Geneva; UN: New York; BIS: Basel; ADB: Manila; New Development Bank: Shanghai; AIIB: Beijing.",
      "Bank headquarters: SBI, RBI, BoB, BoI, Union Bank, Central Bank: Mumbai; PNB: New Delhi; Canara Bank: Bengaluru; Indian Bank, IOB: Chennai; UCO Bank: Kolkata; Bank of Maharashtra: Pune.",
    ],
  },
};
