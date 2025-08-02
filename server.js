// Amer-Center-Portal --- server.js
// A robust Node.js and Express server for the portal application.

// --- Dependencies ---
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// --- Server Setup ---
const app = express();
const PORT = 2525;
const DB_PATH = path.join(__dirname, 'database.json');

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Database Helper Functions ---
const readDb = () => {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("FATAL: Could not read database file.", error);
        // In a real-world scenario, you might want to exit if the DB is unreadable
        // For this app, we'll return a safe default.
        return { users: [], requests: [], logs: [], daily_log: [] };
    }
};

const writeDb = (data) => {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("FATAL: Could not write to database file.", error);
    }
};

const addLog = (message, user) => {
    try {
        const db = readDb();
        db.logs.unshift({
            message,
            user: user ? user.username : 'System',
            timestamp: new Date().toISOString()
        });
        writeDb(db);
    } catch (error) {
        console.error("Failed to write to log.", error);
    }
};

const updateDailyLog = (request, finalStatus, finalUser) => {
    try {
        const db = readDb();
        const today = new Date().toISOString().split('T')[0];
        const receptionUser = db.users.find(u => u.id === request.receptionId);

        const logEntry = {
            date: today,
            ticketNumber: request.ticketNumber,
            createdBy: request.counterName,
            counterNumber: request.counterNumber || 'N/A',
            taggedReception: receptionUser ? receptionUser.username : 'N/A',
            finalStatus: finalStatus,
            finalActionBy: finalUser.username,
            finalTimestamp: new Date().toISOString()
        };

        db.daily_log = db.daily_log.filter(entry => entry.ticketNumber !== request.ticketNumber);
        db.daily_log.push(logEntry);
        writeDb(db);
    } catch (error) {
        console.error("Failed to update daily log.", error);
    }
};

// --- Database Initialization ---
const initializeDb = () => {
    if (!fs.existsSync(DB_PATH)) {
        console.log("Database file not found. Creating a new one with default data.");
        const defaultData = {
            users: [
                { id: 'admin01', email: 'admin@amer.com', password: 'password123', role: 'admin', username: 'Chief Administrator', isOnline: false },
                { id: 'rec01', email: 'reception@amer.com', password: 'password123', role: 'reception', username: 'Fatima Al-Mansoori', isOnline: false },
                { id: 'count01', email: 'counter@amer.com', password: 'password123', role: 'counter', username: 'Ahmed Al-Jaber', isOnline: false },
                { id: 'count02', email: 'counter2@amer.com', password: 'password123', role: 'counter', username: 'Yusuf Ibrahim', isOnline: false },
            ],
            requests: [],
            logs: [],
            daily_log: []
        };
        writeDb(defaultData);
        addLog("Database initialized with default users.", null);
    }
};

// --- API Endpoints ---

app.get('/api/health', (req, res) => res.status(200).json({ status: 'Server is running', timestamp: new Date() }));

app.get('/api/data', (req, res) => {
    const { users, requests } = readDb();
    res.status(200).json({ users, requests });
});

app.get('/api/admin/data', (req, res) => res.status(200).json(readDb()));

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const db = readDb();
    const user = db.users.find(u => u.email === email && u.password === password);

    if (user) {
        const userIndex = db.users.findIndex(u => u.id === user.id);
        db.users[userIndex].isOnline = true;
        writeDb(db);
        addLog(`User ${user.username} logged in.`, user);
        res.status(200).json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials.' });
    }
});

app.post('/api/logout', (req, res) => {
    const { userId } = req.body;
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
        db.users[userIndex].isOnline = false;
        const user = db.users[userIndex];
        writeDb(db);
        addLog(`User ${user.username} logged out.`, user);
        res.status(200).json({ message: 'Logged out successfully.' });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});

app.post('/api/requests', (req, res) => {
    const { requestData, user } = req.body;
    const db = readDb();
    
    const newRequest = {
        ...requestData,
        id: `comp${Date.now()}`,
        createdAt: new Date().toISOString(),
        events: [{
            action: 'Created',
            user: user.username,
            timestamp: new Date().toISOString()
        }]
    };

    db.requests.unshift(newRequest);
    writeDb(db);
    addLog(`Created request for ticket ${newRequest.ticketNumber} from Counter ${newRequest.counterNumber}.`, user);
    res.status(201).json(newRequest);
});

app.put('/api/requests/:id/status', (req, res) => {
    const { id } = req.params;
    const { status, user, note } = req.body;
    const db = readDb();
    
    const reqIndex = db.requests.findIndex(r => r.id === id);
    if (reqIndex !== -1) {
        const currentRequest = db.requests[reqIndex];
        currentRequest.status = status;
        
        let eventAction = '';
        if (status === 'Returned') {
            eventAction = 'Returned by Reception';
        } else if (status === 'Pending' && note) {
            eventAction = `Returned to Reception (from C${currentRequest.counterNumber})`;
        } else if (status === 'Pending') {
            eventAction = 'Return Cancelled';
        }

        const newEvent = { action: eventAction, user: user.username, timestamp: new Date().toISOString() };
        if (note) newEvent.note = note;
        currentRequest.events.push(newEvent);

        writeDb(db);
        addLog(`${eventAction} for ticket ${currentRequest.ticketNumber}.`, user);
        res.status(200).json(currentRequest);
    } else {
        res.status(404).json({ message: 'Request not found.' });
    }
});

app.delete('/api/requests/:id', (req, res) => {
    const { id } = req.params;
    const { user, finalStatus } = req.body;
    const db = readDb();
    
    const requestToDelete = db.requests.find(r => r.id === id);
    if (requestToDelete) {
        db.requests = db.requests.filter(r => r.id !== id);
        writeDb(db);
        
        updateDailyLog(requestToDelete, finalStatus, user);
        addLog(`${finalStatus} request for ticket ${requestToDelete.ticketNumber}.`, user);
        
        res.status(200).json({ message: 'Request removed successfully.' });
    } else {
        res.status(404).json({ message: 'Request not found.' });
    }
});

// --- Admin User Management ---
app.post('/api/users', (req, res) => {
    const { userData, adminUser } = req.body;
    const db = readDb();
    
    const newUser = { ...userData, id: `user${Date.now()}`, isOnline: false };
    db.users.push(newUser);
    writeDb(db);
    addLog(`Admin ${adminUser.username} created new user: ${newUser.username}.`, adminUser);
    res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { userData, adminUser } = req.body;
    const db = readDb();
    
    const userIndex = db.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
        const isOnline = db.users[userIndex].isOnline;
        db.users[userIndex] = { ...db.users[userIndex], ...userData, isOnline };
        writeDb(db);
        addLog(`Admin ${adminUser.username} updated user: ${userData.username}.`, adminUser);
        res.status(200).json(db.users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const { adminUser } = req.body;
    const db = readDb();
    
    const userToDelete = db.users.find(u => u.id === id);
    if (userToDelete) {
        if (userToDelete.id === adminUser.id) {
            return res.status(403).json({ message: "Admins cannot delete their own account." });
        }
        db.users = db.users.filter(u => u.id !== id);
        writeDb(db);
        addLog(`Admin ${adminUser.username} deleted user: ${userToDelete.username}.`, adminUser);
        res.status(200).json({ message: 'User deleted.' });
    } else {
        res.status(404).json({ message: 'User not found.' });
    }
});

// --- Fallback Route ---
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// --- Server Initialization ---
app.listen(PORT, () => {
    console.log(`Amer Center Portal server is running on http://localhost:${PORT}`);
    initializeDb();
});
