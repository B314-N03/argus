# Project: Global Activity Situational Dashboard Named Argus

## Overview

This project is a web-based situational awareness dashboard focused on global military-related activity using open-source intelligence (OSINT).

The purpose of the application is:

- Early recognition of activity patterns
- Trend and anomaly visualization
- Aggregated situational awareness
- Analytical exploration

This application is NOT:

- A tactical control system
- A military decision-support system
- A real-time interception or response platform

The focus is descriptive analytics, not operational action.

---

# Core Principles

## 1. Analysis Over Action

The system emphasizes:

- Indicators
- Trends
- Pattern deviations
- Regional activity scores

It must NOT:

- Provide tactical recommendations
- Suggest responses
- Optimize operational decisions
- Enable real-time targeting behavior

Language used in UI must be neutral:

- "Increased activity"
- "Deviation from baseline"
- "Elevated signal frequency"
- "Regional anomaly detected"

Avoid:

- "Threat"
- "Intercept"
- "Engage"
- "Respond"

---

# Technical Stack

## Framework

- TanStack Start
- React 19
- TypeScript (strict mode enabled)

## Styling

- SCSS (no Tailwind)
- SCSS Modules for components
- Global SCSS architecture
- Mobile-first responsive design
- Dark mode default

## State Management

- TanStack Query
- Minimal global state
- Colocated state when possible

## Architecture Style

- Feature-based modular architecture
- Small, composable components
- Strict separation of concerns
- No business logic inside page components

---

# Folder Structure Philosophy

/features

- air
- naval
- signals
- indicators

/components

- ui
- layout

/domain

- TypeScript domain models only
- No UI logic

/lib/api

- API abstraction layer
- Typed service functions

/hooks

- Reusable hooks only

/styles

- SCSS variables
- mixins
- breakpoints
- global styles

Each feature:

- Self-contained
- Has UI components
- Has hooks
- Has data access
- Has no cross-feature tight coupling

---

# Domain Models

Core domain entities:

- Aircraft
- Vessel
- SignalEvent
- ActivityIndicator
- Region

Domain layer contains:

- Types
- Interfaces
- Pure utility functions

No UI dependencies allowed inside domain.

---

# Indicator Philosophy

Indicators are statistical representations of activity over time.

Examples:

- ISR Activity Index
- Naval Presence Index
- Tanker Density Score
- Signal Activity Index

Indicators must:

- Be based on time windows
- Compare against baselines
- Express uncertainty
- Avoid deterministic claims

---

# Responsiveness Strategy

Mobile-first design.

Layout rules:

- Desktop: multi-column dashboard layout
- Tablet: reduced panels
- Mobile: stacked vertical layout

Use SCSS breakpoints via mixins.
No inline styles.
No CSS-in-JS.

---

# Code Quality Rules

- Strict TypeScript (no `any`)
- Named exports only
- Functional components only
- Components under ~120 lines
- Composition over configuration
- No monolithic files
- No implicit side effects
- Clean architecture boundaries

---

# Data Handling Philosophy

- Data is aggregated
- Delays may be applied
- Statistical interpretation preferred over exact precision
- UI must reflect uncertainty

The system visualizes patterns — it does not assert intent.

---

# Future Scalability Considerations

- Modular feature isolation
- Replaceable data sources
- API abstraction layer
- Indicator engine extensibility
- Clear domain contracts

---

# When Generating Code

Claude must:

- Respect feature boundaries
- Avoid mixing domain and UI logic
- Maintain strict typing
- Avoid tight coupling between features
- Keep components small and composable
- Prefer readability over cleverness

---
