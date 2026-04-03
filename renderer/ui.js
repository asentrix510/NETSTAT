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
    // Stage 1 close logic, perhaps exit app
    if(confirm("Exit Precision Monitor?")) {
        const { ipcRenderer } = require('electron');
        const remote = require('electron').remote;
        // Or simply trigger window closed in main
        window.close(); 
    }
});
