// Architecture Simulator - Simulation and Advanced Features

// Simulation functions
function simulateDataFlow() {
    if (droppedComponents.length === 0) {
        showNotification('Please add components to simulate', 'warning');
        return;
    }
    
    // Show simulation panel
    const panel = document.getElementById('simulationPanel');
    if (panel) {
        panel.style.display = 'block';
    }
    
    // Start simulation steps
    startSimulation();
}

function startSimulation() {
    const steps = [
        { id: 'step1', duration: 2000, message: 'Initializing components...' },
        { id: 'step2', duration: 1500, message: 'Establishing connections...' },
        { id: 'step3', duration: 2500, message: 'Calculating performance...' },
        { id: 'step4', duration: 1800, message: 'Analyzing costs...' },
        { id: 'step5', duration: 1200, message: 'Generating report...' }
    ];
    
    let currentStep = 0;
    
    function runStep() {
        if (currentStep >= steps.length) {
            completeSimulation();
            return;
        }
        
        const step = steps[currentStep];
        const stepElement = document.getElementById(step.id);
        const progressElement = document.getElementById('progress' + (currentStep + 1));
        
        if (stepElement && progressElement) {
            // Highlight current step
            stepElement.classList.add('active');
            
            // Animate progress bar
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                progressElement.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        runStep();
                    }, 500);
                }
            }, step.duration / 50);
        }
        
        currentStep++;
    }
    
    // Start first step
    runStep();
}

function completeSimulation() {
    // Calculate results
    const totalCost = calculateTotalCost();
    const performanceScore = calculatePerformanceScore();
    const scalabilityScore = calculateScalabilityScore();
    const securityScore = calculateSecurityScore();
    
    // Update results display
    updateSimulationResults(totalCost, performanceScore, scalabilityScore, securityScore);
    
    // Show results
    const results = document.getElementById('simulationResults');
    if (results) {
        results.style.display = 'block';
    }
    
    // Animate data flow
    animateDataFlow();
    
    showNotification('Simulation completed successfully!', 'success');
}

function calculateTotalCost() {
    let total = 0;
    droppedComponents.forEach(comp => {
        total += comp.cost;
    });
    return total;
}

function calculatePerformanceScore() {
    // Simple scoring based on component types and connections
    let score = 50; // Base score
    
    // Bonus for load balancers
    const loadBalancers = droppedComponents.filter(comp => comp.name.includes('Load Balancer'));
    score += loadBalancers.length * 15;
    
    // Bonus for caching
    const caches = droppedComponents.filter(comp => comp.name.includes('Redis') || comp.name.includes('Cache'));
    score += caches.length * 10;
    
    // Bonus for CDN
    const cdns = droppedComponents.filter(comp => comp.name.includes('CDN') || comp.name.includes('CloudFront'));
    score += cdns.length * 12;
    
    // Penalty for too many connections (complexity)
    if (connections.length > 10) {
        score -= (connections.length - 10) * 2;
    }
    
    return Math.min(100, Math.max(0, score));
}

function calculateScalabilityScore() {
    let score = 40; // Base score
    
    // Bonus for microservices
    const services = droppedComponents.filter(comp => comp.type === 'service');
    score += services.length * 8;
    
    // Bonus for message queues
    const queues = droppedComponents.filter(comp => comp.type === 'queue');
    score += queues.length * 15;
    
    // Bonus for auto-scaling components
    const autoScaling = droppedComponents.filter(comp => 
        comp.name.includes('Lambda') || comp.name.includes('ECS') || comp.name.includes('Kubernetes')
    );
    score += autoScaling.length * 12;
    
    return Math.min(100, Math.max(0, score));
}

function calculateSecurityScore() {
    let score = 30; // Base score
    
    // Bonus for security components
    const securityComponents = droppedComponents.filter(comp => comp.type === 'security');
    score += securityComponents.length * 20;
    
    // Bonus for WAF
    const wafs = droppedComponents.filter(comp => comp.name.includes('WAF'));
    score += wafs.length * 15;
    
    // Bonus for authentication
    const auth = droppedComponents.filter(comp => 
        comp.name.includes('OAuth') || comp.name.includes('JWT') || comp.name.includes('Auth')
    );
    score += auth.length * 10;
    
    return Math.min(100, Math.max(0, score));
}

function updateSimulationResults(totalCost, performanceScore, scalabilityScore, securityScore) {
    const totalCostElement = document.getElementById('totalCost');
    const performanceElement = document.getElementById('performanceScore');
    const scalabilityElement = document.getElementById('scalabilityScore');
    const securityElement = document.getElementById('securityScore');
    
    if (totalCostElement) totalCostElement.textContent = '$' + totalCost;
    if (performanceElement) performanceElement.textContent = performanceScore + '/100';
    if (scalabilityElement) scalabilityElement.textContent = scalabilityScore + '/100';
    if (securityElement) securityElement.textContent = securityScore + '/100';
}

function animateDataFlow() {
    // Animate connection lines
    const connectionArrows = document.querySelectorAll('.connection-arrow');
    
    connectionArrows.forEach((arrow, index) => {
        setTimeout(() => {
            arrow.classList.add('active');
            
            // Add data particles
            createDataParticles(arrow);
            
            setTimeout(() => {
                arrow.classList.remove('active');
            }, 2000);
        }, index * 500);
    });
}

function createDataParticles(arrow) {
    // Create animated particles along the connection
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.className = 'data-particle';
        particle.style.position = 'absolute';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.background = '#22c55e';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '20';
        particle.style.animation = 'particleMove 2s linear forwards';
        
        // Position particle at start of arrow
        particle.style.left = '0px';
        particle.style.top = '50%';
        particle.style.transform = 'translateY(-50%)';
        
        arrow.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

function closeSimulation() {
    const panel = document.getElementById('simulationPanel');
    if (panel) {
        panel.style.display = 'none';
    }
    
    // Reset simulation state
    const steps = document.querySelectorAll('.simulation-step');
    steps.forEach(step => {
        step.classList.remove('active');
        const progress = step.querySelector('.progress-fill');
        if (progress) {
            progress.style.width = '0%';
        }
    });
    
    const results = document.getElementById('simulationResults');
    if (results) {
        results.style.display = 'none';
    }
}

// Export functions
function exportArchitecture() {
    if (droppedComponents.length === 0) {
        showNotification('No components to export', 'warning');
        return;
    }
    
    const data = {
        components: droppedComponents.map(comp => ({
            id: comp.id,
            type: comp.type,
            name: comp.name,
            cost: comp.cost,
            description: comp.description,
            x: comp.x,
            y: comp.y
        })),
        connections: connections.map(conn => ({
            id: conn.id,
            from: conn.from,
            to: conn.to,
            fromPosition: conn.fromPosition,
            toPosition: conn.toPosition,
            name: conn.name,
            type: conn.type,
            description: conn.description,
            style: conn.style
        })),
        metadata: {
            totalCost: calculateTotalCost(),
            performanceScore: calculatePerformanceScore(),
            scalabilityScore: calculateScalabilityScore(),
            securityScore: calculateSecurityScore(),
            exportedAt: new Date().toISOString(),
            version: '1.0.0'
        }
    };
    
    // Create and download JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'architecture-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Architecture exported successfully!', 'success');
}

// Presentation mode
let isPresentationMode = false;
let currentSlide = 1;
let totalSlides = 1;

function togglePresentation() {
    isPresentationMode = !isPresentationMode;
    
    if (isPresentationMode) {
        startPresentation();
    } else {
        stopPresentation();
    }
}

function startPresentation() {
    const overlay = document.getElementById('presentationOverlay');
    if (overlay) {
        overlay.style.display = 'block';
    }
    
    // Create presentation slides
    createPresentationSlides();
    
    // Update slide counter
    updateSlideCounter();
    
    showNotification('Presentation mode started', 'info');
}

function stopPresentation() {
    const overlay = document.getElementById('presentationOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    isPresentationMode = false;
    currentSlide = 1;
    
    showNotification('Presentation mode stopped', 'info');
}

function createPresentationSlides() {
    const slideContainer = document.querySelector('.presentation-content');
    if (!slideContainer) return;
    
    // Clear existing slides
    slideContainer.innerHTML = '';
    
    // Create slides based on architecture
    const slides = [
        {
            title: 'Architecture Overview',
            content: 'Complete system architecture with all components and connections',
            notes: [
                'Scalable microservices architecture',
                'High availability and fault tolerance',
                'Cost-effective cloud deployment'
            ]
        },
        {
            title: 'Component Analysis',
            content: 'Detailed breakdown of all system components',
            notes: [
                `Total components: ${droppedComponents.length}`,
                `Total connections: ${connections.length}`,
                `Estimated monthly cost: $${calculateTotalCost()}`
            ]
        },
        {
            title: 'Performance Metrics',
            content: 'System performance and scalability analysis',
            notes: [
                `Performance Score: ${calculatePerformanceScore()}/100`,
                `Scalability Score: ${calculateScalabilityScore()}/100`,
                `Security Score: ${calculateSecurityScore()}/100`
            ]
        }
    ];
    
    totalSlides = slides.length;
    
    slides.forEach((slide, index) => {
        const slideElement = document.createElement('div');
        slideElement.className = `presentation-slide ${index === 0 ? 'active' : ''}`;
        slideElement.id = `slide${index + 1}`;
        
        slideElement.innerHTML = `
            <h3>${slide.title}</h3>
            <div class="slide-content">
                <p>${slide.content}</p>
                <div class="architecture-preview">
                    <!-- Architecture diagram will be shown here -->
                </div>
            </div>
        `;
        
        slideContainer.appendChild(slideElement);
    });
    
    // Update notes
    const notesList = document.getElementById('presentationNotes');
    if (notesList && slides[0]) {
        notesList.innerHTML = slides[0].notes.map(note => `<li>${note}</li>`).join('');
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
        updateSlideCounter();
    }
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
        updateSlideCounter();
    }
}

function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.presentation-slide');
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show current slide
    const currentSlideElement = document.getElementById(`slide${slideNumber}`);
    if (currentSlideElement) {
        currentSlideElement.classList.add('active');
    }
    
    // Update notes
    updateSlideNotes(slideNumber);
}

function updateSlideCounter() {
    const currentSlideElement = document.getElementById('currentSlide');
    const totalSlidesElement = document.getElementById('totalSlides');
    
    if (currentSlideElement) currentSlideElement.textContent = currentSlide;
    if (totalSlidesElement) totalSlidesElement.textContent = totalSlides;
}

function updateSlideNotes(slideNumber) {
    const notesList = document.getElementById('presentationNotes');
    if (!notesList) return;
    
    const slideNotes = [
        [
            'Scalable microservices architecture',
            'High availability and fault tolerance',
            'Cost-effective cloud deployment'
        ],
        [
            `Total components: ${droppedComponents.length}`,
            `Total connections: ${connections.length}`,
            `Estimated monthly cost: $${calculateTotalCost()}`
        ],
        [
            `Performance Score: ${calculatePerformanceScore()}/100`,
            `Scalability Score: ${calculateScalabilityScore()}/100`,
            `Security Score: ${calculateSecurityScore()}/100`
        ]
    ];
    
    const notes = slideNotes[slideNumber - 1] || [];
    notesList.innerHTML = notes.map(note => `<li>${note}</li>`).join('');
}

// Arrow styling panel toggle
function toggleArrowStyling() {
    const panel = document.getElementById('arrowStylingPanel');
    if (panel) {
        const isVisible = panel.classList.contains('show');
        
        if (isVisible) {
            panel.classList.remove('show');
            panel.style.display = 'none';
        } else {
            panel.classList.add('show');
            panel.style.display = 'block';
        }
        
        console.log('Arrow styling panel toggled:', !isVisible);
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    return icons[type] || 'info-circle';
}

// Template loading
function loadTemplate(templateName) {
    // Clear existing components
    clearCanvas();
    
    // Load template based on name
    switch (templateName) {
        case 'microservices':
            loadMicroservicesTemplate();
            break;
        case 'serverless':
            loadServerlessTemplate();
            break;
        case 'monolith':
            loadMonolithTemplate();
            break;
        case 'event-driven':
            loadEventDrivenTemplate();
            break;
        default:
            showNotification('Template not found', 'error');
    }
}

function clearCanvas() {
    // Remove all components
    droppedComponents.forEach(comp => {
        if (comp.element && comp.element.parentNode) {
            comp.element.parentNode.removeChild(comp.element);
        }
    });
    
    // Clear arrays
    droppedComponents = [];
    connections = [];
    
    // Clear connections visually
    const connectionArrows = document.querySelectorAll('.connection-arrow');
    connectionArrows.forEach(arrow => arrow.remove());
    
    // Show instruction
    const instruction = document.getElementById('canvasInstruction');
    if (instruction) {
        instruction.style.display = 'block';
    }
    
    // Update counts
    updateComponentCount();
    
    // Save data
    saveData();
}

function loadMicroservicesTemplate() {
    const components = [
        { type: 'service', name: 'API Gateway', cost: 30, x: 100, y: 100 },
        { type: 'service', name: 'User Service', cost: 35, x: 300, y: 100 },
        { type: 'service', name: 'Payment Service', cost: 60, x: 500, y: 100 },
        { type: 'service', name: 'Order Service', cost: 45, x: 300, y: 250 },
        { type: 'database', name: 'PostgreSQL', cost: 70, x: 100, y: 400 },
        { type: 'database', name: 'MongoDB', cost: 55, x: 500, y: 400 },
        { type: 'queue', name: 'Apache Kafka', cost: 50, x: 300, y: 400 },
        { type: 'monitoring', name: 'Prometheus', cost: 40, x: 100, y: 550 },
        { type: 'monitoring', name: 'Grafana', cost: 30, x: 500, y: 550 }
    ];
    
    components.forEach(comp => {
        createDroppedComponent({
            type: comp.type,
            name: comp.name,
            cost: comp.cost,
            description: `${comp.name} component`,
            icon: getComponentIcon(comp.type)
        }, comp.x, comp.y);
    });
    
    showNotification('Microservices template loaded', 'success');
}

function loadServerlessTemplate() {
    const components = [
        { type: 'service', name: 'API Gateway', cost: 30, x: 200, y: 100 },
        { type: 'cloud', name: 'AWS Lambda', cost: 15, x: 100, y: 250 },
        { type: 'cloud', name: 'AWS Lambda', cost: 15, x: 300, y: 250 },
        { type: 'cloud', name: 'AWS Lambda', cost: 15, x: 500, y: 250 },
        { type: 'database', name: 'DynamoDB', cost: 40, x: 200, y: 400 },
        { type: 'queue', name: 'AWS SQS', cost: 25, x: 400, y: 400 },
        { type: 'storage', name: 'AWS S3', cost: 20, x: 100, y: 550 },
        { type: 'cdn', name: 'CloudFront', cost: 25, x: 500, y: 550 }
    ];
    
    components.forEach(comp => {
        createDroppedComponent({
            type: comp.type,
            name: comp.name,
            cost: comp.cost,
            description: `${comp.name} component`,
            icon: getComponentIcon(comp.type)
        }, comp.x, comp.y);
    });
    
    showNotification('Serverless template loaded', 'success');
}

function loadMonolithTemplate() {
    const components = [
        { type: 'service', name: 'Load Balancer', cost: 25, x: 200, y: 100 },
        { type: 'service', name: 'Web Application', cost: 80, x: 200, y: 250 },
        { type: 'database', name: 'PostgreSQL', cost: 70, x: 200, y: 400 },
        { type: 'monitoring', name: 'Application Monitor', cost: 35, x: 200, y: 550 }
    ];
    
    components.forEach(comp => {
        createDroppedComponent({
            type: comp.type,
            name: comp.name,
            cost: comp.cost,
            description: `${comp.name} component`,
            icon: getComponentIcon(comp.type)
        }, comp.x, comp.y);
    });
    
    showNotification('Monolith template loaded', 'success');
}

function loadEventDrivenTemplate() {
    const components = [
        { type: 'service', name: 'Event Producer', cost: 40, x: 100, y: 100 },
        { type: 'queue', name: 'Apache Kafka', cost: 50, x: 300, y: 100 },
        { type: 'service', name: 'Event Consumer', cost: 35, x: 500, y: 100 },
        { type: 'service', name: 'Event Processor', cost: 45, x: 300, y: 250 },
        { type: 'database', name: 'Event Store', cost: 60, x: 300, y: 400 },
        { type: 'monitoring', name: 'Event Monitor', cost: 30, x: 300, y: 550 }
    ];
    
    components.forEach(comp => {
        createDroppedComponent({
            type: comp.type,
            name: comp.name,
            cost: comp.cost,
            description: `${comp.name} component`,
            icon: getComponentIcon(comp.type)
        }, comp.x, comp.y);
    });
    
    showNotification('Event-driven template loaded', 'success');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes particleMove {
        0% {
            left: 0px;
            opacity: 1;
        }
        100% {
            left: 100%;
            opacity: 0;
        }
    }
    
    .simulation-step.active {
        background: #f0f9ff;
        border-left: 4px solid #3b82f6;
    }
    
    .progress-fill {
        background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        transition: width 0.3s ease;
    }
    
    .results-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .result-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: center;
    }
    
    .result-card h5 {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        color: #64748b;
    }
    
    .result-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
    }
    
    .simulation-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
        margin-top: 1rem;
    }
    
    .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .btn-primary {
        background: #3b82f6;
        color: white;
    }
    
    .btn-primary:hover {
        background: #2563eb;
    }
    
    .btn-secondary {
        background: #6b7280;
        color: white;
    }
    
    .btn-secondary:hover {
        background: #4b5563;
    }
    
    .presentation-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #1e293b;
        color: white;
        z-index: 10000;
        display: none;
    }
    
    .presentation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        border-bottom: 1px solid #334155;
    }
    
    .presentation-controls {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .presentation-btn {
        width: 40px;
        height: 40px;
        background: #475569;
        border: none;
        border-radius: 0.5rem;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
    }
    
    .presentation-btn:hover {
        background: #64748b;
    }
    
    .slide-counter {
        font-size: 0.875rem;
        color: #94a3b8;
    }
    
    .presentation-content {
        padding: 2rem;
        height: calc(100vh - 200px);
        overflow-y: auto;
    }
    
    .presentation-slide {
        display: none;
    }
    
    .presentation-slide.active {
        display: block;
    }
    
    .presentation-slide h3 {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: #f1f5f9;
    }
    
    .slide-content {
        font-size: 1.125rem;
        line-height: 1.6;
        color: #cbd5e1;
    }
    
    .presentation-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem 2rem;
        border-top: 1px solid #334155;
        background: #0f172a;
    }
    
    .presentation-notes h4 {
        margin: 0 0 0.5rem 0;
        color: #f1f5f9;
    }
    
    .presentation-notes ul {
        margin: 0;
        padding-left: 1.5rem;
        color: #cbd5e1;
    }
    
    .mini-status {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 1000;
        font-size: 0.875rem;
    }
    
    .status-icon {
        color: #22c55e;
    }
    
    .simulation-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        min-width: 400px;
        max-width: 500px;
        display: none;
    }
    
    .simulation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
    }
    
    .simulation-step {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        margin-bottom: 0.75rem;
        transition: all 0.3s;
    }
    
    .step-icon {
        width: 32px;
        height: 32px;
        background: #e5e7eb;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #6b7280;
    }
    
    .step-content {
        flex: 1;
    }
    
    .step-content h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.875rem;
        color: #374151;
    }
    
    .step-content p {
        margin: 0 0 0.5rem 0;
        font-size: 0.75rem;
        color: #6b7280;
    }
    
    .progress-bar {
        width: 100%;
        height: 4px;
        background: #e5e7eb;
        border-radius: 2px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        width: 0%;
        background: #3b82f6;
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(style);

// Make functions globally available
window.simulateDataFlow = simulateDataFlow;
window.exportArchitecture = exportArchitecture;
window.togglePresentation = togglePresentation;
window.toggleArrowStyling = toggleArrowStyling;
window.loadTemplate = loadTemplate;
window.closeSimulation = closeSimulation;
window.previousSlide = previousSlide;
window.nextSlide = nextSlide;
