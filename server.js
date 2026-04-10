/**
 * ═══════════════════════════════════════════════════
 *  JOSHLEE SOLUTIONS AFRICA — server.js
 *  Express + MongoDB backend
 * ═══════════════════════════════════════════════════
 *
 *  Setup:
 *    npm install
 *    node server.js
 *
 *  Default admin credentials:
 *    username: admin
 *    password: jlsa2025
 *
 *  Change them via ADMIN_USER / ADMIN_PASS env vars
 *  or create a .env file (recommended).
 */

// Load .env file if present
require('dotenv').config();

const express    = require('express');
const { MongoClient } = require('mongodb');
const path       = require('path');
const crypto     = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── CONFIG ─── */
const MONGO_URI = process.env.MONGO_URI ||
  'mongodb://joshlee:joshlee123@ac-iv9nojb-shard-00-00.vllflpf.mongodb.net:27017,ac-iv9nojb-shard-00-01.vllflpf.mongodb.net:27017,ac-iv9nojb-shard-00-02.vllflpf.mongodb.net:27017/?ssl=true&replicaSet=atlas-77nxoq-shard-0&authSource=admin&appName=Cluster0';

const DB_NAME   = 'jlsa_website';
const COL_NAME  = 'content';

// Admin credentials — change these or use env vars
const ADMIN = {
  username: process.env.ADMIN_USER || 'admin',
  password: process.env.ADMIN_PASS || 'jlsa2025',
};

// Simple token store — in production use Redis or JWT properly
const activeSessions = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession() {
  const token = generateToken();
  activeSessions.set(token, { createdAt: Date.now() });
  return token;
}

function verifySession(token) {
  if (!token) return false;
  const session = activeSessions.get(token);
  if (!session) return false;
  // Sessions expire after 8 hours
  if (Date.now() - session.createdAt > 8 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

function getToken(req) {
  const auth = req.headers['authorization'];
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

function requireAuth(req, res, next) {
  const token = getToken(req);
  if (!verifySession(token)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' });
  }
  next();
}

/* ─── DEFAULT SEED CONTENT ─── */
const DEFAULT_CONTENT = {
  hero: {
    tag: 'IT Consultancy · Nairobi, Kenya',
    headline: 'Developing',
    headlineItalic: 'Solutions',
    headlineSmall: 'for The Future',
    description: 'Joshlee Solutions Africa delivers cutting-edge IT services and technology solutions to businesses across East Africa. From infrastructure to software, we power your digital transformation.'
  },
  about: {
    label: 'Who We Are',
    heading: 'Your Trusted IT Partner in East Africa',
    body: 'Founded in Nairobi, Joshlee Solutions Africa has been delivering reliable, innovative technology services to businesses of all sizes. We combine local expertise with world-class solutions to help organisations thrive in a digital world.'
  },
  services: {
    label: 'What We Do',
    heading: 'Our Core Services',
    description: 'From infrastructure to software, we deliver end-to-end IT solutions tailored for East African businesses.',
    items: [
      { ic: '🖥️', t: 'IT Infrastructure', d: 'Design, deployment and maintenance of robust server, network and cloud infrastructure.', tags: ['Cloud', 'Networking', 'Servers'] },
      { ic: '🔒', t: 'Cybersecurity', d: 'Protect your business with enterprise-grade security audits, monitoring and response.', tags: ['Security', 'Compliance', 'Audit'] },
      { ic: '💻', t: 'Software Development', d: 'Custom web and mobile applications built to solve your unique business challenges.', tags: ['Web', 'Mobile', 'Custom'] },
      { ic: '☁️', t: 'Cloud Solutions', d: 'Migration, management and optimisation of cloud environments on AWS, Azure and GCP.', tags: ['AWS', 'Azure', 'GCP'] },
      { ic: '🛠️', t: 'IT Support & Helpdesk', d: 'Responsive, expert support for your team — on-site or remote, 24/7.', tags: ['Support', 'Helpdesk', 'SLA'] },
      { ic: '📊', t: 'Data & Analytics', d: 'Turn your data into insights with dashboards, reporting and business intelligence tools.', tags: ['BI', 'Analytics', 'Dashboards'] },
      { ic: '🔄', t: 'System Integration', d: 'Connect your existing tools and platforms for seamless, automated workflows.', tags: ['API', 'Integration', 'Automation'] },
      { ic: '🎓', t: 'IT Training', d: 'Upskill your team with tailored workshops and certification preparation programmes.', tags: ['Training', 'Workshops', 'Certs'] }
    ]
  },
  products: {
    label: 'IT Solutions',
    heading: 'Specialised Offerings',
    description: 'Packaged solutions designed for fast deployment and measurable results.',
    items: [
      { ic: '🏢', t: 'Business Network Setup', d: 'Complete LAN/WAN design and deployment for offices of all sizes.', f: ['Structured cabling', 'Firewall & router config', 'VPN setup', 'Ongoing monitoring'] },
      { ic: '🔐', t: 'Security Audit Package', d: 'Comprehensive assessment of your IT security posture with actionable recommendations.', f: ['Vulnerability scanning', 'Penetration testing', 'Policy review', 'Remediation roadmap'] },
      { ic: '📱', t: 'Mobile App Development', d: 'Cross-platform mobile apps for iOS and Android, delivered in weeks.', f: ['UI/UX design', 'iOS & Android', 'API integration', '12-month support'] },
      { ic: '☁️', t: 'Cloud Migration', d: 'End-to-end migration of your on-premise systems to the cloud.', f: ['Assessment & planning', 'Zero-downtime migration', 'Cost optimisation', 'Post-migration support'] },
      { ic: '📊', t: 'Analytics Dashboard', d: 'Custom BI dashboards that give you real-time visibility into your business.', f: ['Data pipeline setup', 'Custom KPIs', 'Role-based access', 'Automated reports'] },
      { ic: '🎓', t: 'Staff IT Training', d: 'Structured training programmes to raise your team\'s technical capability.', f: ['Needs assessment', 'Custom curriculum', 'Hands-on labs', 'Certification prep'] }
    ]
  },
  clients: {
    label: 'Trusted By',
    heading: 'Clients Who Count on Us',
    items: [
      { n: 'Equity Bank', l: 'Nairobi, Kenya', t: 'Banking' },
      { n: 'Safaricom', l: 'Nairobi, Kenya', t: 'Telecoms' },
      { n: 'KCB Group', l: 'Nairobi, Kenya', t: 'Banking' },
      { n: 'Nation Media Group', l: 'Nairobi, Kenya', t: 'Media' }
    ]
  },
  testimonials: {
    label: 'Testimonials',
    heading: 'What Our Clients Say',
    items: [
      { q: 'JLSA transformed our IT infrastructure. The team was professional, on time and delivered beyond expectations.', n: 'James Otieno', r: 'CTO, Equity Bank Kenya', i: 'JO' },
      { q: 'Outstanding support and deep technical knowledge. They are our go-to partner for all IT challenges.', n: 'Aisha Mwangi', r: 'Head of IT, Nation Media', i: 'AM' },
      { q: 'The cybersecurity audit they conducted gave us clarity and confidence in our systems. Highly recommended.', n: 'David Kamau', r: 'Director, KCB Group', i: 'DK' }
    ]
  },
  contact: {
    label: 'Contact Us',
    heading: "Let's Start a Conversation",
    description: 'Ready to transform your IT? Get in touch with our team today.',
    phone: '0739 293 691',
    email: 'info@joshleesafrica.com',
    website: 'joshleesafrica.com',
    location: 'Nairobi, Kenya'
  },
  pullquote: {
    text: 'Technology is not just a tool — it is the foundation on which modern African business is built.',
    attr: '— Joshlee Solutions Africa · Nairobi, Kenya'
  },
  theme: {
    purple: '#4B1D8F', purple2: '#6B32C8',
    gold: '#C9960C', gold2: '#E4AF24',
    black: '#0A0812', white: '#FEFCFF',
    cream: '#F9F6FF', ink: '#0D0A1A'
  },
  typography: {
    displayFont: 'Cormorant Garamond',
    bodyFont: 'Outfit'
  }
};

/* ─── MONGODB ─── */
let db = null;

async function connectDB() {
  try {
  const client = new MongoClient(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  tls: true,
  tlsAllowInvalidCertificates: true,
});
    await client.connect();
    db = client.db(DB_NAME);
    console.log('✓ MongoDB connected');

    // Ensure indexes
    await db.collection(COL_NAME).createIndex({ _key: 1 }, { unique: true });

    // Seed default content if collection is empty
    const existing = await db.collection(COL_NAME).findOne({ _key: 'site_content' });
    if (!existing) {
      console.log('  Seeding default content...');
      await db.collection(COL_NAME).insertOne({ _key: 'site_content', ...DEFAULT_CONTENT, updatedAt: new Date() });
      console.log('  ✓ Default content seeded.');
    }
  } catch (err) {
    console.error('✗ MongoDB connection failed:', err.message);
    console.log('  Server will run without DB — content changes will not persist.');
    db = null;
  }
}

async function getContent() {
  if (!db) return null;
  try {
    const doc = await db.collection(COL_NAME).findOne({ _key: 'site_content' });
    if (doc) {
      const { _id, _key, ...data } = doc;
      return data;
    }
    return null;
  } catch (err) {
    console.error('DB read error:', err.message);
    return null;
  }
}

async function saveContent(data) {
  if (!db) throw new Error('Database not connected');
  try {
    await db.collection(COL_NAME).updateOne(
      { _key: 'site_content' },
      { $set: { _key: 'site_content', ...data, updatedAt: new Date() } },
      { upsert: true }
    );
    return true;
  } catch (err) {
    console.error('DB write error:', err.message);
    throw err;
  }
}

/* ─── MIDDLEWARE ─── */
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

/* ─── PUBLIC API ─── */

// GET site content (public — used by frontend to load dynamic data)
app.get('/api/content', async (req, res) => {
  try {
    const data = await getContent();
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ error: 'Failed to load content' });
  }
});

/* ─── ADMIN API ─── */

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (
    username === ADMIN.username &&
    password === ADMIN.password
  ) {
    const token = createSession();
    console.log(`Admin login: ${username} at ${new Date().toISOString()}`);
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ ok: false, message: 'Invalid credentials' });
});

// GET /api/admin/verify — check if session is still valid
app.get('/api/admin/verify', requireAuth, (req, res) => {
  res.json({ ok: true });
});

// POST /api/admin/save — save content to DB
app.post('/api/admin/save', requireAuth, async (req, res) => {
  const { data } = req.body || {};
  if (!data) return res.status(400).json({ ok: false, message: 'No data provided' });

  try {
    await saveContent(data);
    console.log(`Content saved at ${new Date().toISOString()}`);
    res.json({ ok: true, message: 'Content saved successfully' });
  } catch (err) {
    res.status(500).json({ ok: false, message: 'Failed to save: ' + err.message });
  }
});

// GET /api/admin/logout
app.post('/api/admin/logout', requireAuth, (req, res) => {
  const token = getToken(req);
  if (token) activeSessions.delete(token);
  res.json({ ok: true });
});

/* ─── PAGE ROUTES ─── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

/* ─── 404 ─── */
app.use((req, res) => {
  res.status(404).send('Not found');
});

/* ─── BOOT ─── */
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 JLSA Server running at http://localhost:${PORT}`);
    console.log(`   Site:  http://localhost:${PORT}/`);
    console.log(`   Admin: http://localhost:${PORT}/admin`);
    console.log(`\n   Login: ${ADMIN.username} / ${ADMIN.password}`);
    console.log('   (Change ADMIN_USER / ADMIN_PASS env vars to update credentials)\n');
  });
})();
