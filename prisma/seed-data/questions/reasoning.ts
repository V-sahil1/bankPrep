import type { SeedQuestionFile } from "../types";

const FOLLOWS_OPTIONS: [string, string, string, string] = [
  "Only I follows",
  "Only II follows",
  "Both I and II follow",
  "Neither I nor II follows",
];

const FOLLOWS_EITHER_OPTIONS: [string, string, string, string] = [
  "Only I follows",
  "Only II follows",
  "Either I or II follows",
  "Neither I nor II follows",
];

const ASSUMPTION_OPTIONS: [string, string, string, string] = [
  "Only assumption I is implicit",
  "Only assumption II is implicit",
  "Both assumptions I and II are implicit",
  "Neither assumption I nor II is implicit",
];

const CONCLUSION_OPTIONS: [string, string, string, string] = [
  "Only conclusion I follows",
  "Only conclusion II follows",
  "Both conclusions I and II follow",
  "Neither conclusion I nor II follows",
];

const DS_OPTIONS: [string, string, string, string] = [
  "Statement I alone is sufficient, but statement II alone is not",
  "Statement II alone is sufficient, but statement I alone is not",
  "Either statement I alone or statement II alone is sufficient",
  "Both statements I and II together are necessary",
];

const AR_OPTIONS: [string, string, string, string] = [
  "Both A and R are true, and R is the correct explanation of A",
  "Both A and R are true, but R is not the correct explanation of A",
  "A is true, but R is false",
  "A is false, but R is true",
];

const IO_EXAMS = ["rbi-grade-b", "ibps-po", "ibps-so-it", "sbi-po"];

const file: SeedQuestionFile = {
  contexts: [
    {
      key: "reasoning-floor-puzzle",
      type: "PASSAGE",
      title: "Seven-floor building",
      content:
        "Seven people, Anil, Bina, Chetan, Divya, Esha, Farhan and Gita, live on different floors of a seven-storey building. The lowest floor is numbered 1 and the topmost is numbered 7. Each person likes a different colour: Red, Blue, Green, Yellow, Pink, White or Black.\n\n" +
        "Anil lives on an even-numbered floor and likes Black.\n" +
        "Exactly two people live between Anil and the person who likes Blue, who lives above Anil.\n" +
        "The person who likes Green lives immediately below the person who likes Black.\n" +
        "Bina likes Pink and lives on a floor below Farhan's.\n" +
        "Divya lives immediately above Bina.\n" +
        "The person who likes Yellow lives immediately above the person who likes Pink.\n" +
        "Exactly one person lives between Farhan and Esha.\n" +
        "Esha likes Red and lives on an odd-numbered floor.\n" +
        "Gita lives on a floor above Chetan's, and Gita does not like White.",
    },
    {
      key: "reasoning-box-puzzle",
      type: "PASSAGE",
      title: "Stack of eight boxes",
      content:
        "Eight boxes, K, L, M, N, O, P, Q and R, are stacked one above another. Position 1 is the bottom of the stack and position 8 is the top.\n\n" +
        "Box K is immediately above box Q.\n" +
        "Exactly three boxes are between box K and box M, and M is below K.\n" +
        "Exactly one box is between box L and box K, and L is above K.\n" +
        "Box R is somewhere above box L.\n" +
        "Box N is immediately below box Q.\n" +
        "Box P is not adjacent to box M.",
    },
    {
      key: "reasoning-linear-seating",
      type: "PASSAGE",
      title: "Row with mixed facing",
      content:
        "Seven people, T, U, V, W, X, Y and Z, sit in a straight row. Some face north and the rest face south. Exactly three of them face south. Left and right are always taken from the person's own facing direction.\n\n" +
        "T faces north.\n" +
        "Z sits immediately to the right of T.\n" +
        "W sits second to the right of T.\n" +
        "X sits immediately to the left of T and faces the opposite direction to T.\n" +
        "U sits at an extreme end of the row, is an immediate neighbour of X, and faces the same direction as T.\n" +
        "Y sits second to the left of W.\n" +
        "V sits immediately to the right of Y.\n" +
        "Z and V face the same direction, and Y faces the opposite direction to V.",
    },
    {
      key: "reasoning-circular-seating",
      type: "PASSAGE",
      title: "Circular table of eight",
      content:
        "Eight people, A, B, C, D, E, F, G and H, sit around a circular table at equal distances, all facing the centre.\n\n" +
        "A sits opposite E.\n" +
        "B sits second to the right of D.\n" +
        "C sits third to the right of B.\n" +
        "H is an immediate neighbour of E.\n" +
        "A is not an immediate neighbour of B.\n" +
        "F is not an immediate neighbour of D.\n" +
        "G is not an immediate neighbour of H.",
    },
    {
      key: "reasoning-io-words-numbers",
      type: "PASSAGE",
      title: "Word and number machine",
      content:
        "A word and number arrangement machine rearranges an input line step by step, following a fixed rule. Here is an illustration.\n\n" +
        "Input: tiger 34 plum 81 kite 52 ash 17 ruby 66\n" +
        "Step I: ash tiger 34 plum kite 52 17 ruby 66 81\n" +
        "Step II: ash kite tiger 34 plum 52 17 ruby 66 81\n" +
        "Step III: ash kite plum tiger 34 17 ruby 52 66 81\n" +
        "Step IV: ash kite plum ruby tiger 17 34 52 66 81\n\n" +
        "Step IV is the last step for this input.\n\n" +
        "Using the same rule, answer the questions for this input:\n" +
        "Input: gold 58 vest 23 coin 94 mint 41 deer 76 sand 12",
    },
    {
      key: "reasoning-io-numbers",
      type: "PASSAGE",
      title: "Number sorting machine",
      content:
        "A number arrangement machine rearranges an input line step by step, following a fixed rule. Here is an illustration.\n\n" +
        "Input: 45 18 72 33 91 27 60\n" +
        "Step I: 18 45 72 33 91 27 60\n" +
        "Step II: 18 45 72 33 27 60 91\n" +
        "Step III: 18 27 45 72 33 60 91\n" +
        "Step IV: 18 27 45 33 60 72 91\n" +
        "Step V: 18 27 33 45 60 72 91\n\n" +
        "Step V is the last step for this input.\n\n" +
        "Using the same rule, answer the questions for this input:\n" +
        "Input: 56 84 29 92 13 67 38",
    },
  ],
  questions: [
    // ---------- Puzzles ----------
    {
      topic: "Puzzles",
      subtopic: "Floor Puzzle",
      difficulty: "EASY",
      format: "PASSAGE",
      context: "reasoning-floor-puzzle",
      text: "Who lives on the topmost floor?",
      options: ["Gita", "Chetan", "Esha", "Anil"],
      correct: 0,
      explanation:
        "Anil cannot be on floor 6 (Blue would be on floor 9). Floor 2 fails too: it forces either Gita to like White or Farhan to be below Bina. So Anil is on 4, Green on 3 and Blue on 7. Final order from floor 1: Bina-Pink, Divya-Yellow, Farhan-Green, Anil-Black, Esha-Red, Chetan-White, Gita-Blue. Gita is on floor 7.",
      tags: ["floor puzzle", "arrangement"],
    },
    {
      topic: "Puzzles",
      subtopic: "Floor Puzzle",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-floor-puzzle",
      text: "Which colour does Farhan like?",
      options: ["Yellow", "White", "Blue", "Green"],
      correct: 3,
      explanation:
        "Final order from floor 1: Bina-Pink, Divya-Yellow, Farhan-Green, Anil-Black, Esha-Red, Chetan-White, Gita-Blue. Farhan is on floor 3, immediately below Anil (Black), so he likes Green.",
      tags: ["floor puzzle", "attributes"],
    },
    {
      topic: "Puzzles",
      subtopic: "Floor Puzzle",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "reasoning-floor-puzzle",
      text: "How many people live between Divya and the person who likes White?",
      options: ["Two", "Three", "Four", "One"],
      correct: 1,
      explanation:
        "Final order from floor 1: Bina-Pink, Divya-Yellow, Farhan-Green, Anil-Black, Esha-Red, Chetan-White, Gita-Blue. Divya is on floor 2 and Chetan (White) on floor 6, so floors 3, 4 and 5 lie between them: three people.",
      tags: ["floor puzzle", "counting"],
    },
    {
      topic: "Puzzles",
      subtopic: "Box Puzzle",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-box-puzzle",
      text: "Which box is immediately above box K?",
      options: ["L", "Q", "P", "R"],
      correct: 2,
      explanation:
        "M is 4 below K and L is 2 above K, so K is 5 or 6. If K were 6, L would be 8, leaving no room for R above L. So K=5, Q=4, N=3, M=1, L=7, R=8. P cannot be next to M, so O=2 and P=6. Bottom to top: M, O, N, Q, K, P, L, R. P is immediately above K.",
      tags: ["box puzzle", "stacking"],
    },
    {
      topic: "Puzzles",
      subtopic: "Box Puzzle",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-box-puzzle",
      text: "How many boxes are between box O and box L?",
      options: ["Four", "Three", "Five", "Two"],
      correct: 0,
      explanation:
        "Bottom to top: M, O, N, Q, K, P, L, R. O is at position 2 and L at position 7, so N, Q, K and P lie between them: four boxes.",
      tags: ["box puzzle", "counting"],
    },

    // ---------- Seating Arrangement ----------
    {
      topic: "Seating Arrangement",
      subtopic: "Linear Seating",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-linear-seating",
      text: "Who sits second to the right of Z?",
      options: ["W", "T", "Y", "V"],
      correct: 3,
      explanation:
        "Taking T as facing north, positions rise to T's right. West to east the row is: U(N), X(S), T(N), Z(N), W(S), V(N), Y(S). Z faces north, so second to its right is V.",
      tags: ["linear seating", "mixed facing"],
    },
    {
      topic: "Seating Arrangement",
      subtopic: "Linear Seating",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-linear-seating",
      text: "Who sits third to the right of Y?",
      options: ["Z", "W", "T", "V"],
      correct: 0,
      explanation:
        "Row from west to east: U(N), X(S), T(N), Z(N), W(S), V(N), Y(S). Y faces south, so its right is toward the west: V is first, W second and Z third.",
      tags: ["linear seating", "mixed facing"],
    },
    {
      topic: "Seating Arrangement",
      subtopic: "Linear Seating",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "reasoning-linear-seating",
      text: "How many of the people sitting between U and W face north?",
      options: ["One", "Three", "Two", "None"],
      correct: 2,
      explanation:
        "Row from west to east: U(N), X(S), T(N), Z(N), W(S), V(N), Y(S). Between U and W sit X(S), T(N) and Z(N), so two of them face north.",
      tags: ["linear seating", "mixed facing"],
    },
    {
      topic: "Seating Arrangement",
      subtopic: "Circular Seating",
      difficulty: "EASY",
      format: "PASSAGE",
      context: "reasoning-circular-seating",
      text: "Who sits opposite D?",
      options: ["F", "H", "B", "C"],
      correct: 1,
      explanation:
        "Facing the centre, a person's left is clockwise. The conditions give the clockwise order A, F, C, H, E, B, G, D. Opposite seats are four places apart, so H sits opposite D.",
      tags: ["circular seating"],
    },
    {
      topic: "Seating Arrangement",
      subtopic: "Circular Seating",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-circular-seating",
      text: "Who sits third to the left of F?",
      options: ["H", "B", "G", "E"],
      correct: 3,
      explanation:
        "Clockwise order: A, F, C, H, E, B, G, D. All face the centre, so left is clockwise. From F, going left: C, H, E. E is third to the left of F.",
      tags: ["circular seating"],
    },

    // ---------- Syllogism ----------
    {
      topic: "Syllogism",
      difficulty: "EASY",
      text: "Statements: All ledgers are files. All files are boxes.\nConclusions:\nI. All ledgers are boxes.\nII. Some boxes are ledgers.\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 2,
      explanation:
        "The ledgers sit inside files, which sit inside boxes, so all ledgers are boxes. Converting that universal gives some boxes are ledgers. Both follow.",
      tags: ["syllogism", "all-some"],
    },
    {
      topic: "Syllogism",
      difficulty: "MEDIUM",
      text: "Statements: Some cards are coins. No coins are stamps.\nConclusions:\nI. Some cards are not stamps.\nII. No cards are stamps.\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 0,
      explanation:
        "The cards that are coins cannot be stamps, so some cards are not stamps. Other cards may still be stamps, so II is not certain. Only I follows.",
      tags: ["syllogism", "negative"],
    },
    {
      topic: "Syllogism",
      difficulty: "MEDIUM",
      text: "Statements: All keys are locks. Some locks are doors. No doors are windows.\nConclusions:\nI. Some keys are doors.\nII. No keys are doors.\nWhich conclusion(s) follow?",
      options: FOLLOWS_EITHER_OPTIONS,
      correct: 2,
      explanation:
        "Keys and doors are connected only through the middle of locks, so neither conclusion is certain alone. But 'some' and 'no' on the same two terms form a complementary pair: one of them must be true. So either I or II follows.",
      tags: ["syllogism", "either-or"],
    },
    {
      topic: "Syllogism",
      subtopic: "Possibility Cases",
      difficulty: "HARD",
      text: "Statements: Only a few pearls are rubies. All rubies are emeralds. No emeralds are topazes.\nConclusions:\nI. All pearls being topazes is a possibility.\nII. No pearls being emeralds is a possibility.\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 3,
      explanation:
        "'Only a few' means some pearls are rubies and some are not. Those rubies are emeralds, so some pearls are definitely emeralds and not topazes. That rules out both all pearls being topazes and no pearls being emeralds. Neither follows.",
      tags: ["syllogism", "possibility", "only a few"],
    },
    {
      topic: "Syllogism",
      subtopic: "Possibility Cases",
      difficulty: "HARD",
      text: "Statements: Some atlases are maps. All maps are charts. No charts are globes. Some globes are sketches.\nConclusions:\nI. Some atlases are globes.\nII. Some sketches being atlases is a possibility.\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 1,
      explanation:
        "The atlases that are maps are charts and so not globes, but other atlases may or may not be globes, so I is not certain. Nothing forbids an overlap of sketches and atlases, so II is a valid possibility. Only II follows.",
      tags: ["syllogism", "possibility"],
    },

    // ---------- Inequality ----------
    {
      topic: "Inequality",
      difficulty: "EASY",
      text: "Statements: A > B ≥ C = D < E\nConclusions:\nI. A > D\nII. E > C\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 2,
      explanation:
        "A > B ≥ C = D gives A > D. D < E with C = D gives E > C. Both follow.",
      tags: ["inequality", "direct"],
    },
    {
      topic: "Inequality",
      difficulty: "MEDIUM",
      text: "Statements: P ≥ Q > R ≤ S = T\nConclusions:\nI. P > R\nII. T > R\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 0,
      explanation:
        "P ≥ Q > R gives P > R. R ≤ S = T gives only T ≥ R, so T > R is not certain. Only I follows.",
      tags: ["inequality", "direct"],
    },
    {
      topic: "Inequality",
      difficulty: "MEDIUM",
      text: "Statements: L ≥ M = N ≤ O\nConclusions:\nI. L > N\nII. L = N\nWhich conclusion(s) follow?",
      options: FOLLOWS_EITHER_OPTIONS,
      correct: 2,
      explanation:
        "L ≥ M = N gives L ≥ N, so L is either greater than or equal to N. Neither alone is certain, but together they cover every case. Either I or II follows.",
      tags: ["inequality", "either-or"],
    },
    {
      topic: "Inequality",
      difficulty: "HARD",
      text: "Statements: U ≥ V > W; X ≤ V = Y; Z > Y\nConclusions:\nI. X < W\nII. W < Z\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 1,
      explanation:
        "Z > Y = V > W gives W < Z, so II follows. X ≤ V and W < V place both below or at V with no link between them, so I is not certain. Only II follows.",
      tags: ["inequality", "multiple chains"],
    },
    {
      topic: "Inequality",
      subtopic: "Coded Inequality",
      difficulty: "HARD",
      text: "In the following, 'P @ Q' means P > Q; 'P # Q' means P ≥ Q; 'P $ Q' means P = Q; 'P % Q' means P ≤ Q; 'P & Q' means P < Q.\nStatements: M # N, N & O, O $ K, J % K\nConclusions:\nI. M @ J\nII. N & J\nWhich conclusion(s) follow?",
      options: FOLLOWS_OPTIONS,
      correct: 3,
      explanation:
        "Decoded: M ≥ N, N < O, O = K, J ≤ K, so M ≥ N < O = K ≥ J. M and J, and likewise N and J, are joined only through opposing signs, so they cannot be compared. Neither follows.",
      tags: ["inequality", "coded"],
    },

    // ---------- Blood Relations ----------
    {
      topic: "Blood Relations",
      difficulty: "EASY",
      text: "Pointing to a man, Neha says, \"He is the son of my mother's only brother.\" How is the man related to Neha?",
      options: ["Brother", "Cousin", "Nephew", "Uncle"],
      correct: 1,
      explanation:
        "Neha's mother's brother is Neha's maternal uncle. His son is Neha's cousin.",
      tags: ["blood relations", "pointing"],
    },
    {
      topic: "Blood Relations",
      difficulty: "MEDIUM",
      text: "A is the father of B. C is the sister of A. D is the son of C. How is D related to A?",
      options: ["Nephew", "Son", "Brother", "Cousin"],
      correct: 0,
      explanation:
        "C is A's sister and D is C's son, so D is the son of A's sister, which makes him A's nephew.",
      tags: ["blood relations", "family chain"],
    },
    {
      topic: "Blood Relations",
      subtopic: "Coded Relations",
      difficulty: "MEDIUM",
      text: "'P + Q' means P is the mother of Q; 'P - Q' means P is the brother of Q; 'P * Q' means P is the father of Q; 'P / Q' means P is the sister of Q. In the expression M + N - O * R, how is M related to R?",
      options: ["Mother", "Aunt", "Sister", "Grandmother"],
      correct: 3,
      explanation:
        "M is the mother of N, and N is the brother of O, so M is also O's mother. O is the father of R. M is therefore R's grandmother (father's mother).",
      tags: ["blood relations", "coded"],
    },
    {
      topic: "Blood Relations",
      difficulty: "HARD",
      text: "Pointing to a woman, Rohan said, \"Her mother's only son is my father's father.\" How is the woman related to Rohan's father?",
      options: ["Mother", "Sister", "Aunt", "Grandmother"],
      correct: 2,
      explanation:
        "The woman's mother's only son is the woman's brother, and he is Rohan's grandfather. So the woman is the sister of Rohan's father's father, which makes her the aunt of Rohan's father.",
      tags: ["blood relations", "pointing"],
    },
    {
      topic: "Blood Relations",
      difficulty: "HARD",
      text: "Anita is the only daughter-in-law of Bharat, whose only son is Chirag. Dinesh is Anita's son. Esha is Bharat's daughter. How is Esha related to Dinesh?",
      options: ["Aunt", "Mother", "Sister", "Cousin"],
      correct: 0,
      explanation:
        "Bharat has only one son, Chirag, so Anita is Chirag's wife and Dinesh is their son. Esha, Bharat's daughter, is Chirag's sister. She is therefore Dinesh's father's sister, his aunt.",
      tags: ["blood relations", "family chain"],
    },

    // ---------- Direction and Distance ----------
    {
      topic: "Direction and Distance",
      difficulty: "EASY",
      text: "Ravi walks 5 km north, turns right and walks 3 km, then turns right and walks 5 km. How far and in which direction is he from his starting point?",
      options: ["5 km north", "3 km west", "8 km east", "3 km east"],
      correct: 3,
      explanation:
        "The two 5 km legs (north, then south) cancel. Only the 3 km walked east remains, so he is 3 km east of the start.",
      tags: ["direction", "displacement"],
    },
    {
      topic: "Direction and Distance",
      difficulty: "MEDIUM",
      text: "Sonal walks 10 m south, turns left and walks 6 m, turns left and walks 18 m, then turns right and walks 9 m. How far is she from her starting point, and in which direction?",
      options: ["15 m north-east", "19 m south-east", "17 m north-east", "17 m north-west"],
      correct: 2,
      explanation:
        "South 10, then east 6, then north 18, then east 9. Net: 15 m east and 8 m north. Distance = √(15² + 8²) = 17 m, toward the north-east.",
      tags: ["direction", "pythagoras"],
    },
    {
      topic: "Direction and Distance",
      subtopic: "Turning-based Questions",
      difficulty: "MEDIUM",
      text: "Meera faces west. She turns 135° clockwise, then 90° anticlockwise, and then 180° clockwise. Which direction does she face now?",
      options: ["South-east", "North-west", "North-east", "South-west"],
      correct: 0,
      explanation:
        "Net turn = 135 - 90 + 180 = 225° clockwise. From west (270° on a compass), 270 + 225 = 495, which is 135° on a compass: south-east.",
      tags: ["direction", "angles"],
    },
    {
      topic: "Direction and Distance",
      difficulty: "HARD",
      text: "Point B is 12 m east of point A. Point C is 5 m north of B. Point D is 8 m west of C. Point E is 8 m south of D. How far is E from A, and in which direction?",
      options: ["5 m south-west", "5 m south-east", "7 m south-east", "4 m east"],
      correct: 1,
      explanation:
        "With A at (0, 0): B = (12, 0), C = (12, 5), D = (4, 5), E = (4, -3). AE = √(4² + 3²) = 5 m, and E is to the east and south of A: south-east.",
      tags: ["direction", "coordinates"],
    },
    {
      topic: "Direction and Distance",
      difficulty: "HARD",
      text: "Tara walks 8 km east, turns left and walks 3 km, turns left and walks 14 km, turns left and walks 11 km, then turns right and walks 2 km. How far is she from her starting point, and in which direction?",
      options: ["8 km south-west", "8√2 km south-east", "6√2 km south-west", "8√2 km south-west"],
      correct: 3,
      explanation:
        "East 8, north 3, west 14, south 11, then a right turn from south means west 2. Net: 8 km west and 8 km south. Distance = 8√2 km, toward the south-west.",
      tags: ["direction", "displacement"],
    },

    // ---------- Coding-Decoding ----------
    {
      topic: "Coding-Decoding",
      difficulty: "EASY",
      text: "In a certain code, BANK is written as DCPM. How is LOAN written in that code?",
      options: ["NQCP", "NPCP", "MPBO", "NQDP"],
      correct: 0,
      explanation:
        "Each letter moves 2 places forward: B→D, A→C, N→P, K→M. So L→N, O→Q, A→C, N→P, giving NQCP.",
      tags: ["coding", "letter shift"],
    },
    {
      topic: "Coding-Decoding",
      difficulty: "MEDIUM",
      text: "In a certain code, CASH is written as XZHS. How is DEBIT written in that code?",
      options: ["WVYSG", "WVYRG", "VWYRG", "WVXRG"],
      correct: 1,
      explanation:
        "Each letter is replaced by its opposite in the alphabet (A↔Z, B↔Y, and so on): C→X, A→Z, S→H, H→S. So D→W, E→V, B→Y, I→R, T→G, giving WVYRG.",
      tags: ["coding", "opposite letters"],
    },
    {
      topic: "Coding-Decoding",
      difficulty: "MEDIUM",
      text: "In a certain code, TRADE is written as DCZQS. How is MONEY written in that code?",
      options: ["XDMLN", "ZFOPN", "LNMDX", "XDMNL"],
      correct: 3,
      explanation:
        "The word is reversed and each letter then moves 1 place back: TRADE → EDART → DCZQS. MONEY → YENOM → XDMNL.",
      tags: ["coding", "reverse and shift"],
    },
    {
      topic: "Coding-Decoding",
      subtopic: "Letter Coding",
      difficulty: "HARD",
      text: "In a certain code, 'gold bond safe now' is written as 'ka pi ru to', 'safe loan now' is written as 'ru me pi', and 'bond loan rate' is written as 'ka me zo'. What is the code for 'gold'?",
      options: ["ka", "pi", "to", "zo"],
      correct: 2,
      explanation:
        "First and second lines share safe, now and ru, pi. Second and third share loan and me. First and third share bond and ka. In the first line, only gold and to remain, so gold = to.",
      tags: ["coding", "word coding"],
    },
    {
      topic: "Coding-Decoding",
      difficulty: "HARD",
      text: "In a certain code, VAULT is written as WZVKU. How is CREDIT written in that code?",
      options: ["DQFCJS", "DSFEJU", "BQDCHS", "DQFEJS"],
      correct: 0,
      explanation:
        "Letters in odd positions move 1 forward and letters in even positions move 1 back: V→W, A→Z, U→V, L→K, T→U. So C→D, R→Q, E→F, D→C, I→J, T→S, giving DQFCJS.",
      tags: ["coding", "alternating shift"],
    },

    // ---------- Alphanumeric Series ----------
    {
      topic: "Series",
      subtopic: "Alphabet Series",
      difficulty: "EASY",
      text: "Find the next term in the series: AZ, CX, EV, GT, ?",
      options: ["IS", "HR", "JR", "IR"],
      correct: 3,
      explanation:
        "The first letter moves 2 forward (A, C, E, G, I) and the second moves 2 back (Z, X, V, T, R). The next term is IR.",
      tags: ["series", "letter pairs"],
    },
    {
      topic: "Series",
      subtopic: "Alphanumeric Series",
      difficulty: "MEDIUM",
      text: "Study the arrangement: 7 K @ 3 R B # 9 E 2 $ T L 5 % A 8 G & 4 U M 6\nHow many consonants in the arrangement are immediately followed by a digit?",
      options: ["One", "Three", "Two", "Four"],
      correct: 2,
      explanation:
        "A consonant followed directly by a digit occurs only at L 5 and M 6. The count is two.",
      tags: ["series", "counting"],
    },
    {
      topic: "Series",
      subtopic: "Alphanumeric Series",
      difficulty: "MEDIUM",
      text: "Study the arrangement: 7 K @ 3 R B # 9 E 2 $ T L 5 % A 8 G & 4 U M 6\nWhich element is 7th to the left of the 12th element from the right end?",
      options: ["B", "R", "3", "#"],
      correct: 1,
      explanation:
        "There are 23 elements, so the 12th from the right is the 12th from the left, which is T. Going 7 places left of position 12 reaches position 5, which is R.",
      tags: ["series", "position"],
    },
    {
      topic: "Series",
      subtopic: "Alphanumeric Series",
      difficulty: "HARD",
      text: "Study the arrangement: 7 K @ 3 R B # 9 E 2 $ T L 5 % A 8 G & 4 U M 6\nHow many symbols are immediately preceded by a digit and immediately followed by a letter?",
      options: ["Two", "One", "Three", "None"],
      correct: 0,
      explanation:
        "Checking each symbol: @ (K, 3), # (B, 9) and & (G, 4) fail. $ (2, T) and % (5, A) qualify. The count is two.",
      tags: ["series", "counting"],
    },
    {
      topic: "Series",
      subtopic: "Alphanumeric Series",
      difficulty: "HARD",
      text: "Study the arrangement: 7 K @ 3 R B # 9 E 2 $ T L 5 % A 8 G & 4 U M 6\nIf all the symbols are removed, which element is 5th to the right of the 9th element from the left end?",
      options: ["A", "8", "G", "4"],
      correct: 2,
      explanation:
        "After removal: 7 K 3 R B 9 E 2 T L 5 A 8 G 4 U M 6. The 9th element from the left is T, at position 9. Position 14 is G.",
      tags: ["series", "position"],
    },

    // ---------- Ranking and Order ----------
    {
      topic: "Ranking and Order",
      difficulty: "EASY",
      text: "In a class, Riya is 14th from the top and 23rd from the bottom. How many students are in the class?",
      options: ["37", "36", "35", "38"],
      correct: 1,
      explanation: "Total = 14 + 23 - 1 = 36.",
      tags: ["ranking", "rank from both ends"],
    },
    {
      topic: "Ranking and Order",
      difficulty: "MEDIUM",
      text: "In a row, Arun is 11th from the left and Bela is 16th from the right. They interchange their positions, and Arun is now 24th from the left. How many people are in the row?",
      options: ["38", "40", "37", "39"],
      correct: 3,
      explanation:
        "Arun's new position is Bela's old one, so that seat is 24th from the left and 16th from the right. Total = 24 + 16 - 1 = 39.",
      tags: ["ranking", "interchange"],
    },
    {
      topic: "Ranking and Order",
      difficulty: "MEDIUM",
      text: "Among five colleagues, Pooja earned more than Qasim but less than Rekha. Sunil earned less than Qasim. Tarun earned more than Pooja but less than Rekha. Who earned the second highest amount?",
      options: ["Tarun", "Pooja", "Rekha", "Qasim"],
      correct: 0,
      explanation:
        "Order from highest: Rekha, Tarun, Pooja, Qasim, Sunil. Tarun is second.",
      tags: ["ranking", "comparison"],
    },
    {
      topic: "Ranking and Order",
      difficulty: "HARD",
      text: "Six students took a test and all scored differently. Omar scored more than Nitin but less than Sara. Priya scored less than Nitin but more than Ravi. Mina scored less than Omar but more than Nitin. Who scored the third highest?",
      options: ["Omar", "Nitin", "Mina", "Priya"],
      correct: 2,
      explanation:
        "Order from highest: Sara, Omar, Mina, Nitin, Priya, Ravi. Mina is third.",
      tags: ["ranking", "comparison"],
    },
    {
      topic: "Ranking and Order",
      difficulty: "HARD",
      text: "In a row, A is 9th from the left and B, who is to the right of A, is 7th from the right. C sits exactly midway between A and B, and there are five people between A and C. How many people are in the row?",
      options: ["26", "27", "28", "25"],
      correct: 1,
      explanation:
        "C is at position 9 + 6 = 15. C is midway, so B is at 15 + 6 = 21. B is 7th from the right, so total = 21 + 7 - 1 = 27.",
      tags: ["ranking", "position"],
    },

    // ---------- Input-Output ----------
    {
      topic: "Other Reasoning",
      subtopic: "Input-Output",
      difficulty: "EASY",
      format: "PASSAGE",
      context: "reasoning-io-words-numbers",
      text: "How many steps does the machine need to complete the arrangement for the given input?",
      options: ["Four", "Six", "Seven", "Five"],
      correct: 3,
      explanation:
        "Rule: each step sends the next word in alphabetical order to the left block and the next largest number to the right block. Steps: I coin ... 94; II deer ... 76; III gold ... 58; IV mint ... 41; V sand ... 23. Step V reads coin deer gold mint sand vest 12 23 41 58 76 94, which is final.",
      tags: ["input-output", "steps"],
      exams: IO_EXAMS,
    },
    {
      topic: "Other Reasoning",
      subtopic: "Input-Output",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-io-words-numbers",
      text: "In Step III, which element is 5th from the left?",
      options: ["vest", "23", "mint", "41"],
      correct: 1,
      explanation:
        "Step III reads coin deer gold vest 23 mint 41 sand 12 58 76 94. The 5th element from the left is 23.",
      tags: ["input-output", "position"],
      exams: IO_EXAMS,
    },
    {
      topic: "Other Reasoning",
      subtopic: "Input-Output",
      difficulty: "MEDIUM",
      format: "PASSAGE",
      context: "reasoning-io-words-numbers",
      text: "In Step IV, which element is 3rd to the right of 'mint'?",
      options: ["sand", "23", "vest", "12"],
      correct: 0,
      explanation:
        "Step IV reads coin deer gold mint vest 23 sand 12 41 58 76 94. Counting right from mint: vest, 23, sand. The answer is sand.",
      tags: ["input-output", "position"],
      exams: IO_EXAMS,
    },
    {
      topic: "Other Reasoning",
      subtopic: "Input-Output",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "reasoning-io-numbers",
      text: "In Step III, what is the sum of the number 2nd from the left and the number 3rd from the right?",
      options: ["85", "105", "96", "92"],
      correct: 2,
      explanation:
        "Rule: odd steps move the next smallest number to the left block, even steps move the next largest to the right block. Step III reads 13 29 56 84 67 38 92. The 2nd from the left is 29 and the 3rd from the right is 67, so the sum is 96.",
      tags: ["input-output", "number arrangement"],
      exams: IO_EXAMS,
    },
    {
      topic: "Other Reasoning",
      subtopic: "Input-Output",
      difficulty: "HARD",
      format: "PASSAGE",
      context: "reasoning-io-numbers",
      text: "Which step reads 13 29 56 67 38 84 92?",
      options: ["Step II", "Step III", "Step V", "Step IV"],
      correct: 3,
      explanation:
        "Step I: 13 56 84 29 92 67 38. Step II: 13 56 84 29 67 38 92. Step III: 13 29 56 84 67 38 92. Step IV: 13 29 56 67 38 84 92. So the line is Step IV.",
      tags: ["input-output", "number arrangement"],
      exams: IO_EXAMS,
    },

    // ---------- Data Sufficiency ----------
    {
      topic: "Other Reasoning",
      subtopic: "Data Sufficiency",
      difficulty: "EASY",
      format: "MULTIPLE_STATEMENTS",
      text: "Among P, Q, R and S, all of different heights, who is the tallest? Decide which statement(s) are sufficient to answer.",
      options: DS_OPTIONS,
      correct: 0,
      explanation:
        "I gives S > P > Q and R, so S is the tallest. II relates only Q and R, which says nothing about the tallest. Statement I alone is sufficient.",
      tags: ["data sufficiency", "comparison"],
      formatData: {
        statements: [
          "I. S is taller than P, and P is taller than both Q and R.",
          "II. Q is taller than R.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Data Sufficiency",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Five friends, A, B, C, D and E, sit in a row facing north. Who sits in the middle? Decide which statement(s) are sufficient to answer.",
      options: DS_OPTIONS,
      correct: 3,
      explanation:
        "I gives A first, C second and B last, but D and E could take the 3rd and 4th seats either way. II alone leaves E and B free to sit in many positions. Together, E is 4th, so D is in the middle. Both are needed.",
      tags: ["data sufficiency", "seating"],
      formatData: {
        statements: [
          "I. A and B sit at the two extreme ends, and C sits immediately to the right of A.",
          "II. E sits immediately to the left of B.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Data Sufficiency",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "In which direction is point Q from point P? Decide which statement(s) are sufficient to answer.",
      options: DS_OPTIONS,
      correct: 2,
      explanation:
        "I places Q 3 m east and 4 m north of P: north-east. II places Q 6 m east and 2 m north of P: also north-east. Either statement alone answers the question.",
      tags: ["data sufficiency", "direction"],
      formatData: {
        statements: [
          "I. R is 3 m east of P, and Q is 4 m north of R.",
          "II. T is 6 m east of P, and Q is 2 m north of T.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Data Sufficiency",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "In a certain code, the words bank, loan, rate and cash each have a distinct code from ka, mi, ro and ti, and the order of codes in a coded phrase is not fixed. What is the code for 'bank'? Decide which statement(s) are sufficient to answer.",
      options: DS_OPTIONS,
      correct: 1,
      explanation:
        "I only narrows bank to ka or mi. II shows cash, the common word, is ti, so bank = ka. Statement II alone is sufficient.",
      tags: ["data sufficiency", "coding"],
      formatData: {
        statements: [
          "I. 'bank loan' is coded as 'ka mi', and 'rate cash' is coded as 'ro ti'.",
          "II. 'bank cash' is coded as 'ka ti', and 'cash loan' is coded as 'ti mi'.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Data Sufficiency",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "Six friends, A, B, C, D, E and F, sit at equal distances around a circular table, all facing the centre. Who sits opposite F? Decide which statement(s) are sufficient to answer.",
      options: DS_OPTIONS,
      correct: 3,
      explanation:
        "I fixes A and B relative to F but leaves C, D and E open. II fixes C relative to F but lets B and D shift together. Together, B is next to F on its left and D is second to the left of B, three seats from F: D is opposite F. Both are needed.",
      tags: ["data sufficiency", "seating"],
      formatData: {
        statements: [
          "I. A sits second to the right of F, and B sits immediately to the left of F.",
          "II. D sits second to the left of B, and C sits immediately to the right of F.",
        ],
      },
    },

    // ---------- Logical Reasoning ----------
    {
      topic: "Other Reasoning",
      subtopic: "Critical Reasoning",
      difficulty: "EASY",
      text: "All branches of Sahyadri Bank remain closed on Sundays. The Ambala branch of Sahyadri Bank is open today. Which of the following must be true?",
      options: [
        "Today is not a Sunday",
        "Today is a Saturday",
        "The Ambala branch is the bank's busiest branch",
        "Other banks in Ambala are closed today",
      ],
      correct: 0,
      explanation:
        "If today were a Sunday, the Ambala branch would be closed. It is open, so today cannot be a Sunday. The other options are not established by the information.",
      tags: ["logic", "inference"],
    },
    {
      topic: "Other Reasoning",
      subtopic: "Arguments",
      difficulty: "HARD",
      text: "A bank claims that its new mobile app reduced crowding at branches, because branch visits fell by 20 percent in the quarter after the app was launched. Which of the following, if true, most weakens this claim?",
      options: [
        "Customers who use the app rate it highly",
        "The bank plans to add more features to the app",
        "Other banks have also launched mobile apps",
        "In the same quarter, the bank closed a third of its branches for renovation",
      ],
      correct: 3,
      explanation:
        "Closing a third of the branches offers another explanation for the fall in visits, so the app may not be the cause. The other options do not challenge the link between the app and the fall.",
      tags: ["logic", "weaken"],
    },
    {
      topic: "Other Reasoning",
      subtopic: "Cause and Effect",
      difficulty: "MEDIUM",
      text: "Statement I: Long queues formed at the counters of a bank branch throughout the week.\nStatement II: Two of the branch's three tellers were on leave throughout the week.\nWhich of the following best describes the relationship between the two statements?",
      options: [
        "Statement I is the cause and statement II is its effect",
        "Statement II is the cause and statement I is its effect",
        "Both statements are independent causes",
        "Both statements are effects of independent causes",
      ],
      correct: 1,
      explanation:
        "Fewer tellers means slower service, which produces long queues. So statement II is the cause and statement I is the effect.",
      tags: ["logic", "cause and effect"],
    },
    {
      topic: "Other Reasoning",
      subtopic: "Assertion and Reason",
      difficulty: "MEDIUM",
      format: "ASSERTION_REASON",
      text: "Read the assertion (A) and the reason (R), then choose the correct option.",
      options: AR_OPTIONS,
      correct: 1,
      explanation:
        "Both are true properties of odd integers. But the reason is about a product, while the assertion is about a sum, so R does not explain A.",
      tags: ["logic", "assertion reason"],
      formatData: {
        assertion: "The sum of two odd integers is always even.",
        reason: "The product of two odd integers is always odd.",
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Assertion and Reason",
      difficulty: "MEDIUM",
      format: "ASSERTION_REASON",
      text: "Read the assertion (A) and the reason (R), then choose the correct option.",
      options: AR_OPTIONS,
      correct: 2,
      explanation:
        "A square has four right angles, so every square is a rectangle: A is true. A rectangle need not have equal sides, so R is false.",
      tags: ["logic", "assertion reason"],
      formatData: {
        assertion: "Every square is a rectangle.",
        reason: "Every rectangle has all four sides equal.",
      },
    },

    // ---------- Statement and Assumptions ----------
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Assumption",
      difficulty: "EASY",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: A bank has announced a special camp next Saturday to open savings accounts for senior citizens. Which assumption(s) are implicit in the statement?",
      options: ASSUMPTION_OPTIONS,
      correct: 0,
      explanation:
        "A camp is organised only if some senior citizens are expected to use it, so I is implicit. Nothing suggests senior citizens in the area hold no account at all, so II is not.",
      tags: ["assumptions"],
      formatData: {
        statements: [
          "I. Some senior citizens are likely to find the camp useful.",
          "II. Senior citizens in the area currently hold no bank account.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Assumption",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: A notice at a bank branch reads, \"Use our mobile app for balance enquiries instead of waiting in the queue.\" Which assumption(s) are implicit in the statement?",
      options: ASSUMPTION_OPTIONS,
      correct: 2,
      explanation:
        "The notice would be pointless if the app could not give balances (I), or if no customer wanted to avoid the queue (II). Both are implicit.",
      tags: ["assumptions"],
      formatData: {
        statements: [
          "I. Balance enquiries can be made through the mobile app.",
          "II. At least some customers would prefer to avoid waiting in the queue.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Assumption",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: The regulator has increased the penalty on banks that delay resolving customer complaints. Which assumption(s) are implicit in the statement?",
      options: ASSUMPTION_OPTIONS,
      correct: 1,
      explanation:
        "Raising a penalty presumes that at least some banks respond to financial pressure, so II is implicit. The step aims at faster resolution, not at ending every complaint, so I is too extreme.",
      tags: ["assumptions", "extreme wording"],
      formatData: {
        statements: [
          "I. Higher penalties will eliminate all customer complaints.",
          "II. At least some banks respond to the threat of a financial penalty.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Assumption",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: A company has decided to recruit this year only through an online test. Which assumption(s) are implicit in the statement?",
      options: ASSUMPTION_OPTIONS,
      correct: 3,
      explanation:
        "The decision needs only that an online test is workable for this year's recruitment. It need not be the only fair method anywhere (I), and past recruits need not have performed poorly (II). Neither is implicit.",
      tags: ["assumptions", "extreme wording"],
      formatData: {
        statements: [
          "I. An online test is the only fair method of assessing candidates anywhere.",
          "II. Candidates recruited in earlier years performed poorly.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Assumption",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: An advertisement by a bank says, \"Deposit with us: we have served customers for over fifty years.\" Which assumption(s) are implicit in the statement?",
      options: ASSUMPTION_OPTIONS,
      correct: 0,
      explanation:
        "Highlighting fifty years of service makes sense only if length of service matters to at least some depositors, so I is implicit. The advertisement does not need other banks to be younger, so II is not.",
      tags: ["assumptions", "advertisement"],
      formatData: {
        statements: [
          "I. Length of service influences the choice of bank for at least some depositors.",
          "II. No other bank has served customers for as long.",
        ],
      },
    },

    // ---------- Statement and Conclusions ----------
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Conclusion",
      difficulty: "EASY",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: Every employee of the Jaipur office who completes the compliance course receives a certificate. Ravi, an employee of the Jaipur office, has completed the course. Which conclusion(s) follow?",
      options: CONCLUSION_OPTIONS,
      correct: 0,
      explanation:
        "Applying the rule to Ravi gives I directly. The statement says nothing about how he ranks among employees, so II does not follow.",
      tags: ["conclusions"],
      formatData: {
        statements: [
          "I. Ravi receives a certificate.",
          "II. Ravi is the best-performing employee of the Jaipur office.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Conclusion",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: Only customers whose KYC records are up to date can use net banking at Bank M. Meera uses net banking at Bank M. Which conclusion(s) follow?",
      options: CONCLUSION_OPTIONS,
      correct: 1,
      explanation:
        "'Only' makes up-to-date KYC a necessary condition, so Meera's records must be up to date: II follows. Nothing links net banking to balance size, so I does not.",
      tags: ["conclusions", "necessary condition"],
      formatData: {
        statements: [
          "I. Meera holds the largest balance among the bank's customers.",
          "II. Meera's KYC records are up to date.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Conclusion",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: A branch approved more home loans in the second quarter than in the first, and more in the third quarter than in the second. Which conclusion(s) follow?",
      options: CONCLUSION_OPTIONS,
      correct: 2,
      explanation:
        "The approvals rose from first to second to third. So the third exceeded the first (I), and the first was the lowest of the three (II). Both follow.",
      tags: ["conclusions", "comparison"],
      formatData: {
        statements: [
          "I. The branch approved more home loans in the third quarter than in the first.",
          "II. Of these three quarters, the first had the fewest approvals.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Conclusion",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: Some depositors of Bank K have also taken home loans from Bank K. Which conclusion(s) follow?",
      options: CONCLUSION_OPTIONS,
      correct: 3,
      explanation:
        "'Some depositors have home loans' does not say every borrower is a depositor, so I overreaches. It says nothing about car loans, so II has no basis. Neither follows.",
      tags: ["conclusions", "overreach"],
      formatData: {
        statements: [
          "I. All home-loan borrowers of Bank K are its depositors.",
          "II. No depositor of Bank K has taken a car loan from it.",
        ],
      },
    },
    {
      topic: "Other Reasoning",
      subtopic: "Statement and Conclusion",
      difficulty: "HARD",
      format: "MULTIPLE_STATEMENTS",
      text: "Statement: In a survey of 1,000 savers in a city, 700 said they prefer digital payments for amounts under ₹500. Which conclusion(s) follow?",
      options: CONCLUSION_OPTIONS,
      correct: 1,
      explanation:
        "700 out of 1,000 is a majority of those surveyed, so II follows. A preference among those surveyed does not show that cash has stopped being used in the city, so I does not.",
      tags: ["conclusions", "survey"],
      formatData: {
        statements: [
          "I. Cash is no longer used in the city for amounts under ₹500.",
          "II. A majority of the savers surveyed prefer digital payments for amounts under ₹500.",
        ],
      },
    },
  ],
};

export default file;
