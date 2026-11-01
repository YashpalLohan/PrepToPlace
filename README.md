# PrepToPlace – Personal Learning & Notes Tracker

PrepToPlace is a personal learning management and placement preparation platform built with React, TypeScript, Tailwind CSS, Lucide icons, Recharts, and Firebase.

## Key Features

1. **6 Primary Learning Tracks**:
   - DSA Track (`/tracks/dsa`)
   - Development Track (`/tracks/development`)
   - AI / ML Track (`/tracks/ai-ml`)
   - System Design Track (`/tracks/system-design`)
   - DevOps Track (`/tracks/devops`)
   - Core Subjects Track (`/tracks/core-subjects`)

2. **Unlimited Nested Hierarchy**:
   - `Track -> Sections -> Subsections -> Topics -> Notes`
   - Supports "Coming Soon" sections (visually disabled placeholder state).
   - Dynamic CRUD for sections, sub-sections, and topics.
   - Clean empty states: "No topics added yet", "Your notes will appear here".

3. **Dedicated Topic Notes System**:
   - Reading Mode: Distraction-free review.
   - Editing Mode: Markdown notes, bullet lists, code formatting.
   - Important concepts and key takeaways list.
   - Handwritten notes and diagram upload support with preview, captions, and removal.
   - Related topic tags.

4. **Personal Learning & Streak Tracker**:
   - Topic statuses: `Not Started`, `In Progress`, `Completed`, `Needs Revision`.
   - Day-wise activity log: track, topic, duration, topics cleared, personal remarks.
   - Learning Calendar: heatmap with visual indicators for targets met and partial study days.

5. **Dynamic Dashboard**:
   - Dynamic mastery percentage calculated across database records.
   - Current and longest streak tracker.
   - Total hours dedicated.
   - Daily target progress bar.
   - Weekly study minutes interactive bar chart.

6. **Global Search**:
   - Search across tracks, sections, topics, and markdown notes with direct jump links.

## Quick Start (Frontend)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

