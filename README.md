# Galileo Platform - Ways of Work & Product Operative Model

An interactive web-based visualization of the Galileo Platform's unified socio-technical framework, showcasing how Discovery, Delivery, and Operations work together in a continuous flow model.

## Overview

This project presents the **Galileo Platform Ways of Work** - a socio-technical continuous flow model where Discovery, Delivery, and Operations move in parallel, share information continuously, and adapt in real time to uncertainty. The framework is designed for e-commerce, stores, lab, and logistics operations across Mexico, Chile, and Colombia.

## Key Concepts

### 1. Ways of Work
Three parallel tracks - Discovery, Delivery, and Operations - running continuously with feedback loops instead of handoffs. This approach embodies the principle of "dancing with the customer problem" rather than following rigid phases.

### 2. Product Operative Model (POM)
A non-linear operating system where stream-aligned teams own bounded contexts. Features:
- Three-cycle orchestration
- Outcome slicing
- Triads as cognitive units
- System intelligence where Operations feeds data to strengthen Discovery

### 3. Socio-Technical Architecture (STA)
The organizational structure and software architecture are unified as one system, demonstrating context ownership across different domains (e-commerce, lab operations, logistics, etc.).

### 4. Role POV Model
Defines responsibilities and perspectives for various roles including:
- Product Manager
- Tech Lead
- Software Engineer
- Data Engineer
- Platform Engineer
- SRE
- QA Enablement

### 5. Residuality Theory
Every cycle leaves the system stronger. Stressors surface in Operations, robustness accumulates in Delivery, and assumptions are challenged in Discovery.

## Features

- **Interactive Visualizations**: Four comprehensive views with dynamic SVG diagrams
- **Multiple View Modes**:
  - Standard flow
  - Insight loop highlighting
  - Stability loop highlighting
  - Residuality theory lens
- **Responsive Design**: Works across desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS and custom glassmorphism effects
- **Smooth Animations**: GSAP-powered transitions and interactions

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom styles with Tailwind CSS
- **JavaScript**: Vanilla JS for interactivity
- **GSAP**: Animation library
- **Google Fonts**: Space Grotesk and Inter typefaces
- **Material Symbols**: Icon set

## Project Structure

```
galileo-framework-ways-of-work/
├── index.html          # Main application file (self-contained)
└── README.md          # This file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No build tools or package managers required

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd galileo-framework-ways-of-work
```

2. Open the file directly in your browser:
```bash
open index.html
```

Or use a local development server:
```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Usage

### Navigation

The application features a fixed top navigation bar with four main views:

1. **Ways of Work**: Continuous DDO (Discovery-Delivery-Operations) flow visualization
2. **Product Operative Model**: Three-cycle orchestration and team structure
3. **Socio-Technical Architecture**: Context ownership and system topology
4. **Role POV Model**: Individual role responsibilities and contributions

### Interactive Elements

- **Hover Effects**: Hover over diagram elements to see detailed information
- **Mode Switching**: Use buttons to toggle between different visualization modes
- **Click Interactions**: Click on contexts, roles, or team elements for detailed views
- **Smooth Scrolling**: Navigate through comprehensive sections in each view

### Visualization Modes

Each view offers multiple modes to highlight different aspects:

- **Ways of Work**:
  - Standard flow
  - Insight loop
  - Stability loop
  - Residuality view

- **Product Operative Model**:
  - Standard
  - Outcomes focus
  - Continuous mode
  - Residuality lens

- **Socio-Technical Architecture**:
  - Standard view
  - DDO flow layer
  - Team topology layer
  - Residuality theory layer

## Architecture

The application is a single-page application (SPA) with all resources embedded:

- **Self-contained**: All HTML, CSS, and JavaScript in one file
- **CDN Dependencies**: External libraries loaded from CDNs
- **No Build Step**: Direct browser execution
- **Modular JavaScript**: Well-organized functions for each view

## Organizational Context

**Company**: Lentes Galileo S.A.P.I. de C.V.
**Platform**: Galileo Platform
**Domains**: E-commerce, Retail Stores, Laboratory Operations, Logistics
**Markets**: Mexico, Chile, Colombia

## Design Philosophy

### Core Principles

1. **Continuous Flow Over Phases**: Work happens in parallel, not sequentially
2. **Dance, Not Choreography**: Adaptive response to customer problems
3. **Feedback Loops Over Handoffs**: Continuous information sharing
4. **System Thinking**: Software architecture and organization as one unified system
5. **Residuality**: Each cycle strengthens the overall system

### Visual Design

- **Dark Theme**: Professional dark background (#0b0f19)
- **Glassmorphism**: Translucent panels with backdrop blur
- **Gradient Accents**: Blue, green, and pink gradients for visual hierarchy
- **Material Symbols**: Consistent iconography
- **Space Grotesk Font**: Modern, geometric typeface for headings

## Contributing

This is an internal framework documentation tool for Galileo Platform. For updates or modifications, please:

1. Create a feature branch
2. Make your changes
3. Test thoroughly across different browsers
4. Submit a pull request with a clear description

## Version History

- **v3** (Latest): Updated tools and interactive visualizations
- **v2**: Interactive visualization for the Ways of Work
- **v1**: Initial framework documentation

## License

Internal use only - Lentes Galileo S.A.P.I. de C.V.

## Contact

For questions about the Galileo Platform framework or this visualization tool, please contact the Product or Engineering teams.

---

**Note**: This is a living document that evolves with the Galileo Platform's operating model. The visualization represents the current state of our socio-technical system design.
