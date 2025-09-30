#!/usr/bin/env node

/**
 * Script para crear una acción de prueba en Supabase
 * Ejecutar: node .agents/create-test-action.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

async function createTestAction() {
  console.log('📝 Creating test action in Supabase...');

  const testAction = {
    id: generateId(),
    title: 'Añadir botón de exportar roadmap a PDF',
    category: 'Producto',
    description: 'Implementar funcionalidad para exportar el roadmap completo a PDF con estilos y logos de Nevent',
    priority: 'Media',
    quarter: 'Q4 2025',
    status: 'Pendiente',
    responsable: 'CTO Agent',
    deadline: null,
    subtasks: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('roadmap_actions')
    .insert(testAction)
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating action:', error);
    process.exit(1);
  }

  console.log('✅ Test action created successfully!');
  console.log('\n📋 Action details:');
  console.log(`   ID: ${data.id}`);
  console.log(`   Title: ${data.title}`);
  console.log(`   Category: ${data.category}`);
  console.log(`   Priority: ${data.priority}`);
  console.log(`   Status: ${data.status}`);
  console.log('\n🎯 Ready to test agents!');
  console.log('   Run: npm run agents:start');
}

createTestAction();