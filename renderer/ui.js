const { ipcRenderer } = require('electron');

const handle = document.getElementById('sidebar-handle');
const dashboard = document.getElementById('dashboard');
const closeBtn = document.getElementById('close-btn');

let isExpanded = false;

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
});
