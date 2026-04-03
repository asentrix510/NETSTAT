const { ipcRenderer } = require('electron');
const { Chart } = require('chart.js/auto');

const handle = document.getElementById('sidebar-handle');
const dashboard = document.getElementById('dashboard');
const closeBtn = document.getElementById('close-btn');
const toggleUnitBtn = document.getElementById('unit-toggle-btn');

let isExpanded = false;
let isMegaBytes = false;

const dlDataHistory = Array(60).fill(0);
const ulDataHistory = Array(60).fill(0);

const ctx = document.getElementById('speed-chart').getContext('2d');

const speedChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(60).fill(''),
        datasets: [
            {
                label: 'DWN',
                data: dlDataHistory,
                borderColor: '#60a5fa', 
                backgroundColor: 'rgba(96, 165, 250, 0.1)',
                borderWidth: 1.5,
                tension: 0.3,
                pointRadius: 0,
                fill: true
            },
            {
                label: 'UPL',
                data: ulDataHistory,
                borderColor: '#c084fc', 
                backgroundColor: 'rgba(192, 132, 252, 0.1)',
                borderWidth: 1.5,
                tension: 0.3,
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
            y: { 
                display: true, 
                position: 'right',
                grid: { color: '#ffffff0a', drawBorder: false },
                ticks: { color: '#ffffff50', font: { size: 9, family: 'Inter' }, maxTicksLimit: 4 },
                border: { display: false },
                beginAtZero: true
            }
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        },
        layout: { padding: { left: -10, right: 0, top: 15, bottom: -5 } }
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

// Auto-collapse when user clicks somewhere else on desktop (Window Blur)
ipcRenderer.on('force-close-sidebar', () => {
    if (isExpanded) {
        toggleSidebar();
    }
});

toggleUnitBtn.addEventListener('click', (e) => {
    isMegaBytes = !isMegaBytes;
    e.target.innerText = isMegaBytes ? 'MB/s' : 'Mb/s';
    
    document.querySelectorAll('.unit-label').forEach(el => {
        el.innerText = isMegaBytes ? 'MB/s' : 'Mb/s';
    });
    
    const factor = isMegaBytes ? 8 : 1;
    speedChart.data.datasets[0].data = dlDataHistory.map(v => v / factor);
    speedChart.data.datasets[1].data = ulDataHistory.map(v => v / factor);
    speedChart.update();
});

ipcRenderer.on('network-data', (event, data) => {
    const rawDl = parseFloat(data.download);
    const rawUl = parseFloat(data.upload);

    document.getElementById('network-name').innerText = data.networkName;
    
    const factor = isMegaBytes ? 8 : 1;
    document.getElementById('dl-text').innerText = (rawDl / factor).toFixed(1);
    document.getElementById('ul-text').innerText = (rawUl / factor).toFixed(1);
    
    document.getElementById('ping-text').innerText = `${data.ping} ms`;
    document.getElementById('uptime').innerText = data.uptime;

    dlDataHistory.push(rawDl);
    dlDataHistory.shift();
    
    ulDataHistory.push(rawUl);
    ulDataHistory.shift();
    
    speedChart.data.datasets[0].data = dlDataHistory.map(v => v / factor);
    speedChart.data.datasets[1].data = ulDataHistory.map(v => v / factor);
    
    speedChart.update();
});
