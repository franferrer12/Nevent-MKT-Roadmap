-- ================================================================
-- MIGRATION: v3.0.0 - Seed Data
-- Description: Populate initial data for testing and development
-- Date: 2025-09-30
-- Author: CTO Agent
-- ================================================================

-- ================================================================
-- 1. INSERT DEPARTMENTS (7 departments as per documentation)
-- ================================================================

INSERT INTO departments (id, name, icon, status) VALUES
  ('dept-marketing', 'Marketing', '📢', 'active'),
  ('dept-sales', 'Ventas', '💰', 'active'),
  ('dept-product', 'Producto', '🚀', 'active'),
  ('dept-engineering', 'Ingeniería', '⚙️', 'active'),
  ('dept-customer-success', 'Customer Success', '🤝', 'active'),
  ('dept-operations', 'Operaciones', '📊', 'active'),
  ('dept-finance', 'Finanzas', '💵', 'active')
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 2. INSERT COMPANY OKRs (2025)
-- ================================================================

INSERT INTO company_okrs (id, fiscal_year, objective, key_results, health_score) VALUES
  (
    'co-2025-growth',
    '2025',
    'Acelerar el crecimiento sostenible de la empresa',
    '[
      {
        "id": "kr-1",
        "description": "Aumentar ARR de €2M a €5M",
        "current": 2500000,
        "target": 5000000,
        "unit": "EUR",
        "progress": 50
      },
      {
        "id": "kr-2",
        "description": "Alcanzar 200 clientes activos",
        "current": 120,
        "target": 200,
        "unit": "clientes",
        "progress": 60
      },
      {
        "id": "kr-3",
        "description": "Mantener NRR > 120%",
        "current": 115,
        "target": 120,
        "unit": "%",
        "progress": 96
      }
    ]'::jsonb,
    85
  ),
  (
    'co-2025-product',
    '2025',
    'Convertir Nevent en la plataforma líder de gestión de eventos',
    '[
      {
        "id": "kr-1",
        "description": "Lanzar 3 features enterprise",
        "current": 1,
        "target": 3,
        "unit": "features",
        "progress": 33
      },
      {
        "id": "kr-2",
        "description": "Alcanzar NPS > 50",
        "current": 42,
        "target": 50,
        "unit": "points",
        "progress": 84
      },
      {
        "id": "kr-3",
        "description": "Reducir churn rate a < 5%",
        "current": 8,
        "target": 5,
        "unit": "%",
        "progress": 60
      }
    ]'::jsonb,
    72
  ),
  (
    'co-2025-team',
    '2025',
    'Construir un equipo de clase mundial',
    '[
      {
        "id": "kr-1",
        "description": "Crecer equipo de 25 a 40 personas",
        "current": 30,
        "target": 40,
        "unit": "personas",
        "progress": 50
      },
      {
        "id": "kr-2",
        "description": "Mantener employee satisfaction > 4.5/5",
        "current": 4.3,
        "target": 4.5,
        "unit": "rating",
        "progress": 95
      },
      {
        "id": "kr-3",
        "description": "Reducir time-to-hire a < 30 días",
        "current": 45,
        "target": 30,
        "unit": "días",
        "progress": 67
      }
    ]'::jsonb,
    78
  )
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 3. UPDATE DEPARTMENTS WITH OKRs
-- ================================================================

-- Marketing Department OKRs
UPDATE departments SET okrs = '[
  {
    "id": "dept-okr-mkt-1",
    "objective": "Generar 500 leads cualificados",
    "contributes_to": "co-2025-growth",
    "quarter": "Q4 2025",
    "key_results": [
      {
        "id": "kr-1",
        "description": "Alcanzar 100K visitas web/mes",
        "current": 65000,
        "target": 100000,
        "unit": "visitas",
        "progress": 65
      },
      {
        "id": "kr-2",
        "description": "Conseguir tasa conversión > 3%",
        "current": 2.1,
        "target": 3,
        "unit": "%",
        "progress": 70
      },
      {
        "id": "kr-3",
        "description": "Generar 500 MQLs",
        "current": 320,
        "target": 500,
        "unit": "leads",
        "progress": 64
      }
    ],
    "health_score": 75
  }
]'::jsonb, health_score = 75, budget = '{"allocated": 120000, "spent": 68000, "currency": "EUR"}'::jsonb
WHERE id = 'dept-marketing';

-- Sales Department OKRs
UPDATE departments SET okrs = '[
  {
    "id": "dept-okr-sales-1",
    "objective": "Cerrar €1.5M en nuevos contratos",
    "contributes_to": "co-2025-growth",
    "quarter": "Q4 2025",
    "key_results": [
      {
        "id": "kr-1",
        "description": "Cerrar €1.5M ARR nuevo",
        "current": 900000,
        "target": 1500000,
        "unit": "EUR",
        "progress": 60
      },
      {
        "id": "kr-2",
        "description": "Reducir sales cycle a < 45 días",
        "current": 52,
        "target": 45,
        "unit": "días",
        "progress": 87
      },
      {
        "id": "kr-3",
        "description": "Alcanzar win rate > 30%",
        "current": 25,
        "target": 30,
        "unit": "%",
        "progress": 83
      }
    ],
    "health_score": 72
  }
]'::jsonb, health_score = 72, budget = '{"allocated": 200000, "spent": 145000, "currency": "EUR"}'::jsonb
WHERE id = 'dept-sales';

-- Product Department OKRs
UPDATE departments SET okrs = '[
  {
    "id": "dept-okr-product-1",
    "objective": "Lanzar features enterprise Q4 2025",
    "contributes_to": "co-2025-product",
    "quarter": "Q4 2025",
    "key_results": [
      {
        "id": "kr-1",
        "description": "Lanzar API pública v1",
        "current": 80,
        "target": 100,
        "unit": "%",
        "progress": 80
      },
      {
        "id": "kr-2",
        "description": "Implementar SSO enterprise",
        "current": 60,
        "target": 100,
        "unit": "%",
        "progress": 60
      },
      {
        "id": "kr-3",
        "description": "Lanzar analytics dashboard",
        "current": 40,
        "target": 100,
        "unit": "%",
        "progress": 40
      }
    ],
    "health_score": 68
  }
]'::jsonb, health_score = 68, budget = '{"allocated": 150000, "spent": 92000, "currency": "EUR"}'::jsonb
WHERE id = 'dept-product';

-- Customer Success Department OKRs
UPDATE departments SET okrs = '[
  {
    "id": "dept-okr-cs-1",
    "objective": "Maximizar retención y expansión",
    "contributes_to": "co-2025-growth",
    "quarter": "Q4 2025",
    "key_results": [
      {
        "id": "kr-1",
        "description": "Mantener NRR > 120%",
        "current": 115,
        "target": 120,
        "unit": "%",
        "progress": 96
      },
      {
        "id": "kr-2",
        "description": "Reducir churn a < 5%",
        "current": 8,
        "target": 5,
        "unit": "%",
        "progress": 62
      },
      {
        "id": "kr-3",
        "description": "NPS > 50",
        "current": 42,
        "target": 50,
        "unit": "points",
        "progress": 84
      }
    ],
    "health_score": 80
  }
]'::jsonb, health_score = 80, budget = '{"allocated": 80000, "spent": 54000, "currency": "EUR"}'::jsonb
WHERE id = 'dept-customer-success';

-- Engineering Department OKRs
UPDATE departments SET okrs = '[
  {
    "id": "dept-okr-eng-1",
    "objective": "Aumentar velocidad y calidad del desarrollo",
    "contributes_to": "co-2025-product",
    "quarter": "Q4 2025",
    "key_results": [
      {
        "id": "kr-1",
        "description": "Reducir bugs en producción a < 5/semana",
        "current": 8,
        "target": 5,
        "unit": "bugs",
        "progress": 62
      },
      {
        "id": "kr-2",
        "description": "Alcanzar 80% test coverage",
        "current": 65,
        "target": 80,
        "unit": "%",
        "progress": 81
      },
      {
        "id": "kr-3",
        "description": "Reducir deployment time a < 15min",
        "current": 22,
        "target": 15,
        "unit": "minutos",
        "progress": 68
      }
    ],
    "health_score": 70
  }
]'::jsonb, health_score = 70, budget = '{"allocated": 300000, "spent": 198000, "currency": "EUR"}'::jsonb
WHERE id = 'dept-engineering';

-- ================================================================
-- 4. INSERT SAMPLE USER OKRs (using dummy user IDs)
-- ================================================================

-- Note: These will need to be updated with real user_id values after user creation
-- For now, we'll create them without user_id constraint

INSERT INTO user_okrs (id, user_id, title, contributes_to, quarter, key_results, progress, status, deadline) VALUES
  (
    'user-okr-mkt-manager-1',
    NULL,  -- To be updated with real user_id
    'Aumentar engagement en redes sociales',
    'dept-okr-mkt-1',
    'Q4 2025',
    '[
      {
        "id": "kr-1",
        "description": "Alcanzar 50K seguidores en LinkedIn",
        "current": 32000,
        "target": 50000,
        "unit": "seguidores",
        "progress": 64
      },
      {
        "id": "kr-2",
        "description": "Conseguir engagement rate > 5%",
        "current": 3.2,
        "target": 5,
        "unit": "%",
        "progress": 64
      },
      {
        "id": "kr-3",
        "description": "Publicar 40 posts de valor",
        "current": 28,
        "target": 40,
        "unit": "posts",
        "progress": 70
      }
    ]'::jsonb,
    66,
    'on_track',
    '2025-12-31'
  ),
  (
    'user-okr-sales-manager-1',
    NULL,
    'Cerrar 10 cuentas enterprise',
    'dept-okr-sales-1',
    'Q4 2025',
    '[
      {
        "id": "kr-1",
        "description": "Cerrar 10 cuentas > €50K ARR",
        "current": 6,
        "target": 10,
        "unit": "cuentas",
        "progress": 60
      },
      {
        "id": "kr-2",
        "description": "Pipeline de €2M",
        "current": 1600000,
        "target": 2000000,
        "unit": "EUR",
        "progress": 80
      },
      {
        "id": "kr-3",
        "description": "30 demos enterprise realizados",
        "current": 22,
        "target": 30,
        "unit": "demos",
        "progress": 73
      }
    ]'::jsonb,
    71,
    'on_track',
    '2025-12-31'
  )
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- 5. INSERT SAMPLE INITIATIVES
-- ================================================================

INSERT INTO initiatives (id, department_id, title, description, contributes_to_okr, quarter, start_date, end_date, status, progress, health, budget_allocated, budget_spent) VALUES
  (
    'init-mkt-content-2025-q4',
    'dept-marketing',
    'Campaña de Content Marketing Q4',
    'Crear y distribuir contenido de valor para atraer leads cualificados',
    'user-okr-mkt-manager-1',
    'Q4 2025',
    '2025-10-01',
    '2025-12-31',
    'in_progress',
    65,
    'on_track',
    25000.00,
    16000.00
  ),
  (
    'init-sales-enterprise-2025-q4',
    'dept-sales',
    'Programa de ventas enterprise',
    'Estrategia enfocada en cerrar cuentas > €50K ARR',
    'user-okr-sales-manager-1',
    'Q4 2025',
    '2025-10-01',
    '2025-12-31',
    'in_progress',
    70,
    'on_track',
    40000.00,
    28000.00
  ),
  (
    'init-product-api-2025-q4',
    'dept-product',
    'Desarrollo API Pública v1',
    'Diseño e implementación de API REST pública para integraciones',
    'dept-okr-product-1',
    'Q4 2025',
    '2025-10-01',
    '2025-12-31',
    'in_progress',
    80,
    'on_track',
    60000.00,
    48000.00
  ),
  (
    'init-cs-onboarding-2025-q4',
    'dept-customer-success',
    'Optimización proceso onboarding',
    'Mejorar experiencia de onboarding para reducir time-to-value',
    'dept-okr-cs-1',
    'Q4 2025',
    '2025-10-01',
    '2025-12-31',
    'in_progress',
    55,
    'at_risk',
    15000.00,
    8500.00
  )
ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- SEED DATA COMPLETE
-- ================================================================

SELECT 'v3.0.0 Seed Data Complete - ' ||
  (SELECT COUNT(*) FROM departments) || ' departments, ' ||
  (SELECT COUNT(*) FROM company_okrs) || ' company OKRs, ' ||
  (SELECT COUNT(*) FROM user_okrs) || ' user OKRs, ' ||
  (SELECT COUNT(*) FROM initiatives) || ' initiatives' AS status;