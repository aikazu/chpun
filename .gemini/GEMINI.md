## Part 1: Core Principles & Directives

_This section outlines the fundamental philosophy and non-negotiable rules governing all agent operations._

### 📜 Prime Directives

1.  **Clarity and Precision:** Prioritize clear, unambiguous communication and implementation over complex or clever solutions.
2.  **Documentation-First:** Always precede implementation with documentation. Define the task, architecture, and plan before writing code.
3.  **Stateful Awareness:** Rigorously maintain and reference the project state. Every session must begin with a context review and end with a state checkpoint.
4.  **Systematic Execution:** Follow the defined workflows and protocols without deviation. Adhere strictly to all formatting and structural standards.
5.  **Proactive Validation:** Document all assumptions. Before execution, verify dependencies, environment settings, and constraints.
6.  **Checkpoint:** When sent command **checkpoint** commit to git repository.

### 🤖 AI Meta-Directives

- **Assumption Exposition**: Clearly state any assumptions made during task interpretation or implementation. Never use timestamps or dates in documentation.
- **Alternative Analysis**: When faced with a non-obvious decision, present at least two alternative options with their respective pros and cons before recommending a course of action.
- **Constraint Adherence**: Treat all documented constraints (e.g., line limits, dependencies) as hard requirements.
- **Boundary Awareness**: Structure work to fit within conversational limits. Proactively create checkpoints before complex tasks or when approaching a limit.

## Part 2: Project Documentation System

_This section defines the structure, content, and management of all project documentation. All documents, except for the root `README.md`, must reside within a `.project-doc/` directory._

### 📚 Documentation Hierarchy

1.  **Primary Documents** (Required for all projects)

    - `README.md`: The main entry point, located in the project root.
    - `.project-doc/TASK.md`: Tracks all work units.
    - `.project-doc/STATE.md`: Records session-to-session state snapshots.

2.  **Secondary Documents** (Recommended for medium/large projects)

    - `.project-doc/ARCHITECTURE.md`: Describes the system's design and data models.
    - `.project-doc/DECISIONS.md`: Logs significant technical choices and their rationale.
    - `.project-doc/CHANGELOG.md`: Chronicles version history.

3.  **Specialized Documents** (As needed)
    - `.project-doc/API-SPECS.md`: Details for API usage.
    - `.project-doc/TESTING.md`: The project's testing strategy.
    - `.project-doc/TECH-STACK.md`: A definitive list of technologies used.
    - `.project-doc/REFACTORING.md`: Tracks technical debt and refactoring plans.

### 📄 Document Specifications

#### `README.md`

- **Purpose**: To provide a concise, high-level overview of the project.
- **Constraint**: Must be kept under 500 lines.
- **Content**:
  - Project Name & a one-sentence description.
  - Problem Statement & Value Proposition.
  - Key Features (3-5 bullet points).
  - **Quick Start Guide**: Verified installation and startup commands.
  - **Architecture Overview**: A text-based diagram or link to `ARCHITECTURE.md`.
  - **Documentation Map**: Links to all other key documents.
  - **Contribution Guidelines** & **License**.

#### `TASK.md`

- **Purpose**: To manage all project tasks in a transparent, Kanban-style format.
- **Constraint**: Update at the start and end of every work session. Limit active "IN_PROGRESS" tasks to a maximum of three.
- **Structure**:
  1.  **Task Board**: A Markdown table with columns: `ID`, `Description`, `Priority`, `Status` (TODO, IN_PROGRESS, DONE), `Dependencies`, and `Progress %`.
  2.  **Active Session Focus**: A checklist for the task currently being worked on.
  3.  **Completed Task Log**: A table of finished tasks with completion notes.

#### `STATE.md`

- **Purpose**: To capture a snapshot of the project's state, enabling seamless context restoration.
- **Constraint**: Generate a new state before ending a session or tackling a major architectural change. Keep only the 3 most recent checkpoints.
- **Structure**:
  - **Checkpoint ID & Timestamp**: A unique identifier for the snapshot.
  - **Implementation Status**: A brief summary of what was accomplished.
  - **Component Progress**: A visual progress bar summary.
  - **Next Steps**: A clear, actionable list for resuming work.
  ```
  Authentication:  [███████░░░] 70%
  User Management: [██████████] 100%
  ```

#### `ARCHITECTURE.md`

- **Purpose**: To provide a detailed blueprint of the system's design.
- **Constraint**: Must be updated with every significant architectural change.
- **Content**:
  - **System Diagram**: A text/ASCII diagram showing major components and interactions.
  - **Data Model**: Descriptions of data entities and their relationships.
  - **Design Patterns**: A list of key patterns used and their rationale.
  - **Security & Performance**: Notes on critical security measures and performance considerations.

#### `DECISIONS.md`

- **Purpose**: To maintain an immutable log of key technical decisions.
- **Constraint**: Document decisions as they are made. Use the `DXXX` sequential format (e.g., `D001`, `D002`).
- **Template**:
  - **Decision `DXXX`**: {Title}
  - **Context**: The problem or situation.
  - **Options Considered**: A numbered list of options with their pros and cons.
  - **Decision**: The chosen option and justification.
  - **Consequences**: Trade-offs, risks, and future work created by this decision.

## Part 3: Development & Workflow Protocol

_This section defines the operational procedures for all development activities, from session start to task completion._

### 🔄 Session & State Protocol

1.  **Session Initiation (`!resume`)**:

    - Begin every session with a `!resume` command.
    - The agent will load context by parsing `TASK.md` and `STATE.md`.
    - The agent will declare its "Session Focus," linking to the active task ID.

2.  **Active Session Workflow**:

    - **Plan-Document-Implement**: For any given task, first document the approach in the relevant file (`ARCHITECTURE.md`, `TASK.md`), then proceed with implementation.
    - **Real-time Updates**: Update task progress in `TASK.md` as steps are completed.
    - **Live Decision Logging**: Record significant choices in `DECISIONS.md` immediately.

3.  **Session Handoff (Checkpointing)**:
    - Before finishing, generate a comprehensive checkpoint in `STATE.md`.
    - Ensure `TASK.md` accurately reflects the current progress.
    - Summarize what was completed and explicitly state the immediate next steps.

### 🧩 Task Management Protocol

1.  **Task Definition**: All work must be defined as a task in `TASK.md` before starting. Tasks must include:
    - A clear **Goal**.
    - **Priority** (HIGH, MEDIUM, LOW).
    - **Acceptance Criteria** (3-5 measurable outcomes).
2.  **Task Breakdown**:
    - Break down complex tasks (>1 session) into subtasks.
    - Subtasks can be managed within the parent task's description or as specialized `SUBTASK-{ID}.md` files for highly complex components.
3.  **Dependency Management**: Clearly link tasks with dependencies. Do not start a task until its dependencies are marked as `DONE`.

## Part 4: Technical & Style Standards

_This section provides specific, enforceable standards for all code, assets, and diagrams._

### 📏 Code & Environment Standards

- **Code Modularity**: Files should not exceed 500 lines. Functions should be under 50 lines with a maximum of 3 nesting levels.
- **Dependencies**: Always use the latest stable versions of dependencies, tools, and binaries unless explicitly specified otherwise.
- **Environment**: Define the complete development environment in `TECH-STACK.md`, ensuring it is reproducible.
- **Error Handling**: Implement consistent, predictable error-handling patterns across the entire codebase.

### 📊 Visualization Standards

- **Diagrams**: All diagrams (architecture, flowcharts, entity relationships) **must** be rendered in text-based ASCII or Unicode. No binary images.
- **Progress Tracking**: Use standardized visual markers.
  - **Component Progress**: `Component: [████░░░░░░] 40%`
  - **Task Status Icons**: `T001 ✓ | T002 🚧 | T003 ❌` (Done | In Progress | Blocked)
