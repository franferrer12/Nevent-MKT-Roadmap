#!/usr/bin/env node

/**
 * Orchestrator - Multi-Agent Coordinator
 *
 * Coordinates the workflow between:
 * - CTO Agent (implements features)
 * - QA Agent (reviews and validates)
 * - PM Agent (analyzes and suggests new features)
 *
 * Workflow:
 * 1. CTO picks up pending action and implements it
 * 2. QA reviews the implementation
 * 3. If approved, mark as complete. If not, CTO iterates
 * 4. PM analyzes completed features and suggests improvements
 * 5. Repeat cycle
 */

import CTOAgent from './cto-agent.mjs';
import QAAgent from './qa-agent.mjs';
import ProductManagerAgent from './pm-agent.mjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

class Orchestrator {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    this.ctoAgent = new CTOAgent();
    this.qaAgent = new QAAgent();
    this.pmAgent = new ProductManagerAgent();

    this.config = null;
    this.projectRoot = process.cwd();
    this.sessionLog = [];
  }

  async initialize() {
    console.log('\n🚀 Starting Multi-Agent Orchestrator');
    console.log('='.repeat(70));

    const configPath = path.join(this.projectRoot, '.agents', 'config.json');
    const configData = await fs.readFile(configPath, 'utf-8');
    this.config = JSON.parse(configData);

    console.log(`\n📋 Configuration:`);
    console.log(`   Cycles: ${this.config.workflow.cycles}`);
    console.log(`   Max iterations per feature: ${this.config.workflow.maxIterationsPerFeature}`);
    console.log(`   Auto-commit: ${this.config.workflow.autoCommit}`);
    console.log(`   Require QA approval: ${this.config.workflow.requireQAApproval}`);
    console.log(`   PM review after completion: ${this.config.workflow.pmReviewAfterCompletion}`);

    await this.ctoAgent.initialize();
    await this.qaAgent.initialize();
    await this.pmAgent.initialize();

    console.log('\n✅ All agents initialized\n');
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, level, message };
    this.sessionLog.push(logEntry);

    const icon = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    }[level] || 'ℹ️';

    console.log(`${icon} [${timestamp}] ${message}`);
  }

  async developmentCycle(cycleNumber) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🔄 CYCLE ${cycleNumber}`);
    console.log(`${'='.repeat(70)}\n`);

    this.log(`Starting cycle ${cycleNumber}`, 'info');

    // Step 1: CTO implements feature
    this.log('Phase 1: CTO Agent - Feature Implementation', 'info');

    const ctoResults = await this.ctoAgent.run(1);

    if (ctoResults.length === 0) {
      this.log('No pending actions found', 'warning');
      return { noActions: true };
    }

    const { action, result: ctoResult } = ctoResults[0];

    if (!ctoResult.success) {
      this.log(`CTO implementation failed: ${ctoResult.reason || ctoResult.error}`, 'error');
      return { success: false, phase: 'cto', error: ctoResult };
    }

    this.log(`CTO successfully implemented: ${action.title}`, 'success');

    // Step 2: QA reviews implementation
    if (this.config.workflow.requireQAApproval) {
      this.log('Phase 2: QA Agent - Code Review', 'info');

      const qaResult = await this.qaAgent.run(action.id);

      if (!qaResult.success) {
        this.log(`QA review failed: ${qaResult.reason || qaResult.error}`, 'error');
        return { success: false, phase: 'qa', error: qaResult };
      }

      if (!qaResult.review.approved) {
        this.log(`QA did not approve (score: ${qaResult.review.score}/100)`, 'warning');
        this.log(`Issues found: ${qaResult.review.issues.length}`, 'warning');

        // TODO: In future, trigger CTO to fix issues
        // For now, we'll continue but mark as needing revision

        return {
          success: true,
          needsRevision: true,
          action,
          ctoResult,
          qaResult
        };
      }

      this.log(`QA approved with score: ${qaResult.review.score}/100`, 'success');

      return {
        success: true,
        action,
        ctoResult,
        qaResult
      };
    }

    return {
      success: true,
      action,
      ctoResult
    };
  }

  async productReview() {
    console.log(`\n${'='.repeat(70)}`);
    console.log('📊 PRODUCT MANAGER REVIEW');
    console.log(`${'='.repeat(70)}\n`);

    this.log('Running PM analysis...', 'info');

    const pmResult = await this.pmAgent.run();

    if (!pmResult.success) {
      this.log(`PM analysis failed: ${pmResult.error}`, 'error');
      return { success: false, error: pmResult };
    }

    this.log(`PM created ${pmResult.createdActions.length} new actions`, 'success');
    this.log(`PM recommendations: ${pmResult.insights.recommendations}`, 'info');

    return pmResult;
  }

  async generateSessionReport(cycles, pmReview) {
    this.log('Generating session report...', 'info');

    const completedCycles = cycles.filter(c => c.success);
    const failedCycles = cycles.filter(c => !c.success);
    const needsRevision = cycles.filter(c => c.needsRevision);

    const report = {
      sessionStart: this.sessionLog[0]?.timestamp,
      sessionEnd: new Date().toISOString(),
      totalCycles: cycles.length,
      successfulCycles: completedCycles.length,
      failedCycles: failedCycles.length,
      needsRevisionCycles: needsRevision.length,
      actionsImplemented: completedCycles.map(c => ({
        title: c.action?.title,
        category: c.action?.category,
        qaScore: c.qaResult?.review?.score
      })),
      pmAnalysis: pmReview?.success ? {
        newFeaturesCreated: pmReview.createdActions.length,
        recommendations: pmReview.insights.recommendations
      } : null,
      log: this.sessionLog
    };

    const reportsDir = path.join(this.projectRoot, '.agents', 'reports');
    await fs.mkdir(reportsDir, { recursive: true });

    const reportPath = path.join(
      reportsDir,
      `orchestrator-session-${Date.now()}.json`
    );

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

    console.log(`\n${'='.repeat(70)}`);
    console.log('📊 SESSION SUMMARY');
    console.log(`${'='.repeat(70)}`);
    console.log(`Duration: ${this.sessionLog[0]?.timestamp} → ${report.sessionEnd}`);
    console.log(`Total Cycles: ${report.totalCycles}`);
    console.log(`Successful: ${report.successfulCycles}`);
    console.log(`Failed: ${report.failedCycles}`);
    console.log(`Needs Revision: ${report.needsRevisionCycles}`);

    if (completedCycles.length > 0) {
      console.log(`\n✅ Implemented Actions:`);
      completedCycles.forEach((cycle, i) => {
        const qaScore = cycle.qaResult?.review?.score || 'N/A';
        console.log(`   ${i + 1}. ${cycle.action.title} (QA: ${qaScore}/100)`);
      });
    }

    if (pmReview?.success && pmReview.createdActions.length > 0) {
      console.log(`\n➕ New Actions Created by PM:`);
      pmReview.createdActions.forEach((action, i) => {
        console.log(`   ${i + 1}. [${action.priority}] ${action.title}`);
      });
    }

    console.log(`\n📄 Full report saved: ${reportPath}`);

    return report;
  }

  async run() {
    await this.initialize();

    const cycles = [];
    const maxCycles = this.config.workflow.cycles;

    // Run development cycles
    for (let i = 1; i <= maxCycles; i++) {
      const cycleResult = await this.developmentCycle(i);

      if (cycleResult.noActions) {
        this.log('No more pending actions. Ending cycles early.', 'info');
        break;
      }

      cycles.push(cycleResult);

      // Small delay between cycles
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Run PM review if configured
    let pmReview = null;
    if (this.config.workflow.pmReviewAfterCompletion) {
      pmReview = await this.productReview();
    }

    // Generate final report
    const report = await this.generateSessionReport(cycles, pmReview);

    this.log('Orchestrator session complete!', 'success');

    return report;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new Orchestrator();

  orchestrator.run()
    .then(() => {
      console.log('\n✅ Orchestrator finished successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Orchestrator failed:', error);
      process.exit(1);
    });
}

export default Orchestrator;