#!/usr/bin/env node

/**
 * Product Manager Agent
 *
 * Responsibilities:
 * - Analyze completed features and their impact
 * - Review user feedback and metrics
 * - Suggest new features for the roadmap
 * - Update priorities based on business value
 * - Create new actions in Supabase
 * - Identify technical debt and improvements
 */

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

class ProductManagerAgent {
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
    console.log('📊 Initializing Product Manager Agent...');

    const configPath = path.join(this.projectRoot, '.agents', 'config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    this.config = JSON.parse(configData);

    console.log('✅ Product Manager Agent initialized');
  }

  async fetchCompletedActions() {
    console.log('\n📋 Fetching completed actions...');

    const { data, error } = await this.supabase
      .from('roadmap_actions')
      .select('*')
      .eq('status', 'Completado')
      .order('updated_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Error fetching completed actions:', error);
      return [];
    }

    console.log(`✅ Found ${data.length} completed actions`);
    return data;
  }

  async fetchAllActions() {
    const { data, error } = await this.supabase
      .from('roadmap_actions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching actions:', error);
      return [];
    }

    return data;
  }

  async fetchQAReports() {
    console.log('\n📄 Fetching QA reports...');

    try {
      const reportsDir = path.join(this.projectRoot, '.agents', 'reports');
      const files = await fs.readdir(reportsDir);

      const reports = [];
      for (const file of files.filter(f => f.startsWith('qa-review-'))) {
        const content = await fs.readFile(path.join(reportsDir, file), 'utf-8');
        reports.push(JSON.parse(content));
      }

      console.log(`✅ Found ${reports.length} QA reports`);
      return reports;
    } catch (error) {
      console.log('⚠️  No QA reports found');
      return [];
    }
  }

  async analyzeProductHealth(completedActions, allActions, qaReports) {
    console.log('\n🔍 Analyzing product health...');

    const stats = {
      total: allActions.length,
      completed: completedActions.length,
      pending: allActions.filter(a => a.status === 'Pendiente').length,
      inProgress: allActions.filter(a => a.status === 'En curso').length,
      byCategory: {},
      byPriority: {},
      avgQAScore: 0,
    };

    // Calculate stats
    allActions.forEach(action => {
      stats.byCategory[action.category] = (stats.byCategory[action.category] || 0) + 1;
      stats.byPriority[action.priority] = (stats.byPriority[action.priority] || 0) + 1;
    });

    // Calculate average QA score
    if (qaReports.length > 0) {
      const totalScore = qaReports.reduce((sum, report) => sum + report.score, 0);
      stats.avgQAScore = Math.round(totalScore / qaReports.length);
    }

    return stats;
  }

  async generateRoadmapInsights(completedActions, allActions, qaReports, stats) {
    console.log('\n💡 Generating roadmap insights...');

    const indexPath = path.join(this.projectRoot, 'index.html');
    const currentCode = await fs.readFile(indexPath, 'utf-8');

    const prompt = `You are a Product Manager analyzing the Nevent Strategic Execution Platform roadmap.

**Product Statistics:**
- Total Actions: ${stats.total}
- Completed: ${stats.completed}
- In Progress: ${stats.inProgress}
- Pending: ${stats.pending}
- Average QA Score: ${stats.avgQAScore}/100

**Actions by Category:**
${Object.entries(stats.byCategory).map(([cat, count]) => `- ${cat}: ${count}`).join('\n')}

**Actions by Priority:**
${Object.entries(stats.byPriority).map(([pri, count]) => `- ${pri}: ${count}`).join('\n')}

**Recently Completed Actions:**
${completedActions.slice(0, 5).map(a => `- [${a.category}] ${a.title}`).join('\n')}

**QA Reports Summary:**
${qaReports.slice(0, 3).map(r => `- ${r.action}: Score ${r.score}/100, Approved: ${r.approved}`).join('\n')}

**Current Application Code (index.html):**
\`\`\`html
${currentCode.substring(0, 5000)}... [truncated]
\`\`\`

**Your Task as Product Manager:**

Analyze the roadmap and provide strategic insights:

1. **Completed Features Analysis**: What have we accomplished? What's the impact?
2. **Gaps & Opportunities**: What's missing? What should we prioritize next?
3. **Technical Debt**: Any code quality issues or refactoring needs?
4. **New Feature Suggestions**: 3-5 specific new actions to add to roadmap
5. **Priority Adjustments**: Which pending actions should be prioritized/deprioritized?
6. **Category Balance**: Are we focusing too much on one area?

**For each new feature suggestion, provide:**
- Title (clear, actionable)
- Category (Marketing, Customer Success, Expansión, Producto, Ventas, Operaciones)
- Description (detailed explanation)
- Priority (Alta, Media, Baja)
- Quarter (Q4 2025, Q1 2026, Q2 2026, Q3 2026, Q4 2026)
- Reasoning (why this feature matters now)

**Respond in JSON format:**
{
  "analysis": {
    "completedImpact": "...",
    "gaps": ["..."],
    "technicalDebt": ["..."],
    "categoryBalance": "..."
  },
  "newFeatures": [
    {
      "title": "...",
      "category": "...",
      "description": "...",
      "priority": "...",
      "quarter": "...",
      "reasoning": "..."
    }
  ],
  "priorityAdjustments": [
    {
      "actionId": "...",
      "currentPriority": "...",
      "suggestedPriority": "...",
      "reasoning": "..."
    }
  ],
  "recommendations": "Overall strategic recommendations..."
}`;

    const message = await this.anthropic.messages.create({
      model: this.config.agents.productManager.model,
      max_tokens: this.config.agents.productManager.maxTokens,
      temperature: this.config.agents.productManager.temperature,
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

  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async createNewActions(newFeatures) {
    console.log(`\n➕ Creating ${newFeatures.length} new actions...`);

    const created = [];

    for (const feature of newFeatures) {
      const action = {
        id: this.generateId(),
        title: feature.title,
        category: feature.category,
        description: feature.description,
        priority: feature.priority,
        quarter: feature.quarter,
        status: 'Pendiente',
        responsable: 'CTO Agent',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subtasks: []
      };

      const { data, error } = await this.supabase
        .from('roadmap_actions')
        .insert(action)
        .select()
        .single();

      if (error) {
        console.error(`❌ Error creating action "${feature.title}":`, error);
      } else {
        console.log(`✅ Created: ${feature.title}`);
        created.push(data);
      }
    }

    return created;
  }

  async updatePriorities(adjustments, allActions) {
    console.log(`\n🔄 Updating priorities...`);

    for (const adjustment of adjustments) {
      const action = allActions.find(a => a.id === adjustment.actionId);

      if (!action) {
        console.log(`⚠️  Action not found: ${adjustment.actionId}`);
        continue;
      }

      const { error } = await this.supabase
        .from('roadmap_actions')
        .update({
          priority: adjustment.suggestedPriority,
          updated_at: new Date().toISOString()
        })
        .eq('id', adjustment.actionId);

      if (error) {
        console.error(`❌ Error updating priority for ${action.title}:`, error);
      } else {
        console.log(`✅ Updated: ${action.title} (${adjustment.currentPriority} → ${adjustment.suggestedPriority})`);
      }
    }
  }

  async generateReport(insights, stats, createdActions) {
    console.log('\n📄 Generating PM report...');

    const report = {
      timestamp: new Date().toISOString(),
      stats,
      analysis: insights.analysis,
      newFeaturesCreated: createdActions.length,
      newFeatures: createdActions.map(a => ({
        title: a.title,
        category: a.category,
        priority: a.priority,
        quarter: a.quarter
      })),
      priorityAdjustments: insights.priorityAdjustments?.length || 0,
      recommendations: insights.recommendations
    };

    const reportsDir = path.join(this.projectRoot, '.agents', 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    const reportPath = path.join(
      reportsDir,
      `pm-analysis-${Date.now()}.json`
    );

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`✅ Report saved: ${reportPath}`);

    return report;
  }

  async run() {
    await this.initialize();

    console.log(`\n${'='.repeat(60)}`);
    console.log('📊 Product Manager Analysis');
    console.log(`${'='.repeat(60)}`);

    try {
      // Fetch data
      const completedActions = await this.fetchCompletedActions();
      const allActions = await this.fetchAllActions();
      const qaReports = await this.fetchQAReports();

      // Analyze product health
      const stats = await this.analyzeProductHealth(completedActions, allActions, qaReports);

      console.log('\n📊 Current State:');
      console.log(`   Total Actions: ${stats.total}`);
      console.log(`   Completed: ${stats.completed} (${Math.round(stats.completed / stats.total * 100)}%)`);
      console.log(`   In Progress: ${stats.inProgress}`);
      console.log(`   Pending: ${stats.pending}`);
      console.log(`   Avg QA Score: ${stats.avgQAScore}/100`);

      // Generate insights
      const insights = await this.generateRoadmapInsights(
        completedActions,
        allActions,
        qaReports,
        stats
      );

      if (!insights) {
        console.error('❌ Failed to generate insights');
        return null;
      }

      console.log('\n💡 Analysis Complete:');
      console.log(`   New Features Suggested: ${insights.newFeatures?.length || 0}`);
      console.log(`   Priority Adjustments: ${insights.priorityAdjustments?.length || 0}`);
      console.log(`   Gaps Identified: ${insights.analysis.gaps?.length || 0}`);

      // Create new actions
      let createdActions = [];
      if (insights.newFeatures && insights.newFeatures.length > 0) {
        createdActions = await this.createNewActions(insights.newFeatures);
      }

      // Update priorities
      if (insights.priorityAdjustments && insights.priorityAdjustments.length > 0) {
        await this.updatePriorities(insights.priorityAdjustments, allActions);
      }

      // Generate report
      const report = await this.generateReport(insights, stats, createdActions);

      console.log(`\n${'='.repeat(60)}`);
      console.log('📊 PM Agent Summary:');
      console.log(`${'='.repeat(60)}`);
      console.log(`New features created: ${createdActions.length}`);
      console.log(`Priorities adjusted: ${insights.priorityAdjustments?.length || 0}`);
      console.log(`\n📌 Recommendations:`);
      console.log(insights.recommendations);

      return {
        success: true,
        insights,
        report,
        createdActions
      };

    } catch (error) {
      console.error('❌ Error during PM analysis:', error);
      return { success: false, error: error.message };
    }
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const agent = new ProductManagerAgent();

  agent.run()
    .then(() => {
      console.log('\n✅ PM Agent finished');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ PM Agent failed:', error);
      process.exit(1);
    });
}

export default ProductManagerAgent;