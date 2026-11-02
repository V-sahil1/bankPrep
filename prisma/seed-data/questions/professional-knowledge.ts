import type { SeedQuestionFile } from "../types";

const AR_OPTIONS: [string, string, string, string] = [
  "Both A and R are true and R is the correct explanation of A",
  "Both A and R are true but R is not the correct explanation of A",
  "A is true but R is false",
  "A is false but R is true",
];

const STATEMENT_OPTIONS: [string, string, string, string] = [
  "1 and 2 only",
  "2 and 3 only",
  "1 and 3 only",
  "1, 2 and 3",
];

const file: SeedQuestionFile = {
  contexts: [],
  questions: [
    // ---------- Database Management Systems ----------
    {
      topic: "Database Management Systems",
      difficulty: "EASY",
      text: "A relation in 1NF is also in 2NF when which additional condition holds?",
      options: [
        "Every attribute is atomic",
        "No non-prime attribute depends on only part of a candidate key",
        "No non-prime attribute depends transitively on a candidate key",
        "Every determinant is a candidate key",
      ],
      correct: 1,
      explanation:
        "2NF removes partial dependencies, so every non-prime attribute must depend on a whole candidate key. Atomic values are already required by 1NF. Removing transitive dependencies is the extra step for 3NF, and it is often confused with 2NF.",
      tags: ["normalization", "2nf"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Database Management Systems",
      difficulty: "MEDIUM",
      text: "Relation R(A, B, C, D) has exactly these functional dependencies: AB -> C and C -> D. What is the highest normal form R satisfies?",
      options: ["BCNF", "3NF", "2NF", "1NF"],
      correct: 2,
      explanation:
        "The only candidate key is AB, and neither C nor D depends on A or B alone, so there is no partial dependency and R is in 2NF. C -> D is a transitive dependency because C is not a superkey and D is non-prime, so R fails 3NF. Choosing 1NF wrongly treats this transitive dependency as a partial one.",
      tags: ["normalization", "functional dependency"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Database Management Systems",
      difficulty: "MEDIUM",
      format: "ASSERTION_REASON",
      text: "Read Assertion (A) and Reason (R) about two-phase locking, then choose the correct option.",
      options: AR_OPTIONS,
      correct: 3,
      explanation:
        "A is false: two-phase locking guarantees conflict serializability but does not prevent deadlock. R is true, and it is exactly why deadlock remains possible, since two transactions can each hold a lock the other is waiting for. Serializability and deadlock freedom are separate guarantees.",
      tags: ["transactions", "locking", "deadlock"],
      exams: ["ibps-so-it"],
      formatData: {
        assertion: "Basic two-phase locking prevents deadlocks among concurrent transactions.",
        reason: "Under two-phase locking, a transaction may keep the locks it holds while it waits for another lock.",
      },
    },
    {
      topic: "Database Management Systems",
      difficulty: "HARD",
      text: "Consider the schedule S: R1(A), R2(B), W1(B), W2(C), R3(C), W3(A). Which statement about S is correct?",
      options: [
        "S is conflict-equivalent to the serial order T2, T1, T3",
        "S is conflict-equivalent to the serial order T1, T2, T3",
        "S is conflict-equivalent to the serial order T3, T1, T2",
        "S is not conflict-serializable because its precedence graph has a cycle",
      ],
      correct: 0,
      explanation:
        "The conflicting pairs are R2(B) before W1(B), giving T2 -> T1; R1(A) before W3(A), giving T1 -> T3; and W2(C) before R3(C), giving T2 -> T3. The precedence graph has no cycle and its only topological order is T2, T1, T3. Taking T1 first is a common slip caused by following the order of first appearance rather than the conflict edges.",
      tags: ["transactions", "serializability"],
      exams: ["ibps-so-it"],
    },

    // ---------- SQL ----------
    {
      topic: "SQL",
      difficulty: "EASY",
      text: "Which SQL clause filters groups after GROUP BY has formed them, for example to keep only groups with more than five rows?",
      options: ["HAVING", "WHERE", "ORDER BY", "DISTINCT"],
      correct: 0,
      explanation:
        "HAVING is evaluated after grouping, so it can test aggregates such as COUNT(*). WHERE filters individual rows before any group exists, which is why it cannot contain an aggregate condition.",
      tags: ["group by", "having"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "SQL",
      difficulty: "MEDIUM",
      text: "Table emp(dept, salary) holds: (Ops, 40), (Ops, 55), (IT, 70), (IT, 65), (IT, 30), (HR, 60), (HR, 25). What does this query return?\nSELECT dept, COUNT(*)\nFROM emp\nWHERE salary >= 40\nGROUP BY dept\nHAVING COUNT(*) >= 2\nORDER BY dept;",
      options: ["HR 1; IT 2; Ops 2", "HR 2; IT 3; Ops 2", "IT 3; Ops 2", "IT 2; Ops 2"],
      correct: 3,
      explanation:
        "WHERE first removes the rows with salaries 30 and 25, leaving Ops with 2 rows, IT with 2 and HR with 1. HAVING then drops HR because its count is below 2. The answer with IT 3 wrongly counts rows before WHERE has been applied.",
      tags: ["output", "group by"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "SQL",
      difficulty: "MEDIUM",
      text: "Table t has one column x with the rows 1, NULL, 2, NULL, 2. What does this query return?\nSELECT COUNT(*), COUNT(x), COUNT(DISTINCT x) FROM t;",
      options: ["5, 5, 3", "5, 3, 2", "3, 3, 2", "5, 3, 3"],
      correct: 1,
      explanation:
        "COUNT(*) counts all 5 rows regardless of NULLs, while COUNT(x) ignores NULLs and gives 3. COUNT(DISTINCT x) also ignores NULLs, leaving the two values 1 and 2. Answering 3 for the distinct count wrongly treats NULL as one more distinct value.",
      tags: ["output", "null", "aggregates"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "SQL",
      difficulty: "HARD",
      text: "Table a(id) holds 1, 2, 3. Table b(aid, v) holds (1, 10), (1, 20), (2, 30). What counts do these queries return?\nQ1: SELECT COUNT(*) FROM a LEFT JOIN b ON a.id = b.aid AND b.v > 15;\nQ2: SELECT COUNT(*) FROM a LEFT JOIN b ON a.id = b.aid WHERE b.v > 15;",
      options: ["Q1 = 3, Q2 = 2", "Q1 = 2, Q2 = 2", "Q1 = 4, Q2 = 2", "Q1 = 3, Q2 = 3"],
      correct: 0,
      explanation:
        "In Q1 the filter is part of the join, so ids 1 and 2 each match one row and id 3 survives with NULLs, giving 3. In Q2 the join runs first and WHERE then rejects the NULL row for id 3 along with v = 10, giving 2. Assuming ON and WHERE are interchangeable holds for inner joins but not for outer joins.",
      tags: ["output", "joins"],
      exams: ["ibps-so-it"],
    },

    // ---------- Computer Networks ----------
    {
      topic: "Computer Networks",
      difficulty: "EASY",
      text: "Which protocol finds the MAC address that belongs to a known IPv4 address on the local network?",
      options: ["DNS", "ARP", "DHCP", "ICMP"],
      correct: 1,
      explanation:
        "ARP broadcasts a request for an IPv4 address and the owner replies with its MAC address. DNS is the usual wrong choice, but it maps domain names to IP addresses rather than IP addresses to hardware addresses.",
      tags: ["tcp/ip", "arp"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Networks",
      difficulty: "MEDIUM",
      text: "What is the broadcast address of the subnet containing the host 192.168.10.75/26?",
      options: ["192.168.10.63", "192.168.10.64", "192.168.10.127", "192.168.10.255"],
      correct: 2,
      explanation:
        "A /26 mask gives blocks of 64 addresses in the last octet, so 75 falls in the block 64 to 127. The last address of that block, 192.168.10.127, is the broadcast address. The value 192.168.10.64 is the network address, and 192.168.10.255 would apply only to a /24.",
      tags: ["subnetting", "ipv4"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Networks",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the statements about transport-layer protocols. Which of them are correct?",
      options: STATEMENT_OPTIONS,
      correct: 0,
      explanation:
        "UDP is connectionless, and TCP opens a connection with the SYN, SYN-ACK, ACK exchange, so statements 1 and 2 are correct. Statement 3 is false because UDP provides neither sequence numbers nor ordered delivery; those are TCP features, and applications that need them over UDP must add them.",
      tags: ["tcp/ip", "tcp", "udp"],
      exams: ["ibps-so-it"],
      formatData: {
        statements: [
          "UDP can send data without first establishing a connection.",
          "TCP connection establishment normally uses SYN, SYN-ACK and ACK segments.",
          "UDP uses sequence numbers to guarantee in-order delivery.",
        ],
      },
    },
    {
      topic: "Computer Networks",
      difficulty: "HARD",
      text: "A /16 network must be divided into equal subnets so that there are at least 60 subnets and each has at least 1000 usable host addresses. Which prefix length meets both requirements?",
      options: ["/24", "/23", "/22", "/21"],
      correct: 2,
      explanation:
        "60 subnets need 6 subnet bits, which extends the prefix to at least /22. 1000 usable hosts need 10 host bits because 2^10 - 2 = 1022, which limits the prefix to at most /22. A /21 satisfies the host count but provides only 32 subnets, while /23 and /24 provide too few hosts.",
      tags: ["subnetting", "ipv4"],
      exams: ["ibps-so-it"],
    },

    // ---------- Operating Systems ----------
    {
      topic: "Operating Systems",
      difficulty: "EASY",
      text: "What does the term thrashing describe in a virtual memory system?",
      options: [
        "A process being permanently denied the CPU",
        "Two processes waiting for each other's resources",
        "Free memory being split into small unusable holes",
        "The system spending more time on paging than on useful execution",
      ],
      correct: 3,
      explanation:
        "Thrashing occurs when processes lack enough frames, so page faults are constant and CPU utilisation collapses while the paging device stays busy. The other options describe starvation, deadlock and external fragmentation, which are often confused with it because all of them hurt throughput.",
      tags: ["paging", "thrashing"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Operating Systems",
      difficulty: "MEDIUM",
      text: "Processes given as (arrival time, burst time) are P1 (0, 6), P2 (1, 3), P3 (4, 1) and P4 (5, 2). What is the average waiting time under preemptive Shortest Remaining Time First scheduling?",
      options: ["1.5", "2.5", "3.0", "3.75"],
      correct: 0,
      explanation:
        "The execution order is P1 from 0 to 1, P2 from 1 to 4, P3 from 4 to 5, P4 from 5 to 7 and P1 from 7 to 12. Only P1 waits, for 6 units, so the average is 6/4 = 1.5. The value 3.0 comes from non-preemptive SJF and 3.75 from FCFS, both of which leave P1 running to completion first.",
      tags: ["scheduling", "srtf"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Operating Systems",
      difficulty: "MEDIUM",
      text: "How many page faults occur under LRU replacement with 3 initially empty frames for the reference string 7, 1, 2, 7, 3, 1, 4, 2, 7, 1?",
      options: ["7", "8", "9", "10"],
      correct: 2,
      explanation:
        "Only the second reference to 7 is a hit, because each later page is evicted just before it is needed again, so LRU gives 9 faults. The answer 7 is what FIFO produces on this string, since FIFO keeps page 1 and page 2 loaded for longer here. LRU is usually good but is not better than FIFO on every string.",
      tags: ["paging", "lru"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Operating Systems",
      difficulty: "HARD",
      text: "A system has resource types A, B and C, with Available = (1, 1, 1). Allocation: P0 (1, 0, 1), P1 (2, 0, 0), P2 (1, 1, 1), P3 (0, 1, 0). Maximum: P0 (3, 2, 2), P1 (3, 1, 2), P2 (2, 2, 2), P3 (1, 1, 3). Under the Banker's algorithm, which is a safe sequence?",
      options: ["P1, P2, P0, P3", "P2, P1, P0, P3", "P0, P2, P1, P3", "P2, P3, P0, P1"],
      correct: 1,
      explanation:
        "The Need values are P0 (2, 2, 1), P1 (1, 1, 2), P2 (1, 1, 1) and P3 (1, 0, 3), so only P2 can run first, raising Available to (2, 2, 2). P1 then gives (4, 2, 2), P0 gives (5, 2, 3), and P3 can finish. P2, P3, ... fails because P3 needs 3 units of C when only 2 are free; comparing Allocation instead of Need with Available is the usual error.",
      tags: ["deadlock", "bankers algorithm"],
      exams: ["ibps-so-it"],
    },

    // ---------- Data Structures ----------
    {
      topic: "Data Structures",
      difficulty: "EASY",
      text: "Which data structure is normally used to hold the vertices waiting to be visited in breadth-first search?",
      options: ["Stack", "Hash table", "Binary heap", "Queue"],
      correct: 3,
      explanation:
        "BFS visits vertices level by level, and a FIFO queue preserves the order in which they were discovered. A stack is the common wrong choice, but its LIFO order suits depth-first search.",
      tags: ["queue", "graph traversal"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Data Structures",
      difficulty: "MEDIUM",
      text: "The keys 40, 20, 60, 10, 30, 50, 70, 25 are inserted in this order into an empty binary search tree. What is the postorder traversal?",
      options: [
        "10 25 30 20 50 70 60 40",
        "10 20 25 30 40 50 60 70",
        "40 20 10 30 25 60 50 70",
        "10 30 25 20 50 70 60 40",
      ],
      correct: 0,
      explanation:
        "Key 25 becomes the left child of 30, and postorder visits left subtree, right subtree, then root, which gives 10 25 30 20 50 70 60 40. The sorted sequence is the inorder traversal and the sequence starting at 40 is the preorder. Placing 30 before 25 wrongly treats 25 as the right child of 30.",
      tags: ["bst", "tree traversal"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Data Structures",
      difficulty: "MEDIUM",
      text: "What is the value of the postfix expression 5 3 2 * + 9 3 / - when evaluated using a stack?",
      options: ["6", "8", "10", "14"],
      correct: 1,
      explanation:
        "The stack computes 3 * 2 = 6, then 5 + 6 = 11, then 9 / 3 = 3, and finally 11 - 3 = 8. For a non-commutative operator, the first value popped is the right operand. Reversing the operands of the final subtraction is a common slip in such problems.",
      tags: ["stack", "postfix"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Data Structures",
      difficulty: "HARD",
      text: "A binary tree has preorder M K J L R P Q T and inorder J K L M P Q R T. What is its postorder traversal?",
      options: [
        "J K L Q P T R M",
        "L J K Q P R T M",
        "J L K Q P T R M",
        "J L K P Q T R M",
      ],
      correct: 2,
      explanation:
        "M is the root, with left subtree K(J, L) and right subtree rooted at R, whose children are P and T. Within R's left subtree, preorder P Q and inorder P Q make Q the right child of P, so Q comes before P in postorder. The result is J L K Q P T R M; the option with P before Q wrongly makes Q the parent.",
      tags: ["binary tree", "tree traversal"],
      exams: ["ibps-so-it"],
    },

    // ---------- Algorithms ----------
    {
      topic: "Algorithms",
      difficulty: "EASY",
      text: "Which of these sorting algorithms has a worst-case time complexity of O(n log n)?",
      options: ["Merge sort", "Quick sort", "Insertion sort", "Bubble sort"],
      correct: 0,
      explanation:
        "Merge sort always splits the input in half and merges in linear time, so its worst case is O(n log n). Quick sort is the usual trap: its average case is O(n log n), but poor pivots make its worst case O(n^2).",
      tags: ["sorting", "complexity"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Algorithms",
      difficulty: "MEDIUM",
      text: "What is the solution of the recurrence T(n) = 4T(n/2) + n?",
      options: ["Θ(n)", "Θ(n log n)", "Θ(n^1.5)", "Θ(n²)"],
      correct: 3,
      explanation:
        "Here a = 4 and b = 2, so n^(log_b a) = n², which grows polynomially faster than the term f(n) = n. Case 1 of the Master theorem gives Θ(n²). Θ(n log n) is the answer for 2T(n/2) + n, and it is often chosen by overlooking the change from 2 to 4 subproblems.",
      tags: ["complexity", "recurrence"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Algorithms",
      difficulty: "MEDIUM",
      text: "An undirected graph has these adjacency lists, with neighbours visited in the order shown:\nA: B, C\nB: A, D, E\nC: A, F\nD: B\nE: B, F\nF: C, E\nWhat is the depth-first traversal order from A?",
      options: ["A B D E F C", "A B C D E F", "A C F E B D", "A B E F C D"],
      correct: 0,
      explanation:
        "DFS goes from A to B to D, backtracks to B, then continues to E, F and C. Reading level by level gives A B C D E F, but that is the BFS order. The other sequences ignore the stated neighbour order, even though they follow real edges.",
      tags: ["graph traversal", "dfs"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Algorithms",
      difficulty: "HARD",
      text: "Consider the fragment below. What is the final value of count for n = 1024, and what is its growth rate as a function of n?\ncount = 0;\nfor (i = 1; i <= n; i = i * 2)\n    for (j = 1; j <= i; j++)\n        count++;",
      options: [
        "2047, Θ(n log n)",
        "2047, Θ(n)",
        "1023, Θ(n)",
        "11264, Θ(n log n)",
      ],
      correct: 1,
      explanation:
        "The inner loop runs 1, 2, 4, ..., 1024 times, and this geometric series sums to 2047, which is less than 2n, so the growth is Θ(n). Multiplying log n outer iterations by at most n inner iterations suggests n log n, but that is only a loose upper bound because most inner loops are far shorter than n. The value 1023 omits the final pass with i = 1024.",
      tags: ["complexity", "loops"],
      exams: ["ibps-so-it"],
    },

    // ---------- Programming Concepts ----------
    {
      topic: "Programming Concepts",
      difficulty: "EASY",
      text: 'What does this C statement print?\nprintf("%d %d", 7 / 2, 7 % 2);',
      options: ["3.5 1", "4 1", "3 0", "3 1"],
      correct: 3,
      explanation:
        "Dividing two int values in C performs integer division, which truncates 3.5 to 3, and 7 % 2 gives the remainder 1. The answer 3.5 assumes the result is promoted to floating point, which happens only when an operand is floating point.",
      tags: ["c", "output", "operators"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Programming Concepts",
      difficulty: "MEDIUM",
      text: 'What does this C fragment print?\nint a[] = {10, 20, 30, 40};\nint *p = a;\np += 2;\nprintf("%d %d", *p, *(p - 1));',
      options: ["20 10", "30 20", "30 10", "40 30"],
      correct: 1,
      explanation:
        "Pointer arithmetic moves by whole elements, so p += 2 makes p point to a[2], which holds 30, and *(p - 1) reads a[1], which holds 20. Choosing 20 10 confuses the offset 2 with the second element, whereas index 2 is the third element.",
      tags: ["c", "output", "pointers"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Programming Concepts",
      difficulty: "MEDIUM",
      text: 'What does this Java fragment print?\nString s = "bank";\ns.concat("prep");\nStringBuilder b = new StringBuilder("bank");\nb.append("prep");\nSystem.out.println(s.length() + " " + b.length());',
      options: ["4 8", "8 8", "4 4", "8 4"],
      correct: 0,
      explanation:
        "String is immutable, so concat returns a new string that is discarded here and s keeps its length of 4. StringBuilder is mutable, so append changes b to length 8. The answer 8 8 assumes concat modifies the original string.",
      tags: ["java", "output", "strings"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Programming Concepts",
      difficulty: "HARD",
      text: 'What does this C program print?\n#include <stdio.h>\nint f(int n) {\n    static int c = 0;\n    c += n;\n    if (n == 0) return c;\n    int r = f(n - 1);\n    return r + n;\n}\nint main(void) {\n    printf("%d", f(3));\n    return 0;\n}',
      options: ["6", "9", "12", "15"],
      correct: 2,
      explanation:
        "All recursive calls share the single static variable c, which reaches 3 + 2 + 1 + 0 = 6, so f(0) returns 6. Unwinding adds 1, 2 and 3, giving 12. The answer 6 is what a non-static c would produce, because f(0) would then return 0 and only the additions during unwinding would count.",
      tags: ["c", "output", "recursion"],
      exams: ["ibps-so-it"],
    },

    // ---------- Object-Oriented Programming ----------
    {
      topic: "Object-Oriented Programming",
      difficulty: "EASY",
      text: "Which OOP principle is applied when a class keeps its fields private and exposes them only through its own methods?",
      options: ["Inheritance", "Encapsulation", "Polymorphism", "Composition"],
      correct: 1,
      explanation:
        "Encapsulation bundles data with the methods that operate on it and restricts direct access to that data. Polymorphism is a frequent wrong answer, but it concerns one interface having many runtime behaviours rather than access control.",
      tags: ["oop", "encapsulation"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Object-Oriented Programming",
      difficulty: "MEDIUM",
      text: 'What does this Java code print?\nclass A { int x = 1; int get() { return x; } }\nclass B extends A { int x = 2; int get() { return x; } }\n// elsewhere\nA o = new B();\nSystem.out.println(o.x + " " + o.get());',
      options: ["1 1", "2 2", "1 2", "2 1"],
      correct: 2,
      explanation:
        "Field access is resolved from the reference type at compile time, so o.x reads A's x, which is 1. Method calls are dispatched on the runtime object, so o.get() runs B's version and returns 2. The answer 2 2 assumes fields are overridden like methods, but a field with the same name only hides the inherited one.",
      tags: ["java", "output", "polymorphism"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Object-Oriented Programming",
      difficulty: "MEDIUM",
      format: "MATCH_THE_FOLLOWING",
      text: "Match each design principle in Column A with its meaning in Column B.",
      options: [
        "A-3, B-2, C-4, D-1",
        "A-4, B-3, C-2, D-1",
        "A-1, B-4, C-2, D-3",
        "A-3, B-4, C-2, D-1",
      ],
      correct: 3,
      explanation:
        "Single Responsibility limits a class to one reason to change, and Open-Closed allows extension without editing existing code. Liskov Substitution requires a subclass to work wherever its base class is expected, and Dependency Inversion makes code depend on abstractions. Liskov is often confused with Open-Closed because both involve subclasses, but it concerns behavioural compatibility rather than extension.",
      tags: ["oop", "solid"],
      exams: ["ibps-so-it"],
      formatData: {
        columnA: [
          "Single Responsibility",
          "Open-Closed",
          "Liskov Substitution",
          "Dependency Inversion",
        ],
        columnB: [
          "Depend on abstractions rather than concrete classes",
          "A subclass must be usable wherever its base class is expected",
          "A class should have only one reason to change",
          "Add behaviour by extension without modifying existing code",
        ],
      },
    },
    {
      topic: "Object-Oriented Programming",
      difficulty: "HARD",
      text: 'What does this Java code print when new C() is executed?\nclass P {\n    P() { System.out.print("P "); init(); }\n    void init() { System.out.print("Pi "); }\n}\nclass C extends P {\n    int v = 5;\n    C() { System.out.print("C" + v); }\n    @Override void init() { System.out.print("Ci" + v + " "); }\n}',
      options: ["P Ci0 C5", "P Pi C5", "P Ci5 C5", "Ci0 P C5"],
      correct: 0,
      explanation:
        "The parent constructor runs first and its call to init() dispatches to C's override, even during construction. C's field initializer has not yet run at that point, so v still holds the default value 0. It becomes 5 before the body of C's constructor executes, so the output is P Ci0 C5. Assuming initializers run before super() leads to the wrong answer with Ci5.",
      tags: ["java", "output", "constructors"],
      exams: ["ibps-so-it"],
    },

    // ---------- Software Engineering ----------
    {
      topic: "Software Engineering",
      difficulty: "EASY",
      text: "In which SDLC phase is the Software Requirements Specification (SRS) primarily produced?",
      options: ["Coding", "Deployment", "Requirements analysis", "Maintenance"],
      correct: 2,
      explanation:
        "The SRS records what the system must do, so it is the main output of requirements analysis and it guides the later phases. It is not created during coding, which implements decisions that have already been specified.",
      tags: ["sdlc", "requirements"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Software Engineering",
      difficulty: "MEDIUM",
      text: "An age field accepts integers from 18 to 60 inclusive. Which set of test inputs best applies boundary value analysis to the two limits?",
      options: [
        "18, 39, 60, 100",
        "1, 18, 60, 99",
        "20, 30, 40, 50",
        "17, 18, 60, 61",
      ],
      correct: 3,
      explanation:
        "Boundary value analysis tests each limit together with the value just outside it, here 17 and 18 at the lower end and 60 and 61 at the upper end. Values such as 20, 30, 40 and 50 are all from one valid partition, so they would not reveal off-by-one errors at the limits.",
      tags: ["testing", "black box"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Software Engineering",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the statements about software testing. Which of them are correct?",
      options: STATEMENT_OPTIONS,
      correct: 1,
      explanation:
        "Regression testing checks that a change has not broken existing behaviour, and beta testing is done by real users in their own environment, so statements 2 and 3 are correct. Statement 1 is false because it describes black-box testing; white-box test design relies on knowledge of the internal code structure.",
      tags: ["testing"],
      exams: ["ibps-so-it"],
      formatData: {
        statements: [
          "White-box test design requires no knowledge of the internal structure of the code.",
          "Regression testing checks that a change has not broken previously working behaviour.",
          "Beta testing is carried out by real users in their own environment.",
        ],
      },
    },
    {
      topic: "Software Engineering",
      difficulty: "HARD",
      text: "What is the cyclomatic complexity of this function, and hence the minimum number of test cases for basis path coverage?\nint f(int x) {\n    int e = 0, o = 0, r = 0;\n    while (x > 0) {\n        if (x % 2 == 0) { e++; } else { o++; }\n        x--;\n    }\n    if (e > o) { r = 1; }\n    return r;\n}",
      options: ["3", "4", "5", "6"],
      correct: 1,
      explanation:
        "The function has three simple predicates, the while and the two if conditions, so V(G) = 3 + 1 = 4. Its control flow graph confirms this, since E - N + 2 = 11 - 9 + 2 = 4. The answer 3 comes from counting decisions without adding 1, and the else branch adds no extra decision of its own.",
      tags: ["testing", "cyclomatic complexity"],
      exams: ["ibps-so-it"],
    },

    // ---------- Cyber Security ----------
    {
      topic: "Cyber Security",
      difficulty: "EASY",
      text: "An email that appears to come from a customer's bank urges them to follow a link and enter their login credentials on a fake site. What type of attack is this?",
      options: ["Phishing", "Ransomware", "Port scanning", "Buffer overflow"],
      correct: 0,
      explanation:
        "Phishing uses a deceptive message to trick the victim into revealing sensitive information. Ransomware is sometimes delivered by email, but it is defined by encrypting data for payment, which is not what happens here.",
      tags: ["attacks", "social engineering"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Cyber Security",
      difficulty: "MEDIUM",
      text: "A login page builds its SQL statement by concatenating user input into the query string. Which is the most effective primary defence against the resulting injection risk?",
      options: [
        "Hiding database errors from users",
        "Moving the site to HTTPS",
        "Rejecting input that contains the word SELECT",
        "Using parameterized queries or prepared statements",
      ],
      correct: 3,
      explanation:
        "Parameterized queries send the SQL structure and the data separately, so input cannot change the meaning of the statement. HTTPS protects data in transit but does nothing to the query the server builds. Keyword blocklists are easy to bypass, and hiding errors only makes exploitation harder to observe.",
      tags: ["owasp", "sql injection"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Cyber Security",
      difficulty: "MEDIUM",
      text: "A customer logged in to a banking site visits a malicious page. That page silently submits a funds-transfer form to the bank, and the browser attaches the customer's session cookie automatically. Which attack is this?",
      options: [
        "Stored cross-site scripting",
        "SQL injection",
        "Cross-site request forgery",
        "DNS spoofing",
      ],
      correct: 2,
      explanation:
        "CSRF abuses the browser's habit of sending cookies automatically, so a forged request carries the victim's authenticated session. Anti-CSRF tokens and SameSite cookies are the standard defences. Stored XSS is the common confusion, but it requires attacker script to run within the bank's own site, which does not happen here.",
      tags: ["owasp", "csrf"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Cyber Security",
      difficulty: "HARD",
      format: "ASSERTION_REASON",
      text: "Read Assertion (A) and Reason (R) about session cookies, then choose the correct option.",
      options: AR_OPTIONS,
      correct: 2,
      explanation:
        "A is true because a script injected through XSS can still send requests and read page content within the user's session. R is false because HttpOnly does not stop scripts from executing; it only hides that cookie from client-side script. Treating HttpOnly as a complete XSS fix is the misconception, since output encoding and a Content Security Policy are still needed.",
      tags: ["owasp", "xss", "cookies"],
      exams: ["ibps-so-it"],
      formatData: {
        assertion: "Marking a session cookie HttpOnly does not by itself remove the risk from a cross-site scripting flaw.",
        reason: "The HttpOnly attribute prevents all JavaScript from executing on the page.",
      },
    },

    // ---------- Cryptography ----------
    {
      topic: "Cryptography",
      difficulty: "EASY",
      text: "Which key does a recipient use to verify a sender's digital signature?",
      options: [
        "The sender's private key",
        "The sender's public key",
        "The recipient's private key",
        "The recipient's public key",
      ],
      correct: 1,
      explanation:
        "The sender signs with their own private key, and anyone can verify the signature with the matching public key. Choosing the recipient's keys confuses signing with public-key encryption, where the sender encrypts using the recipient's public key.",
      tags: ["asymmetric", "digital signature"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Cryptography",
      difficulty: "MEDIUM",
      text: "A group of 20 users wants every pair to be able to communicate privately. How many secret keys are needed with symmetric cryptography, and how many keys in total (public and private) with asymmetric cryptography?",
      options: ["190 and 40", "190 and 20", "380 and 40", "400 and 40"],
      correct: 0,
      explanation:
        "Each pair shares one symmetric key, giving 20 x 19 / 2 = 190 keys. With asymmetric cryptography each user needs one key pair, which is 40 keys in total. The value 380 counts each pair twice, and 20 counts only one key from each user's pair.",
      tags: ["symmetric", "asymmetric", "key management"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Cryptography",
      difficulty: "MEDIUM",
      format: "MULTIPLE_STATEMENTS",
      text: "Consider the statements about cryptographic hash functions and password storage. Which of them are correct?",
      options: STATEMENT_OPTIONS,
      correct: 2,
      explanation:
        "A hash has a fixed output length, and a unique salt for each password makes precomputed rainbow tables impractical, so statements 1 and 3 are correct. Statement 2 is false: with more possible inputs than outputs, collisions must exist. Collision resistance means only that they are computationally infeasible to find.",
      tags: ["hashing", "passwords"],
      exams: ["ibps-so-it"],
      formatData: {
        statements: [
          "A given hash function produces output of a fixed length regardless of the input length.",
          "Collision resistance means that no two different inputs can ever have the same hash value.",
          "A unique salt for each password makes precomputed rainbow tables impractical.",
        ],
      },
    },
    {
      topic: "Cryptography",
      difficulty: "HARD",
      text: "In RSA with p = 7, q = 13 and public exponent e = 5, what are the private exponent d and the ciphertext C of the message M = 3?",
      options: ["d = 17, C = 61", "d = 29, C = 15", "d = 43, C = 61", "d = 29, C = 61"],
      correct: 3,
      explanation:
        "Here n = 91 and φ(n) = 6 x 12 = 72, and d = 29 because 5 x 29 = 145 leaves remainder 1 modulo 72. The ciphertext is 3^5 mod 91 = 243 mod 91 = 61. The value C = 15 wrongly multiplies M by e instead of raising M to the power e, and d must be computed modulo φ(n), not modulo n.",
      tags: ["rsa", "asymmetric"],
      exams: ["ibps-so-it"],
    },

    // ---------- Computer Architecture ----------
    {
      topic: "Computer Architecture",
      difficulty: "EASY",
      text: "Which feature is characteristic of a RISC processor design?",
      options: [
        "A large set of complex multi-cycle instructions",
        "Many memory-addressing modes in most instructions",
        "Arithmetic instructions that operate directly on memory",
        "Simple fixed-length instructions with a load/store architecture",
      ],
      correct: 3,
      explanation:
        "RISC designs favour simple, usually fixed-length instructions and access memory only through load and store instructions, which makes pipelining easier. The other options describe CISC traits. A smaller instruction set does not imply slower programs, which is a common assumption.",
      tags: ["risc", "cisc"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Architecture",
      difficulty: "MEDIUM",
      text: "A byte-addressable machine with 32-bit addresses has a 64 KB direct-mapped cache with 32-byte blocks. What are the tag, index and offset widths in bits?",
      options: ["16, 11, 5", "17, 10, 5", "16, 10, 6", "15, 12, 5"],
      correct: 0,
      explanation:
        "A 32-byte block needs 5 offset bits. The cache has 64 KB / 32 B = 2048 lines, which needs 11 index bits, and the remaining 32 - 11 - 5 = 16 bits form the tag. The split 16, 10, 6 uses the correct tag width by coincidence but misreads the block size as 64 bytes.",
      tags: ["cache mapping", "direct mapped"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Architecture",
      difficulty: "MEDIUM",
      text: "How long does a 5-stage pipeline with a 2 ns clock cycle take to complete 1000 instructions, assuming no stalls or hazards?",
      options: ["2000 ns", "2008 ns", "2010 ns", "10000 ns"],
      correct: 1,
      explanation:
        "The first instruction takes k = 5 cycles and each of the other n - 1 = 999 finishes one cycle later, giving 1004 cycles x 2 ns = 2008 ns. The value 2000 ns ignores the cycles needed to fill the pipeline. The value 10000 ns is the time without pipelining, assuming each instruction takes all 5 stages in sequence.",
      tags: ["pipelining", "performance"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Architecture",
      difficulty: "HARD",
      text: "A byte-addressable machine with 32-bit addresses has a 16 KB, 4-way set-associative cache with 64-byte blocks. Each line stores a tag and one valid bit. How many bits in total are needed for tags and valid bits?",
      options: ["1344", "4864", "5120", "5376"],
      correct: 3,
      explanation:
        "The cache has 16 KB / 64 B = 256 lines in 64 sets, so there are 6 offset bits, 6 index bits and a 20-bit tag. Each line needs 21 bits, so the total is 256 x 21 = 5376 bits. The value 1344 counts sets rather than lines, 5120 leaves out the valid bits, and 4864 uses the shorter tag of a direct-mapped cache.",
      tags: ["cache mapping", "set associative"],
      exams: ["ibps-so-it"],
    },

    // ---------- Cloud Computing ----------
    {
      topic: "Cloud Computing",
      difficulty: "EASY",
      text: "A bank's staff use a provider-hosted email application through a browser, with no responsibility for its servers or code. Which cloud service model is this?",
      options: ["IaaS", "PaaS", "SaaS", "On-premises hosting"],
      correct: 2,
      explanation:
        "In SaaS the provider runs the complete application and the customer simply uses it. PaaS is the usual confusion, but there the customer still develops and deploys its own application on the provider's platform.",
      tags: ["service models", "saas"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Cloud Computing",
      difficulty: "MEDIUM",
      text: "Under the IaaS shared responsibility model, which task normally belongs to the customer rather than the cloud provider?",
      options: [
        "Securing the physical data centre",
        "Patching the guest operating system",
        "Maintaining the hypervisor",
        "Replacing failed server hardware",
      ],
      correct: 1,
      explanation:
        "IaaS provides virtualised infrastructure, so everything from the guest operating system upward is the customer's job. The provider manages the facility, hardware and hypervisor. Assuming the provider patches virtual machines confuses IaaS with PaaS or SaaS.",
      tags: ["service models", "iaas", "shared responsibility"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Cloud Computing",
      difficulty: "MEDIUM",
      format: "ASSERTION_REASON",
      text: "Read Assertion (A) and Reason (R) about scaling, then choose the correct option.",
      options: AR_OPTIONS,
      correct: 1,
      explanation:
        "Both statements are true definitions. However, R describes vertical scaling, a different technique, so it does not explain why horizontal scaling works by adding instances. A related statement is not automatically an explanation, which is the usual trap in this format.",
      tags: ["scalability"],
      exams: ["ibps-so-it"],
      formatData: {
        assertion: "Horizontal scaling increases capacity by adding more server instances.",
        reason: "Vertical scaling increases the CPU or memory of an existing server.",
      },
    },
    {
      topic: "Cloud Computing",
      difficulty: "HARD",
      text: "An application needs its web tier and its database to both be up. The web tier has two independent redundant servers, each 99% available, and only one must be running. The single database is 99.9% available. What is the approximate overall availability?",
      options: ["97.91%", "99.89%", "99.90%", "99.99%"],
      correct: 1,
      explanation:
        "The parallel web tier has availability 1 - 0.01 x 0.01 = 0.9999. In series with the database, the total is 0.9999 x 0.999, which is about 0.9989 or 99.89%. The value 97.91% wrongly places all three components in series, and 99.99% ignores the database.",
      tags: ["availability", "redundancy"],
      exams: ["ibps-so-it"],
    },

    // ---------- Web Technologies ----------
    {
      topic: "Web Technologies",
      difficulty: "EASY",
      text: "Which class of HTTP status codes indicates that the server failed to fulfil an apparently valid request?",
      options: ["5xx", "2xx", "3xx", "4xx"],
      correct: 0,
      explanation:
        "5xx codes such as 500 and 503 report server-side failures. 4xx is the common confusion, but those codes indicate a problem with the client's request, such as 404 Not Found. 2xx signals success and 3xx signals redirection.",
      tags: ["http", "status codes"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Web Technologies",
      difficulty: "MEDIUM",
      text: "Which HTTP method is not idempotent according to the HTTP semantics?",
      options: ["GET", "PUT", "DELETE", "POST"],
      correct: 3,
      explanation:
        "Repeating a POST can have further effects, such as creating another record, so it is not defined as idempotent. PUT and DELETE are idempotent because repeating them leaves the server in the same state. DELETE is often picked by mistake, since a repeat may return a different status code even though the resulting state is unchanged.",
      tags: ["http", "idempotency"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Web Technologies",
      difficulty: "MEDIUM",
      text: "Under the browser same-origin policy, which URL has the same origin as https://bank.example.com/login?",
      options: [
        "http://bank.example.com/api",
        "https://api.bank.example.com/data",
        "https://bank.example.com:443/api/balance",
        "https://bank.example.com:8443/login",
      ],
      correct: 2,
      explanation:
        "An origin consists of scheme, host and port, and 443 is the default port for HTTPS, so the explicit :443 URL matches. The path plays no part in the comparison. A subdomain is the common trap, because api.bank.example.com is a different host and therefore a different origin.",
      tags: ["http", "same-origin policy"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Web Technologies",
      difficulty: "HARD",
      text: 'In what order does this JavaScript print its letters?\nconsole.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");',
      options: ["A B C D", "A D B C", "A C D B", "A D C B"],
      correct: 3,
      explanation:
        "The synchronous code prints A and D first. When the call stack empties, the microtask queue runs before the next task, so the promise callback prints C before the timer callback prints B. A delay of 0 does not make setTimeout run immediately; it only schedules a task, which is the misconception behind A D B C.",
      tags: ["javascript", "event loop", "output"],
      exams: ["ibps-so-it"],
    },

    // ---------- Data Communication ----------
    {
      topic: "Data Communication",
      difficulty: "EASY",
      text: "Which line-coding scheme guarantees a signal transition in the middle of every bit period, which helps with clock recovery?",
      options: ["NRZ-L", "Manchester", "NRZ-I", "Bipolar AMI"],
      correct: 1,
      explanation:
        "Manchester encoding places a transition at the middle of every bit, so the receiver can recover timing from the signal itself. NRZ-L has no transition during long runs of the same bit, and Bipolar AMI loses transitions during long runs of zeros.",
      tags: ["encoding", "line coding"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Data Communication",
      difficulty: "MEDIUM",
      text: "What is the maximum data rate of a noiseless channel with a bandwidth of 4 kHz that uses 8 signal levels, according to the Nyquist formula?",
      options: ["8 kbps", "12 kbps", "24 kbps", "48 kbps"],
      correct: 2,
      explanation:
        "The Nyquist formula gives C = 2B log2 L = 2 x 4000 x 3 = 24000 bps. The value 12 kbps omits the factor of 2, and 8 kbps is the rate for only two signal levels. Shannon's formula is not needed here because the channel is stated to be noiseless and no signal-to-noise ratio is involved.",
      tags: ["nyquist", "channel capacity"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Data Communication",
      difficulty: "MEDIUM",
      format: "MATCH_THE_FOLLOWING",
      text: "Match each digital modulation technique in Column A with the carrier property it varies in Column B.",
      options: [
        "A-4, B-3, C-1, D-2",
        "A-4, B-1, C-3, D-2",
        "A-2, B-3, C-1, D-4",
        "A-3, B-4, C-1, D-2",
      ],
      correct: 0,
      explanation:
        "ASK varies amplitude, FSK varies frequency and PSK varies phase. QAM varies both amplitude and phase, which allows more bits per symbol. QAM is often mistaken for a purely amplitude-based scheme because of its name, but its constellation points also differ in phase.",
      tags: ["modulation"],
      exams: ["ibps-so-it"],
      formatData: {
        columnA: ["ASK", "FSK", "PSK", "QAM"],
        columnB: ["Phase only", "Amplitude and phase", "Frequency only", "Amplitude only"],
      },
    },
    {
      topic: "Data Communication",
      difficulty: "HARD",
      text: "A sender applies a CRC to the data bits 110101 using the generator 1011. What check bits does it append?",
      options: ["011", "101", "110", "111"],
      correct: 3,
      explanation:
        "The generator has degree 3, so three zeros are appended and 110101000 is divided by 1011 using modulo-2 (XOR) arithmetic, leaving the remainder 111. The transmitted frame is therefore 110101111. A common error is ordinary binary subtraction with borrows, or dividing without first appending the zeros.",
      tags: ["crc", "error detection"],
      exams: ["ibps-so-it"],
    },

    // ---------- Computer Organization ----------
    {
      topic: "Computer Organization",
      difficulty: "EASY",
      text: "In which addressing mode is the operand value itself contained in the instruction?",
      options: ["Immediate", "Direct", "Indirect", "Register indirect"],
      correct: 0,
      explanation:
        "Immediate addressing holds the operand in the instruction, so no memory read is needed for it. Direct addressing is the usual confusion: its address field gives the memory location of the operand rather than the operand itself.",
      tags: ["addressing modes"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Organization",
      difficulty: "MEDIUM",
      text: "An instruction has address field 400 and index register R1 contains 100. Memory holds M[400] = 700, M[500] = 900 and M[700] = 300. What operand value is fetched in indexed addressing mode?",
      options: ["300", "500", "700", "900"],
      correct: 3,
      explanation:
        "Indexed addressing computes the effective address as 400 + 100 = 500, and the operand is the content of that location, M[500] = 900. The value 500 is the effective address itself rather than the operand. The values 700 and 300 result from direct and indirect addressing respectively.",
      tags: ["addressing modes", "effective address"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Organization",
      difficulty: "MEDIUM",
      text: "A two-level cache has an L1 hit time of 1 ns and an L1 miss rate of 10%. L2 has a 10 ns access time and a local miss rate of 20%, and a main memory access costs 100 ns. What is the average memory access time?",
      options: ["2 ns", "3 ns", "4 ns", "12 ns"],
      correct: 2,
      explanation:
        "AMAT = L1 hit time + L1 miss rate x (L2 time + L2 miss rate x memory time) = 1 + 0.1 x (10 + 0.2 x 100) = 1 + 0.1 x 30 = 4 ns. The value 2 ns ignores main memory, and 12 ns applies the L1 miss penalty to L2 and memory in full without the L2 miss rate.",
      tags: ["cache", "amat"],
      exams: ["ibps-so-it"],
    },
    {
      topic: "Computer Organization",
      difficulty: "HARD",
      text: "A processor uses 16-bit instructions and 6-bit address fields with an expanding opcode. If 13 two-address instructions are defined, what is the maximum number of one-address instructions possible?",
      options: ["64", "128", "192", "256"],
      correct: 2,
      explanation:
        "Two-address instructions leave 16 - 12 = 4 opcode bits, which gives 16 patterns, and 13 are used. Each of the 3 free patterns is extended by the 6 bits of a released address field, giving 3 x 64 = 192 one-address instructions. The answer 64 extends only one free pattern, which misses the other two.",
      tags: ["instruction format", "expanding opcode"],
      exams: ["ibps-so-it"],
    },
  ],
};

export default file;
