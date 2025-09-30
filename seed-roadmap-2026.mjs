#!/usr/bin/env node
/**
 * Seed Roadmap 2026 - Populate roadmap_actions with Unified Roadmap
 * Based on: UNIFIED_ROADMAP_2026.md
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tvbqzqripcevaryquhfg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2YnF6cXJpcGNldmFyeXF1aGZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE1MjgzMSwiZXhwIjoyMDc0NzI4ODMxfQ.tzOzwRMe9lzKvEDZpy7-mzL4p4LqqVGCZvZF3j9lDxw';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

console.log('🚀 Seeding Roadmap 2026 Actions...\n');

// ============================================================================
// ROADMAP ACTIONS DATA
// ============================================================================

const roadmapActions = [
  // Q4 2025: Current Sprint (Already exists, but adding missing ones)
  {
    quarter: 'Q4 2025',
    category: 'Security & UX',
    title: 'Sprint 1: Security Fixes (v3.0.1) ✅',
    description: 'XSS protection with DOMPurify, loading states on 6 functions, database query fixes (status → is_active), onboarding flow, metric tooltips. Security: 6/10 → 8.5/10, UX: 5.6/10 → 7.5/10',
    priority: 'Alta',
    status: 'Completado',
    responsable: 'CTO Team',
    deadline: '2025-09-30',
    initiative_id: null,
    subtasks: [
      { id: 'st1', text: 'XSS Protection (DOMPurify)', completed: true },
      { id: 'st2', text: 'Loading States (6 functions)', completed: true },
      { id: 'st3', text: 'Database Query Fixes', completed: true },
      { id: 'st4', text: 'Onboarding Flow', completed: true },
      { id: 'st5', text: 'Metric Tooltips', completed: true }
    ]
  },
  {
    quarter: 'Q4 2025',
    category: 'Accessibility',
    title: 'Sprint 2: Accessibility (v3.1.0)',
    description: 'WCAG 2.1 AA compliance: color contrast fixes (4.5:1 ratio), keyboard navigation for all interfaces, screen reader support with ARIA labels, focus indicators. Target: Lighthouse score 70 → 95+',
    priority: 'Alta',
    status: 'En Progreso',
    responsable: 'Frontend Team',
    deadline: '2025-11-15',
    initiative_id: null,
    subtasks: [
      { id: 'st6', text: 'Color Contrast Audit & Fixes (12h)', completed: false },
      { id: 'st7', text: 'Keyboard Navigation (6h)', completed: false },
      { id: 'st8', text: 'Screen Reader Support (4h)', completed: false },
      { id: 'st9', text: 'Accessibility Testing (3h)', completed: false }
    ]
  },

  // Q1 2026: MARKETING FOUNDATION
  {
    quarter: 'Q1 2026',
    category: 'Marketing Hub',
    title: 'Sprint 3: Campaign Management (v3.2.0)',
    description: 'Campaign CRUD with budget tracking, ROI calculator, team assignment, link campaigns to OKRs. Target: 25+ campaigns in first month, budget accuracy 95%, creation time <5 min',
    priority: 'Alta',
    status: 'Pendiente',
    responsable: 'Product Team',
    deadline: '2026-02-15',
    initiative_id: null,
    subtasks: [
      { id: 'st10', text: 'Database schema (campaigns, campaign_team)', completed: false },
      { id: 'st11', text: 'Campaign creation wizard', completed: false },
      { id: 'st12', text: 'Budget tracking (allocated vs spent)', completed: false },
      { id: 'st13', text: 'ROI calculator', completed: false },
      { id: 'st14', text: 'Team assignment & permissions', completed: false }
    ]
  },
  {
    quarter: 'Q1 2026',
    category: 'Marketing Hub',
    title: 'Sprint 4: Content Calendar (v3.3.0)',
    description: 'Multi-channel calendar (Blog, Social, Email, Ads) with FullCalendar.js, drag & drop scheduling, approval workflows, status tracking (Idea → Published). Target: 200+ items/quarter, approval time <24h',
    priority: 'Alta',
    status: 'Pendiente',
    responsable: 'Product Team',
    deadline: '2026-03-15',
    initiative_id: null,
    subtasks: [
      { id: 'st15', text: 'Database schema (content_items, approvals)', completed: false },
      { id: 'st16', text: 'FullCalendar.js integration', completed: false },
      { id: 'st17', text: 'Drag & drop scheduling', completed: false },
      { id: 'st18', text: 'Approval workflow engine', completed: false },
      { id: 'st19', text: 'Rich text editor (Tiptap)', completed: false }
    ]
  },
  {
    quarter: 'Q1 2026',
    category: 'Marketing Hub',
    title: 'Sprint 5: Budget Dashboard (v3.4.0)',
    description: 'Real-time budget tracking with Chart.js visualizations, breakdown by campaign/channel, budget burn rate, alerts at 80% threshold, CSV export. Target: Budget visibility 95%, variance <5%',
    priority: 'Media',
    status: 'Pendiente',
    responsable: 'Analytics Team',
    deadline: '2026-03-31',
    initiative_id: null,
    subtasks: [
      { id: 'st20', text: 'Budget aggregation API', completed: false },
      { id: 'st21', text: 'Chart.js charts (bar, line, pie)', completed: false },
      { id: 'st22', text: 'Budget alerts system', completed: false },
      { id: 'st23', text: 'CSV export functionality', completed: false }
    ]
  },

  // Q2 2026: AGILE PROJECT MANAGEMENT
  {
    quarter: 'Q2 2026',
    category: 'Agile PM',
    title: 'Sprint 6: Kanban Boards (v3.5.0)',
    description: 'Kanban board with SortableJS drag & drop, customizable columns, WIP limits, swim lanes (by priority/assignee), quick actions on cards. Target: 80%+ daily usage, WIP compliance 90%',
    priority: 'Alta',
    status: 'Pendiente',
    responsable: 'Engineering Team',
    deadline: '2026-05-15',
    initiative_id: null,
    subtasks: [
      { id: 'st24', text: 'Database schema (boards, columns, views)', completed: false },
      { id: 'st25', text: 'SortableJS drag & drop', completed: false },
      { id: 'st26', text: 'WIP limits with alerts', completed: false },
      { id: 'st27', text: 'Swim lanes (group by criteria)', completed: false },
      { id: 'st28', text: 'Quick actions (edit, assign, deadline)', completed: false }
    ]
  },
  {
    quarter: 'Q2 2026',
    category: 'Agile PM',
    title: 'Sprint 7: Sprint Management (v3.6.0)',
    description: 'Sprint planning with capacity tracking, drag from backlog, sprint board view, retrospectives with voting, planning poker. Target: 80%+ sprint completion, velocity tracking 100%',
    priority: 'Alta',
    status: 'Pendiente',
    responsable: 'Engineering Team',
    deadline: '2026-06-15',
    initiative_id: null,
    subtasks: [
      { id: 'st29', text: 'Database schema (sprints, retrospectives)', completed: false },
      { id: 'st30', text: 'Sprint creation & planning', completed: false },
      { id: 'st31', text: 'Capacity tracking (story points)', completed: false },
      { id: 'st32', text: 'Retrospective tool with voting', completed: false },
      { id: 'st33', text: 'Planning poker session', completed: false }
    ]
  },
  {
    quarter: 'Q2 2026',
    category: 'Agile PM',
    title: 'Sprint 8: Intelligent Backlog (v3.7.0)',
    description: 'Auto-prioritization algorithm (deadline, OKR impact, effort, dependencies), daily recommendations panel, backlog scoring 0-100, refinement sessions. Target: 85%+ accuracy, 70%+ recommendations accepted',
    priority: 'Media',
    status: 'Pendiente',
    responsable: 'Product Team',
    deadline: '2026-06-30',
    initiative_id: null,
    subtasks: [
      { id: 'st34', text: 'Priority scoring algorithm', completed: false },
      { id: 'st35', text: 'Daily recommendations engine', completed: false },
      { id: 'st36', text: 'Refinement session tool', completed: false },
      { id: 'st37', text: 'Quality checklist', completed: false }
    ]
  },

  // Q3 2026: WORKFLOWS & VISUALIZATION
  {
    quarter: 'Q3 2026',
    category: 'Workflows',
    title: 'Sprint 9: Custom Workflows (v3.8.0)',
    description: 'Visual workflow editor with drag & drop states, custom transitions with conditions, automation rules (notify, update, create), department templates (Marketing, Dev, CS, Product). Target: 10+ workflows/dept',
    priority: 'Media',
    status: 'Pendiente',
    responsable: 'Product Team',
    deadline: '2026-08-15',
    initiative_id: null,
    subtasks: [
      { id: 'st38', text: 'Database schema (workflows)', completed: false },
      { id: 'st39', text: 'Visual workflow editor', completed: false },
      { id: 'st40', text: 'Transition conditions & validations', completed: false },
      { id: 'st41', text: 'Automation rules engine', completed: false },
      { id: 'st42', text: 'Department workflow templates', completed: false }
    ]
  },
  {
    quarter: 'Q3 2026',
    category: 'Visualization',
    title: 'Sprint 10: Dependency Graphs (v4.0.0) 🎉',
    description: 'Interactive dependency graph with Cytoscape.js, visual dependency management, cycle detection, critical path calculation, blocker alerts. Target: 100% dependency visibility, <1 day blocker identification',
    priority: 'Media',
    status: 'Pendiente',
    responsable: 'Engineering Team',
    deadline: '2026-09-15',
    initiative_id: null,
    subtasks: [
      { id: 'st43', text: 'Database updates (blocks, blocked_by)', completed: false },
      { id: 'st44', text: 'Cytoscape.js integration', completed: false },
      { id: 'st45', text: 'Cycle detection algorithm', completed: false },
      { id: 'st46', text: 'Critical path calculation', completed: false },
      { id: 'st47', text: 'Visual blocker alerts', completed: false }
    ]
  },
  {
    quarter: 'Q3 2026',
    category: 'Analytics',
    title: 'Sprint 11: Charts & Analytics (v4.1.0)',
    description: 'Burndown/burnup charts with ApexCharts, velocity charts, daily snapshots automation, cycle time & lead time tracking. Target: 5x daily usage, 85%+ planning accuracy, 40% predictability improvement',
    priority: 'Baja',
    status: 'Pendiente',
    responsable: 'Analytics Team',
    deadline: '2026-09-30',
    initiative_id: null,
    subtasks: [
      { id: 'st48', text: 'Database (sprint_daily_snapshots)', completed: false },
      { id: 'st49', text: 'ApexCharts burndown/burnup', completed: false },
      { id: 'st50', text: 'Velocity charts', completed: false },
      { id: 'st51', text: 'Automated daily snapshots', completed: false }
    ]
  },

  // Q4 2026: INTEGRATIONS & AI
  {
    quarter: 'Q4 2026',
    category: 'Integrations',
    title: 'Sprint 12: Integrations Hub (v4.2.0)',
    description: 'Integrate Google Analytics, Meta Ads, Google Ads, HubSpot, Slack notifications, Zapier webhooks. Target: 5+ integrations live, 6h sync frequency, <10 min setup time',
    priority: 'Media',
    status: 'Pendiente',
    responsable: 'Integration Team',
    deadline: '2026-11-15',
    initiative_id: null,
    subtasks: [
      { id: 'st52', text: 'Integration framework architecture', completed: false },
      { id: 'st53', text: 'Google Analytics connector', completed: false },
      { id: 'st54', text: 'Meta Ads + Google Ads APIs', completed: false },
      { id: 'st55', text: 'HubSpot integration', completed: false },
      { id: 'st56', text: 'Slack notifications + Zapier', completed: false }
    ]
  },
  {
    quarter: 'Q4 2026',
    category: 'AI & ML',
    title: 'Sprint 13: AI-Powered Insights (v4.3.0)',
    description: 'Campaign performance predictions, budget optimization suggestions, content topic recommendations with OpenAI, anomaly detection (traffic drops, spend spikes). Target: 60%+ AI suggestions accepted',
    priority: 'Baja',
    status: 'Pendiente',
    responsable: 'AI Team',
    deadline: '2026-12-01',
    initiative_id: null,
    subtasks: [
      { id: 'st57', text: 'OpenAI API integration', completed: false },
      { id: 'st58', text: 'Content idea generator', completed: false },
      { id: 'st59', text: 'Campaign predictions model', completed: false },
      { id: 'st60', text: 'Anomaly detection engine', completed: false }
    ]
  },
  {
    quarter: 'Q4 2026',
    category: 'UX & Performance',
    title: 'Sprint 14: Advanced Features (v4.4.0)',
    description: 'Keyboard shortcuts (Ctrl+K, G+D, etc.), dark mode, offline mode with Service Worker, mobile optimization, performance optimization (<2s load time). Target: 40%+ shortcuts adoption, <2s load',
    priority: 'Baja',
    status: 'Pendiente',
    responsable: 'UX Team',
    deadline: '2026-12-20',
    initiative_id: null,
    subtasks: [
      { id: 'st61', text: 'Keyboard shortcuts system', completed: false },
      { id: 'st62', text: 'Dark mode CSS variables', completed: false },
      { id: 'st63', text: 'Service Worker (offline)', completed: false },
      { id: 'st64', text: 'Mobile responsive optimization', completed: false },
      { id: 'st65', text: 'Performance tuning (<2s)', completed: false }
    ]
  }
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

async function seedRoadmap() {
  console.log('📋 Preparing to seed roadmap with', roadmapActions.length, 'actions...\n');

  // Optional: Clear existing data (comment out if you want to keep existing)
  console.log('🗑️  Clearing existing roadmap actions...');
  const { error: deleteError } = await supabase
    .from('roadmap_actions')
    .delete()
    .neq('id', 'dummy'); // Delete all

  if (deleteError) {
    console.log('⚠️  Note: Could not clear existing data (might be first run)');
  } else {
    console.log('✅ Cleared existing roadmap\n');
  }

  // Insert new actions
  let successCount = 0;
  let errorCount = 0;

  for (const action of roadmapActions) {
    try {
      const actionData = {
        id: generateId(),
        category: action.category,
        title: action.title,
        description: action.description,
        priority: action.priority,
        status: action.status,
        responsable: action.responsable,
        deadline: action.deadline,
        quarter: action.quarter,
        subtasks: action.subtasks || []
      };

      const { data, error } = await supabase
        .from('roadmap_actions')
        .insert(actionData);

      if (error) throw error;

      successCount++;
      console.log(`✅ [${action.quarter}] ${action.title.substring(0, 60)}...`);

    } catch (error) {
      errorCount++;
      console.log(`❌ [${action.quarter}] Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SEED SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Success: ${successCount} actions`);
  console.log(`❌ Errors: ${errorCount} actions`);
  console.log(`📦 Total: ${roadmapActions.length} actions`);
  console.log('='.repeat(60));

  if (successCount > 0) {
    console.log('\n🎉 Roadmap seeded successfully!');
    console.log('🔗 View at: https://franferrer12.github.io/Nevent-MKT-Roadmap/');
  }
}

function generateId() {
  return 'action_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================================================
// RUN
// ============================================================================

seedRoadmap()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
