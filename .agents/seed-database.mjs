#!/usr/bin/env node

/**
 * Seed Database Script
 * Populates Supabase with initial data for v3.0.0
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('🌱 Seeding database with v3.0.0 data...\n');

// ================================================================
// 1. DEPARTMENTS
// ================================================================

console.log('📊 Inserting departments...');

const departments = [
  {id: 'dept-marketing', name: 'Marketing', icon: '📢', status: 'active', health_score: 75, budget: {allocated: 120000, spent: 68000, currency: 'EUR'}},
  {id: 'dept-sales', name: 'Ventas', icon: '💰', status: 'active', health_score: 72, budget: {allocated: 200000, spent: 145000, currency: 'EUR'}},
  {id: 'dept-product', name: 'Producto', icon: '🚀', status: 'active', health_score: 68, budget: {allocated: 150000, spent: 92000, currency: 'EUR'}},
  {id: 'dept-engineering', name: 'Ingeniería', icon: '⚙️', status: 'active', health_score: 70, budget: {allocated: 300000, spent: 198000, currency: 'EUR'}},
  {id: 'dept-customer-success', name: 'Customer Success', icon: '🤝', status: 'active', health_score: 80, budget: {allocated: 80000, spent: 54000, currency: 'EUR'}},
  {id: 'dept-operations', name: 'Operaciones', icon: '📊', status: 'active', health_score: 77, budget: {allocated: 100000, spent: 62000, currency: 'EUR'}},
  {id: 'dept-finance', name: 'Finanzas', icon: '💵', status: 'active', health_score: 82, budget: {allocated: 90000, spent: 48000, currency: 'EUR'}}
];

const { data: deptData, error: deptError } = await supabase
  .from('departments')
  .upsert(departments, { onConflict: 'id' });

if (deptError) {
  console.error('❌ Error inserting departments:', deptError.message);
  console.error('Details:', deptError);
} else {
  console.log(`✅ Inserted ${departments.length} departments`);
}

// ================================================================
// 2. COMPANY OKRs
// ================================================================

console.log('\n🎯 Inserting company OKRs...');

const companyOKRs = [
  {
    id: 'co-2025-growth',
    fiscal_year: '2025',
    objective: 'Acelerar el crecimiento sostenible de la empresa',
    key_results: [
      {
        id: 'kr-1',
        description: 'Aumentar ARR de €2M a €5M',
        current: 2500000,
        target: 5000000,
        unit: 'EUR',
        progress: 50
      },
      {
        id: 'kr-2',
        description: 'Alcanzar 200 clientes activos',
        current: 120,
        target: 200,
        unit: 'clientes',
        progress: 60
      },
      {
        id: 'kr-3',
        description: 'Mantener NRR > 120%',
        current: 115,
        target: 120,
        unit: '%',
        progress: 96
      }
    ],
    health_score: 85
  },
  {
    id: 'co-2025-product',
    fiscal_year: '2025',
    objective: 'Convertir Nevent en la plataforma líder de gestión de eventos',
    key_results: [
      {
        id: 'kr-1',
        description: 'Lanzar 3 features enterprise',
        current: 1,
        target: 3,
        unit: 'features',
        progress: 33
      },
      {
        id: 'kr-2',
        description: 'Alcanzar NPS > 50',
        current: 42,
        target: 50,
        unit: 'points',
        progress: 84
      },
      {
        id: 'kr-3',
        description: 'Reducir churn rate a < 5%',
        current: 8,
        target: 5,
        unit: '%',
        progress: 60
      }
    ],
    health_score: 72
  },
  {
    id: 'co-2025-team',
    fiscal_year: '2025',
    objective: 'Construir un equipo de clase mundial',
    key_results: [
      {
        id: 'kr-1',
        description: 'Crecer equipo de 25 a 40 personas',
        current: 30,
        target: 40,
        unit: 'personas',
        progress: 50
      },
      {
        id: 'kr-2',
        description: 'Mantener employee satisfaction > 4.5/5',
        current: 4.3,
        target: 4.5,
        unit: 'rating',
        progress: 95
      },
      {
        id: 'kr-3',
        description: 'Reducir time-to-hire a < 30 días',
        current: 45,
        target: 30,
        unit: 'días',
        progress: 67
      }
    ],
    health_score: 78
  }
];

const { data: okrData, error: okrError } = await supabase
  .from('company_okrs')
  .upsert(companyOKRs, { onConflict: 'id' });

if (okrError) {
  console.error('❌ Error inserting company OKRs:', okrError.message);
  console.error('Details:', okrError);
} else {
  console.log(`✅ Inserted ${companyOKRs.length} company OKRs`);
}

// ================================================================
// 3. INITIATIVES
// ================================================================

console.log('\n🚀 Inserting initiatives...');

const initiatives = [
  {
    id: 'init-mkt-content-2025-q4',
    department_id: 'dept-marketing',
    title: 'Campaña de Content Marketing Q4',
    description: 'Crear y distribuir contenido de valor para atraer leads cualificados',
    quarter: 'Q4 2025',
    start_date: '2025-10-01',
    end_date: '2025-12-31',
    status: 'in_progress',
    progress: 65,
    health: 'on_track',
    budget_allocated: 25000.00,
    budget_spent: 16000.00
  },
  {
    id: 'init-sales-enterprise-2025-q4',
    department_id: 'dept-sales',
    title: 'Programa de ventas enterprise',
    description: 'Estrategia enfocada en cerrar cuentas > €50K ARR',
    quarter: 'Q4 2025',
    start_date: '2025-10-01',
    end_date: '2025-12-31',
    status: 'in_progress',
    progress: 70,
    health: 'on_track',
    budget_allocated: 40000.00,
    budget_spent: 28000.00
  },
  {
    id: 'init-product-api-2025-q4',
    department_id: 'dept-product',
    title: 'Desarrollo API Pública v1',
    description: 'Diseño e implementación de API REST pública para integraciones',
    quarter: 'Q4 2025',
    start_date: '2025-10-01',
    end_date: '2025-12-31',
    status: 'in_progress',
    progress: 80,
    health: 'on_track',
    budget_allocated: 60000.00,
    budget_spent: 48000.00
  },
  {
    id: 'init-cs-onboarding-2025-q4',
    department_id: 'dept-customer-success',
    title: 'Optimización proceso onboarding',
    description: 'Mejorar experiencia de onboarding para reducir time-to-value',
    quarter: 'Q4 2025',
    start_date: '2025-10-01',
    end_date: '2025-12-31',
    status: 'in_progress',
    progress: 55,
    health: 'at_risk',
    budget_allocated: 15000.00,
    budget_spent: 8500.00
  },
  {
    id: 'init-eng-testing-2025-q4',
    department_id: 'dept-engineering',
    title: 'Implementación testing automatizado',
    description: 'Aumentar cobertura de tests e implementar CI/CD robusto',
    quarter: 'Q4 2025',
    start_date: '2025-10-01',
    end_date: '2025-12-31',
    status: 'in_progress',
    progress: 45,
    health: 'at_risk',
    budget_allocated: 35000.00,
    budget_spent: 22000.00
  }
];

const { data: initData, error: initError } = await supabase
  .from('initiatives')
  .upsert(initiatives, { onConflict: 'id' });

if (initError) {
  console.error('❌ Error inserting initiatives:', initError.message);
  console.error('Details:', initError);
} else {
  console.log(`✅ Inserted ${initiatives.length} initiatives`);
}

// ================================================================
// SUMMARY
// ================================================================

console.log('\n' + '='.repeat(60));
console.log('📊 Seed Summary:');
console.log('='.repeat(60));
console.log(`✅ ${departments.length} departments`);
console.log(`✅ ${companyOKRs.length} company OKRs`);
console.log(`✅ ${initiatives.length} initiatives`);
console.log('\n🎉 Database seeding complete!');
console.log('\n💡 Note: User OKRs require authenticated users and will be created via UI');