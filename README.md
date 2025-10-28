# Architecture Simulator

A powerful tool for Solution Architects to design, simulate, and present software architectures with drag-and-drop functionality and real-time cost analysis.

## 🚀 Features

### Core Functionality
- **Drag & Drop Interface**: Intuitive component placement and connection
- **Real-time Cost Simulation**: Live cost calculation and analysis
- **Performance Metrics**: Automated performance and scalability scoring
- **Interactive Presentations**: Built-in presentation mode for client meetings
- **Export Capabilities**: Export architecture as JSON for documentation

### Component Library
- **Cloud Providers**: AWS, Azure, Google Cloud components
- **Microservices**: API Gateway, Load Balancer, various services
- **Databases**: PostgreSQL, MongoDB, Redis, Elasticsearch
- **Message Queues**: Apache Kafka, RabbitMQ, AWS SQS
- **Monitoring**: Prometheus, Grafana, ELK Stack
- **Security**: OAuth 2.0, JWT, WAF
- **CDN & Storage**: CloudFront, CloudFlare, AWS S3/EBS

### Advanced Features
- **Hand Tool**: Pan and navigate large architectures
- **Zoom Controls**: Zoom in/out with mouse wheel or buttons
- **Connection System**: Visual connections with customizable styling
- **Template Library**: Pre-built architecture templates
- **Auto-save**: Automatic saving of work progress
- **Keyboard Shortcuts**: Efficient workflow with hotkeys

## 📁 File Structure

```
architecture-simulator/
├── main.html              # Main entry point
├── styles.css             # All CSS styling
├── app.js                 # Core application logic
├── simulation.js          # Simulation and advanced features
├── components.html        # Component library and templates
├── canvas.html           # Canvas and workspace
├── connections.html      # Connection system and styling
├── simulation.html       # Simulation panels and presentation
└── README.md             # This documentation
```

## 🛠️ Installation

1. **Clone or Download** the project files
2. **Open** `main.html` in a modern web browser
3. **Start Building** your architecture!

No server setup required - runs entirely in the browser.

## 🎯 Usage

### Getting Started
1. **Open** `main.html` in your browser
2. **Drag components** from the sidebar to the canvas
3. **Connect components** by clicking on them and dragging from connection points
4. **Customize connections** by clicking on arrows to open the style editor
5. **Simulate** your architecture to see cost and performance metrics

### Keyboard Shortcuts
- **H**: Toggle Hand tool for panning
- **Ctrl + +**: Zoom in
- **Ctrl + -**: Zoom out
- **Ctrl + 0**: Reset zoom
- **Escape**: Close all modals

### Templates
- **Microservices**: Complete microservices architecture
- **Serverless**: Event-driven serverless setup
- **Monolith**: Traditional monolithic application
- **Event-Driven**: Event-driven architecture with message queues

### Connection Styling
- **Width**: 1px, 3px, 5px stroke width
- **Style**: Solid, dashed, dotted lines
- **Type**: Straight, curved, right-angled connections
- **Arrowhead**: Triangle, circle, diamond arrowheads

## 🔧 Customization

### Adding New Components
1. Edit `components.html`
2. Add new component items with appropriate data attributes
3. Update `getComponentIcon()` function in `app.js`

### Modifying Styles
1. Edit `styles.css`
2. All styling is organized by component type
3. Responsive design included for mobile devices

### Extending Functionality
1. Add new functions to `app.js` for core features
2. Add simulation features to `simulation.js`
3. Update HTML templates as needed

## 📊 Simulation Features

### Cost Analysis
- Real-time cost calculation
- Monthly cost estimates
- Component-based pricing

### Performance Scoring
- Load balancer detection
- Caching optimization
- CDN integration
- Complexity analysis

### Scalability Assessment
- Microservices architecture
- Message queue integration
- Auto-scaling components
- Event-driven patterns

### Security Evaluation
- Security component detection
- Authentication mechanisms
- WAF integration
- Best practices compliance

## 🎨 Design Philosophy

### Excalidraw-inspired Interface
- Clean, minimalist design
- Hand-drawn aesthetic elements
- Intuitive user experience
- Professional presentation quality

### Modern Web Standards
- Responsive design
- CSS Grid and Flexbox
- Modern JavaScript (ES6+)
- Accessibility considerations

## 🚀 Performance

### Optimizations
- Hardware acceleration for smooth animations
- Throttled event handlers
- Efficient DOM manipulation
- Local storage for auto-save

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 📝 Development

### Code Organization
- **Modular Structure**: Separated concerns across multiple files
- **Global Functions**: HTML onclick compatibility
- **Event Delegation**: Efficient event handling
- **Error Handling**: Try-catch blocks for robustness

### Future Enhancements
- Real-time collaboration
- Version control
- Advanced analytics
- Cloud integration
- API documentation generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues, questions, or feature requests:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description

---

**Built with ❤️ for Solution Architects**