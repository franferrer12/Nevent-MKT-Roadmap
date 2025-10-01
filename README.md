# 🚀 Nevent Strategic Execution Platform

> De roadmap táctico a plataforma estratégica end-to-end

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://franferrer12.github.io/Nevent-MKT-Roadmap/)
[![Version](https://img.shields.io/badge/version-3.1.0-blue)](https://github.com/franferrer12/Nevent-MKT-Roadmap/releases/tag/v3.1.0)
[![License](https://img.shields.io/badge/license-MIT-green)]()
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)]()

Sistema de ejecución estratégica que conecta objetivos del CEO con el trabajo diario del equipo, con seguimiento en tiempo real y jerarquía Company OKRs → Departments → User OKRs → Initiatives → Actions.

---

## ✨ Features

- 🎯 **OKR Management** - Objetivos jerárquicos (Company → Department → Individual)
- 📊 **Strategic Initiatives** - Proyectos vinculados a OKRs con budget tracking
- ✅ **Action Tracking** - Tareas concretas con subtareas y deadlines
- ⚡ **Real-time Sync** - Cambios instantáneos vía WebSockets
- 🔐 **Role-based Access** - Admin, Director, Manager, Viewer
- 📱 **Responsive Design** - Mobile-first, funciona en todos los dispositivos
- 🌙 **Dark Theme** - Tema oscuro moderno

---

## 🚀 Quick Start

### Live Demo

Visita la aplicación en producción: **https://franferrer12.github.io/Nevent-MKT-Roadmap/**

### Local Development

```bash
# Clone repository
git clone https://github.com/franferrer12/Nevent-MKT-Roadmap.git
cd Nevent-MKT-Roadmap

# Open with Live Server (VS Code extension)
# Right-click index.html → "Open with Live Server"

# Or use Python
python -m http.server 8000
# Open http://localhost:8000
```

---

## 📸 Screenshots

### Timeline View
![Timeline](https://via.placeholder.com/800x400?text=Timeline+View)

### Dashboard View (v3.0)
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+View)

### OKR Management
![OKRs](https://via.placeholder.com/800x400?text=OKR+Management)

---

## 🏗️ Architecture

### Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Backend:** Supabase (PostgreSQL 15, Auth, Realtime)
- **Hosting:** GitHub Pages (auto-deploy)
- **No build process** - Single HTML file

### Data Hierarchy

```
Company OKRs (CEO)
    ↓
Departments (Directors)
    ↓
User OKRs (Managers)
    ↓
Initiatives (Projects)
    ↓
Actions (Tasks)
```

---

## 📚 Documentation

Comprehensive documentation available in [`/docs`](./docs):

- **[Architecture](./docs/architecture.md)** - System design, data flow, tech decisions
- **[Database](./docs/database.md)** - Schemas, queries, RLS policies
- **[Development](./docs/development.md)** - Setup, workflows, coding standards
- **[CLAUDE.md](./CLAUDE.md)** - AI assistant guidance

---

## 🎯 Roadmap

### v3.1.0 (Production) ✅ **CURRENT**

**Released:** October 1, 2025

- [x] Schema de base de datos completo (Company OKRs, Departments, User OKRs, Initiatives, Actions)
- [x] 4 Dashboards funcionales (My, CEO, Director, CS)
- [x] Sistema de autenticación por roles (CEO, Director, CSM, User)
- [x] View As system (CEO puede ver como otros roles)
- [x] Creación de OKRs personales
- [x] Creación de Initiatives
- [x] CS Dashboard con métricas (NRR, Churn, Customer Health)
- [x] Sincronización CS metrics → Company OKRs
- [x] Analytics system (localStorage-based)
- [x] Confirmation dialogs (prevención de eliminaciones accidentales)
- [x] Visual overlay en View As mode
- [x] RLS policies configuradas correctamente
- [x] 12 Departments con status filter
- [x] 3 Company OKRs (Growth, Product, Team)

**Documentation:**
- [x] CHANGELOG.md actualizado
- [x] RELEASE_NOTES_v3.1.0.md creado
- [x] Migrations documentadas
- [x] Test users documentados

### v3.2.0 (Planned) 📅

- [ ] Company OKR creation modal (CEO Dashboard)
- [ ] Department OKR creation modal (Director Dashboard)
- [ ] Team Review functionality (Director Dashboard)
- [ ] Customer creation modal (CS Dashboard)
- [ ] Gráficos interactivos con ApexCharts
- [ ] Health scores con alertas automáticas
- [ ] Tracking manual de métricas con formularios

### v3.3.0+ (Future) 🔮

- [ ] Exportación a PDF de dashboards
- [ ] Integración con CRM (HubSpot, Salesforce)
- [ ] Automatizaciones y alertas por email
- [ ] Mobile app (React Native)
- [ ] AI-powered insights y recomendaciones

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- **JavaScript:** ES6+, async/await, descriptive names
- **CSS:** Custom properties, BEM-like naming
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/)

See [Development Guide](./docs/development.md) for details.

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea? [Open an issue](https://github.com/franferrer12/Nevent-MKT-Roadmap/issues/new)

Please include:
- What you were trying to do
- What happened instead
- Your role (admin/editor/viewer)
- Browser and version
- Screenshot if applicable

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Maintainer:** [Fran Ferrer](https://github.com/franferrer12) (fran.ferrer@nevent.es)

**Organization:** Nevent Marketing Team

---

## 🙏 Acknowledgments

- **Supabase** - Backend as a Service
- **GitHub Pages** - Free hosting
- **Claude AI** - Development assistance

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/franferrer12/Nevent-MKT-Roadmap?style=social)
![GitHub forks](https://img.shields.io/github/forks/franferrer12/Nevent-MKT-Roadmap?style=social)
![GitHub issues](https://img.shields.io/github/issues/franferrer12/Nevent-MKT-Roadmap)
![GitHub last commit](https://img.shields.io/github/last-commit/franferrer12/Nevent-MKT-Roadmap)

---

<div align="center">

**[Website](https://franferrer12.github.io/Nevent-MKT-Roadmap/)** • **[Documentation](./docs)** • **[Issues](https://github.com/franferrer12/Nevent-MKT-Roadmap/issues)**

Made with ❤️ by the Nevent Team

</div>