# SQL Query Runner

## Introduction

A web-based SQL query editor and results viewer that lets you run queries and explore data with a smooth, responsive interface. Hi, I'm Eshan Tripathi, a Frontend engineer who's making this project for Atlan's Interview challenge task.

## Walkthrough

Attaching my video walkthrough over here, sorry it went approx 4 mins, rusty editing skills I guess.

https://github.com/user-attachments/assets/4fab14f1-0305-43dd-8102-ede8d485d796


## Implementation Details

### Framework and Libraries Installed

I chose React with Vite as the build tool for this project. Vite has been an absolute game-changer for development experience. Its build time is blazing fast compared to traditional bundlers, and the Hot Module Replacement (HMR) is nearly instantaneous, which means I can see changes in real-time without any noticeable lag. The production builds are also highly optimized out of the box, making deployment smooth and efficient.

For the UI and functionality, I've installed several libraries that you'll see referenced throughout the project. The main ones include `@uiw/react-textarea-code-editor` for the SQL editor, `@tanstack/react-virtual` for virtualizing large tables, `react-resizable-panels` for the split view layout, `react-hotkeys-hook` for keyboard shortcuts, Radix UI components (`@radix-ui/*`) for accessible UI primitives, TailwindCSS v4 for styling, and `papaparse` for CSV parsing and export. In the subsequent sections, I've detailed which libraries are used for which specific components and features.

### Data Source

I initially thought of using csvs from Northwind dataset, and they're present in the project directory too, but then loading csvs would have been a headache, since they'll be downloaded on the client, and so I thought of mocking backend response. For the implementation you can check `src/data/mockData.ts`. I created this file to simulate query execution by parsing basic SQL patterns and returning predefined datasets, which makes the app feel real without needing an actual backend.

### Local Setup

Make sure you have Node 22 installed, then:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Main Features

**Query Editor**
SQL code editor with syntax highlighting and formatting. Built with `@uiw/react-textarea-code-editor`.
Files: `src/components/QueryEditor.tsx`

**Results Table**
Interactive table with pagination, sorting, column filtering, and column visibility toggles. Uses `@tanstack/react-virtual` for efficient rendering of large datasets.
Files: `src/components/ResultsTable.tsx`

**Data Export**
Export query results as CSV, JSON, or copy to clipboard. Powered by `papaparse` for CSV generation.
Files: `src/components/ResultsTable.tsx`

**Query History**
Automatically tracks all executed queries with timestamps and execution stats, grouped by date.
Files: `src/components/QueryHistory.tsx`

**Saved Queries**
Save frequently used queries to localStorage with names and descriptions.
Files: `src/utils/localStorage.ts`, `src/components/AppSidebar.tsx`

**Database Explorer**
Sidebar showing available databases and tables. Click any table to generate a SELECT query.
Files: `src/components/DatabaseTree.tsx`, `src/components/AppSidebar.tsx`

**Multiple Tabs**
Work on multiple queries simultaneously with a tabbed interface.
Files: `src/components/QueryTabList.tsx`, `src/components/NormalTabView.tsx`

**Split View**
Side-by-side query editing and comparison using `react-resizable-panels`.
Files: `src/components/SplitViewLayout.tsx`

**Keyboard Shortcuts**
Run queries (Cmd/Ctrl+Enter), manage tabs (Alt+N, Alt+W), navigate (Cmd/Ctrl+Shift+[/]), and more. Implemented with `react-hotkeys-hook`.
Files: `src/App.tsx`, `src/components/KeyboardShortcutsHelp.tsx`

**Responsive Design**
Mobile-friendly layout with collapsible sidebar and touch-optimized controls.
Files: `src/components/HeaderBar.tsx`, `src/App.tsx`

**UI Components**
Custom component library built on top of Radix UI primitives with TailwindCSS v4.
Files: `src/components/ui/`

## Optimizations

Page Load Metrics for the project, measured using `lighthouse` utility-
 - LCP -> 0.9s
 - FCP -> 0.6s
Other Metrics-
<img width="571" height="242" alt="Screenshot 2025-11-30 182256" src="https://github.com/user-attachments/assets/3c1c4d42-43c3-42be-b964-5d8eda8bafbf" />

I used Claude Sonnet 4.5 to help optimize both the build process and SEO for this project.

**Build Optimizations** (vite.config.ts):
I configured manual code splitting to break the bundle into focused chunks (react-core, ui-framework, layout-utils, data-processing, code-editor) which allows parallel loading and better caching. Also set up Terser minification to strip out console logs and debugger statements in production, plus configured dependency pre-bundling and server warmup for faster dev experience.

**SEO Optimizations**:
Added comprehensive meta tags including Open Graph and Twitter cards for better social sharing, implemented JSON-LD structured data for search engines, created robots.txt and sitemap.xml for better crawlability, added a PWA manifest for progressive web app capabilities, and set up canonical URLs to avoid duplicate content issues. These changes boosted the Lighthouse SEO score significantly.

## AI Usage

I used Claude Sonnet 4.5 to generate boilerplate code for components and UI primitives, write utility functions like localStorage management and data formatting, create the mock data structure and query execution logic, and optimize both the build configuration and SEO setup.

