              Event-Driven Lead Scoring System

OVERVIEW

The Event-Driven Lead Scoring System is a real-time, scalable application designed to evaluate and rank sales leads based on their interactions across multiple touchpoints. The system ingests behavioral and transactional events—such as page views, email opens, form submissions, demo requests, and purchases—and dynamically recalculates lead scores as events occur. By adopting an event-driven architecture, the platform ensures that scoring logic remains decoupled, responsive, and extensible as new event sources or scoring rules are introduced.

The application is built to handle high-volume, asynchronous event streams originating from different sources, including webhooks, REST APIs, and batch file uploads. To maintain accuracy and consistency, the system enforces event ordering and idempotency, ensuring that out-of-order or duplicate events do not corrupt lead scores. Each event is uniquely identified and validated before processing, and score updates are computed in a controlled, deterministic manner.

A key feature of the system is transparency and traceability. Every score change is recorded with contextual metadata, allowing users to view a complete history of how and why a lead’s score evolved over time. The frontend provides real-time visibility into score updates, trend visualizations, event timelines, and lead rankings, enabling sales and marketing teams to prioritize outreach effectively. By combining real-time processing, configurable scoring rules, and rich historical insights, this project demonstrates a production-ready approach to building event-driven systems that are resilient, auditable, and easy to evolve.

OBJECTIVES

1. Implement event-driven architecture for lead scoring
2. Handle events from multiple sources (webhooks, API, file uploads)
3. Ensure event ordering and idempotency
4. Real-time score recalculation without blocking operations
5. Display lead score history and trend visualization

TECHNICAL REQUIREMENTS

Backend (Node.js):
- Event ingestion endpoints:
  * Webhook endpoint for external services
  * REST API for manual event submission
  * Batch upload endpoint (CSV/JSON file)
- Event processing queue (Bull/Agenda) for async processing
- Lead scoring engine with configurable rules:
  * Email open: +10 points
  * Page view: +5 points
  * Form submission: +20 points
  * Demo request: +50 points
  * Purchase: +100 points
  * (Allow configuration of these rules)
- Idempotency handling (prevent duplicate event processing)
- Event ordering mechanism (handle out-of-order events)
- Real-time score updates via WebSockets
- API endpoints for:
  * Lead CRUD operations
  * Event submission
  * Score retrieval and history
  * Scoring rules configuration
  * Lead leaderboard (top scored leads)

Frontend (React):
- Lead management dashboard:
  * List of leads with current scores
  * Lead detail view with score history
  * Score trend chart (line graph over time)
  * Event timeline for each lead
- Event submission form (manual entry)
- File upload for batch events
- Scoring rules configuration UI
- Real-time score updates
- Filters and search (by score range, lead status, etc.)
- Leaderboard view (top N leads)

Database (MongoDB):
- Collections for:
  * Leads (name, email, company, current_score, status)
  * Events (event_type, lead_id, timestamp, metadata, processed)
  * Score history (lead_id, score, timestamp, reason)
  * Scoring rules (event_type, points, active)
- Indexes for efficient queries
- Schema design for event deduplication

SCORING ALGORITHM REQUIREMENTS

- Configurable scoring rules (stored in database)
- Maximum score cap (e.g., 1000 points)
- Score recalculation on every new event
- Maintain score history for audit trail


EVALUATION CRITERIA

- Event processing architecture (30%)
- Scoring algorithm correctness (25%)
- Idempotency and ordering (20%)
- Code quality and error handling (15%)
- UI/UX design (10%)

BONUS POINTS

- Unit tests for scoring algorithm
- Integration tests for event processing
- Advanced scoring features (negative scores, time-based decay)
- Event replay functionality
- Analytics on event patterns
- Export functionality (leads, events, scores)
- Webhook signature verification
- Event schema validation


NOTES

- Focus on demonstrating event-driven architecture understanding
- We're interested in how you handle idempotency and ordering
- You can use mock/sample events for testing
- If you can't handle true out-of-order events, explain your approach
- Scoring rules should be configurable, not hardcoded

