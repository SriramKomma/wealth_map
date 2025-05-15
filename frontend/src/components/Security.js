const Security = {
  encryptData: (key, data) => {
    // Mock AES-256 encryption
    console.log(`Encrypting ${key} with AES-256 (mock)`);
    localStorage.setItem(key, JSON.stringify(data));
  },
  logAccess: (user, action, details) => {
    const logs = JSON.parse(localStorage.getItem("accessLogs") || "[]");
    logs.push({ user, action, details, timestamp: new Date().toISOString() });
    localStorage.setItem("accessLogs", JSON.stringify(logs));
  },
  getLogs: () => {
    return JSON.parse(localStorage.getItem("accessLogs") || "[]");
  },
};

export default Security;
