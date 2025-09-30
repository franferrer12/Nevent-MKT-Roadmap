# ✅ Manual Test Checklist - Post-Fixes

**Fecha**: 2025-09-30
**Versión**: v3.0.1 (Post critical fixes)
**Tester**: Manual validation required

---

## 🔐 SECURITY TESTS

### XSS Protection
- [ ] **Timeline XSS**: Crear action con título: `<script>alert('xss')</script>`
  - Expected: Text rendered safely, no script execution
  - Location: Timeline view, action cards

- [ ] **Toast XSS**: Trigger error with HTML in message
  - Expected: HTML sanitized, no execution
  - Location: Any error message

### Loading States
- [ ] **Login**: Rapid double-click "Iniciar sesión"
  - Expected: Button shows spinner, second click ignored
  - Credentials: ceo@nevent.es / Test1234!

- [ ] **Create OKR**: Double-click "Crear OKR"
  - Expected: Button disabled during save, no duplicates
  - Location: User dashboard → Nuevo OKR

- [ ] **Create Customer**: Double-click save in customer form
  - Expected: Loading state, no duplicate customers
  - Location: CS Dashboard → Nuevo Cliente

- [ ] **Create Action**: Double-click save in action form
  - Expected: Loading state, no duplicate actions
  - Location: Roadmap → Nueva Acción

---

## 🎓 UX TESTS

### Onboarding Flow
- [ ] **First Login**: Clear localStorage, login fresh
  - Command: `localStorage.clear()` in console, then refresh
  - Expected: Onboarding modal appears after 500ms

- [ ] **Complete Button**: Click "¡Empecemos!"
  - Expected: Modal closes, welcome toast appears
  - Check: `localStorage.getItem('onboarding_completed')` === 'true'

- [ ] **Skip Button**: Reset and click "Saltar"
  - Command: `resetOnboarding()` in console, refresh
  - Expected: Modal closes, no toast, marked as completed

- [ ] **Second Login**: Logout and login again
  - Expected: NO onboarding modal (already completed)

### Metric Tooltips
- [ ] **Tooltip Hover**: Hover over any metric label with "?" icon
  - Expected: Tooltip appears with title, description, formula
  - Test on: NRR, Churn, Health Score (CS Dashboard)

- [ ] **Tooltip Animation**: Quick hover in/out
  - Expected: Smooth fade in/out, no flicker

---

## 🔍 INTEGRATION TESTS

### Dashboard Navigation
- [ ] **CEO Dashboard**: Login as ceo@nevent.es
  - [ ] Company OKRs grid loads
  - [ ] Department health grid shows 7 departments
  - [ ] View As dropdown works
  - [ ] No console errors

- [ ] **Director Dashboard**: Login as director@nevent.es
  - [ ] Department metrics load
  - [ ] Team members grid works
  - [ ] No console errors

- [ ] **CS Dashboard**: Login as csm@nevent.es
  - [ ] Customer list loads
  - [ ] NRR/Churn calculations show
  - [ ] Health scores visible
  - [ ] Tooltips work on metrics
  - [ ] No console errors

- [ ] **User Dashboard**: Login as user@nevent.es
  - [ ] Personal OKRs load
  - [ ] Can create new OKR
  - [ ] Initiatives visible
  - [ ] No console errors

### Data Persistence
- [ ] **Create OKR**: Create test OKR, refresh page
  - Expected: OKR persists in Supabase

- [ ] **Create Customer**: Create test customer, refresh
  - Expected: Customer persists

- [ ] **Create Action**: Create test action, refresh
  - Expected: Action visible in timeline

---

## 📱 RESPONSIVE TESTS

- [ ] **Mobile View**: Resize browser to 375px width
  - [ ] Login page responsive
  - [ ] Dashboard adapts
  - [ ] Modals fit screen
  - [ ] Tooltips don't overflow

---

## 🚀 PRODUCTION VERIFICATION

- [ ] **Production URL**: Visit https://franferrer12.github.io/Nevent-MKT-Roadmap/
  - [ ] Page loads without errors
  - [ ] Login works
  - [ ] DOMPurify loaded (check Network tab)
  - [ ] All features work same as local

- [ ] **Console Errors**: Check browser console
  - Expected: No red errors (warnings OK)

---

## 🧪 EDGE CASES

- [ ] **Offline Mode**: Disconnect network, try to save
  - Expected: Error message, loading state clears

- [ ] **Invalid Data**: Try to create OKR with empty title
  - Expected: Validation error, loading clears

- [ ] **Session Expiry**: Wait 60 min, try to save
  - Expected: Graceful re-auth or error

---

## ✅ SIGN-OFF

**Tested by**: _______________
**Date**: _______________
**Pass Rate**: ___/35 tests

**Critical Issues Found**:
- None / List below

**Notes**:


---

## 🔧 DEBUG COMMANDS

```javascript
// Reset onboarding
resetOnboarding()

// Clear all localStorage
localStorage.clear()

// Check analytics events
analytics.getEvents()

// Force show onboarding
document.getElementById('onboardingOverlay').classList.add('active')

// Test XSS (should be safe)
const testXSS = '<script>alert("xss")</script>';
sanitizeHTML(testXSS) // Should return empty or escaped

// Check current user
console.log(currentUser)
```