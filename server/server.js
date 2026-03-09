import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

// Multer Storage Configuration - Model files
const modelStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../public/models');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Multer Storage Configuration - Thumbnail images
const thumbnailStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../public/thumbnails');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: modelStorage });
const uploadThumbnail = multer({
    storage: thumbnailStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        // Cho phép frontend domain / localhost mọi port / hoặc domain cụ thể từ ENV
        const allowedOrigins = [process.env.FRONTEND_URL, 'http://127.0.0.1:5173'];
        if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Trong lúc dev/test sếp có thể tạm allow all
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json());
app.use('/models', express.static(path.resolve(__dirname, '../public/models')));
app.use('/thumbnails', express.static(path.resolve(__dirname, '../public/thumbnails')));

// Serve giao diện frontend đã build tĩnh
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Database setup
const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Lỗi kết nối database:', err.message);
    } else {
        console.log('Đã kết nối SQLite database tại:', dbPath);
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // Table cho người dùng
        db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      role TEXT,
      plan TEXT,
      password TEXT
    )`);

        // Table cho mô hình 3D
        db.run(`CREATE TABLE IF NOT EXISTS models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      file_url TEXT,
      thumbnail TEXT,
      subject TEXT,
      grade INTEGER,
      tags TEXT
    )`);

        // Table cho password reset tokens
        db.run(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    )`);

        // Add thumbnail column for existing databases
        db.run(`ALTER TABLE models ADD COLUMN thumbnail TEXT`, (err) => {
            // Ignore error if column already exists
            if (err && !err.message.includes('duplicate column')) {
                // Column already exists, that's fine
            }
        });

        console.log('Đã khởi tạo các bảng database thành công.');

        // Auto-seed admin user
        const adminEmail = 'admin@mvp.com';
        const adminPassword = 'Admin123';
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(adminPassword, salt);

        db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
            if (!row) {
                db.run(
                    'INSERT INTO users (name, email, role, plan, password) VALUES (?, ?, ?, ?, ?)',
                    ['Admin MVP', adminEmail, 'admin', 'premium', hash],
                    (err) => {
                        if (err) console.error('Lỗi tự động tạo admin:', err.message);
                        else console.log('Đã tự động tạo tài khoản admin mặc định.');
                    }
                );
            } else {
                // Cập nhật mật khẩu cho admin hiện tại dể đảm bảo đúng Admin123
                db.run('UPDATE users SET password = ?, role = ? WHERE email = ?', [hash, 'admin', adminEmail]);
            }
        });
    });
}

// Helper: generate random 6-digit reset code
function generateResetCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// API Endpoints
app.get('/api/users', (req, res) => {
    db.all('SELECT id, name, email, role, plan FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/users', (req, res) => {
    const { name, email, role, plan, password } = req.body;

    // Check if email already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.status(400).json({ error: 'Email đã được sử dụng' });

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        db.run(
            'INSERT INTO users (name, email, role, plan, password) VALUES (?, ?, ?, ?, ?)',
            [name, email, role, plan || 'free', hashPassword],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id: this.lastID, message: 'Đăng ký thành công' });
            }
        );
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Mật khẩu không chính xác' });

        const { password: _, ...userProfile } = user;
        res.json({ message: 'Đăng nhập thành công', user: userProfile });
    });
});

app.get('/api/models', (req, res) => {
    db.all('SELECT * FROM models', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Chuyển đổi tags từ string ngược lại thành array
        const parsedRows = rows.map(row => {
            let tags = [];
            if (typeof row.tags === 'string') {
                try {
                    tags = JSON.parse(row.tags);
                    if (!Array.isArray(tags)) tags = [];
                } catch (e) {
                    tags = row.tags.split(',').map(t => t.trim()).filter(t => t);
                }
            }
            return { ...row, tags };
        });

        res.json(parsedRows);
    });
});

app.get('/api/models/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM models WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Không tìm thấy mô hình 3D' });

        let tags = [];
        if (typeof row.tags === 'string') {
            try {
                tags = JSON.parse(row.tags);
                if (!Array.isArray(tags)) tags = [];
            } catch (e) {
                tags = row.tags.split(',').map(t => t.trim()).filter(t => t);
            }
        }
        res.json({ ...row, tags });
    });
});

app.post('/api/models', (req, res) => {
    const { title, description, file_url, thumbnail, subject, grade, tags } = req.body;

    // Đảm bảo tags lưu dưới dạng chuỗi JSON của mảng, xử lý trường hợp mảng gửi lên và string gửi lên
    let tagsArray = [];
    if (Array.isArray(tags)) {
        tagsArray = tags;
    } else if (typeof tags === 'string') {
        try {
            const parsed = JSON.parse(tags);
            tagsArray = Array.isArray(parsed) ? parsed : [tags];
        } catch (e) {
            tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
        }
    }
    const tagsStr = JSON.stringify(tagsArray);

    db.run(
        'INSERT INTO models (title, description, file_url, thumbnail, subject, grade, tags) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, file_url, thumbnail || null, subject, grade, tagsStr],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Lưu mô hình 3D thành công' });
        }
    );
});

// Upload Model File Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có tệp nào được tải lên' });

    // Return the URL for the frontend to access
    const fileUrl = `/models/${req.file.filename}`;
    res.json({ file_url: fileUrl, message: 'Tải lên thành công' });
});

// Upload Thumbnail Image Endpoint
app.post('/api/upload-thumbnail', uploadThumbnail.single('thumbnail'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Không có ảnh nào được tải lên' });

    const thumbnailUrl = `/thumbnails/${req.file.filename}`;
    res.json({ thumbnail_url: thumbnailUrl, message: 'Tải ảnh đại diện thành công' });
});

// Delete Model Endpoint (Admin only)
app.delete('/api/models/:id', (req, res) => {
    const { id } = req.params;

    // First, get the model to find the file path
    db.get('SELECT * FROM models WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Không tìm thấy học liệu' });

        // Delete the physical model file if it exists
        if (row.file_url) {
            const filePath = path.resolve(__dirname, '../public', row.file_url.replace(/^\//, ''));
            try {
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log(`[INFO] Đã xóa file model: ${filePath}`);
                }
            } catch (unlinkErr) {
                console.error(`[ERROR] Không thể xóa file model: ${filePath}`, unlinkErr.message);
            }
        }

        // Delete the thumbnail file if it exists
        if (row.thumbnail) {
            const thumbPath = path.resolve(__dirname, '../public', row.thumbnail.replace(/^\//, ''));
            try {
                if (fs.existsSync(thumbPath)) {
                    fs.unlinkSync(thumbPath);
                    console.log(`[INFO] Đã xóa file thumbnail: ${thumbPath}`);
                }
            } catch (unlinkErr) {
                console.error(`[ERROR] Không thể xóa file thumbnail: ${thumbPath}`, unlinkErr.message);
            }
        }

        // Delete from database
        db.run('DELETE FROM models WHERE id = ?', [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Không tìm thấy học liệu để xóa' });
            res.json({ message: 'Xóa học liệu thành công' });
        });
    });
});

// ============================================================
// FORGOT PASSWORD ENDPOINTS (Demo/Simulated Mode)
// ============================================================
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email là bắt buộc' });

    db.get('SELECT id, name FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(404).json({ error: 'Email không tồn tại trong hệ thống' });

        const resetCode = generateResetCode();
        const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

        // Delete old tokens for this email
        db.run('DELETE FROM password_reset_tokens WHERE email = ?', [email], () => {
            // Insert new token
            db.run(
                'INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)',
                [email, resetCode, expiresAt],
                (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    console.log(`[DEMO] Mã reset cho ${email}: ${resetCode}`);
                    res.json({
                        message: 'Mã xác nhận đã được tạo',
                        reset_code: resetCode, // Demo mode: return code directly
                        user_name: user.name
                    });
                }
            );
        });
    });
});

app.post('/api/reset-password', (req, res) => {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
        return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }

    db.get(
        'SELECT * FROM password_reset_tokens WHERE email = ? AND token = ?',
        [email, token],
        (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(400).json({ error: 'Mã xác nhận không hợp lệ' });
            if (Date.now() > row.expires_at) {
                // Clean up expired token
                db.run('DELETE FROM password_reset_tokens WHERE id = ?', [row.id]);
                return res.status(400).json({ error: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.' });
            }

            // Update password
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(newPassword, salt);

            db.run('UPDATE users SET password = ? WHERE email = ?', [hash, email], function (err) {
                if (err) return res.status(500).json({ error: err.message });

                // Delete used token
                db.run('DELETE FROM password_reset_tokens WHERE email = ?', [email]);

                res.json({ message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' });
            });
        }
    );
});

// ============================================================
// AI SEARCH ENDPOINT - Hybrid AI Search (Gemini + Weighted Scoring)
// ============================================================
app.post('/api/ai-search', async (req, res) => {
    const { query } = req.body;
    if (!query || !query.trim()) {
        return res.status(400).json({ error: 'Vui lòng nhập nội dung tìm kiếm' });
    }

    try {
        // Step 1: Get all models from DB
        const models = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM models', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        if (models.length === 0) {
            return res.json({
                results: [],
                ai_insight: 'Thư viện hiện chưa có học liệu nào. Vui lòng tải lên mô hình 3D trước.',
                keywords: [],
                predicted_subject: null
            });
        }

        // Step 2: Use Gemini AI to understand the query
        let aiAnalysis = null;
        const apiKey = process.env.GEMINI_API_KEY;

        if (apiKey && apiKey !== 'YOUR_API_KEY_HERE') {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

                // Build context about available models
                const modelSummary = models.map(m => {
                    const tags = typeof m.tags === 'string' ? JSON.parse(m.tags || '[]') : (m.tags || []);
                    return `ID:${m.id} | Title:${m.title} | Subject:${m.subject} | Tags:${tags.join(',')} | Desc:${m.description || ''}`;
                }).join('\n');

                const prompt = `You are an educational assistant for a Vietnamese STEM learning platform.
The user is searching for learning materials (3D models and infographics) about natural sciences.

User query: "${query}"

Available materials in database:
${modelSummary}

Analyze the user's query and respond in this EXACT JSON format (no markdown, no code block):
{
  "keywords": ["keyword1", "keyword2"],
  "predicted_subject": "physics" or "chemistry" or "biology" or null,
  "intent": "Brief Vietnamese description of what user is looking for",
  "matched_ids": [1, 2, 3]
}

Rules:
- keywords: Extract key Vietnamese/English terms related to STEM education
- predicted_subject: Best guess of the subject area
- intent: Explain in Vietnamese what the user wants
- matched_ids: IDs of the most relevant materials from the list, sorted by relevance (most relevant first). Return empty array if nothing matches.`;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text().trim();

                // Parse JSON from AI response (handle potential markdown wrapping)
                let cleanJson = responseText;
                if (cleanJson.startsWith('```')) {
                    cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
                }
                aiAnalysis = JSON.parse(cleanJson);
            } catch (aiError) {
                console.error('[AI Search] Gemini API error:', aiError.message);
                // Fall through to keyword-based search
            }
        }

        // Step 3: Hybrid Scoring - combine AI results with keyword matching
        const searchTerms = query.toLowerCase().split(/[\s,]+/).filter(t => t.length > 1);
        const aiKeywords = aiAnalysis?.keywords?.map(k => k.toLowerCase()) || [];
        const allKeywords = [...new Set([...searchTerms, ...aiKeywords])];
        const predictedSubject = aiAnalysis?.predicted_subject || null;
        const aiMatchedIds = aiAnalysis?.matched_ids || [];

        const scoredModels = models.map(m => {
            let score = 0;
            const titleLower = (m.title || '').toLowerCase();
            const descLower = (m.description || '').toLowerCase();
            const tagsArr = typeof m.tags === 'string' ? JSON.parse(m.tags || '[]') : (m.tags || []);
            const tagsLower = tagsArr.map(t => t.toLowerCase());

            // AI direct match bonus (+30 points per position)
            const aiIndex = aiMatchedIds.indexOf(m.id);
            if (aiIndex !== -1) {
                score += 30 * (aiMatchedIds.length - aiIndex); // Higher score for higher ranking
            }

            // Subject match (+20 points)
            if (predictedSubject && m.subject === predictedSubject) {
                score += 20;
            }

            // Keyword matching
            for (const keyword of allKeywords) {
                // Tag match (+15 per keyword)
                if (tagsLower.some(tag => tag.includes(keyword))) {
                    score += 15;
                }
                // Title match (+10 per keyword)
                if (titleLower.includes(keyword)) {
                    score += 10;
                }
                // Description match (+5 per keyword)
                if (descLower.includes(keyword)) {
                    score += 5;
                }
            }

            return { ...m, score, tags: tagsArr };
        });

        // Sort by score descending, filter out zero-score items
        const rankedResults = scoredModels
            .filter(m => m.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10); // Top 10 results

        res.json({
            results: rankedResults,
            ai_insight: aiAnalysis?.intent || `Tìm kiếm với từ khóa: ${allKeywords.join(', ')}`,
            keywords: allKeywords,
            predicted_subject: predictedSubject
        });

    } catch (error) {
        console.error('[AI Search] Error:', error);
        res.status(500).json({ error: 'Lỗi hệ thống khi tìm kiếm AI' });
    }
});

// Chuyển hướng các request còn lại về React frontend (để xử lý React Router)
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    const htmlFile = path.resolve(__dirname, '../dist/index.html');
    if (fs.existsSync(htmlFile)) {
        res.sendFile(htmlFile);
    } else {
        res.status(404).send('Frontend build not found. Please run "npm run build" first.');
    }
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`[SUCCESS] Backend Server đang chạy tại http://127.0.0.1:${PORT}`);
    console.log(`[INFO] Thư mục upload: ${path.resolve(__dirname, '../public/models')}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[ERROR] Cổng ${PORT} đã bị sử dụng bởi ứng dụng khác.`);
    } else {
        console.error('[ERROR] Lỗi khi khởi chạy server:', err);
    }
});
