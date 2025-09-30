# 🤖 Multi-Agent Development System

## Overview

This project includes an automated multi-agent system that can autonomously develop features, review code, and evolve the product roadmap.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                              │
│              (Coordinates all agents)                        │
└───────┬─────────────────────────┬─────────────────┬─────────┘
        │                         │                 │
        ▼                         ▼                 ▼
┌──────────────┐         ┌──────────────┐  ┌──────────────────┐
│  CTO Agent   │────────▶│  QA Agent    │  │  PM Agent        │
│              │         │              │  │                  │
│ • Reads      │         │ • Reviews    │  │ • Analyzes       │
│   roadmap    │         │   code       │  │   completed      │
│ • Implements │         │ • Tests      │  │   features       │
│   features   │         │ • Approves/  │  │ • Suggests new   │
│ • Creates    │         │   Rejects    │  │   features       │
│   commits    │         │ • Provides   │  │ • Updates        │
│              │         │   feedback   │  │   priorities     │
└──────────────┘         └──────────────┘  └──────────────────┘
        │                         │                 │
        └─────────────┬───────────┴─────────────────┘
                      ▼
              ┌───────────────┐
              │   SUPABASE    │
              │   (Database)  │
              └───────────────┘
```

## Agents

### 1. 🎯 CTO Agent (`cto-agent.mjs`)

**Role**: Development Lead

**Responsibilities**:
- Fetches pending actions from Supabase roadmap
- Analyzes implementation requirements
- Implements features in vanilla JS
- Creates git commits with clear messages
- Updates action status in Supabase

**Usage**:
```bash
npm run agents:cto

# Or specify number of actions to process:
node .agents/cto-agent.mjs 3
```

### 2. 🧪 QA Agent (`qa-agent.mjs`)

**Role**: Quality Assurance

**Responsibilities**:
- Reviews code from recent commits
- Runs validation tests
- Checks code quality and best practices
- Identifies bugs and security issues
- Approves or rejects implementations
- Provides constructive feedback

**Usage**:
```bash
npm run agents:qa

# Or specify action ID to review:
node .agents/qa-agent.mjs <action_id>
```

### 3. 📊 PM Agent (`pm-agent.mjs`)

**Role**: Product Strategy

**Responsibilities**:
- Analyzes completed features and their impact
- Reviews QA reports and metrics
- Identifies gaps and opportunities
- Suggests new features for roadmap
- Updates priorities based on business value
- Creates new actions in Supabase

**Usage**:
```bash
npm run agents:pm
```

### 4. 🎭 Orchestrator (`orchestrator.mjs`)

**Role**: Workflow Coordinator

**Responsibilities**:
- Coordinates all agents in sequence
- Manages development cycles
- Handles retry logic for failed implementations
- Generates session reports
- Logs all activities

**Usage**:
```bash
npm run agents:start
```

## Workflow

### Development Cycle

```
1. ORCHESTRATOR starts
   ↓
2. CTO Agent picks a pending action
   ↓
3. CTO analyzes requirements
   ↓
4. CTO implements feature
   ↓
5. CTO creates git commit
   ↓
6. CTO updates status to "En curso" (80% progress)
   ↓
7. QA Agent reviews the commit
   ↓
8. QA runs validation tests
   ↓
9. QA scores the implementation (0-100)
   ↓
10. IF QA approves (score > threshold):
       → Mark action as "Completado"
       → Continue to next action
    ELSE:
       → Keep action as "En curso"
       → Log issues for revision
   ↓
11. After N cycles, PM Agent runs
   ↓
12. PM analyzes all completed features
   ↓
13. PM suggests new features
   ↓
14. PM creates new actions in Supabase
   ↓
15. PM updates priorities
   ↓
16. ORCHESTRATOR generates final report
```

## Configuration

Edit `.agents/config.json`:

```json
{
  "agents": {
    "cto": {
      "model": "claude-sonnet-4",
      "maxTokens": 8000,
      "temperature": 0.7
    },
    "qa": {
      "model": "claude-sonnet-4",
      "maxTokens": 8000,
      "temperature": 0.5
    },
    "productManager": {
      "model": "claude-sonnet-4",
      "maxTokens": 8000,
      "temperature": 0.8
    }
  },
  "workflow": {
    "cycles": 5,
    "maxIterationsPerFeature": 3,
    "autoCommit": true,
    "requireQAApproval": true,
    "pmReviewAfterCompletion": true
  }
}
```

### Key Settings:

- **cycles**: Number of development cycles to run
- **maxIterationsPerFeature**: How many times CTO can retry a failed feature
- **autoCommit**: Automatically create git commits
- **requireQAApproval**: Require QA approval before marking as complete
- **pmReviewAfterCompletion**: Run PM analysis after cycles

## Environment Setup

1. **Copy `.env.example` to `.env`**:
```bash
cp .env.example .env
```

2. **Add your API keys**:
```env
SUPABASE_URL=https://tvbqzqripcevaryquhfg.supabase.co
SUPABASE_ANON_KEY=your_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

3. **Install dependencies**:
```bash
npm install
```

## Running the System

### Full Automated Workflow

```bash
npm run agents:start
```

This will:
1. Run 5 development cycles (configurable)
2. CTO implements up to 5 features
3. QA reviews each implementation
4. PM analyzes and suggests new features
5. Generate comprehensive report

### Individual Agents

```bash
# Run CTO only (implement 1 feature)
npm run agents:cto

# Run QA only (review specific action)
npm run agents:qa <action_id>

# Run PM only (analyze and suggest)
npm run agents:pm
```

## Reports

All reports are saved in `.agents/reports/`:

### CTO Reports
- Saved implicitly in git commits

### QA Reports
- `qa-review-<action_id>-<timestamp>.json`
- Contains: score, issues, strengths, recommendations

### PM Reports
- `pm-analysis-<timestamp>.json`
- Contains: statistics, new features, priority adjustments

### Orchestrator Reports
- `orchestrator-session-<timestamp>.json`
- Contains: full session log, all cycles, summary

## Testing

Run validation tests:

```bash
npm test
```

This validates:
- HTML structure
- Supabase integration
- Authentication flow
- Realtime sync
- UI components
- Code quality

## Git Branches

- **`main`**: Production version (manual approval required)
- **`development`**: Active development (agents work here)
- **`staging`**: Testing before production (future)

## Safety Features

1. **Backup**: CTO creates `index.html.backup` before changes
2. **RLS**: Supabase Row Level Security prevents unauthorized changes
3. **Validation**: Tests run after each implementation
4. **Review**: QA reviews all code before approval
5. **Logging**: All actions logged for audit trail

## Monitoring

View real-time progress:

```bash
# Watch git log
git log --oneline --graph

# View last report
cat .agents/reports/orchestrator-session-*.json | jq .
```

## Troubleshooting

### Issue: Agent fails to connect to Supabase
**Solution**: Check `.env` file has correct credentials

### Issue: Agent fails with API error
**Solution**: Check `ANTHROPIC_API_KEY` is valid and has credits

### Issue: No pending actions found
**Solution**: Add actions via the web UI or manually in Supabase

### Issue: QA always rejects
**Solution**: Review QA reports in `.agents/reports/` for specific issues

## Future Enhancements

- [ ] Add iteration loop (CTO fixes issues from QA feedback)
- [ ] Implement A/B testing for features
- [ ] Add performance monitoring
- [ ] Create Slack/Discord notifications
- [ ] Add human approval checkpoints
- [ ] Implement rollback mechanism
- [ ] Add metrics dashboard

## Best Practices

1. **Start small**: Test with 1-2 simple actions first
2. **Review commits**: Always review what agents commit
3. **Monitor reports**: Check QA and PM reports regularly
4. **Adjust config**: Tune cycles and iterations based on results
5. **Keep backups**: Commit to git before running agents
6. **Test locally**: Use development branch, not main

## Contributing

When adding new agent capabilities:

1. Update agent file (`.agents/*.mjs`)
2. Update config schema (`.agents/config.json`)
3. Update orchestrator workflow
4. Add tests (`tests/`)
5. Update this README

## License

MIT License - See LICENSE file for details

---

**Last Updated**: September 30, 2025
**Version**: 1.0.0
**Maintainer**: Nevent Team