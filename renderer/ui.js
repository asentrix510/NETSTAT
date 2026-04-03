const { ipcRenderer } = require('electron');
const { Chart } = require('chart.js/auto');

const handle = document.getElementById('sidebar-handle');
const dashboard = document.getElementById('dashboard');
const closeBtn = document.getElementById('close-btn');

let isExpanded = false;

// Initialize chart
const ctx = document.getElementById('speed-chart').getContext('2d');
const MAX_DATA_POINTS = 60; // 60 seconds
const speedChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(MAX_DATA_POINTS).fill(''),
        datasets: [
            {
                label: 'Download',
                data: Array(MAX_DATA_POINTS).fill(0),
                borderColor: '#00daf3', 
                backgroundColor: 'rgba(0, 218, 243, 0.1)',
                borderWidth: 1.5,
                tension: 0.4,
                pointRadius: 0,
                fill: true
            },
            {
                label: 'Upload',
                data: Array(MAX_DATA_POINTS).fill(0),
                borderColor: '#ffcf8f', 
                backgroundColor: 'rgba(255, 207, 143, 0.1)',
                borderWidth: 1,
                tension: 0.4,
                pointRadius: 0,
                fill: true
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        scales: {
            x: { display: false },
            y: { display: false, beginAtZero: true, suggestedMax: 100 }
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        layout: { padding: 0 }
    }
});

function toggleSidebar() {
  isExpanded = !isExpanded;
  
  if (isExpanded) {
    dashboard.classList.remove('hidden');
    // Fast IPC call to resize window so the panel becomes viewable immediately
    ipcRenderer.send('toggle-sidebar', true);
  } else {
    dashboard.classList.add('hidden');
    ipcRenderer.send('toggle-sidebar', false);
  }
}

handle.addEventListener('click', toggleSidebar);

// Close button in header
closeBtn.addEventListener('click', () => {
    if(confirm("Exit Precision Monitor?")) {
        window.close(); 
    }
});

// Update Network Stats Real-Time
ipcRenderer.on('network-data', (event, data) => {
    document.getElementById('dl-text').innerText = data.download;
    document.getElementById('ul-text').innerText = data.upload;
    document.getElementById('ping-text').innerHTML = `${data.ping}<span class="text-[10px] ml-1 text-outline">ms</span>`;
    document.getElementById('net-type').innerText = data.type;
    document.getElementById('net-status').innerText = data.status;

    // Animate Needle based on speed 
    // dl: ~1000 mbps bounds, ul: ~100 mbps bounds
    const dlRot = -75 + Math.min(150, (data.download / 1000) * 150);
    document.getElementById('dl-needle').style.transform = `rotate(${dlRot}deg)`;
    
    const ulRot = -45 + Math.min(90, (data.upload / 100) * 90);
    document.getElementById('ul-needle').style.transform = `rotate(${ulRot}deg)`;

    // Update Oscilloscope Graph
    const dlSpeed = parseFloat(data.download);
    const ulSpeed = parseFloat(data.upload);
    
    speedChart.data.datasets[0].data.push(dlSpeed);
    speedChart.data.datasets[0].data.shift();
    
    speedChart.data.datasets[1].data.push(ulSpeed);
    speedChart.data.datasets[1].data.shift();
    
    speedChart.update();

    // Update Uptime
    document.getElementById('uptime').innerText = data.uptime;
});
