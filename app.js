// Architecture Simulator - Main JavaScript Logic

// Global variables
let droppedComponents = [];
let connections = [];
let connectionCounter = 0;
let isHandMode = false;
let isPanning = false;
let isConnecting = false;
let currentZoom = 1;
let canvasOffset = { x: 0, y: 0 };
let panStart = { x: 0, y: 0 };
let currentEditingConnection = null;

// Arrow styling
let arrowStyle = {
    strokeWidth: 3,
    strokeStyle: 'solid',
    roughness: 0,
    arrowType: 'straight',
    arrowhead: 'triangle'
};

// DOM elements
let canvas, sidebar, workspace;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Get DOM elements
    canvas = document.getElementById('canvas');
    sidebar = document.querySelector('.sidebar');
    workspace = document.querySelector('.workspace');
    
    // Initialize canvas
    initializeCanvas();
    
    // Initialize component library
    initializeComponentLibrary();
    
    // Initialize arrow styling
    initializeArrowStyling();
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts();
    
    // Initialize auto-save
    initializeAutoSave();
    
    // Load saved data
    loadSavedData();
    
    console.log('Architecture Simulator initialized successfully!');
}

// Canvas initialization
function initializeCanvas() {
    if (!canvas) return;
    
    // Set initial transform
    canvas.style.transform = `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${currentZoom})`;
    
    // Add event listeners
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('wheel', handleCanvasWheel);
    canvas.addEventListener('dragover', handleCanvasDragOver);
    canvas.addEventListener('drop', handleCanvasDrop);
    
    // Add click event delegation for arrows
    canvas.addEventListener('click', handleCanvasClick);
    
    // Prevent context menu
    canvas.addEventListener('contextmenu', e => e.preventDefault());
}

// Component library initialization
function initializeComponentLibrary() {
    const componentItems = document.querySelectorAll('.component-item');
    const searchBox = document.getElementById('componentSearch');
    
    // Add drag event listeners to components
    componentItems.forEach(item => {
        item.addEventListener('dragstart', handleComponentDragStart);
        item.addEventListener('dragend', handleComponentDragEnd);
    });
    
    // Add search functionality
    if (searchBox) {
        searchBox.addEventListener('input', handleComponentSearch);
    }
    
    // Update component count
    updateComponentCount();
}

// Drag from library → canvas
function handleComponentDragStart(e) {
    try {
        const item = e.currentTarget;
        const iconEl = item.querySelector('i');
        const data = {
            type: item.dataset.type,
            name: item.dataset.name,
            cost: item.dataset.cost,
            description: item.dataset.description,
            icon: iconEl ? iconEl.className : 'fas fa-box'
        };

        e.dataTransfer.setData('text/plain', JSON.stringify(data));
        e.dataTransfer.effectAllowed = 'copy';
        item.classList.add('dragging');
        console.log('Drag start from library:', data);
    } catch (err) {
        console.error('Error in handleComponentDragStart:', err);
    }
}

function handleComponentDragEnd(e) {
    const item = e.currentTarget;
    item.classList.remove('dragging');
    console.log('Drag end from library');
}

// Arrow styling initialization
function initializeArrowStyling() {
    const panel = document.getElementById('arrowStylingPanel');
    const floatingPanel = document.getElementById('floatingArrowPanel');
    
    if (!panel || !floatingPanel) return;
    
    // Add event listeners to main panel
    panel.addEventListener('click', handleStylingPanelClick);
    
    // Add event listeners to floating panel
    floatingPanel.addEventListener('click', handleFloatingPanelClick);
    
    // Auto-hide floating panel when clicking outside
    document.addEventListener('click', handleOutsideClick);
}

// Keyboard shortcuts
function initializeKeyboardShortcuts() {
    // Hand tool toggle (H key)
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            toggleHandMode();
        }
        
        // Zoom shortcuts
        if (e.ctrlKey) {
            if (e.key === '=' || e.key === '+') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                resetZoom();
            }
        }
        
        // Escape key
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Auto-save functionality
function initializeAutoSave() {
    setInterval(() => {
        saveData();
    }, 30000); // Save every 30 seconds
}

// Load saved data
function loadSavedData() {
    try {
        const savedData = localStorage.getItem('architectureSimulator');
        if (savedData) {
            const data = JSON.parse(savedData);
            droppedComponents = data.components || [];
            connections = data.connections || [];
            currentZoom = data.zoom || 1;
            canvasOffset = data.offset || { x: 0, y: 0 };
            
            // Redraw components
            redrawComponents();
            
            // Redraw connections
            redrawConnections();
            
            // Update zoom
            updateZoom();
            
            console.log('Data loaded successfully');
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Save data
function saveData() {
    try {
        const data = {
            components: droppedComponents,
            connections: connections,
            zoom: currentZoom,
            offset: canvasOffset,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('architectureSimulator', JSON.stringify(data));
        console.log('Data saved successfully');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Canvas event handlers
function handleCanvasMouseDown(e) {
    console.log('Canvas mousedown - Target:', e.target);
    
    // Check if clicking on an arrow
    const arrow = e.target.closest('.connection-arrow');
    if (arrow) {
        console.log('Canvas mousedown on arrow - allowing event to propagate');
        return; // Let the arrow handle the event
    }
    
    if (isHandMode && e.button === 0) {
        // Start panning
        isPanning = true;
        panStart = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
        e.preventDefault();
        e.stopPropagation();
    }
}

function handleCanvasMouseMove(e) {
    if (isHandMode && isPanning) {
        // Pan canvas
        const deltaX = e.clientX - panStart.x;
        const deltaY = e.clientY - panStart.y;
        
        canvasOffset.x += deltaX;
        canvasOffset.y += deltaY;
        
        updateZoom();
        
        panStart = { x: e.clientX, y: e.clientY };
    }
}

function handleCanvasMouseUp(e) {
    if (isHandMode) {
        isPanning = false;
        canvas.style.cursor = 'grab';
    }
}

function handleCanvasClick(e) {
    console.log('Canvas click - Target:', e.target);
    
    // Check if clicking on an arrow
    const arrow = e.target.closest('.connection-arrow');
    if (arrow) {
        console.log('🎯 Arrow clicked via canvas delegation!', arrow.dataset.connectionId);
        
        // Find the connection
        const connectionId = arrow.dataset.connectionId;
        const connection = connections.find(conn => conn.id === connectionId);
        
        if (connection) {
            console.log('Found connection:', connection);
            
            // Select this connection
            selectConnection(connection.id);
            
            // Open style editor
            openConnectionStyleEditor(connection, e);
            
            // Show notification for debugging
            if (typeof showNotification === 'function') {
                showNotification('Arrow clicked! Opening style editor...', 'info');
            }
        }
        
        e.preventDefault();
        e.stopPropagation();
        return;
    }
}

function handleCanvasWheel(e) {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, currentZoom * delta));
    
    if (newZoom !== currentZoom) {
        currentZoom = newZoom;
        updateZoom();
    }
}

function handleCanvasDragOver(e) {
    e.preventDefault();
}

function handleCanvasDrop(e) {
    e.preventDefault();
    
    const componentData = e.dataTransfer.getData('text/plain');
    if (!componentData) return;
    
    const data = JSON.parse(componentData);
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvasOffset.x) / currentZoom;
    const y = (e.clientY - rect.top - canvasOffset.y) / currentZoom;
    
    createDroppedComponent(data, x, y);
}

// Component creation and management
function createDroppedComponent(data, x, y) {
    const component = document.createElement('div');
    component.className = 'dropped-component';
    component.style.left = x + 'px';
    component.style.top = y + 'px';
    
    component.innerHTML = `
        <i class="${data.icon}"></i>
        <h3>${data.name}</h3>
        <div class="cost">$${data.cost}/mo</div>
        <button class="delete-btn" onclick="deleteComponent(this)">×</button>
    `;
    
    // Add component data
    component.dataset.type = data.type;
    component.dataset.name = data.name;
    component.dataset.cost = data.cost;
    component.dataset.description = data.description;
    
    // Add event listeners
    component.addEventListener('mousedown', handleComponentMouseDown);
    component.addEventListener('click', handleComponentClick);
    
    canvas.appendChild(component);
    
    // Store component reference
    const componentData = {
        id: 'comp_' + Date.now(),
        element: component,
        type: data.type,
        name: data.name,
        cost: parseInt(data.cost),
        description: data.description,
        x: x,
        y: y
    };
    
    droppedComponents.push(componentData);
    component.dataset.id = componentData.id;
    
    // Hide instruction
    const instruction = document.getElementById('canvasInstruction');
    if (instruction) {
        instruction.style.display = 'none';
    }
    
    // Update component count
    updateComponentCount();
    
    // Save data
    saveData();
}

// Component event handlers
function handleComponentMouseDown(e) {
    if (isHandMode) return;
    
    e.stopPropagation();
    
    const component = e.target.closest('.dropped-component');
    if (!component) return;
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = parseFloat(component.style.left);
    const startTop = parseFloat(component.style.top);
    
    let isDragging = false;
    const dragThreshold = 5;
    
    function handleMouseMove(e) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        if (!isDragging && (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold)) {
            isDragging = true;
            component.style.cursor = 'grabbing';
        }
        
        if (isDragging) {
            const newX = startLeft + deltaX / currentZoom;
            const newY = startTop + deltaY / currentZoom;
            
            component.style.left = newX + 'px';
            component.style.top = newY + 'px';
            
            // Update component data
            const componentData = droppedComponents.find(c => c.element === component);
            if (componentData) {
                componentData.x = newX;
                componentData.y = newY;
            }
        }
    }
    
    function handleMouseUp() {
        if (isDragging) {
            component.style.cursor = 'move';
            saveData();
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleComponentClick(e) {
    if (isHandMode) return;
    
    e.stopPropagation();
    
    const component = e.target.closest('.dropped-component');
    if (!component) return;
    
    // Toggle connection mode
    isConnecting = !isConnecting;
    
    if (isConnecting) {
        showConnectionPoints(component);
        component.classList.add('connecting');
    } else {
        hideConnectionPoints();
        component.classList.remove('connecting');
    }
}

// Connection management
function showConnectionPoints(component) {
    hideConnectionPoints();
    
    const positions = ['top', 'right', 'bottom', 'left'];
    
    positions.forEach(position => {
        const point = document.createElement('div');
        point.className = `connection-point ${position}`;
        point.dataset.position = position;
        point.dataset.componentId = component.dataset.id;
        
        // Add event listeners
        point.addEventListener('mousedown', handleConnectionPointMouseDown);
        
        component.appendChild(point);
    });
}

function hideConnectionPoints() {
    const points = document.querySelectorAll('.connection-point');
    points.forEach(point => point.remove());
    
    // Remove connecting class from all components
    const components = document.querySelectorAll('.dropped-component');
    components.forEach(comp => comp.classList.remove('connecting'));
    
    isConnecting = false;
}

// Connection point handlers
function handleConnectionPointMouseDown(e) {
    e.stopPropagation();
    
    const point = e.target;
    const component = point.closest('.dropped-component');
    const position = point.dataset.position;
    
    // Create temporary line
    const tempLine = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tempLine.className = 'temp-connection-line';
    tempLine.style.position = 'absolute';
    tempLine.style.pointerEvents = 'none';
    tempLine.style.zIndex = '90';
    
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('stroke', '#3b82f6');
    line.setAttribute('stroke-width', '3');
    line.setAttribute('stroke-dasharray', '8,4');
    line.setAttribute('fill', 'none');
    
    tempLine.appendChild(line);
    canvas.appendChild(tempLine);
    
    // Get starting position
    const componentRect = component.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const startX = componentRect.left + componentRect.width / 2 - canvasRect.left;
    const startY = componentRect.top + componentRect.height / 2 - canvasRect.top;
    
    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', startX);
    line.setAttribute('y2', startY);
    
    function handleMouseMove(e) {
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        
        // Check for snap targets
        const snapTarget = findSnapTarget(x, y);
        if (snapTarget) {
            showSnapIndicator(snapTarget.x, snapTarget.y);
        } else {
            hideSnapIndicator();
        }
    }
    
    function handleMouseUp(e) {
        const x = e.clientX - canvasRect.left;
        const y = e.clientY - canvasRect.top;
        
        const snapTarget = findSnapTarget(x, y);
        if (snapTarget) {
            createConnection(component, position, snapTarget.component, snapTarget.position);
        }
        
        // Clean up
        tempLine.remove();
        hideSnapIndicator();
        hideConnectionPoints();
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

// Connection creation
function createConnection(fromComponent, fromPosition, toComponent, toPosition) {
    const connection = {
        id: 'conn_' + (++connectionCounter),
        from: fromComponent.dataset.id,
        to: toComponent.dataset.id,
        fromPosition: fromPosition,
        toPosition: toPosition,
        name: `Connection ${connectionCounter}`,
        type: 'data',
        description: '',
        created: new Date().toISOString(),
        style: {
            strokeWidth: 3,
            strokeStyle: 'solid',
            roughness: 0,
            arrowType: 'straight',
            arrowhead: 'triangle'
        }
    };
    
    connections.push(connection);
    drawConnection(connection);
    
    // Save data
    saveData();
    
    console.log('Connection created:', connection);
}

// Drawing connections
function drawConnection(connection) {
    const fromComponent = document.querySelector(`[data-id="${connection.from}"]`);
    const toComponent = document.querySelector(`[data-id="${connection.to}"]`);
    
    if (!fromComponent || !toComponent) return;
    
    const fromPoint = getConnectionPointPosition(fromComponent, connection.fromPosition);
    const toPoint = getConnectionPointPosition(toComponent, connection.toPosition);
    
    const style = connection.style || arrowStyle;
    
    // Calculate distance and angle
    const deltaX = toPoint.x - fromPoint.x;
    const deltaY = toPoint.y - fromPoint.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
    
    // Create arrow container
    const arrow = document.createElement('div');
    arrow.className = 'connection-arrow';
    arrow.dataset.connectionId = connection.id;
    arrow.style.position = 'absolute';
    arrow.style.left = fromPoint.x + 'px';
    arrow.style.top = fromPoint.y + 'px';
    arrow.style.width = distance + 'px';
    arrow.style.height = Math.max(style.strokeWidth + 20, 30) + 'px';
    arrow.style.pointerEvents = 'auto';
    arrow.style.zIndex = '10';
    arrow.style.cursor = 'pointer';
    arrow.style.background = 'transparent';
    arrow.style.border = 'none';
    arrow.style.outline = 'none';
    arrow.style.userSelect = 'none';
    
    console.log('Arrow created with pointer-events: auto');
    
    // Create line based on style
    if (style.arrowType === 'straight') {
        const line = document.createElement('div');
        line.className = 'connection-line';
        line.style.position = 'absolute';
        line.style.left = '0';
        line.style.top = '50%';
        line.style.width = '100%';
        line.style.height = style.strokeWidth + 'px';
        line.style.background = '#3b82f6';
        line.style.transformOrigin = 'left center';
        line.style.transform = `translateY(-50%) rotate(${angle}deg)`;
        line.style.pointerEvents = 'none';
        line.style.zIndex = '2';
        
        // Apply stroke style
        if (style.strokeStyle === 'dashed') {
            line.style.background = 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 8px, transparent 8px, transparent 16px)';
        } else if (style.strokeStyle === 'dotted') {
            line.style.background = 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 2px, transparent 2px, transparent 4px)';
        }
        
        // Apply roughness
        if (style.roughness > 0) {
            line.style.filter = `blur(${style.roughness * 0.5}px)`;
            line.style.opacity = '0.9';
        }
        
        arrow.appendChild(line);
        
    } else if (style.arrowType === 'curved') {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.overflow = 'visible';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '2';
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const controlX = distance / 2 + (Math.random() - 0.5) * 50;
        const controlY = (Math.random() - 0.5) * 50;
        
        path.setAttribute('d', `M 0 ${arrow.offsetHeight/2} Q ${controlX} ${controlY} ${distance} ${arrow.offsetHeight/2}`);
        path.setAttribute('stroke', '#3b82f6');
        path.setAttribute('stroke-width', style.strokeWidth);
        path.setAttribute('fill', 'none');
        
        if (style.strokeStyle === 'dashed') {
            path.setAttribute('stroke-dasharray', '8,4');
        } else if (style.strokeStyle === 'dotted') {
            path.setAttribute('stroke-dasharray', '2,2');
        }
        
        if (style.roughness > 0) {
            path.setAttribute('filter', `blur(${style.roughness * 0.5})`);
            path.setAttribute('opacity', '0.9');
        }
        
        svg.appendChild(path);
        arrow.appendChild(svg);
        
        // For curved, position arrowhead at the end of the curve
        arrowhead.style.left = (distance - 8) + 'px';
        arrowhead.style.top = '50%';
        arrowhead.style.transform = 'translateY(-50%)';
        
    } else if (style.arrowType === 'right-angled') {
        const horizontalLine = document.createElement('div');
        horizontalLine.className = 'connection-line-horizontal';
        horizontalLine.style.position = 'absolute';
        horizontalLine.style.left = '0';
        horizontalLine.style.top = '50%';
        horizontalLine.style.width = '50%';
        horizontalLine.style.height = style.strokeWidth + 'px';
        horizontalLine.style.background = '#3b82f6';
        horizontalLine.style.transform = 'translateY(-50%)';
        horizontalLine.style.pointerEvents = 'none';
        horizontalLine.style.zIndex = '2';
        
        const verticalLine = document.createElement('div');
        verticalLine.className = 'connection-line-vertical';
        verticalLine.style.position = 'absolute';
        verticalLine.style.left = '50%';
        verticalLine.style.top = '50%';
        verticalLine.style.width = style.strokeWidth + 'px';
        verticalLine.style.height = '50%';
        verticalLine.style.background = '#3b82f6';
        verticalLine.style.transform = 'translateX(-50%)';
        verticalLine.style.pointerEvents = 'none';
        verticalLine.style.zIndex = '2';
        
        // Apply stroke style to both lines
        if (style.strokeStyle === 'dashed') {
            const dashPattern = 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 8px, transparent 8px, transparent 16px)';
            horizontalLine.style.background = dashPattern;
            verticalLine.style.background = 'repeating-linear-gradient(0deg, #3b82f6 0, #3b82f6 8px, transparent 8px, transparent 16px)';
        } else if (style.strokeStyle === 'dotted') {
            const dotPattern = 'repeating-linear-gradient(90deg, #3b82f6 0, #3b82f6 2px, transparent 2px, transparent 4px)';
            horizontalLine.style.background = dotPattern;
            verticalLine.style.background = 'repeating-linear-gradient(0deg, #3b82f6 0, #3b82f6 2px, transparent 2px, transparent 4px)';
        }
        
        arrow.appendChild(horizontalLine);
        arrow.appendChild(verticalLine);
        
        // For right-angled, position arrowhead at the end of vertical line
        arrowhead.style.left = '50%';
        arrowhead.style.top = '100%';
        arrowhead.style.transform = 'translateX(-50%)';
    }
    
    // Add arrowhead - positioned at the end of the line
    const arrowhead = document.createElement('div');
    arrowhead.className = 'connection-arrowhead';
    arrowhead.style.position = 'absolute';
    arrowhead.style.left = (distance - 8) + 'px'; // Position at the end of the line
    arrowhead.style.top = '50%';
    arrowhead.style.transform = 'translateY(-50%)';
    arrowhead.style.width = '0';
    arrowhead.style.height = '0';
    arrowhead.style.pointerEvents = 'none';
    arrowhead.style.zIndex = '3';
    
    if (style.arrowhead === 'triangle') {
        arrowhead.style.borderLeft = '8px solid #3b82f6';
        arrowhead.style.borderTop = '6px solid transparent';
        arrowhead.style.borderBottom = '6px solid transparent';
    } else if (style.arrowhead === 'circle') {
        arrowhead.style.width = '12px';
        arrowhead.style.height = '12px';
        arrowhead.style.background = '#3b82f6';
        arrowhead.style.borderRadius = '50%';
        arrowhead.style.border = 'none';
    } else if (style.arrowhead === 'diamond') {
        arrowhead.style.width = '12px';
        arrowhead.style.height = '12px';
        arrowhead.style.background = '#3b82f6';
        arrowhead.style.transform = 'translateY(-50%) rotate(45deg)';
        arrowhead.style.border = 'none';
    }
    
    arrow.appendChild(arrowhead);
    
    // Arrow will be handled by canvas click delegation
    console.log('Arrow created for canvas delegation:', connection.id);
    
    // Add hover effect
    arrow.addEventListener('mouseenter', function() {
        console.log('🎯 Arrow hovered:', connection.id);
        arrow.style.cursor = 'pointer';
        arrow.style.opacity = '0.8';
        arrow.style.transform = 'scale(1.05)';
        
        // Highlight the arrow
        const lines = arrow.querySelectorAll('.connection-line, .connection-line-horizontal, .connection-line-vertical, path');
        lines.forEach(line => {
            if (line.tagName === 'path') {
                line.setAttribute('stroke', '#22c55e');
                line.setAttribute('stroke-width', style.strokeWidth + 2);
            } else {
                line.style.background = '#22c55e';
                line.style.height = (style.strokeWidth + 2) + 'px';
            }
        });
        
        const arrowhead = arrow.querySelector('.connection-arrowhead');
        if (arrowhead) {
            if (style.arrowhead === 'triangle') {
                arrowhead.style.borderLeft = '8px solid #22c55e';
            } else {
                arrowhead.style.background = '#22c55e';
            }
        }
    });
    
    arrow.addEventListener('mouseleave', function() {
        console.log('🎯 Arrow mouse leave:', connection.id);
        arrow.style.cursor = 'pointer';
        arrow.style.opacity = '1';
        arrow.style.transform = 'scale(1)';
        
        // Restore original color
        const lines = arrow.querySelectorAll('.connection-line, .connection-line-horizontal, .connection-line-vertical, path');
        lines.forEach(line => {
            if (line.tagName === 'path') {
                line.setAttribute('stroke', '#3b82f6');
                line.setAttribute('stroke-width', style.strokeWidth);
            } else {
                line.style.background = '#3b82f6';
                line.style.height = style.strokeWidth + 'px';
            }
        });
        
        const arrowhead = arrow.querySelector('.connection-arrowhead');
        if (arrowhead) {
            if (style.arrowhead === 'triangle') {
                arrowhead.style.borderLeft = '8px solid #3b82f6';
            } else {
                arrowhead.style.background = '#3b82f6';
            }
        }
    });
    
    canvas.appendChild(arrow);
    
    // Store reference for deletion
    connection.svgElement = arrow;
    
    // Add visual debugging - temporary border to see arrow area
    arrow.style.border = '2px solid rgba(255, 0, 0, 0.8)';
    arrow.style.background = 'rgba(255, 0, 0, 0.2)';
    arrow.style.cursor = 'pointer';
    
    // Add click test
    arrow.addEventListener('click', function(e) {
        console.log('🎯 DIRECT Arrow click test!', connection.id);
        e.preventDefault();
        e.stopPropagation();
    });
    
    // Remove debugging after 5 seconds
    setTimeout(() => {
        arrow.style.border = 'none';
        arrow.style.background = 'transparent';
    }, 5000);
    
    console.log('Arrow drawn:', {
        connection: connection.id,
        from: fromPoint,
        to: toPoint,
        distance: distance,
        angle: angle,
        style: style,
        arrowElement: arrow,
        pointerEvents: arrow.style.pointerEvents
    });
}

// Utility functions
function getConnectionPointPosition(component, position) {
    // Get component position relative to canvas
    const x = parseFloat(component.style.left) || 0;
    const y = parseFloat(component.style.top) || 0;
    
    // Get component dimensions
    const rect = component.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate connection point based on position
    let pointX, pointY;
    
    switch (position) {
        case 'top':
            pointX = x + width / 2;
            pointY = y;
            break;
        case 'right':
            pointX = x + width;
            pointY = y + height / 2;
            break;
        case 'bottom':
            pointX = x + width / 2;
            pointY = y + height;
            break;
        case 'left':
            pointX = x;
            pointY = y + height / 2;
            break;
        default:
            pointX = x + width / 2;
            pointY = y + height / 2;
    }
    
    console.log('Connection point calculated:', {
        component: component.dataset.id,
        position: position,
        componentPos: { x, y },
        componentSize: { width, height },
        connectionPoint: { x: pointX, y: pointY }
    });
    
    return { x: pointX, y: pointY };
}

function findSnapTarget(x, y) {
    const components = document.querySelectorAll('.dropped-component');
    
    for (let component of components) {
        const rect = component.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        
        const compX = rect.left - canvasRect.left;
        const compY = rect.top - canvasRect.top;
        const compWidth = rect.width;
        const compHeight = rect.height;
        
        if (x >= compX && x <= compX + compWidth && y >= compY && y <= compY + compHeight) {
            // Determine which side is closest
            const centerX = compX + compWidth / 2;
            const centerY = compY + compHeight / 2;
            
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            
            let position;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                position = deltaX > 0 ? 'right' : 'left';
            } else {
                position = deltaY > 0 ? 'bottom' : 'top';
            }
            
            return {
                component: component,
                position: position,
                x: compX + (position === 'left' ? 0 : position === 'right' ? compWidth : compWidth / 2),
                y: compY + (position === 'top' ? 0 : position === 'bottom' ? compHeight : compHeight / 2)
            };
        }
    }
    
    return null;
}

function showSnapIndicator(x, y) {
    hideSnapIndicator();
    
    const indicator = document.createElement('div');
    indicator.className = 'snap-indicator';
    indicator.style.left = x + 'px';
    indicator.style.top = y + 'px';
    indicator.style.zIndex = '95';
    indicator.id = 'snapIndicator';
    
    canvas.appendChild(indicator);
}

function hideSnapIndicator() {
    const indicator = document.getElementById('snapIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Zoom functions
function zoomIn() {
    currentZoom = Math.min(5, currentZoom * 1.2);
    updateZoom();
}

function zoomOut() {
    currentZoom = Math.max(0.1, currentZoom / 1.2);
    updateZoom();
}

function resetZoom() {
    currentZoom = 1;
    canvasOffset = { x: 0, y: 0 };
    updateZoom();
}

function fitToScreen() {
    if (droppedComponents.length === 0) {
        resetZoom();
        return;
    }
    
    // Calculate bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    droppedComponents.forEach(comp => {
        minX = Math.min(minX, comp.x);
        minY = Math.min(minY, comp.y);
        maxX = Math.max(maxX, comp.x + 120);
        maxY = Math.max(maxY, comp.y + 80);
    });
    
    const padding = 50;
    const width = maxX - minX + padding * 2;
    const height = maxY - minY + padding * 2;
    
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    
    const scaleX = canvasWidth / width;
    const scaleY = canvasHeight / height;
    const scale = Math.min(scaleX, scaleY, 1);
    
    currentZoom = scale;
    canvasOffset.x = (canvasWidth - width * scale) / 2 - minX * scale;
    canvasOffset.y = (canvasHeight - height * scale) / 2 - minY * scale;
    
    updateZoom();
}

function updateZoom() {
    if (!canvas) return;
    
    canvas.style.transform = `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${currentZoom})`;
    
    // Update zoom display
    const zoomDisplay = document.getElementById('zoomDisplay');
    if (zoomDisplay) {
        zoomDisplay.textContent = Math.round(currentZoom * 100) + '%';
    }
}

// Hand mode toggle
function toggleHandMode() {
    isHandMode = !isHandMode;
    
    if (isHandMode) {
        canvas.classList.add('hand-mode');
        canvas.style.cursor = 'grab';
        hideConnectionPoints();
    } else {
        canvas.classList.remove('hand-mode');
        canvas.style.cursor = 'crosshair';
    }
    
    // Update button state
    const handBtn = document.querySelector('[onclick="toggleHandMode()"]');
    if (handBtn) {
        handBtn.classList.toggle('active', isHandMode);
    }
    
    console.log('Hand mode:', isHandMode ? 'ON' : 'OFF');
}

// Component management
function deleteComponent(button) {
    const component = button.closest('.dropped-component');
    const componentId = component.dataset.id;
    
    // Remove from array
    droppedComponents = droppedComponents.filter(comp => comp.id !== componentId);
    
    // Remove connections
    connections = connections.filter(conn => conn.from !== componentId && conn.to !== componentId);
    
    // Remove visual elements
    component.remove();
    
    // Redraw connections
    redrawConnections();
    
    // Show instruction if no components
    if (droppedComponents.length === 0) {
        const instruction = document.getElementById('canvasInstruction');
        if (instruction) {
            instruction.style.display = 'block';
        }
    }
    
    // Update counts
    updateComponentCount();
    
    // Save data
    saveData();
}

function updateComponentCount() {
    const count = droppedComponents.length;
    const countElement = document.getElementById('componentCount');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Redraw functions
function redrawComponents() {
    // Clear existing components
    const existingComponents = canvas.querySelectorAll('.dropped-component');
    existingComponents.forEach(comp => comp.remove());
    
    // Redraw all components
    droppedComponents.forEach(compData => {
        const component = document.createElement('div');
        component.className = 'dropped-component';
        component.style.left = compData.x + 'px';
        component.style.top = compData.y + 'px';
        component.dataset.id = compData.id;
        
        component.innerHTML = `
            <i class="${getComponentIcon(compData.type)}"></i>
            <h3>${compData.name}</h3>
            <div class="cost">$${compData.cost}/mo</div>
            <button class="delete-btn" onclick="deleteComponent(this)">×</button>
        `;
        
        // Add event listeners
        component.addEventListener('mousedown', handleComponentMouseDown);
        component.addEventListener('click', handleComponentClick);
        
        canvas.appendChild(component);
        compData.element = component;
    });
}

function redrawConnections() {
    // Clear existing connections
    const existingConnections = canvas.querySelectorAll('.connection-arrow');
    existingConnections.forEach(conn => conn.remove());
    
    // Redraw all connections
    connections.forEach(conn => {
        drawConnection(conn);
    });
}

function getComponentIcon(type) {
    const icons = {
        cloud: 'fas fa-cloud',
        service: 'fas fa-cogs',
        database: 'fas fa-database',
        queue: 'fas fa-stream',
        monitoring: 'fas fa-chart-line',
        security: 'fas fa-shield-alt',
        cdn: 'fas fa-globe',
        storage: 'fas fa-hdd'
    };
    
    return icons[type] || 'fas fa-cube';
}

// Search functionality
function handleComponentSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const components = document.querySelectorAll('.component-item');
    
    components.forEach(component => {
        const name = component.dataset.name.toLowerCase();
        const description = component.dataset.description.toLowerCase();
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            component.style.display = 'block';
        } else {
            component.style.display = 'none';
        }
    });
}

// Styling panel handlers
function handleStylingPanelClick(e) {
    const option = e.target.closest('.styling-option');
    if (!option) return;
    
    const section = option.closest('.styling-section');
    const options = section.querySelectorAll('.styling-option');
    
    // Remove active class from all options in this section
    options.forEach(opt => opt.classList.remove('active'));
    
    // Add active class to clicked option
    option.classList.add('active');
    
    // Update style
    updateStyleFromOption(option, section);
}

function handleFloatingPanelClick(e) {
    const option = e.target.closest('.styling-option');
    if (!option) return;
    
    e.stopPropagation();
    
    const section = option.closest('.styling-section');
    const options = section.querySelectorAll('.styling-option');
    
    // Remove active class from all options in this section
    options.forEach(opt => opt.classList.remove('active'));
    
    // Add active class to clicked option
    option.classList.add('active');
    
    // Update individual connection style
    if (currentEditingConnection) {
        updateConnectionStyleFromOption(option, section);
        redrawConnection(currentEditingConnection);
    }
}

function updateStyleFromOption(option, section) {
    if (currentEditingConnection) {
        // Update individual connection style
        updateConnectionStyleFromOption(option, section);
        redrawConnection(currentEditingConnection);
    } else {
        // Update global arrow style
        updateGlobalStyleFromOption(option, section);
        redrawConnections();
    }
}

function updateConnectionStyleFromOption(option, section) {
    if (!currentEditingConnection) return;
    
    console.log('Updating connection style:', {
        connection: currentEditingConnection.id,
        option: option.dataset,
        section: section.querySelector('h4')?.textContent || 'Unknown'
    });
    
    if (section.querySelector('.stroke-width-option')) {
        currentEditingConnection.style.strokeWidth = parseInt(option.dataset.width);
        console.log('Updated stroke width to:', currentEditingConnection.style.strokeWidth);
    } else if (section.querySelector('.stroke-style-option')) {
        currentEditingConnection.style.strokeStyle = option.dataset.style;
        console.log('Updated stroke style to:', currentEditingConnection.style.strokeStyle);
    } else if (section.querySelector('.arrow-type-option')) {
        currentEditingConnection.style.arrowType = option.dataset.type;
        console.log('Updated arrow type to:', currentEditingConnection.style.arrowType);
    } else if (section.querySelector('.arrowhead-option')) {
        currentEditingConnection.style.arrowhead = option.dataset.arrowhead;
        console.log('Updated arrowhead to:', currentEditingConnection.style.arrowhead);
    }
    
    // Save data after style update
    saveData();
}

function updateGlobalStyleFromOption(option, section) {
    if (section.querySelector('.stroke-width-option')) {
        arrowStyle.strokeWidth = parseInt(option.dataset.width);
    } else if (section.querySelector('.stroke-style-option')) {
        arrowStyle.strokeStyle = option.dataset.style;
    } else if (section.querySelector('.roughness-option')) {
        arrowStyle.roughness = parseInt(option.dataset.roughness);
    } else if (section.querySelector('.arrow-type-option')) {
        arrowStyle.arrowType = option.dataset.type;
    } else if (section.querySelector('.arrowhead-option')) {
        arrowStyle.arrowhead = option.dataset.arrowhead;
    }
}

// Connection style editor
function openConnectionStyleEditor(connection, event) {
    console.log('Opening connection style editor for:', connection);
    
    currentEditingConnection = connection;
    
    // Hide main panel if open
    const mainPanel = document.getElementById('arrowStylingPanel');
    if (mainPanel) {
        mainPanel.classList.remove('show');
        mainPanel.style.display = 'none';
    }
    
    // Show floating panel
    const floatingPanel = document.getElementById('floatingArrowPanel');
    if (!floatingPanel) {
        console.error('Floating panel not found!');
        return;
    }
    
    // Position floating panel near the arrow
    if (event) {
        const canvasRect = canvas.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;
        
        // Position panel near click point, but keep it within canvas bounds
        const panelWidth = 200;
        const panelHeight = 280;
        let panelX = x + 20;
        let panelY = y - panelHeight / 2;
        
        // Adjust if panel would go outside canvas
        if (panelX + panelWidth > canvasRect.width) {
            panelX = x - panelWidth - 20;
        }
        if (panelY < 0) {
            panelY = 20;
        }
        if (panelY + panelHeight > canvasRect.height) {
            panelY = canvasRect.height - panelHeight - 20;
        }
        
        floatingPanel.style.left = panelX + 'px';
        floatingPanel.style.top = panelY + 'px';
        floatingPanel.style.position = 'absolute';
        floatingPanel.style.zIndex = '10003';
        floatingPanel.style.pointerEvents = 'auto';
        
        console.log('Panel positioned at:', { x: panelX, y: panelY });
    }
    
    // Set current values
    setFloatingPanelValues(connection.style);
    
    // Show floating panel
    floatingPanel.classList.add('show');
    floatingPanel.style.display = 'block';
    floatingPanel.style.visibility = 'visible';
    floatingPanel.style.opacity = '1';
    
    // Force reflow
    floatingPanel.offsetHeight;
    
    // Add event listeners to floating panel options
    initializeFloatingPanelEvents();
    
    console.log('Floating panel shown for connection:', connection.id);
}

function initializeFloatingPanelEvents() {
    const floatingPanel = document.getElementById('floatingArrowPanel');
    if (!floatingPanel) return;
    
    // Remove existing event listeners
    const options = floatingPanel.querySelectorAll('.styling-option');
    options.forEach(option => {
        option.replaceWith(option.cloneNode(true));
    });
    
    // Add new event listeners
    const newOptions = floatingPanel.querySelectorAll('.styling-option');
    newOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Floating panel option clicked:', option);
            
            // Remove active class from siblings
            const section = option.closest('.styling-section');
            const siblings = section.querySelectorAll('.styling-option');
            siblings.forEach(sibling => sibling.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Update connection style
            updateConnectionStyleFromOption(option, section);
            
            // Redraw connection
            if (currentEditingConnection) {
                redrawConnection(currentEditingConnection);
            }
        });
    });
    
    console.log('Floating panel events initialized');
}

function setFloatingPanelValues(style) {
    const floatingPanel = document.getElementById('floatingArrowPanel');
    if (!floatingPanel) return;
    
    // Set stroke width
    const widthOptions = floatingPanel.querySelectorAll('.stroke-width-option');
    widthOptions.forEach(option => {
        option.classList.remove('active');
        if (parseInt(option.dataset.width) === style.strokeWidth) {
            option.classList.add('active');
        }
    });
    
    // Set stroke style
    const styleOptions = floatingPanel.querySelectorAll('.stroke-style-option');
    styleOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.style === style.strokeStyle) {
            option.classList.add('active');
        }
    });
    
    // Set arrow type
    const typeOptions = floatingPanel.querySelectorAll('.arrow-type-option');
    typeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.type === style.arrowType) {
            option.classList.add('active');
        }
    });
    
    // Set arrowhead
    const arrowheadOptions = floatingPanel.querySelectorAll('.arrowhead-option');
    arrowheadOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.arrowhead === style.arrowhead) {
            option.classList.add('active');
        }
    });
}

function redrawConnection(connection) {
    console.log('Redrawing connection:', connection.id);
    
    // Remove existing arrow element
    if (connection.svgElement && connection.svgElement.parentNode) {
        connection.svgElement.parentNode.removeChild(connection.svgElement);
    }
    
    // Clear the reference
    connection.svgElement = null;
    
    // Redraw the connection
    drawConnection(connection);
    
    console.log('Connection redrawn successfully');
}

function resetToGlobalStyle() {
    if (!currentEditingConnection) return;
    
    // Reset connection style to global style
    currentEditingConnection.style = { ...arrowStyle };
    
    // Update panel
    setFloatingPanelValues(currentEditingConnection.style);
    
    // Redraw connection
    redrawConnection(currentEditingConnection);
}

function closeConnectionEditor() {
    currentEditingConnection = null;
    
    // Hide floating panel
    const floatingPanel = document.getElementById('floatingArrowPanel');
    if (floatingPanel) {
        floatingPanel.classList.remove('show');
        floatingPanel.style.display = 'none';
    }
}

function handleOutsideClick(e) {
    const floatingPanel = document.getElementById('floatingArrowPanel');
    if (!floatingPanel) return;
    
    if (!floatingPanel.contains(e.target) && !e.target.closest('.connection-arrow')) {
        floatingPanel.classList.remove('show');
        floatingPanel.style.display = 'none';
        currentEditingConnection = null;
    }
}

// Modal management
function closeAllModals() {
    // Close connection info
    const connectionInfo = document.getElementById('connectionInfo');
    if (connectionInfo) {
        connectionInfo.style.display = 'none';
    }
    
    // Close styling panels
    const mainPanel = document.getElementById('arrowStylingPanel');
    if (mainPanel) {
        mainPanel.classList.remove('show');
        mainPanel.style.display = 'none';
    }
    
    const floatingPanel = document.getElementById('floatingArrowPanel');
    if (floatingPanel) {
        floatingPanel.classList.remove('show');
        floatingPanel.style.display = 'none';
    }
    
    // Reset states
    currentEditingConnection = null;
    isConnecting = false;
    hideConnectionPoints();
}

// Arrow deletion function
function deleteConnection(connectionId) {
    console.log('Deleting connection:', connectionId);
    
    // Find connection
    const connectionIndex = connections.findIndex(conn => conn.id === connectionId);
    if (connectionIndex === -1) {
        console.error('Connection not found:', connectionId);
        return;
    }
    
    const connection = connections[connectionIndex];
    
    // Remove visual element
    if (connection.svgElement && connection.svgElement.parentNode) {
        connection.svgElement.parentNode.removeChild(connection.svgElement);
    }
    
    // Remove from array
    connections.splice(connectionIndex, 1);
    
    // Clear current editing if this was being edited
    if (currentEditingConnection && currentEditingConnection.id === connectionId) {
        currentEditingConnection = null;
        closeConnectionEditor();
    }
    
    // Save data
    saveData();
    
    console.log('Connection deleted successfully');
}

// Arrow selection function
function selectConnection(connectionId) {
    // Remove selection from all arrows
    const allArrows = document.querySelectorAll('.connection-arrow');
    allArrows.forEach(arrow => arrow.classList.remove('selected'));
    
    // Select current arrow
    const arrow = document.querySelector(`[data-connection-id="${connectionId}"]`);
    if (arrow) {
        arrow.classList.add('selected');
    }
}

// Global functions for HTML onclick attributes
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.resetZoom = resetZoom;
window.fitToScreen = fitToScreen;
window.toggleHandMode = toggleHandMode;
window.deleteComponent = deleteComponent;
window.closeConnectionInfo = closeAllModals;
window.openConnectionStyleEditor = openConnectionStyleEditor;
window.resetToGlobalStyle = resetToGlobalStyle;
window.closeConnectionEditor = closeConnectionEditor;
window.deleteConnection = deleteConnection;
window.selectConnection = selectConnection;
