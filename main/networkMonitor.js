const si = require('systeminformation');
const os = require('os');

module.exports = {
  startMonitoring: (mainWindow) => {
    const fetchNetworkStats = async () => {
      try {
        const networkStats = await si.networkStats();
        
        let rxSec = 0;
        let txSec = 0;

        for (let net of networkStats) {
          if (net.operstate === 'up') {
            rxSec += (net.rx_sec || 0);
            txSec += (net.tx_sec || 0);
          }
        }
        
        const mbpsDownload = (rxSec * 8) / 1000000;
        const mbpsUpload = (txSec * 8) / 1000000;

        const ping = await si.inetLatency('8.8.8.8');
        
        const networkInterfaces = await si.networkInterfaces();
        const wifiConnections = await si.wifiConnections();
        
        let serviceType = 'UNKNOWN';
        let status = 'OFFLINE';
        let networkName = 'Unknown Network';
        
        for (let iface of networkInterfaces) {
          if (iface.operstate === 'up' && !iface.virtual) {
             if (iface.type === 'wireless') serviceType = 'WIFI';
             else if (iface.type === 'wired') serviceType = 'ETHERNET';
             else serviceType = iface.type ? iface.type.toUpperCase() : 'ETHERNET';
             
             status = 'CONNECTED';
             networkName = iface.iface;
             break;
          }
        }

        if (serviceType === 'WIFI' && wifiConnections && wifiConnections.length > 0) {
            networkName = wifiConnections[0].ssid || networkName;
        } else if (serviceType === 'ETHERNET') {
            networkName = 'Ethernet Connection';
        }

        const upSec = os.uptime();
        const h = Math.floor(upSec / 3600).toString().padStart(2, '0');
        const m = Math.floor((upSec % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(upSec % 60).toString().padStart(2, '0');

        const data = {
          download: mbpsDownload,
          upload: mbpsUpload,
          ping: ping >= 0 ? Math.round(ping) : 0,
          type: serviceType,
          status: status,
          networkName: networkName || 'Connected',
          uptime: `${h}:${m}:${s}`
        };

        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('network-data', data);
        }
      } catch (e) {
        console.error("Error fetching network stats: ", e);
      }
    };

    setInterval(fetchNetworkStats, 1000);
    fetchNetworkStats();
  }
};
