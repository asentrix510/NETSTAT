const si = require('systeminformation');

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
        let serviceType = 'UNKNOWN';
        let status = 'OFFLINE';
        
        for (let iface of networkInterfaces) {
          if (iface.operstate === 'up' && !iface.virtual) {
             if (iface.type === 'wireless') serviceType = 'WIFI';
             else if (iface.type === 'wired') serviceType = 'ETHERNET';
             else serviceType = iface.type ? iface.type.toUpperCase() : 'ETHERNET';
             status = 'CONNECTED';
             break;
          }
        }

        const data = {
          download: mbpsDownload.toFixed(1),
          upload: mbpsUpload.toFixed(1),
          ping: ping >= 0 ? Math.round(ping) : 0,
          type: serviceType,
          status: status
        };

        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('network-data', data);
        }
      } catch (e) {
        console.error("Error fetching network stats: ", e);
      }
    };

    setInterval(fetchNetworkStats, 1000);
    fetchNetworkStats(); // Initial call
  }
};
