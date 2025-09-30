# 💰 Guía de Uso con Coste Mínimo

## Configuración Optimizada

El sistema está configurado para **mínimo coste**:

### **Modelo: Claude 3.5 Haiku**
- 80% más barato que Sonnet
- $0.80 por 1M tokens de entrada
- $4.00 por 1M tokens de salida

### **Configuración actual:**
```json
{
  "model": "claude-3-5-haiku-20241022",
  "maxTokens": 3000-4000,
  "cycles": 2
}
```

## 💸 Estimación de Costes

### Por sesión (2 ciclos):
- **~18,000 tokens totales**
- Input: ~10k × $0.80/1M = **$0.008**
- Output: ~8k × $4.00/1M = **$0.032**
- **TOTAL: ~$0.04 (4 céntimos)**

### Por mes (uso conservador):
- 1 sesión/día × 30 días = **$1.20/mes**
- 2 sesiones/semana × 4 semanas = **$0.32/mes**
- Bajo demanda = **<$1/mes**

## 🎯 Estrategia Recomendada

### **Opción 1: Manual on-demand** ⭐ Recomendada
```bash
# Ejecutar solo cuando tengas acciones pendientes
npm run agents:start
```
**Coste**: $0.04 por ejecución = **<$1/mes**

### **Opción 2: Semanal**
```bash
# Ejecutar una vez por semana (lunes)
npm run agents:start
```
**Coste**: $0.04 × 4 = **$0.16/mes**

### **Opción 3: Solo CTO (sin QA ni PM)**
```bash
# Solo implementar features (más barato)
npm run agents:cto
```
**Coste**: $0.01 por ejecución = **$0.30/mes** (1×/día)

## 🚀 Primeros Pasos

### 1. Conseguir API Key GRATIS de Anthropic

Anthropic ofrece **$5 de crédito gratis** al registrarte:
- Ve a: https://console.anthropic.com/
- Crea cuenta
- Obtén API key
- **$5 gratis = 125 sesiones completas**

### 2. Configurar .env

```bash
# Editar archivo .env
ANTHROPIC_API_KEY=sk-ant-tu_clave_aqui
```

### 3. Crear acción de prueba

```bash
node .agents/create-test-action.mjs
```

### 4. Ejecutar agentes

```bash
npm run agents:start
```

## 📊 Monitorear Uso

### Ver créditos restantes:
https://console.anthropic.com/settings/billing

### Ver logs de sesión:
```bash
cat .agents/reports/orchestrator-session-*.json
```

## 🎛️ Ajustar para reducir más el coste

### Opción A: Solo 1 ciclo
Editar `.agents/config.json`:
```json
"cycles": 1  // En vez de 2
```
**Ahorro**: 50% → $0.02 por sesión

### Opción B: Tokens más bajos
```json
"maxTokens": 2000  // En vez de 3000-4000
```
**Ahorro**: 30% → $0.028 por sesión

### Opción C: Sin PM (solo CTO + QA)
Editar `.agents/config.json`:
```json
"pmReviewAfterCompletion": false
```
**Ahorro**: 30% → $0.028 por sesión

### Opción D: Sin QA (solo CTO)
```json
"requireQAApproval": false
```
**Ahorro**: 50% → $0.02 por sesión

## 💡 Tips para Ahorrar

1. **Batch work**: Agrupa varias acciones y ejecuta una vez
2. **Manual review**: Revisa código tú mismo en vez de QA
3. **PM trimestral**: Ejecuta PM solo cada 3 meses
4. **Haiku siempre**: Nunca cambies a Sonnet/Opus
5. **Low tokens**: Mantén maxTokens bajo (2000-3000)

## 📅 Calendario Sugerido (Ultra-bajo coste)

```
Semana 1: npm run agents:cto        ($0.01)
Semana 2: npm run agents:cto        ($0.01)
Semana 3: npm run agents:start      ($0.04)
Semana 4: npm run agents:pm         ($0.01)

Total mes: $0.07 (7 céntimos)
```

## 🆓 Alternativas Gratuitas

Si no quieres gastar nada:

1. **Desarrollar manualmente** usando el roadmap de Supabase
2. **Usar el UI web** para gestionar acciones
3. **Ejecutar tests locales**: `npm test` (gratis)
4. **Esperar a que Anthropic** ofrezca más créditos

## ⚠️ Límites del Plan Gratuito

### Supabase (Free tier):
- ✅ 500 MB storage (suficiente)
- ✅ 5 GB bandwidth/mes (suficiente)
- ✅ Real-time ilimitado
- ✅ No expira

### Anthropic ($5 gratis):
- ✅ ~125 sesiones completas
- ✅ ~500 ejecuciones de solo CTO
- ⏰ Se agota tras X usos (recarga manual)

## 🎯 Resumen

**Configuración actual**: Ultra low-cost
- Modelo: Haiku (80% más barato)
- Tokens: Reducidos 50%
- Ciclos: Reducidos 60%

**Coste estimado**: $0.04/sesión = **<$1/mes**

**Con $5 gratis de Anthropic**: ~125 sesiones = **4+ meses gratis**

**Recomendación**: Ejecutar **solo cuando necesites** = **casi gratis** ✨