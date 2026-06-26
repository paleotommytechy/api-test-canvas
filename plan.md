# Plan: API Playground Generator

A production-ready application that converts API documentation (Swagger, OpenAPI, Postman) into an interactive testing playground using AI.

## Scope Summary
- **Input:** Swagger/OpenAPI (JSON/YAML), Postman Collections, Raw Text, or URL.
- **AI Processing:** Analyze endpoints, detect auth, generate descriptions, sample requests, responses, and code snippets (cURL, Python, JS, TS, Java).
- **Interface:** Interactive testing UI with parameter inputs, auth switching, environment variables, and Monaco Editor for code/JSON.
- **Visuals:** React Flow for API dependency visualization.
- **Non-Goals:** Real-world server-side persistence (Database/Redis/Node.js) as per current environment constraints. Data will be handled in-memory or via localStorage for the demo/prototype phase.

## Assumptions & Open Questions
- **AI:** Will use OpenAI API for documentation analysis and code generation. Requires an API key from the user or a placeholder.
- **Persistence:** Since I cannot use a backend (PostgreSQL/Node/Redis), I will implement a robust frontend-only version where state is managed via React context/hooks and persisted in `localStorage`.
- **Parsing:** Will use `@apidevtools/swagger-parser` and `postman-collection` libraries.

## Affected Areas
- **Frontend Components:**
  - `DocumentUploader`: Handles file/text/URL input.
  - `Playground`: The main testing interface.
  - `Sidebar`: Endpoint navigation and search.
  - `CodeSnippets`: Monaco-based code generation display.
  - `FlowDiagram`: React Flow visualization of API structure.
- **State Management:**
  - `useApiStore`: Global state for parsed endpoints, environments, and history.
- **Services:**
  - `aiService`: Logic for OpenAI prompting and response parsing.
  - `parserService`: Logic for converting various formats into a unified internal representation.

## Ordered Phases

### Phase 1: Foundation & Core UI
- Setup project structure and install dependencies.
- Implement the basic layout (Sidebar, Main Content, Top Bar).
- **Owner:** `frontend_engineer`

### Phase 2: Parsing & Internal Schema
- Integrate `swagger-parser` and `postman-collection`.
- Create a unified internal schema for endpoints (Method, Path, Params, Body, Auth).
- Implement the Upload/Paste interface.
- **Owner:** `frontend_engineer`

### Phase 3: AI Integration & Enrichment
- Implement `aiService` to communicate with OpenAI.
- Create prompts for endpoint explanation and code snippet generation.
- Add "AI Chat" for endpoint-specific questions.
- **Owner:** `frontend_engineer`

### Phase 4: Interactive Playground
- Build the request builder (params, headers, body).
- Implement the request execution engine (client-side `fetch`).
- Integrate Monaco Editor for JSON request/response bodies.
- Add environment variable management.
- **Owner:** `frontend_engineer`

### Phase 5: Visualization & UX Polish
- Implement the API Flow diagram using `react-flow`.
- Add Dark Mode support and responsive refinements.
- Final UI/UX polish (Loading states, error explanations).
- **Owner:** `frontend_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Setup dependencies and project structure.
2. frontend_engineer — Implement parsing logic and UI.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4, 5
- **Scope:** Build the entire interactive frontend.
- **Files:**
  - `src/App.tsx` (Main layout)
  - `src/components/playground/*` (UI components)
  - `src/services/parser.ts` (Logic for OpenAPI/Postman)
  - `src/services/ai.ts` (OpenAI integration)
  - `src/store/useApiStore.ts` (Zustand/Context state)
- **Depends on:** none
- **Acceptance criteria:**
  - Can upload a Swagger JSON and see list of endpoints.
  - Can click an endpoint to see generated documentation and testing UI.
  - Can "Send Request" (browser-permitting) and see response.
  - Code snippets (JS/Python/etc) are visible and correct.
  - Flow diagram displays endpoint relationships.

**Do not dispatch:**
- supabase_engineer (No database access in this session)
- quick_fix_engineer (Frontend handles all logic and UI)
