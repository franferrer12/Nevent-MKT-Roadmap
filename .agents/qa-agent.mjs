#!/usr/bin/env node

/**
 * QA Agent - Quality Assurance
 *
 * Responsibilities:
 * - Review code quality and standards
 * - Test functionality
 * - Identify bugs and issues
 * - Provide constructive feedback
 * - Approve or reject changes
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config();

class QAAgent {
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
    console.log('🧪 Initializing QA Agent...');

    const configPath = path.join(this.projectRoot, '.agents', 'config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    this.config = JSON.parse(configData);

    console.log('✅ QA Agent initialized');
  }

  async getLastCommit() {
    try {
      const diff = execSync('git diff HEAD~1 HEAD index.html', {
        cwd: this.projectRoot,
        encoding: 'utf-8'
      });

      const commitMsg = execSync('git log -1 --pretty=%B', {
        cwd: this.projectRoot,
        encoding: 'utf-8'
      });

      return { diff, commitMsg };
    } catch (error) {
      console.error('❌ Error getting last commit:', error.message);
      return null;
    }
  }

  async reviewCode(action, diff, commitMsg) {
    console.log(`\n🔍 Reviewing code for: "${action.title}"`);

    const indexPath = path.join(this.projectRoot, 'index.html');
    const currentCode = await fs.readFile(indexPath, 'utf-8');

    const prompt = `You are a Senior QA Engineer reviewing code for the Nevent Strategic Execution Platform.

**Action Implemented:**
- Title: ${action.title}
- Category: ${action.category}
- Description: ${action.description || 'No description'}

**Commit Message:**
${commitMsg}

**Code Diff:**
\`\`\`diff
${diff}
\`\`\`

**Current Full Code:**
\`\`\`html
${currentCode}
\`\`\`

**Your Task:**
Review this implementation for:

1. **Functionality**: Does it implement the requested feature correctly?
2. **Code Quality**: Is the code clean, readable, and maintainable?
3. **Best Practices**: Does it follow vanilla JS best practices?
4. **Security**: Are there any security concerns?
5. **Performance**: Are there any performance issues?
6. **Integration**: Does it integrate well with existing code?
7. **Bugs**: Are there any obvious bugs or edge cases?

**Respond in JSON format:**
{
  "approved": true/false,
  "score": 0-100,
  "strengths": ["..."],
  "issues": [
    {
      "severity": "critical/major/minor",
      "description": "...",
      "suggestion": "..."
    }
  ],
  "testingNotes": "...",
  "feedback": "Overall assessment..."
}`;

    const message = await this.anthropic.messages.create({
      model: this.config.agents.qa.model,
      max_tokens: this.config.agents.qa.maxTokens,
      temperature: this.config.agents.qa.temperature,
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

  async runBasicTests() {
    console.log('\n🧪 Running basic validation tests...');

    const indexPath = path.join(this.projectRoot, 'index.html');
    const content = await fs.readFile(indexPath, 'utf-8');

    const tests = {
      hasDoctype: content.includes('<!DOCTYPE html>'),
      hasSupabaseImport: content.includes('@supabase/supabase-js'),
      hasSupabaseInit: content.includes('createClient'),
      hasAuthFlow: content.includes('handleLogin'),
      hasRealtimeSync: content.includes('.channel('),
      validHTML: content.includes('</html>'),
      hasCSS: content.includes('<style>'),
      hasJavaScript: content.includes('<script>'),
    };

    const passed = Object.values(tests).filter(Boolean).length;
    const total = Object.keys(tests).length;

    console.log(`\n📊 Basic Tests: ${passed}/${total} passed`);

    Object.entries(tests).forEach(([test, result]) => {
      const icon = result ? '✅' : '❌';
      console.log(`   ${icon} ${test}`);
    });

    return { tests, passed, total };
  }

  async updateActionAfterReview(actionId, review) {
    console.log('\n📝 Updating action based on review...');

    const status = review.approved ? 'Completado' : 'En curso';

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

    console.log(`✅ Action marked as: ${status}`);
    return true;
  }

  async provideFeedback(action, review) {
    console.log('\n💬 Generating feedback report...');

    const report = {
      action: action.title,
      approved: review.approved,
      score: review.score,
      timestamp: new Date().toISOString(),
      summary: review.feedback,
      issues: review.issues,
      strengths: review.strengths,
      recommendation: review.approved
        ? 'Approved for production'
        : 'Needs revision before approval'
    };

    // Save report to file
    const reportsDir = path.join(this.projectRoot, '.agents', 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    const reportPath = path.join(
      reportsDir,
      `qa-review-${action.id}-${Date.now()}.json`
    );

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`📄 Report saved: ${reportPath}`);

    return report;
  }

  async reviewAction(action) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🧪 QA Review: ${action.title}`);
    console.log(`${'='.repeat(60)}`);

    try {
      // Get last commit
      const commit = await this.getLastCommit();
      if (!commit) {
        console.log('⚠️  No recent commit found');
        return { success: false, reason: 'No commit to review' };
      }

      // Run basic tests
      const testResults = await this.runBasicTests();

      // Review code
      const review = await this.reviewCode(action, commit.diff, commit.commitMsg);
      if (!review) {
        console.log('❌ Review failed');
        return { success: false, reason: 'Review generation failed' };
      }

      console.log(`\n📊 Review Results:`);
      console.log(`   Score: ${review.score}/100`);
      console.log(`   Approved: ${review.approved ? '✅ Yes' : '❌ No'}`);
      console.log(`   Issues: ${review.issues.length}`);

      if (review.issues.length > 0) {
        console.log('\n⚠️  Issues Found:');
        review.issues.forEach((issue, i) => {
          console.log(`   ${i + 1}. [${issue.severity.toUpperCase()}] ${issue.description}`);
          console.log(`      → Suggestion: ${issue.suggestion}`);
        });
      }

      if (review.strengths.length > 0) {
        console.log('\n✨ Strengths:');
        review.strengths.forEach((strength, i) => {
          console.log(`   ${i + 1}. ${strength}`);
        });
      }

      // Update action status
      await this.updateActionAfterReview(action.id, review);

      // Generate feedback report
      const report = await this.provideFeedback(action, review);

      return {
        success: true,
        review,
        report,
        testResults
      };

    } catch (error) {
      console.error('❌ Error during QA review:', error);
      return { success: false, error: error.message };
    }
  }

  async run(actionId = null) {
    await this.initialize();

    if (!actionId) {
      console.log('⚠️  No action ID provided. Please specify an action to review.');
      return null;
    }

    // Fetch action from Supabase
    const { data: action, error } = await this.supabase
      .from('roadmap_actions')
      .select('*')
      .eq('id', actionId)
      .single();

    if (error || !action) {
      console.error('❌ Action not found:', actionId);
      return null;
    }

    const result = await this.reviewAction(action);

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 QA Agent Summary:');
    console.log(`${'='.repeat(60)}`);
    console.log(`Action: ${action.title}`);
    console.log(`Result: ${result.success ? '✅ Success' : '❌ Failed'}`);

    if (result.review) {
      console.log(`Approved: ${result.review.approved ? '✅ Yes' : '❌ No'}`);
      console.log(`Score: ${result.review.score}/100`);
    }

    return result;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const actionId = process.argv[2];

  if (!actionId) {
    console.error('❌ Usage: node qa-agent.mjs <action_id>');
    process.exit(1);
  }

  const agent = new QAAgent();

  agent.run(actionId)
    .then(() => {
      console.log('\n✅ QA Agent finished');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ QA Agent failed:', error);
      process.exit(1);
    });
}

export default QAAgent;