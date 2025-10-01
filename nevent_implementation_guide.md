# 🎨 Guía de Implementación - Nevent Design System

## 📦 Instalación

### 1. Configurar Tailwind CSS (Recomendado)

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configurar `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9C27B0',
        secondary: '#673AB7',
        'purple-light': '#BA68C8',
        'purple-dark': '#4A148C',
        'gray-850': '#262626',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
```

### 3. Importar fuente Poppins

En tu `index.html` o layout principal:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

---

## 🎯 Migración Paso a Paso

### PASO 1: Reemplazar Colores

**Buscar y reemplazar en todos los archivos:**

```
#E91E63 → #9C27B0
#FF1744 → #9C27B0
rgb(233, 30, 99) → #9C27B0
rgba(233, 30, 99, → rgba(156, 39, 176,
```

### PASO 2: Unificar Border Radius

```css
/* Antes */
border-radius: 10px;
border-radius: 12px;
border-radius: 15px;
border-radius: 20px;

/* Después - Usar solo estos valores */
border-radius: 8px;   /* Botones */
border-radius: 12px;  /* Cards pequeñas */
border-radius: 16px;  /* Cards grandes */
border-radius: 20px;  /* Contenedores especiales */
```

### PASO 3: Estandarizar Espaciado

```css
/* Sistema de espaciado base 8px */
gap: 8px;    /* gap-1 */
gap: 16px;   /* gap-2 */
gap: 24px;   /* gap-3 */
gap: 32px;   /* gap-4 */
gap: 48px;   /* gap-6 */

/* Padding de cards */
padding: 32px; /* Estándar para cards */
```

### PASO 4: Actualizar Botones

**Antes:**
```jsx
<button style={{
  background: 'linear-gradient(135deg, #E91E63, #9C27B0)',
  padding: '10px 20px',
  borderRadius: '10px'
}}>
  Nueva Acción
</button>
```

**Después:**
```jsx
<Button variant="primary">
  <span>+</span>
  Nueva Acción
</Button>
```

### PASO 5: Actualizar Cards de Métricas

**Antes:**
```jsx
<div className="metric-card">
  <div className="label">Completadas</div>
  <div className="value">89</div>
  <div className="subtitle">60% del total</div>
</div>
```

**Después:**
```jsx
<MetricCard
  label="Completadas"
  value={89}
  subtitle="60% del total"
/>
```

---

## 🔧 Ejemplos de Uso

### Dashboard Header

```jsx
import { DashboardHeader, Button } from '@/components/nevent';

function Dashboard() {
  return (
    <>
      <DashboardHeader
        title="Roadmap Nevent 2025-2026"
        subtitle="Gestión estratégica de objetivos"
        actions={
          <>
            <Button variant="primary">
              <span>+</span> Nueva Acción
            </Button>
            <Button variant="secondary">
              🔄 Sincronizar
            </Button>
          </>
        }
      />
    </>
  );
}
```

### Grid de Métricas

```jsx
import { MetricCard } from '@/components/nevent';

function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        label="Acciones totales"
        value={147}
        subtitle="vs mes anterior"
        trend="up"
        trendValue="23%"
      />
      <MetricCard
        label="Completadas"
        value={89}
        subtitle="60% del total"
      />
      <MetricCard
        label="Progreso global"
        value="67%"
        subtitle="2 de 3 on track"
      />
      <MetricCard
        label="Responsables"
        value={12}
        subtitle="miembros activos"
      />
    </div>
  );
}
```

### Tabs de Navegación

```jsx
import { Tabs } from '@/components/nevent';
import { useState } from 'react';

function DashboardTabs() {
  const [activeTab, setActiveTab] = useState('timeline');

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: '📊' },
    { id: 'my-dashboard', label: 