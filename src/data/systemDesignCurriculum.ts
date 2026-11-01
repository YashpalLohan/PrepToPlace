import { Section, Topic } from '../types';

const now = new Date().toISOString();

const topic = (
  id: string,
  sectionId: string,
  title: string,
  description: string,
  order: number,
  resources: Array<{ title: string; url?: string }>
): Topic => ({
  id,
  sectionId,
  title,
  description,
  order,
  status: 'NOT_STARTED',
  createdAt: now,
  resources,
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 0 — Preparation & Resources
// ─────────────────────────────────────────────────────────────────────────────
const P0 = 'sec-sd-phase0';

export const PHASE0_TOPICS: Topic[] = [
  // Recommended Reading
  topic('sd-p0-hfj', P0, 'Head First Java', 'Comprehensive beginner-friendly Java book — great for OOP foundations.', 1, [
    { title: 'Head First Java', url: 'https://www.youtube.com/results?search_query=Head%20First%20Java%20low%20level%20design' },
  ]),
  topic('sd-p0-hfdp', P0, 'Head First Design Patterns', 'Approachable introduction to Gang-of-Four design patterns.', 2, [
    { title: 'Head First Design Patterns', url: 'https://www.youtube.com/results?search_query=Head%20First%20Design%20Patterns%20design%20pattern' },
  ]),
  topic('sd-p0-cleancode', P0, 'Clean Code Handbook', 'Robert C. Martin\'s guide to writing readable, maintainable code.', 3, [
    { title: 'Clean Code Handbook', url: 'https://www.youtube.com/results?search_query=Clean%20Code%20Handbook%20clean%20code' },
  ]),
  // Essential Blogs & Links
  topic('sd-p0-lld-mastery', P0, 'Low Level Design Mastery', 'Comprehensive resource covering LLD concepts and patterns.', 4, [
    { title: 'Low Level Design Mastery', url: 'https://www.youtube.com/results?search_query=Low%20Level%20Design%20Mastery%20low%20level%20design' },
  ]),
  topic('sd-p0-sd-prep', P0, 'Software Design Prep', 'Curated preparation guide for software design interviews.', 5, [
    { title: 'Software Design Prep', url: 'https://www.youtube.com/results?search_query=Software%20Design%20Prep%20low%20level%20design' },
  ]),
  topic('sd-p0-lld-primer', P0, 'LLD Primer by Akash Bhadouria', 'Structured primer covering LLD fundamentals and interview problems.', 6, [
    { title: 'LLD Primer by Akash Bhadouria', url: 'https://www.youtube.com/results?search_query=LLD%20Primer%20by%20Akash%20Bhadouria%20low%20level%20design' },
  ]),
  topic('sd-p0-hld', P0, 'System Design for Beginners (HLD)', 'High-level design fundamentals for placement interviews.', 7, [
    { title: 'System Design for Beginners (HLD)', url: 'https://www.youtube.com/results?search_query=System%20Design%20for%20Beginners%20%28HLD%29%20low%20level%20design' },
  ]),
  topic('sd-p0-lc-playlist', P0, 'LeetCode Design Problems Playlist', 'Curated playlist of LeetCode design problems.', 8, [
    { title: 'LeetCode Design Problems Playlist', url: 'https://www.youtube.com/results?search_query=LeetCode%20Design%20Problems%20Playlist%20low%20level%20design' },
  ]),
  // Action Items
  topic('sd-p0-task-cleancode', P0, 'Task: Read 1 chapter of Clean Code daily', 'Build the habit of reading Clean Code chapter by chapter.', 9, []),
  topic('sd-p0-task-bookmark', P0, 'Task: Bookmark the LeetCode Design Playlist', 'Save the LeetCode design playlist for regular practice sessions.', 10, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 1 — OOPS Foundations
// ─────────────────────────────────────────────────────────────────────────────
const P1 = 'sec-sd-phase1';

export const PHASE1_TOPICS: Topic[] = [
  // Introduction & Classes
  topic('sd-p1-proc-oop', P1, 'Procedural vs OOP', 'Contrast procedural and object-oriented paradigms with real examples.', 1, [
    { title: 'Procedural vs OOP', url: 'https://www.youtube.com/results?search_query=Procedural%20vs%20OOP%20low%20level%20design' },
  ]),
  topic('sd-p1-obj-model', P1, 'Real-world object modeling', 'Translate real-world entities to objects and classes.', 2, [
    { title: 'Real-world object modeling', url: 'https://www.youtube.com/results?search_query=Real-world%20object%20modeling%20low%20level%20design' },
  ]),
  topic('sd-p1-classes', P1, 'Classes', 'Class definitions, fields, methods, access modifiers.', 3, [
    { title: 'Classes', url: 'https://www.youtube.com/results?search_query=Classes%20low%20level%20design' },
  ]),
  topic('sd-p1-objects', P1, 'Objects', 'Instantiation, heap allocation, object references.', 4, [
    { title: 'Objects', url: 'https://www.youtube.com/results?search_query=Objects%20low%20level%20design' },
  ]),
  topic('sd-p1-inst-vars', P1, 'Instance variables', 'Instance vs class (static) variables, default values.', 5, [
    { title: 'Instance variables', url: 'https://www.youtube.com/results?search_query=Instance%20variables%20low%20level%20design' },
  ]),
  topic('sd-p1-methods', P1, 'Methods', 'Method signatures, return types, overloading, varargs.', 6, [
    { title: 'Methods', url: 'https://www.youtube.com/results?search_query=Methods%20low%20level%20design' },
  ]),
  topic('sd-p1-constructors', P1, 'Constructors', 'Default, parameterised, copy constructors, constructor chaining.', 7, [
    { title: 'Constructors', url: 'https://www.youtube.com/results?search_query=Constructors%20low%20level%20design' },
  ]),
  topic('sd-p1-obj-lifecycle', P1, 'Object lifecycle', 'Object creation, garbage collection, finalise, weak references.', 8, [
    { title: 'Object lifecycle', url: 'https://www.youtube.com/results?search_query=Object%20lifecycle%20low%20level%20design' },
  ]),
  topic('sd-p1-this', P1, 'this keyword', 'Usage of this for disambiguation, method chaining, passing references.', 9, [
    { title: 'this keyword', url: 'https://www.youtube.com/results?search_query=this%20keyword%20low%20level%20design' },
  ]),
  // Core Pillars
  topic('sd-p1-encapsulation', P1, 'Encapsulation', 'Bundling data and methods, reducing direct field access.', 10, [
    { title: 'Encapsulation', url: 'https://www.youtube.com/results?search_query=Encapsulation%20low%20level%20design' },
  ]),
  topic('sd-p1-access-mod', P1, 'Access modifiers', 'public, private, protected, package-private scoping rules.', 11, [
    { title: 'Access modifiers', url: 'https://www.youtube.com/results?search_query=Access%20modifiers%20low%20level%20design' },
  ]),
  topic('sd-p1-data-hiding', P1, 'Data hiding', 'Getters/setters, immutability, information hiding principle.', 12, [
    { title: 'Data hiding', url: 'https://www.youtube.com/results?search_query=Data%20hiding%20low%20level%20design' },
  ]),
  topic('sd-p1-inheritance', P1, 'Inheritance', 'Single/multilevel/hierarchical inheritance, extends keyword.', 13, [
    { title: 'Inheritance', url: 'https://www.youtube.com/results?search_query=Inheritance%20low%20level%20design' },
  ]),
  topic('sd-p1-is-a', P1, 'IS-A relationship', 'Subtype polymorphism, Liskov principle basics, instanceof.', 14, [
    { title: 'IS-A relationship', url: 'https://www.youtube.com/results?search_query=IS-A%20relationship%20low%20level%20design' },
  ]),
  topic('sd-p1-overriding', P1, 'Method overriding', '@Override, covariant return types, final methods.', 15, [
    { title: 'Method overriding', url: 'https://www.youtube.com/results?search_query=Method%20overriding%20low%20level%20design' },
  ]),
  topic('sd-p1-super', P1, 'super keyword', 'Calling parent constructors and methods, super vs this.', 16, [
    { title: 'super keyword', url: 'https://www.youtube.com/results?search_query=super%20keyword%20low%20level%20design' },
  ]),
  topic('sd-p1-polymorphism', P1, 'Polymorphism (Compile-time & Runtime)', 'Overloading vs overriding, dynamic dispatch.', 17, [
    { title: 'Polymorphism (Compile-time & Runtime)', url: 'https://www.youtube.com/results?search_query=Polymorphism%20%28Compile-time%20%26%20Runtime%29%20low%20level%20design' },
  ]),
  topic('sd-p1-dispatch', P1, 'Dynamic method dispatch', 'Late binding, virtual method tables, runtime type identification.', 18, [
    { title: 'Dynamic method dispatch', url: 'https://www.youtube.com/results?search_query=Dynamic%20method%20dispatch%20solid%20principles' },
  ]),
  topic('sd-p1-abstraction', P1, 'Abstraction', 'Hiding implementation details, exposing essential interfaces.', 19, [
    { title: 'Abstraction', url: 'https://www.youtube.com/results?search_query=Abstraction%20low%20level%20design' },
  ]),
  topic('sd-p1-abstract-cls', P1, 'Abstract classes', 'Abstract methods, partial implementation, template method base.', 20, [
    { title: 'Abstract classes', url: 'https://www.youtube.com/results?search_query=Abstract%20classes%20low%20level%20design' },
  ]),
  topic('sd-p1-interfaces', P1, 'Interfaces', 'Interface contracts, default methods, multiple implementation.', 21, [
    { title: 'Interfaces', url: 'https://www.youtube.com/results?search_query=Interfaces%20low%20level%20design' },
  ]),
  // Composition Patterns
  topic('sd-p1-has-a', P1, 'HAS-A relationship', 'Object composition, delegation, aggregation vs composition.', 22, [
    { title: 'HAS-A relationship', url: 'https://www.youtube.com/results?search_query=HAS-A%20relationship%20low%20level%20design' },
  ]),
  topic('sd-p1-comp-vs-inh', P1, 'Composition vs Inheritance', 'When to prefer composition, diamond problem, fragile base class.', 23, [
    { title: 'Composition vs Inheritance', url: 'https://www.youtube.com/results?search_query=Composition%20vs%20Inheritance%20low%20level%20design' },
  ]),
  topic('sd-p1-comp-adv', P1, 'Advantages of composition', 'Flexibility, testability, runtime behaviour swapping.', 24, [
    { title: 'Advantages of composition', url: 'https://www.youtube.com/results?search_query=Advantages%20of%20composition%20low%20level%20design' },
  ]),
  topic('sd-p1-rw-model', P1, 'Real-world modeling', 'Model complex systems (e-commerce, library) using OOP principles.', 25, [
    { title: 'Real-world modeling', url: 'https://www.youtube.com/results?search_query=Real-world%20modeling%20low%20level%20design' },
  ]),
  // Practice Projects
  topic('sd-p1-proj-library', P1, 'Project: Library Management System', 'Design and implement a complete Library Management System using OOP.', 26, []),
  topic('sd-p1-proj-parking', P1, 'Project: Parking Lot System', 'Model a multi-floor parking lot with different vehicle types and slots.', 27, []),
  topic('sd-p1-proj-student', P1, 'Project: Student Management System', 'CRUD operations, course enrolment, grade tracking via OOP.', 28, []),
  topic('sd-p1-proj-movie', P1, 'Project: Movie Ticket Booking System', 'Seat selection, booking flow, cancellation using OOP patterns.', 29, []),
  topic('sd-p1-proj-cab', P1, 'Project: Cab Booking System', 'Driver-rider matching, trip lifecycle, fare calculation.', 30, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 2 — Principles & Design Patterns
// ─────────────────────────────────────────────────────────────────────────────
const P2 = 'sec-sd-phase2';

export const PHASE2_TOPICS: Topic[] = [
  // SOLID & Clean Code
  topic('sd-p2-srp', P2, 'SRP — Single Responsibility Principle', 'A class should have only one reason to change.', 1, [
    { title: 'SRP', url: 'https://www.youtube.com/results?search_query=SRP%20solid%20principles' },
  ]),
  topic('sd-p2-ocp', P2, 'OCP — Open/Closed Principle', 'Open for extension, closed for modification.', 2, [
    { title: 'OCP', url: 'https://www.youtube.com/results?search_query=OCP%20solid%20principles' },
  ]),
  topic('sd-p2-lsp', P2, 'LSP — Liskov Substitution Principle', 'Subclasses should be substitutable for their base classes.', 3, [
    { title: 'LSP', url: 'https://www.youtube.com/results?search_query=LSP%20solid%20principles' },
  ]),
  topic('sd-p2-isp', P2, 'ISP — Interface Segregation Principle', 'Clients should not depend on interfaces they do not use.', 4, [
    { title: 'ISP', url: 'https://www.youtube.com/results?search_query=ISP%20solid%20principles' },
  ]),
  topic('sd-p2-dip', P2, 'DIP — Dependency Inversion Principle', 'Depend on abstractions, not concretions.', 5, [
    { title: 'DIP (SOLID Principles)', url: 'https://www.youtube.com/results?search_query=DIP%20%28SOLID%20Principles%29%20solid%20principles' },
  ]),
  topic('sd-p2-naming', P2, 'Naming conventions', 'Meaningful variable, method, and class names for readability.', 6, [
    { title: 'Naming conventions', url: 'https://www.youtube.com/results?search_query=Naming%20conventions%20low%20level%20design' },
  ]),
  topic('sd-p2-maintainable-fns', P2, 'Writing maintainable functions', 'Small functions, single responsibility, minimal arguments.', 7, [
    { title: 'Writing maintainable functions', url: 'https://www.youtube.com/results?search_query=Writing%20maintainable%20functions%20low%20level%20design' },
  ]),
  topic('sd-p2-readability', P2, 'Code readability', 'Comments, self-documenting code, structure for clarity.', 8, [
    { title: 'Code readability', url: 'https://www.youtube.com/results?search_query=Code%20readability%20low%20level%20design' },
  ]),
  topic('sd-p2-smells', P2, 'Reducing code smells', 'Long methods, God class, magic numbers, dead code, shotgun surgery.', 9, [
    { title: 'Reducing code smells', url: 'https://www.youtube.com/results?search_query=Reducing%20code%20smells%20clean%20code' },
  ]),
  topic('sd-p2-exceptions', P2, 'Exception handling', 'Checked vs unchecked, custom exceptions, fail-fast principle.', 10, [
    { title: 'Exception handling', url: 'https://www.youtube.com/results?search_query=Exception%20handling%20low%20level%20design' },
  ]),
  // UML & Refactoring
  topic('sd-p2-class-diag', P2, 'Class diagrams', 'UML notation for classes, relationships, multiplicity.', 11, [
    { title: 'Class diagrams', url: 'https://www.youtube.com/results?search_query=Class%20diagrams%20low%20level%20design' },
  ]),
  topic('sd-p2-seq-diag', P2, 'Sequence diagrams', 'Modelling interactions and message flows over time.', 12, [
    { title: 'Sequence diagrams', url: 'https://www.youtube.com/results?search_query=Sequence%20diagrams%20low%20level%20design' },
  ]),
  topic('sd-p2-obj-rel', P2, 'Object relationships', 'Association, aggregation, composition, dependency in UML.', 13, [
    { title: 'Object relationships', url: 'https://www.youtube.com/results?search_query=Object%20relationships%20low%20level%20design' },
  ]),
  topic('sd-p2-legacy', P2, 'Improving legacy code', 'Strangler fig pattern, incremental refactoring, test coverage first.', 14, [
    { title: 'Improving legacy code', url: 'https://www.youtube.com/results?search_query=Improving%20legacy%20code%20low%20level%20design' },
  ]),
  topic('sd-p2-coupling', P2, 'Reducing tight coupling', 'Dependency injection, interfaces, event-driven decoupling.', 15, [
    { title: 'Reducing tight coupling', url: 'https://www.youtube.com/results?search_query=Reducing%20tight%20coupling%20low%20level%20design' },
  ]),
  topic('sd-p2-maintainability', P2, 'Increasing maintainability', 'Modular design, separation of concerns, low coupling/high cohesion.', 16, [
    { title: 'Increasing maintainability', url: 'https://www.youtube.com/results?search_query=Increasing%20maintainability%20low%20level%20design' },
  ]),
  // Design Patterns — Creational
  topic('sd-p2-singleton', P2, 'Creational: Singleton', 'Single instance per JVM, thread-safety, lazy vs eager.', 17, [
    { title: 'Singleton', url: 'https://www.youtube.com/results?search_query=Creational%3A%20Singleton%20design%20pattern' },
  ]),
  topic('sd-p2-factory', P2, 'Creational: Factory', 'Factory Method and Abstract Factory for object creation.', 18, [
    { title: 'Factory', url: 'https://www.youtube.com/results?search_query=Factory%20design%20pattern' },
  ]),
  topic('sd-p2-builder', P2, 'Creational: Builder', 'Step-by-step object construction, fluent API.', 19, [
    { title: 'Builder', url: 'https://www.youtube.com/results?search_query=Builder%20design%20pattern' },
  ]),
  topic('sd-p2-prototype', P2, 'Creational: Prototype', 'Object cloning, shallow vs deep copy.', 20, [
    { title: 'Prototype', url: 'https://www.youtube.com/results?search_query=Prototype%20design%20pattern' },
  ]),
  // Design Patterns — Structural
  topic('sd-p2-adapter', P2, 'Structural: Adapter', 'Wrap incompatible interfaces, legacy system integration.', 21, [
    { title: 'Adapter', url: 'https://www.youtube.com/results?search_query=Structural%3A%20Adapter%20design%20pattern' },
  ]),
  topic('sd-p2-decorator', P2, 'Structural: Decorator', 'Dynamic responsibility addition without subclassing.', 22, [
    { title: 'Decorator', url: 'https://www.youtube.com/results?search_query=Decorator%20design%20pattern' },
  ]),
  topic('sd-p2-facade', P2, 'Structural: Facade', 'Simplified interface to complex subsystems.', 23, [
    { title: 'Facade', url: 'https://www.youtube.com/results?search_query=Facade%20design%20pattern' },
  ]),
  topic('sd-p2-composite', P2, 'Structural: Composite', 'Tree structures, uniform treatment of leaf and composite nodes.', 24, [
    { title: 'Composite', url: 'https://www.youtube.com/results?search_query=Composite%20design%20pattern' },
  ]),
  // Design Patterns — Behavioral
  topic('sd-p2-strategy', P2, 'Behavioral: Strategy', 'Interchangeable algorithms, runtime strategy selection.', 25, [
    { title: 'Strategy', url: 'https://www.youtube.com/results?search_query=Behavioral%3A%20Strategy%20design%20pattern' },
  ]),
  topic('sd-p2-observer', P2, 'Behavioral: Observer', 'Publish-subscribe, event listeners, reactive patterns.', 26, [
    { title: 'Observer', url: 'https://www.youtube.com/results?search_query=Observer%20design%20pattern' },
  ]),
  topic('sd-p2-command', P2, 'Behavioral: Command', 'Encapsulate requests as objects, undo/redo support.', 27, [
    { title: 'Command', url: 'https://www.youtube.com/results?search_query=Command%20design%20pattern' },
  ]),
  topic('sd-p2-state', P2, 'Behavioral: State', 'Object-specific behaviour based on internal state.', 28, [
    { title: 'State', url: 'https://www.youtube.com/results?search_query=State%20design%20pattern' },
  ]),
  topic('sd-p2-template', P2, 'Behavioral: Template Method', 'Define algorithm skeleton in base class, fill steps in subclasses.', 29, [
    { title: 'Template Method', url: 'https://www.youtube.com/results?search_query=Template%20Method%20design%20pattern' },
  ]),
  // Machine Coding Fundamentals
  topic('sd-p2-req-analysis', P2, 'Requirement analysis', 'Extract functional/non-functional requirements from problem statements.', 30, [
    { title: 'Requirement analysis', url: 'https://www.youtube.com/results?search_query=Requirement%20analysis%20low%20level%20design' },
  ]),
  topic('sd-p2-class-decomp', P2, 'Class decomposition', 'Identify entities, responsibilities, and relationships from requirements.', 31, [
    { title: 'Class decomposition', url: 'https://www.youtube.com/results?search_query=Class%20decomposition%20low%20level%20design' },
  ]),
  topic('sd-p2-scalable-models', P2, 'Writing scalable object models', 'Design for extension, avoid premature optimisation, keep models clean.', 32, [
    { title: 'Writing scalable object models', url: 'https://www.youtube.com/results?search_query=Writing%20scalable%20object%20models%20low%20level%20design' },
  ]),
  topic('sd-p2-extensibility', P2, 'Handling extensibility', 'Plugin architecture, open points, backward compatibility.', 33, [
    { title: 'Handling extensibility', url: 'https://www.youtube.com/results?search_query=Handling%20extensibility%20low%20level%20design' },
  ]),
  // Machine Coding Projects
  topic('sd-p2-mc-splitwise', P2, 'Machine Code: Splitwise', 'Expense splitting, group management, settle-up flows.', 34, []),
  topic('sd-p2-mc-snake', P2, 'Machine Code: Snake & Ladder', 'Board game with snakes, ladders, multiple players, dice.', 35, []),
  topic('sd-p2-mc-elevator', P2, 'Machine Code: Elevator System', 'Multi-elevator scheduling, floor requests, door states.', 36, []),
  topic('sd-p2-mc-food', P2, 'Machine Code: Food Delivery System', 'Restaurant, menu, order lifecycle, delivery assignment.', 37, []),
  topic('sd-p2-mc-chess', P2, 'Machine Code: Chess Game', 'Piece types, move validation, check/checkmate detection.', 38, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 3 — Software Development Lifecycle (SDLC)
// ─────────────────────────────────────────────────────────────────────────────
const P3 = 'sec-sd-phase3';

export const PHASE3_TOPICS: Topic[] = [
  // Agile & SDLC
  topic('sd-p3-lifecycle', P3, 'Lifecycle overview', 'SDLC phases: requirements, design, development, testing, deployment.', 1, [
    { title: 'Lifecycle overview', url: 'https://www.youtube.com/results?search_query=Lifecycle%20overview%20low%20level%20design' },
  ]),
  topic('sd-p3-req-gathering', P3, 'Requirement gathering', 'Functional vs non-functional, stakeholder interviews, BRD.', 2, [
    { title: 'Requirement gathering', url: 'https://www.youtube.com/results?search_query=Requirement%20gathering%20low%20level%20design' },
  ]),
  topic('sd-p3-planning', P3, 'Planning', 'Effort estimation, capacity planning, milestone definition.', 3, [
    { title: 'Planning', url: 'https://www.youtube.com/results?search_query=Planning%20low%20level%20design' },
  ]),
  topic('sd-p3-scrum', P3, 'Scrum basics', 'Roles (PO, SM, Dev), ceremonies, artefacts (backlog, increment).', 4, [
    { title: 'Scrum basics', url: 'https://www.youtube.com/results?search_query=Scrum%20basics%20sdlc%20scrum%20agile' },
  ]),
  topic('sd-p3-sprint', P3, 'Sprint planning', 'Sprint goals, story points, velocity, planning poker.', 5, [
    { title: 'Sprint planning', url: 'https://www.youtube.com/results?search_query=Sprint%20planning%20sdlc%20scrum%20agile' },
  ]),
  topic('sd-p3-user-stories', P3, 'User stories', 'As a / I want / so that, acceptance criteria, definition of done.', 6, [
    { title: 'User stories', url: 'https://www.youtube.com/results?search_query=User%20stories%20low%20level%20design' },
  ]),
  topic('sd-p3-standups', P3, 'Standups and retrospectives', 'Daily scrums, impediment removal, sprint retros, action items.', 7, [
    { title: 'Standups and retrospectives', url: 'https://www.youtube.com/results?search_query=Standups%20and%20retrospectives%20low%20level%20design' },
  ]),
  // Version Control & Workflow
  topic('sd-p3-git', P3, 'Git fundamentals', 'init, clone, add, commit, push, pull, rebase, cherry-pick.', 8, [
    { title: 'Git fundamentals', url: 'https://www.youtube.com/results?search_query=Git%20fundamentals%20git%20version%20control' },
  ]),
  topic('sd-p3-branching', P3, 'Branching strategies', 'Git Flow, trunk-based, feature flags, release branches.', 9, [
    { title: 'Branching strategies', url: 'https://www.youtube.com/results?search_query=Branching%20strategies%20low%20level%20design' },
  ]),
  topic('sd-p3-prs', P3, 'Pull requests', 'PR templates, diff review, approval gates, squash vs merge.', 10, [
    { title: 'Pull requests', url: 'https://www.youtube.com/results?search_query=Pull%20requests%20git%20version%20control' },
  ]),
  topic('sd-p3-code-review', P3, 'Code reviews', 'Review etiquette, checklist, automated checks, async review.', 11, [
    { title: 'Code reviews', url: 'https://www.youtube.com/results?search_query=Code%20reviews%20low%20level%20design' },
  ]),
  topic('sd-p3-gh-workflow', P3, 'GitHub workflow', 'Issues, projects, actions, CODEOWNERS, protected branches.', 12, [
    { title: 'GitHub workflow', url: 'https://www.youtube.com/results?search_query=GitHub%20workflow%20git%20version%20control' },
  ]),
  topic('sd-p3-docs', P3, 'Documentation', 'README, API docs, ADRs, architecture diagrams, Confluence.', 13, [
    { title: 'Documentation', url: 'https://www.youtube.com/results?search_query=Documentation%20low%20level%20design' },
  ]),
  topic('sd-p3-task-mgmt', P3, 'Task management', 'Jira, Linear, GitHub Issues — story lifecycle, epics, labels.', 14, [
    { title: 'Task management', url: 'https://www.youtube.com/results?search_query=Task%20management%20low%20level%20design' },
  ]),
  topic('sd-p3-code-ownership', P3, 'Code ownership', 'CODEOWNERS files, shared ownership culture, bus factor.', 15, [
    { title: 'Code ownership', url: 'https://www.youtube.com/results?search_query=Code%20ownership%20low%20level%20design' },
  ]),
  // Backend & Databases
  topic('sd-p3-layered-arch', P3, 'Layered architecture', 'Presentation, business, data layers — separation of concerns.', 16, [
    { title: 'Layered architecture', url: 'https://www.youtube.com/results?search_query=Layered%20architecture%20low%20level%20design' },
  ]),
  topic('sd-p3-csr', P3, 'Controller-Service-Repository pattern', 'Request routing, business logic, data access isolation.', 17, [
    { title: 'Controller-Service-Repository pattern', url: 'https://www.youtube.com/results?search_query=Controller-Service-Repository%20pattern%20low%20level%20design' },
  ]),
  topic('sd-p3-rdbms', P3, 'Relational databases', 'Tables, keys, joins, transactions, ACID properties.', 18, [
    { title: 'Relational databases', url: 'https://www.youtube.com/results?search_query=Relational%20databases%20low%20level%20design' },
  ]),
  topic('sd-p3-entity-rel', P3, 'Entity relationships', 'One-to-one, one-to-many, many-to-many, ER diagrams.', 19, [
    { title: 'Entity relationships', url: 'https://www.youtube.com/results?search_query=Entity%20relationships%20low%20level%20design' },
  ]),
  topic('sd-p3-schema', P3, 'Schema design fundamentals', 'Table naming, column types, indexes, constraints.', 20, [
    { title: 'Schema design fundamentals', url: 'https://www.youtube.com/results?search_query=Schema%20design%20fundamentals%20low%20level%20design' },
  ]),
  topic('sd-p3-normalization', P3, 'Normalization basics', '1NF, 2NF, 3NF, BCNF — eliminate redundancy.', 21, [
    { title: 'Normalization basics', url: 'https://www.youtube.com/results?search_query=Normalization%20basics%20low%20level%20design' },
  ]),
  // APIs, Testing & Deployment
  topic('sd-p3-rest', P3, 'REST APIs', 'Resources, verbs, statelessness, idempotency, Richardson maturity.', 22, [
    { title: 'REST APIs', url: 'https://www.youtube.com/results?search_query=REST%20APIs%20low%20level%20design' },
  ]),
  topic('sd-p3-req-resp', P3, 'Request/response lifecycle', 'DNS, TCP, HTTP, parsing, middleware, serialisation.', 23, [
    { title: 'Request/response lifecycle', url: 'https://www.youtube.com/results?search_query=Request%2Fresponse%20lifecycle%20low%20level%20design' },
  ]),
  topic('sd-p3-status-codes', P3, 'Status codes', '2xx success, 3xx redirect, 4xx client error, 5xx server error.', 24, [
    { title: 'Status codes', url: 'https://www.youtube.com/results?search_query=Status%20codes%20low%20level%20design' },
  ]),
  topic('sd-p3-auth', P3, 'Auth', 'JWT, OAuth2, session-based auth, API keys, RBAC.', 25, [
    { title: 'Auth', url: 'https://www.youtube.com/results?search_query=Auth%20low%20level%20design' },
  ]),
  topic('sd-p3-unit-test', P3, 'Unit testing', 'JUnit/Jest, mocks, stubs, test doubles, AAA pattern.', 26, [
    { title: 'Unit testing', url: 'https://www.youtube.com/results?search_query=Unit%20testing%20low%20level%20design' },
  ]),
  topic('sd-p3-int-test', P3, 'Integration testing', 'Testing interactions between components, test databases.', 27, [
    { title: 'Integration testing', url: 'https://www.youtube.com/results?search_query=Integration%20testing%20low%20level%20design' },
  ]),
  topic('sd-p3-testable-code', P3, 'Writing testable code', 'Dependency injection, pure functions, avoiding static state.', 28, [
    { title: 'Writing testable code', url: 'https://www.youtube.com/results?search_query=Writing%20testable%20code%20low%20level%20design' },
  ]),
  topic('sd-p3-hosting', P3, 'Hosting basics', 'VMs, PaaS, serverless, containers — trade-offs.', 29, [
    { title: 'Hosting basics', url: 'https://www.youtube.com/results?search_query=Hosting%20basics%20low%20level%20design' },
  ]),
  topic('sd-p3-cicd', P3, 'CI/CD overview', 'Pipelines, build automation, test gates, deployment strategies.', 30, [
    { title: 'CI/CD overview', url: 'https://www.youtube.com/results?search_query=CI%2FCD%20overview%20low%20level%20design' },
  ]),
  topic('sd-p3-env-vars', P3, 'Env variables', '.env files, secrets management, 12-factor config.', 31, [
    { title: 'Env variables', url: 'https://www.youtube.com/results?search_query=Env%20variables%20low%20level%20design' },
  ]),
  topic('sd-p3-monitoring', P3, 'Monitoring', 'Logs, metrics, alerts, SLOs, error budgets.', 32, [
    { title: 'Monitoring', url: 'https://www.youtube.com/results?search_query=Monitoring%20low%20level%20design' },
  ]),
  // Action Items
  topic('sd-p3-task-api', P3, 'Task: Set up a Layered Architecture API', 'Build a REST API with clear Controller → Service → Repository layers.', 33, []),
  topic('sd-p3-task-tests', P3, 'Task: Write Unit and Integration Tests', 'Add test suites for a chosen service layer covering happy and error paths.', 34, []),
  topic('sd-p3-task-cicd', P3, 'Task: Setup CI/CD and deploy a basic backend', 'Configure a GitHub Actions pipeline that runs tests and deploys on merge.', 35, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// Phase 4 — Practice Problems
// ─────────────────────────────────────────────────────────────────────────────
const P4 = 'sec-sd-phase4';

export const PHASE4_TOPICS: Topic[] = [
  // Beginner & Intermediate
  topic('sd-p4-ttt', P4, 'Tic Tac Toe', 'Turn-based game, win detection, draw conditions.', 1, [
    { title: 'Tic Tac Toe', url: 'https://www.youtube.com/results?search_query=Tic%20Tac%20Toe%20low%20level%20design' },
  ]),
  topic('sd-p4-snake', P4, 'Snake & Ladder', 'Board game with snakes, ladders, multiple players, dice rolls.', 2, [
    { title: 'Snake & Ladder', url: 'https://www.youtube.com/results?search_query=Snake%20%26%20Ladder%20low%20level%20design' },
  ]),
  topic('sd-p4-vending', P4, 'Vending Machine', 'State machine with inventory, payment, change dispensing.', 3, [
    { title: 'Vending Machine', url: 'https://www.youtube.com/results?search_query=Vending%20Machine%20low%20level%20design' },
  ]),
  topic('sd-p4-atm', P4, 'ATM System', 'Card authentication, balance inquiry, withdrawal, deposit flows.', 4, [
    { title: 'ATM System', url: 'https://www.youtube.com/results?search_query=ATM%20System%20low%20level%20design' },
  ]),
  topic('sd-p4-parking', P4, 'Parking Lot', 'Multi-floor lot, vehicle types, slot allocation, fee calculation.', 5, [
    { title: 'Parking Lot', url: 'https://www.youtube.com/results?search_query=Parking%20Lot%20low%20level%20design' },
  ]),
  topic('sd-p4-splitwise', P4, 'Splitwise', 'Group expense management, split strategies, settlement algorithm.', 6, [
    { title: 'Splitwise', url: 'https://www.youtube.com/results?search_query=Splitwise%20low%20level%20design' },
  ]),
  topic('sd-p4-elevator', P4, 'Elevator System', 'Multi-elevator scheduling, floor requests, optimal dispatching.', 7, [
    { title: 'Elevator System', url: 'https://www.youtube.com/results?search_query=Elevator%20System%20low%20level%20design' },
  ]),
  topic('sd-p4-food', P4, 'Food Delivery', 'Restaurant, menu, order lifecycle, real-time delivery tracking.', 8, [
    { title: 'Food Delivery', url: 'https://www.youtube.com/results?search_query=Food%20Delivery%20low%20level%20design' },
  ]),
  topic('sd-p4-meeting', P4, 'Meeting Room Booking', 'Room availability, conflict detection, recurring bookings.', 9, [
    { title: 'Meeting Room Booking', url: 'https://www.youtube.com/results?search_query=Meeting%20Room%20Booking%20low%20level%20design' },
  ]),
  topic('sd-p4-logging', P4, 'Logging Framework', 'Log levels, appenders, formatters, async logging.', 10, [
    { title: 'Logging Framework', url: 'https://www.youtube.com/results?search_query=Logging%20Framework%20low%20level%20design' },
  ]),
  topic('sd-p4-inventory', P4, 'Inventory Management', 'Stock tracking, restocking alerts, purchase orders.', 11, [
    { title: 'Inventory Management', url: 'https://www.youtube.com/results?search_query=Inventory%20Management%20low%20level%20design' },
  ]),
  // Advanced (Product Companies)
  topic('sd-p4-rate-limiter', P4, 'Rate Limiter', 'Token bucket, sliding window, fixed window algorithms.', 12, [
    { title: 'Rate Limiter', url: 'https://www.youtube.com/results?search_query=Rate%20Limiter%20low%20level%20design' },
  ]),
  topic('sd-p4-lru-cache', P4, 'In-Memory Cache (LRU/LFU)', 'LRU with HashMap + doubly linked list, LFU with frequency map.', 13, [
    { title: 'In-Memory Cache (LRU/LFU)', url: 'https://www.youtube.com/results?search_query=In-Memory%20Cache%20%28LRU%2FLFU%29%20low%20level%20design' },
  ]),
  topic('sd-p4-ts-logger', P4, 'Thread-Safe Logger', 'Singleton logger, locks, log queue, async flush.', 14, [
    { title: 'Thread-Safe Logger', url: 'https://www.youtube.com/results?search_query=Thread-Safe%20Logger%20low%20level%20design' },
  ]),
  topic('sd-p4-url-shortener', P4, 'URL Shortener', 'Hash generation, collision handling, redirect, analytics.', 15, [
    { title: 'URL Shortener', url: 'https://www.youtube.com/results?search_query=URL%20Shortener%20low%20level%20design' },
  ]),
  topic('sd-p4-fs-design', P4, 'File System Design', 'Inode structure, directory tree, file operations, permissions.', 16, [
    { title: 'File System Design', url: 'https://www.youtube.com/results?search_query=File%20System%20Design%20low%20level%20design' },
  ]),
  topic('sd-p4-task-sched', P4, 'Task Scheduler', 'Priority queue, cron-like scheduling, retry logic.', 17, [
    { title: 'Task Scheduler', url: 'https://www.youtube.com/results?search_query=Task%20Scheduler%20low%20level%20design' },
  ]),
  topic('sd-p4-dist-lock', P4, 'Distributed Lock Manager', 'Lease-based locking, deadlock detection, Redlock.', 18, [
    { title: 'Distributed Lock Manager', url: 'https://www.youtube.com/results?search_query=Distributed%20Lock%20Manager%20low%20level%20design' },
  ]),
  topic('sd-p4-search-idx', P4, 'Search Index System', 'Inverted index, tokenization, ranking, query processing.', 19, [
    { title: 'Search Index System', url: 'https://www.youtube.com/results?search_query=Search%20Index%20System%20low%20level%20design' },
  ]),
  topic('sd-p4-chat', P4, 'Chat App', 'WebSocket, message persistence, group rooms, delivery receipts.', 20, [
    { title: 'Chat App', url: 'https://www.youtube.com/results?search_query=Chat%20App%20low%20level%20design' },
  ]),
  topic('sd-p4-api-gw', P4, 'API Gateway', 'Auth, rate limiting, routing, load balancing, request aggregation.', 21, [
    { title: 'API Gateway', url: 'https://www.youtube.com/results?search_query=API%20Gateway%20low%20level%20design' },
  ]),
  topic('sd-p4-code-editor', P4, 'Online Code Editor', 'Syntax highlighting, multi-language execution, session isolation.', 22, [
    { title: 'Online Code Editor', url: 'https://www.youtube.com/results?search_query=Online%20Code%20Editor%20low%20level%20design' },
  ]),
  topic('sd-p4-vcs', P4, 'Version Control System', 'DAG-based commit history, branching, merging, conflict resolution.', 23, [
    { title: 'Version Control System', url: 'https://www.youtube.com/results?search_query=Version%20Control%20System%20git%20version%20control' },
  ]),
  // Company-Wise: Microsoft
  topic('sd-p4-ms-text-editor', P4, 'Microsoft: Text Editor', 'Cursor, insert/delete, undo/redo with gap buffer or rope.', 24, [
    { title: 'Text Editor', url: 'https://www.youtube.com/results?search_query=Microsoft%3A%20Text%20Editor%20low%20level%20design' },
  ]),
  topic('sd-p4-ms-notif', P4, 'Microsoft: Notification System', 'Multi-channel notifications, templates, delivery tracking.', 25, [
    { title: 'Notification System', url: 'https://www.youtube.com/results?search_query=Notification%20System%20low%20level%20design' },
  ]),
  topic('sd-p4-ms-cache', P4, 'Microsoft: Cache', 'In-process cache, eviction policies, TTL, distributed caching.', 26, [
    { title: 'Cache', url: 'https://www.youtube.com/results?search_query=Cache%20low%20level%20design' },
  ]),
  topic('sd-p4-ms-task-sched', P4, 'Microsoft: Task Scheduler', 'Job scheduling with priorities, concurrency limits, monitoring.', 27, [
    { title: 'Task Scheduler', url: 'https://www.youtube.com/results?search_query=Task%20Scheduler%20low%20level%20design' },
  ]),
  // Company-Wise: Atlassian
  topic('sd-p4-atl-rate', P4, 'Atlassian: Rate Limiter', 'Multi-tenant rate limiting, sliding window, burst allowance.', 28, [
    { title: 'Rate Limiter', url: 'https://www.youtube.com/results?search_query=Atlassian%3A%20Rate%20Limiter%20low%20level%20design' },
  ]),
  topic('sd-p4-atl-concurrency', P4, 'Atlassian: Concurrency-based Systems', 'Thread pools, locks, semaphores, concurrent data structures.', 29, [
    { title: 'Concurrency-based Systems', url: 'https://www.youtube.com/results?search_query=Concurrency-based%20Systems%20low%20level%20design' },
  ]),
  // Company-Wise: Flipkart
  topic('sd-p4-fk-parking', P4, 'Flipkart: Parking Lot', 'Extended parking lot with priority lanes and EV slots.', 30, [
    { title: 'Parking Lot', url: 'https://www.youtube.com/results?search_query=Flipkart%3A%20Parking%20Lot%20low%20level%20design' },
  ]),
  topic('sd-p4-fk-payment', P4, 'Flipkart: Payment Systems', 'Payment gateway integration, idempotency, refund flows.', 31, [
    { title: 'Payment Systems', url: 'https://www.youtube.com/results?search_query=Payment%20Systems%20low%20level%20design' },
  ]),
  topic('sd-p4-fk-ext', P4, 'Flipkart: Extensibility', 'Plugin system, dynamic feature loading, backward compatibility.', 32, [
    { title: 'Extensibility', url: 'https://www.youtube.com/results?search_query=Extensibility%20low%20level%20design' },
  ]),
  // Company-Wise: Uber
  topic('sd-p4-uber-hit', P4, 'Uber: Hit Counter', 'Sliding window counter, time-bucketed hits, concurrency-safe.', 33, [
    { title: 'Hit Counter', url: 'https://www.youtube.com/results?search_query=Uber%3A%20Hit%20Counter%20low%20level%20design' },
  ]),
  topic('sd-p4-uber-tracking', P4, 'Uber: Real-time Tracking Systems', 'GPS updates, WebSocket feeds, geo-indexing, trip state machine.', 34, [
    { title: 'Real-time Tracking Systems', url: 'https://www.youtube.com/results?search_query=Real-time%20Tracking%20Systems%20low%20level%20design' },
  ]),
  // Practice Tasks
  topic('sd-p4-task-beginner', P4, 'Task: Solve 2 Beginner Problems', 'Pick any two beginner problems and implement with full OOP design.', 35, []),
  topic('sd-p4-task-intermediate', P4, 'Task: Solve 2 Intermediate Problems', 'Pick any two intermediate problems and implement with design patterns.', 36, []),
  topic('sd-p4-task-mock', P4, 'Task: Mock Interview with an Advanced Problem', 'Time-box 45 minutes, design and code an advanced problem end-to-end.', 37, []),
];

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM_DESIGN_SECTIONS — 5 phases (Phase 0–4)
// ─────────────────────────────────────────────────────────────────────────────
export const SYSTEM_DESIGN_SECTIONS: Section[] = [
  {
    id: P0,
    trackId: 'track-system-design',
    title: 'Phase 0: Preparation & Resources',
    description: 'Curated books, blogs, playlists, and starter tasks to set up your System Design study environment.',
    order: 0,
    isComingSoon: false,
    topics: PHASE0_TOPICS,
    subsections: [],
  },
  {
    id: P1,
    trackId: 'track-system-design',
    title: 'Phase 1: OOPS Foundations',
    description: 'Object-oriented programming from first principles — classes, pillars (encapsulation, inheritance, polymorphism, abstraction), and composition patterns.',
    order: 1,
    isComingSoon: false,
    topics: PHASE1_TOPICS,
    subsections: [],
  },
  {
    id: P2,
    trackId: 'track-system-design',
    title: 'Phase 2: Principles & Design Patterns',
    description: 'SOLID principles, clean code practices, UML diagrams, Gang-of-Four design patterns (Creational, Structural, Behavioral), and machine coding fundamentals.',
    order: 2,
    isComingSoon: false,
    topics: PHASE2_TOPICS,
    subsections: [],
  },
  {
    id: P3,
    trackId: 'track-system-design',
    title: 'Phase 3: Software Development Lifecycle (SDLC)',
    description: 'Agile/Scrum, Git workflows, layered backend architecture, relational database design, REST APIs, testing strategies, and CI/CD deployment.',
    order: 3,
    isComingSoon: false,
    topics: PHASE3_TOPICS,
    subsections: [],
  },
  {
    id: P4,
    trackId: 'track-system-design',
    title: 'Phase 4: Practice Problems',
    description: 'Beginner, intermediate, and advanced LLD problems including company-wise focus areas (Microsoft, Atlassian, Flipkart, Uber).',
    order: 4,
    isComingSoon: false,
    topics: PHASE4_TOPICS,
    subsections: [],
  },
];
