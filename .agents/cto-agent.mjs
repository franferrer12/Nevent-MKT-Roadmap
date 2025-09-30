#!/usr/bin/env node

/**
 * CTO Agent - Development Lead
 *
 * Responsibilities:
 * - Read roadmap actions from Supabase
 * - Implement features based on priority
 * - Write clean, maintainable code
 * - Update action status and progress
 * - Create commits with clear messages
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config();

class CTOAgent {
  constructor() {
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    this.config = null;
    this.projectRoot = process.cwd();
  }

  async initialize() {
    console.log('🤖 Initializing CTO Agent...');

    // Load configuration
    const configPath = path.join(this.projectRoot, '.agents', 'config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    this.config = JSON.parse(configData);

    console.log('✅ CTO Agent initialized');
  }

  async fetchPendingActions() {
    console.log('📋 Fetching pending actions from Supabase...');

    const { data, error } = await this.supabase
      .from('roadmap_actions')
      .select('*')
      .in('status', ['Pendiente', 'En curso'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching actions:', error);
      return [];
    }

    console.log(`📊 Found ${data.length} pending actions`);
    return data;
  }

  async analyzeAction(action) {
    console.log(`\n🔍 Analyzing action: "${action.title}"`);

    const prompt = `You are a CTO analyzing a development task for the Nevent Strategic Execution Platform.

**Action Details:**
- Title: ${action.title}
- Category: ${action.category}
- Description: ${action.description || 'No description'}
- Priority: ${action.priority}
- Quarter: ${action.quarter}

**Current Project Structure:**
- Single-file HTML application (index.html)
- Vanilla JavaScript (ES6+)
- Supabase backend (PostgreSQL)
- Real-time sync via WebSockets

**Your Task:**
Analyze this action and provide:
1. **Implementation Plan**: Step-by-step approach
2. **Files to Modify**: Which files need changes
3. **Estimated Complexity**: Low/Medium/High
4. **Dependencies**: What needs to be in place first
5. **Testing Strategy**: How to validate the implementation

Respond in JSON format:
{
  "implementationPlan": "...",
  "filesToModify": ["..."],
  "complexity": "...",
  "dependencies": ["..."],
  "testingStrategy": "...",
  "readyToImplement": true/false
}`;

    const message = await this.anthropic.messages.create({
      model: this.config.agents.cto.model,
      max_tokens: this.config.agents.cto.maxTokens,
      temperature: this.config.agents.cto.temperature,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0].text;

    // Extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return null;
  }

  async implementAction(action, analysis) {
    console.log(`\n💻 Implementing: "${action.title}"`);

    // Read current index.html
    const indexPath = path.join(this.projectRoot, 'index.html');
    const currentCode = await fs.readFile(indexPath, 'utf-8');

    const prompt = `You are a CTO implementing a feature for the Nevent Strategic Execution Platform.

**Action to Implement:**
- Title: ${action.title}
- Description: ${action.description || 'No description'}
- Category: ${action.category}

**Implementation Plan:**
${analysis.implementationPlan}

**Current index.html:**
\`\`\`html
${currentCode}
\`\`\`

**Your Task:**
Implement this feature following the implementation plan.

**Requirements:**
1. Maintain the single-file architecture
2. Use vanilla JavaScript (no frameworks)
3. Follow existing code style and patterns
4. Add comments explaining your changes
5. Ensure Supabase integration is correct
6. Test real-time sync compatibility

**Response Format:**
Provide the COMPLETE updated index.html file with your implementation.
Start with: <!-- UPDATED CODE -->`;

    const message = await this.anthropic.messages.create({
      model: this.config.agents.cto.model,
      max_tokens: this.config.agents.cto.maxTokens,
      temperature: this.config.agents.cto.temperature,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0].text;

    // Extract code from response
    const codeMatch = response.match(/<!-- UPDATED CODE -->([\s\S]*)/);
    if (codeMatch) {
      const updatedCode = codeMatch[1].trim();

      // Create backup
      const backupPath = path.join(this.projectRoot, 'index.html.backup');
      await fs.writeFile(backupPath, currentCode);

      // Write new code
      await fs.writeFile(indexPath, updatedCode);

      console.log('✅ Code updated successfully');
      return true;
    }

    console.error('❌ Failed to extract updated code');
    return false;
  }

  async updateActionStatus(actionId, status, progress) {
    console.log(`📝 Updating action status: ${status} (${progress}%)`);

    const { error } = await this.supabase
      .from('roadmap_actions')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', actionId);

    if (error) {
      console.error('❌ Error updating action:', error);
      return false;
    }

    console.log('✅ Action status updated');
    return true;
  }

  async createCommit(action, analysis) {
    if (!this.config.workflow.autoCommit) {
      console.log('⏭️  Auto-commit disabled, skipping...');
      return;
    }

    console.log('📦 Creating commit...');

    try {
      execSync('git add index.html', { cwd: this.projectRoot });

      const commitMessage = `feat(${action.category.toLowerCase()}): ${action.title}

${action.description || 'No description provided'}

Priority: ${action.priority}
Quarter: ${action.quarter}
Complexity: ${analysis.complexity}

🤖 Implemented by CTO Agent`;

      execSync(`git commit -m "${commitMessage}"`, { cwd: this.projectRoot });

      console.log('✅ Commit created');
    } catch (error) {
      console.error('❌ Error creating commit:', error.message);
    }
  }

  async processAction(action) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 Processing: ${action.title}`);
    console.log(`${'='.repeat(60)}`);

    try {
      // Update status to "En curso"
      await this.updateActionStatus(action.id, 'En curso', 0);

      // Step 1: Analyze
      const analysis = await this.analyzeAction(action);
      if (!analysis || !analysis.readyToImplement) {
        console.log('⚠️  Action not ready to implement, skipping...');
        return { success: false, reason: 'Not ready to implement' };
      }

      console.log(`\n📊 Analysis Complete:`);
      console.log(`   Complexity: ${analysis.complexity}`);
      console.log(`   Files: ${analysis.filesToModify.join(', ')}`);

      // Step 2: Implement
      const implemented = await this.implementAction(action, analysis);
      if (!implemented) {
        return { success: false, reason: 'Implementation failed' };
      }

      // Step 3: Create commit
      await this.createCommit(action, analysis);

      // Step 4: Update to "Completado" (will be verified by QA)
      await this.updateActionStatus(action.id, 'En curso', 80);

      return {
        success: true,
        analysis,
        needsQA: true
      };

    } catch (error) {
      console.error('❌ Error processing action:', error);
      return { success: false, error: error.message };
    }
  }

  async run(limit = 1) {
    await this.initialize();

    const actions = await this.fetchPendingActions();

    if (actions.length === 0) {
      console.log('\n✨ No pending actions found!');
      return [];
    }

    const results = [];
    const actionsToProcess = actions.slice(0, limit);

    for (const action of actionsToProcess) {
      const result = await this.processAction(action);
      results.push({ action, result });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 CTO Agent Summary:');
    console.log(`${'='.repeat(60)}`);
    console.log(`Total actions processed: ${results.length}`);
    console.log(`Successful: ${results.filter(r => r.result.success).length}`);
    console.log(`Failed: ${results.filter(r => !r.result.success).length}`);

    return results;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const limit = parseInt(process.argv[2]) || 1;
  const agent = new CTOAgent();

  agent.run(limit)
    .then(() => {
      console.log('\n✅ CTO Agent finished');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ CTO Agent failed:', error);
      process.exit(1);
    });
}

export default CTOAgent;