const { ipcRenderer } = require('electron');
const { Chart } = require('chart.js/auto');

const handle = document.getElementById('sidebar-handle');
const dashboard = document.getElementById('dashboard');
const closeBtn = document.getElementById('close-btn');

let isExpanded = false;

// Initialize chart
const ctx = document.getElementById('speed-chart').getContext('2d');
const MAX_DATA_POINTS = 60; 

// Chart defaults for aesthetic blending
const cGrid = '#ffffff0a';

const speedChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(MAX_DATA_POINTS).fill(''),
        datasets: [
            {
                label: 'DWN',
                data: Array(MAX_DATA_POINTS).fill(0),
                borderColor: '#00f0ff', 
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                borderWidth: 2.5,
                tension: 0.3,
                pointRadius: 0,
                fill: true
            },
            {
                label: 'UPL',
                data: Array(MAX_DATA_POINTS).fill(0),
                borderColor: '#ff003c', 
                backgroundColor: 'rgba(255, 0, 60, 0.15)',
                borderWidth: 2,
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
            x: { 
                display: false 
            },
            y: { 
                display: true, 
                position: 'right',
                grid: { color: cGrid, drawBorder: false },
                ticks: { color: '#ffffff30', font: { size: 9, family: 'Inter' }, maxTicksLimit: 4 },
                border: { display: false },
                beginAtZero: true, 
                suggestedMax: 50 // auto scales up smoothly
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        layout: { padding: { left: 0, right: 0, top: 20, bottom: 0 } }
    }
});

function toggleSidebar() {
  isExpanded = !isExpanded;
  
  if (isExpanded) {
    dashboard.classList.remove('hidden');
    dashboard.classList.add('flex');
    ipcRenderer.send('toggle-sidebar', true);
  } else {
    dashboard.classList.add('hidden');
    dashboard.classList.remove('flex');
    ipcRenderer.send('toggle-sidebar', false);
  }
}

handle.addEventListener('click', toggleSidebar);

closeBtn.addEventListener('click', () => {
    window.close(); 
});

ipcRenderer.on('network-data', (event, data) => {
    // Re-mapped directly to the new cleanly structured DOM identifiers
    document.getElementById('dl-text').innerText = data.download;
    document.getElementById('ul-text').innerText = data.upload;
    document.getElementById('ping-text').innerHTML = `${data.ping}<span class="text-[9px] font-normal opacity-50 ml-0.5">ms</span>`;
    document.getElementById('net-type').innerText = data.type;
    document.getElementById('net-status').innerText = 'STATUS: ' + data.status;
    document.getElementById('uptime').innerText = data.uptime;

    // Inject graph speeds
    const dlSpeed = parseFloat(data.download);
    const ulSpeed = parseFloat(data.upload);
    
    speedChart.data.datasets[0].data.push(dlSpeed);
    speedChart.data.datasets[0].data.shift();
    
    speedChart.data.datasets[1].data.push(ulSpeed);
    speedChart.data.datasets[1].data.shift();
    
    speedChart.update();
});
