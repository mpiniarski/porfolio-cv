AGENTS

Guidance for AI assistants working on this project.

Tech stack and libraries

- Framework: Next.js with TypeScript (App Router preferred).
- Styling: Tailwind CSS.
- UI components: `shadcn/ui`, installed and configured following the latest official docs for the current Next.js/Tailwind versions.
- Dependencies: Prefer recent stable versions, based on up-to-date documentation.

Data source

- All resume and portfolio content must come from `data.yml` in the project root.
- Both:
  - The static website (portfolio pages).
  - The resume page (`/resume`), which will be printed to PDF.
  must derive their content from `data.yml`. Do not duplicate this data in code.

Website vs resume

- For now, assume that all information present in `data.yml` appears both:
  - On the portfolio website.
  - On the resume page.
- The website and resume can use different layouts and styling, but they should be driven by the same data structures.

Internationalization

- Current implementation is English-only.
- When evolving the data model or components, avoid design choices that make adding more languages later unnecessarily difficult (e.g. hard-coding English assumptions where a more general shape would work just as well).

Code style and comments

- Use idiomatic, modern TypeScript and React.
- Keep comments minimal:
  - Only add comments when strictly necessary to explain non-obvious logic, constraints, or custom solutions.
  - Do not add comments that restate what well-written code already makes clear.

Architecture hints

- Separate concerns:
  - Data loading and mapping from `data.yml` (e.g. in `lib/`).
  - Presentational UI components (e.g. in `components/`).
  - Page-level composition and routing (e.g. in `app/`).
- Ensure that both `/` and `/resume` reuse shared data-loading logic and, where appropriate, shared UI components.

PDF generation

- There is no build-time PDF generation in this project.
- The recommended workflow is:
  - Visit `/resume` in a browser.
  - Use the print dialog (or a “Print” button calling `window.print()`) to save a PDF.
