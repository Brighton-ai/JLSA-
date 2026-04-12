/**
 * ═══════════════════════════════════════════════════
 *  JOSHLEE SOLUTIONS AFRICA — server.js  v2.1
 * ═══════════════════════════════════════════════════
 *  All credentials from .env — nothing hardcoded.
 *
 *  Required .env vars:
 *    ADMIN_EMAIL, ADMIN_PASS, MONGO_URI,
 *    SESSION_SECRET, RESEND_API_KEY, FROM_EMAIL,
 *    SITE_URL, PORT
 */
require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const crypto = require('crypto');

const app  = express();
const PORT = process.env.PORT || 3000;

/* CONFIG */
const MONGO_URI = process.env.MONGO_URI || '';
const DB_NAME   = 'jlsa_website';
const SITE_URL  = (process.env.SITE_URL || 'http://localhost:' + PORT).replace(/\/$/, '');
const ADMIN     = { email: process.env.ADMIN_EMAIL || '', password: process.env.ADMIN_PASS || '' };
const RESEND_KEY = process.env.RESEND_API_KEY || '';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@joshleesafrica.com';

if (!process.env.SESSION_SECRET) console.warn('⚠  SESSION_SECRET not set — sessions reset on restart!');
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');

/* RATE LIMITER */
const rlStore = new Map();
function rateLimit({ windowMs=15*60*1000, max=10, message='Too many requests' }={}) {
  return (req, res, next) => {
    const key = (req.ip||'x')+':'+req.path, now = Date.now();
    const r = rlStore.get(key)||{count:0,start:now};
    if (now-r.start>windowMs){r.count=1;r.start=now;}else r.count++;
    rlStore.set(key, r);
    if (r.count>max) return res.status(429).json({ok:false,message});
    next();
  };
}
setInterval(()=>{const n=Date.now();for(const[k,v]of rlStore)if(n-v.start>3600000)rlStore.delete(k);},1800000);

/* SESSIONS */
const sessions = new Map();
function signToken(payload) {
  const t = crypto.randomBytes(48).toString('hex');
  sessions.set(t, {...payload, createdAt:Date.now()});
  return t;
}
function verifySession(token) {
  if(!token) return null;
  const s = sessions.get(token);
  if(!s) return null;
  if(Date.now()-s.createdAt>28800000){sessions.delete(token);return null;}
  return s;
}
function getToken(req){const a=req.headers['authorization'];return a?.startsWith('Bearer ')?a.slice(7):null;}
function requireAuth(req,res,next){const s=verifySession(getToken(req));if(!s)return res.status(401).json({ok:false,message:'Unauthorized'});req.session=s;next();}
function requireAdmin(req,res,next){const s=verifySession(getToken(req));if(!s||s.role!=='admin')return res.status(403).json({ok:false,message:'Admin access required'});req.session=s;next();}

/* EMAIL via RESEND */
async function sendEmail({to,subject,html,replyTo}){
  if(!RESEND_KEY){console.log(`[Email skipped] To:${to} | ${subject}`);return{ok:true,skipped:true};}
  try{
    const body={from:FROM_EMAIL,to,subject,html};
    if(replyTo) body.reply_to=replyTo;
    const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+RESEND_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});
    const d=await r.json();
    if(!r.ok) throw new Error(d.message||JSON.stringify(d));
    return{ok:true,id:d.id};
  }catch(e){console.error('Email error:',e.message);return{ok:false,error:e.message};}
}

/* EMAIL TEMPLATES */
function tplAdminNotify(msg){
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#4B1D8F;padding:24px 32px;"><h1 style="color:#E4AF24;margin:0;font-size:20px;">New Contact Form Submission</h1></div>
    <div style="padding:28px 32px;background:#fff;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;font-size:13px;width:110px;">Name</td><td style="padding:8px 0;font-weight:600;">${msg.firstName} ${msg.lastName||''}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;">Company</td><td style="padding:8px 0;">${msg.company||'—'}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;">Email</td><td style="padding:8px 0;"><a href="mailto:${msg.email}" style="color:#4B1D8F;">${msg.email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:13px;">Service</td><td style="padding:8px 0;">${msg.service||'—'}</td></tr>
      </table>
      <div style="margin:20px 0;padding:16px;background:#f9f6ff;border-left:4px solid #6B32C8;border-radius:4px;">
        <p style="margin:0;color:#333;line-height:1.6;">${(msg.message||'').replace(/\n/g,'<br>')}</p>
      </div>
      <p style="font-size:12px;color:#999;">Received: ${new Date().toLocaleString('en-KE',{timeZone:'Africa/Nairobi'})} EAT</p>
    </div>
  </div>`;
}
function tplAutoReply(firstName){
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#4B1D8F;padding:24px 32px;"><h1 style="color:#E4AF24;margin:0;font-size:22px;">Thank you, ${firstName}!</h1></div>
    <div style="padding:28px 32px;background:#fff;">
      <p style="color:#333;line-height:1.7;">We've received your message and will respond within <strong>2 business hours</strong>.</p>
      <p style="color:#333;">📞 <strong>0739 293 691</strong></p>
      <p style="color:#333;">🌐 <strong>joshleesafrica.com</strong></p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="font-size:12px;color:#999;">Joshlee Solutions Africa · Nairobi, Kenya</p>
    </div>
  </div>`;
}
function tplReply(msg, replyText){
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#4B1D8F;padding:24px 32px;"><h1 style="color:#E4AF24;margin:0;font-size:20px;">Reply from Joshlee Solutions Africa</h1></div>
    <div style="padding:28px 32px;background:#fff;">
      <p style="color:#333;line-height:1.7;">Hi ${msg.firstName||'there'},</p>
      <div style="margin:20px 0;padding:16px;background:#f9f6ff;border-left:4px solid #6B32C8;border-radius:4px;">
        <p style="margin:0;color:#333;line-height:1.7;">${replyText.replace(/\n/g,'<br>')}</p>
      </div>
      <p style="color:#333;line-height:1.7;">Best regards,<br><strong>Joshlee Solutions Africa Team</strong></p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="font-size:11px;color:#999;">📞 0739 293 691 | 📍 Nairobi, Kenya | 🌐 joshleesafrica.com</p>
      <div style="margin-top:20px;padding:12px;background:#f5f5f5;border-radius:6px;font-size:12px;color:#999;">
        <strong>Your original message:</strong><br><br>${(msg.message||'').replace(/\n/g,'<br>')}
      </div>
    </div>
  </div>`;
}
function tplInvite(invitedBy, role, inviteUrl){
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
    <div style="background:#4B1D8F;padding:24px 32px;"><h1 style="color:#E4AF24;margin:0;font-size:22px;">You're Invited!</h1></div>
    <div style="padding:28px 32px;background:#fff;">
      <p style="color:#333;line-height:1.7;">${invitedBy} has invited you to manage the JLSA website as an <strong>${role}</strong>.</p>
      <div style="margin:28px 0;text-align:center;">
        <a href="${inviteUrl}" style="background:#4B1D8F;color:#E4AF24;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">Accept Invitation →</a>
      </div>
      <p style="color:#999;font-size:13px;">This link expires in 48 hours. If you did not expect this, ignore it.</p>
      <p style="color:#ccc;font-size:11px;word-break:break-all;">Link: ${inviteUrl}</p>
    </div>
  </div>`;
}

/* DEFAULT CONTENT */
const DEFAULT_CONTENT = {
  nav:{logoName:'Joshlee Solutions Africa',logoTagline:'Developing Solutions for The Future',logoImg:'',links:[{label:'Home',href:'#home'},{label:'About',href:'#about'},{label:'Services',href:'#services'},{label:'Products',href:'#products'},{label:'Clients',href:'#clients'},{label:'Values',href:'#values'}],ctaLabel:'Get in Touch',ctaHref:'#contact'},
  hero:{tag:'IT Consultancy · Nairobi, Kenya',headline:'Developing',headlineItalic:'Solutions',headlineSmall:'for The Future',description:'Joshlee Solutions Africa delivers cutting-edge IT services and technology solutions to businesses across East Africa. From infrastructure to software, we power your digital transformation.'},
  about:{label:'Who We Are',heading:'Your Trusted IT Partner in East Africa',body:'Founded in Nairobi, Joshlee Solutions Africa has been delivering reliable, innovative technology services to businesses of all sizes. We combine local expertise with world-class solutions to help organisations thrive in a digital world.'},
  services:{label:'What We Do',heading:'Our Core Services',description:'From infrastructure to software, we deliver end-to-end IT solutions tailored for East African businesses.',items:[{ic:'🎯',n:'01',t:'ICT Management',d:'We assist companies decide on the best ICT policies and strategies that add value and ensure ICT standards are current.',tags:['Strategy','Policy','Planning','Governance']},{ic:'🔐',n:'02',t:'Cybersecurity',d:'Comprehensive cybersecurity services including cloud security, network security audits and software security assessments.',tags:['Cloud Security','Network Security','Software Audit','Threat Analysis']},{ic:'☁️',n:'03',t:'Cloud Solutions',d:'We offer cloud solutions that ensure all client storage needs are met and that their data is secure, accessible and scalable.',tags:['Cloud Storage','Migration','Backup','Office 365']},{ic:'🌐',n:'04',t:'Networking Services',d:'Over 7 years experience delivering networking solutions with minimal downtime — LAN, WAN and bandwidth advisory.',tags:['LAN/WAN','Bandwidth','Infrastructure','Monitoring']},{ic:'💻',n:'05',t:'Website Development & SEO',d:'We develop websites that are intuitive, informative and interactive — an excellent way to exude confidence to your clients.',tags:['Web Design','SEO','CMS','E-commerce']},{ic:'📈',n:'06',t:'Digital Marketing & IT Audit',d:'We expose clients to existing and new audiences digitally, while offering Network Security, System and Overall ICT Audits.',tags:['Digital Marketing','IT Audit','Network Audit','System Review']},{ic:'🖥️',n:'07',t:'Hardware & Software Procurement',d:'We advise on the best hardware and software to procure with the best specifications and at a good market rate.',tags:['Hardware','Software','Licensing','Value Analysis']},{ic:'🔑',n:'08',t:'IT Turnkey Solutions',d:'End-to-end IT project delivery — from planning and procurement through installation, configuration and handover.',tags:['Full Delivery','Setup','Configuration','Handover']}]},
  products:{label:'IT Solutions',heading:'Specialised Offerings',description:'Packaged solutions designed for fast deployment and measurable results.',items:[{ic:'🛡️',n:'01',t:'Cyber Security Suite',d:'A complete cybersecurity package protecting your business from evolving digital threats.',f:['Penetration Testing','Vulnerability Assessment','Incident Response','Security Training','Compliance Reporting']},{ic:'☁️',n:'02',t:'Cloud Security',d:'Secure your cloud infrastructure with monitoring, access control and encryption solutions.',f:['Access Management','Data Encryption','Cloud Monitoring','Compliance','Disaster Recovery']},{ic:'🔍',n:'03',t:'Network Security Audit',d:'Comprehensive assessment of your network infrastructure to identify vulnerabilities and risks.',f:['Network Scanning','Risk Assessment','Firewall Review','VPN Audit','Audit Report']},{ic:'📋',n:'04',t:'Software Security Audit',d:'In-depth review of your software systems to ensure they meet security and compliance standards.',f:['Code Review','OWASP Compliance','Security Testing','Patch Management','Remediation Plan']},{ic:'🔧',n:'05',t:'IT Turnkey Solutions',d:'Complete, ready-to-use IT infrastructure solutions delivered from start to finish.',f:['Needs Analysis','Procurement','Installation','Configuration','Ongoing Support']},{ic:'📊',n:'06',t:'ICT Strategy & Advisory',d:'Expert guidance on technology investments, digital transformation and IT governance.',f:['IT Roadmap','Technology Review','Budget Advisory','Vendor Management','Policy Development']}]},
  clients:{label:'Trusted By',heading:'Clients Who Count on Us',items:[{n:'Italian Trade Agency',l:'International',t:'Government'},{n:'Grasi San Marco Project',l:'Malindi, Kenya',t:'Development'},{n:'Self Help Africa',l:'Kenya',t:'NGO'},{n:'Metropolitan Sacco Limited',l:'Nairobi, Kenya',t:'Financial'}]},
  testimonials:{label:'Testimonials',heading:'What Our Clients Say',items:[{q:'Joshlee Solutions Africa delivered an exceptional network security audit that gave us complete confidence in our IT infrastructure. Professional, thorough and highly knowledgeable.',n:'Client Representative',r:'Italian Trade Agency',i:'IT'},{q:'The team provided outstanding IT support for our project in Malindi. Their expertise in networking and cloud solutions made our operations seamless from day one.',n:'Project Manager',r:'Grasi San Marco Project, Malindi',i:'GS'},{q:'We rely on Joshlee Solutions Africa for all our ICT needs. Their response time, quality of service and honest advice sets them apart from anyone else we have worked with.',n:'IT Coordinator',r:'Self Help Africa, Kenya',i:'SH'}]},
  contact:{label:'Contact Us',heading:"Let's Start a Conversation",description:'Ready to transform your IT? Get in touch with our team today.',phone:'0739 293 691',email:'info@joshleesafrica.com',website:'joshleesafrica.com',location:'Nairobi, Kenya'},
  pullquote:{text:'Technology is not just a tool — it is the foundation on which modern African business is built.',attr:'— Joshlee Solutions Africa · Nairobi, Kenya'},
  theme:{purple:'#4B1D8F',purple2:'#6B32C8',gold:'#C9960C',gold2:'#E4AF24',black:'#0A0812',white:'#FEFCFF',cream:'#F9F6FF',ink:'#0D0A1A'},
  typography:{displayFont:'Cormorant Garamond',bodyFont:'Outfit'}
};

/* CHATBOT */
const CHATBOT_KB=[
  {k:['hello','hi','hey','good morning','good afternoon'],r:"Hello! Welcome to Joshlee Solutions Africa. How can I help you today?"},
  {k:['services','what do you do','offer'],r:"We offer 8 core IT services: ICT Management, Cybersecurity, Cloud Solutions, Networking, Website Development & SEO, Digital Marketing & IT Audit, Hardware & Software Procurement, and IT Turnkey Solutions. Which interests you?"},
  {k:['cybersecurity','security','cyber','hack','protect'],r:"Our Cybersecurity services include cloud security, network audits, software assessments, penetration testing, and incident response. Want a free consultation?"},
  {k:['cloud','azure','aws','office 365','microsoft'],r:"We provide Office 365, Azure/AWS migration, cloud storage, backup and ongoing cloud management."},
  {k:['network','networking','lan','wan','infrastructure'],r:"7+ years delivering LAN/WAN design, bandwidth advisory, monitoring and full infrastructure solutions."},
  {k:['website','web','seo','design','develop'],r:"We build intuitive, responsive websites with SEO to help your business rank higher and attract more clients."},
  {k:['digital marketing','marketing','social media','ads'],r:"Our Digital Marketing: SEO, social media, content marketing and targeted campaigns, paired with IT audit capabilities."},
  {k:['hardware','software','procurement','laptop','computer'],r:"We advise on the best hardware and software at competitive rates — right specs, right price."},
  {k:['turnkey','full solution','complete','end to end'],r:"Our IT Turnkey Solutions handle everything from planning through handover. One contact, zero hassle."},
  {k:['price','cost','quote','how much','pricing','charge'],r:"Pricing depends on scope. Call 0739 293 691 or email info@joshleesafrica.com for a free quote."},
  {k:['contact','phone','email','reach','call','talk'],r:"📞 0739 293 691\n✉️ info@joshleesafrica.com\n📍 Nairobi, Kenya\n\nWe respond within 2 business hours."},
  {k:['location','nairobi','kenya','where','office'],r:"Based in Nairobi, Kenya. We serve clients across East Africa. Remote support available."},
  {k:['clients','who do you work with'],r:"We've worked with the Italian Trade Agency, Grasi San Marco Project, Self Help Africa, Metropolitan Sacco Limited and others."},
  {k:['about','company','jlsa','joshlee','who are you'],r:"JLSA is an IT consultancy in Nairobi, Kenya helping businesses with ICT strategy, infrastructure, cybersecurity and digital transformation for 7+ years."},
  {k:['consultation','meeting','appointment','free'],r:"We offer free initial consultations! Call 0739 293 691 or use the contact form."},
  {k:['audit','it audit','assessment'],r:"Our IT Audit covers Network Security Audits, Software Security Assessments and overall ICT health checks with actionable reports."},
  {k:['thank','thanks','bye','goodbye'],r:"Thank you for reaching out! Have a great day! 😊"},
];
function chatbotReply(msg){const m=msg.toLowerCase();for(const e of CHATBOT_KB)if(e.k.some(k=>m.includes(k)))return e.r;return"I'm not sure, but our team can help!\n📞 0739 293 691\n✉️ info@joshleesafrica.com";}

/* MONGODB */
let db=null;
async function connectDB(){
  if(!MONGO_URI){console.log('⚠  No MONGO_URI — running without DB.');return;}
  try{
    const client=new MongoClient(MONGO_URI,{serverSelectionTimeoutMS:5000,connectTimeoutMS:5000});
    await client.connect();
    db=client.db(DB_NAME);
    console.log('✓ MongoDB connected');
    await db.collection('content').createIndex({_key:1},{unique:true});
    await db.collection('users').createIndex({email:1},{unique:true});
    await db.collection('invites').createIndex({token:1},{unique:true});
    await db.collection('contact_messages').createIndex({createdAt:-1});
    const ex=await db.collection('content').findOne({_key:'site_content'});
    if(!ex){await db.collection('content').insertOne({_key:'site_content',...DEFAULT_CONTENT,updatedAt:new Date()});console.log('  ✓ Default content seeded');}
  }catch(e){console.error('✗ MongoDB failed:',e.message);db=null;}
}
async function getContent(){if(!db)return null;try{const d=await db.collection('content').findOne({_key:'site_content'});if(d){const{_id,_key,...r}=d;return r;}return null;}catch{return null;}}
async function saveContent(data){if(!db)throw new Error('Database not connected');await db.collection('content').updateOne({_key:'site_content'},{$set:{_key:'site_content',...data,updatedAt:new Date()}},{upsert:true});}

/* SECURITY */
app.set('trust proxy',1);
app.disable('x-powered-by');
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Frame-Options','SAMEORIGIN');res.setHeader('X-XSS-Protection','1; mode=block');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');next();});
app.use(express.json({limit:'2mb'}));
app.use((req,res,next)=>{const p=req.path.toLowerCase();if(p==='/.env'||p.startsWith('/.env')||p.includes('/.git')||p==='/server.js'||p==='/package.json'||p.endsWith('.env'))return res.status(404).send('Not found');next();});

/* ═══ PUBLIC ROUTES ═══ */
app.get('/api/content',async(req,res)=>{try{const d=await getContent();res.json(d||DEFAULT_CONTENT);}catch{res.status(500).json({error:'Failed'});}});

app.post('/api/contact',rateLimit({windowMs:600000,max:5,message:'Too many submissions. Please wait.'}),async(req,res)=>{
  const{firstName,lastName,company,email,service,message}=req.body||{};
  if(!firstName||!email||!message)return res.status(400).json({ok:false,message:'Name, email and message required.'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({ok:false,message:'Invalid email.'});
  if(db)try{await db.collection('contact_messages').insertOne({firstName,lastName,company,email,service,message,createdAt:new Date(),read:false,replied:false});}catch{}
  const sc=await getContent();const ae=sc?.contact?.email||ADMIN.email;
  await sendEmail({to:ae,subject:`New Contact: ${firstName} ${lastName||''} — ${service||'General Enquiry'}`,replyTo:email,html:tplAdminNotify({firstName,lastName,company,email,service,message})});
  await sendEmail({to:email,subject:'Thank you for contacting Joshlee Solutions Africa',html:tplAutoReply(firstName)});
  res.json({ok:true,message:'Message sent!'});
});

app.post('/api/chat',rateLimit({windowMs:60000,max:30}),(req,res)=>{
  const{message}=req.body||{};
  if(!message||typeof message!=='string'||message.length>500)return res.status(400).json({ok:false,message:'Invalid.'});
  res.json({ok:true,reply:chatbotReply(message.trim())});
});

/* ═══ ADMIN AUTH ═══ */
app.post('/api/admin/login',rateLimit({windowMs:900000,max:8,message:'Too many login attempts. Try again in 15 minutes.'}),async(req,res)=>{
  const{email,password}=req.body||{};
  if(!email||!password)return res.status(400).json({ok:false,message:'Email and password required.'});
  let role=null,userEmail=null;
  if(email.toLowerCase()===ADMIN.email.toLowerCase()&&password===ADMIN.password){role='admin';userEmail=ADMIN.email;}
  else if(db){const u=await db.collection('users').findOne({email:email.toLowerCase(),active:true});if(u){const h=crypto.createHmac('sha256',SESSION_SECRET).update(password).digest('hex');if(h===u.passwordHash){role=u.role||'editor';userEmail=u.email;}}}
  if(!role){await new Promise(r=>setTimeout(r,300+Math.random()*200));return res.status(401).json({ok:false,message:'Invalid email or password.'});}
  const token=signToken({email:userEmail,role});
  console.log(`Admin login: ${userEmail} [${role}] at ${new Date().toISOString()}`);
  res.json({ok:true,token,role,email:userEmail});
});

app.get('/api/admin/verify',requireAuth,(req,res)=>res.json({ok:true,email:req.session.email,role:req.session.role}));

app.post('/api/admin/save',requireAuth,async(req,res)=>{
  const{data}=req.body||{};
  if(!data)return res.status(400).json({ok:false,message:'No data.'});
  try{await saveContent(data);res.json({ok:true,message:'Saved.'});}
  catch(e){res.status(500).json({ok:false,message:'Failed: '+e.message});}
});

app.post('/api/admin/logout',requireAuth,(req,res)=>{const t=getToken(req);if(t)sessions.delete(t);res.json({ok:true});});

app.post('/api/admin/change-password',requireAuth,async(req,res)=>{
  const{currentPassword,newPassword}=req.body||{};
  if(!currentPassword||!newPassword||newPassword.length<8)return res.status(400).json({ok:false,message:'New password must be 8+ characters.'});
  const s=req.session;let valid=false;
  if(s.email.toLowerCase()===ADMIN.email.toLowerCase()){if(currentPassword===ADMIN.password){ADMIN.password=newPassword;valid=true;}}
  else if(db){const u=await db.collection('users').findOne({email:s.email});if(u){const ch=crypto.createHmac('sha256',SESSION_SECRET).update(currentPassword).digest('hex');if(ch===u.passwordHash){const nh=crypto.createHmac('sha256',SESSION_SECRET).update(newPassword).digest('hex');await db.collection('users').updateOne({email:s.email},{$set:{passwordHash:nh}});valid=true;}}}
  if(!valid)return res.status(401).json({ok:false,message:'Current password incorrect.'});
  res.json({ok:true,message:'Password changed.'});
});

/* ═══ MESSAGES ═══ */
app.get('/api/admin/messages',requireAuth,async(req,res)=>{
  if(!db)return res.json({ok:true,messages:[]});
  try{const m=await db.collection('contact_messages').find({}).sort({createdAt:-1}).limit(100).toArray();res.json({ok:true,messages:m});}
  catch(e){res.status(500).json({ok:false,message:e.message});}
});

app.patch('/api/admin/messages/:id/read',requireAuth,async(req,res)=>{
  if(!db)return res.json({ok:true});
  try{await db.collection('contact_messages').updateOne({_id:new ObjectId(req.params.id)},{$set:{read:true}});res.json({ok:true});}
  catch(e){res.status(500).json({ok:false,message:e.message});}
});

// Reply to a message by email
app.post('/api/admin/messages/:id/reply',requireAuth,rateLimit({windowMs:600000,max:20}),async(req,res)=>{
  const{replyText}=req.body||{};
  if(!replyText||replyText.trim().length<5)return res.status(400).json({ok:false,message:'Reply text required.'});
  if(!db)return res.status(503).json({ok:false,message:'Database unavailable.'});
  let msg;
  try{msg=await db.collection('contact_messages').findOne({_id:new ObjectId(req.params.id)});}
  catch{return res.status(400).json({ok:false,message:'Invalid ID.'});}
  if(!msg)return res.status(404).json({ok:false,message:'Message not found.'});
  const result=await sendEmail({to:msg.email,subject:`Re: ${msg.service||'Your Enquiry'} — Joshlee Solutions Africa`,replyTo:ADMIN.email,html:tplReply(msg,replyText.trim())});
  if(!result.ok&&!result.skipped)return res.status(500).json({ok:false,message:'Email failed: '+result.error});
  await db.collection('contact_messages').updateOne({_id:new ObjectId(req.params.id)},{$set:{read:true,replied:true,repliedAt:new Date(),repliedBy:req.session.email}});
  res.json({ok:true,message:result.skipped?'Marked replied (no email config).':(`Reply sent to ${msg.email}.`)});
});

// Delete one message
app.delete('/api/admin/messages/:id',requireAuth,async(req,res)=>{
  if(!db)return res.status(503).json({ok:false,message:'Database unavailable.'});
  try{await db.collection('contact_messages').deleteOne({_id:new ObjectId(req.params.id)});res.json({ok:true});}
  catch(e){res.status(500).json({ok:false,message:e.message});}
});

// Clear ALL messages (admin only)
app.delete('/api/admin/messages',requireAdmin,async(req,res)=>{
  if(!db)return res.status(503).json({ok:false,message:'Database unavailable.'});
  try{const r=await db.collection('contact_messages').deleteMany({});res.json({ok:true,deleted:r.deletedCount});}
  catch(e){res.status(500).json({ok:false,message:e.message});}
});

/* ═══ USERS ═══ */
app.get('/api/admin/users',requireAdmin,async(req,res)=>{
  if(!db)return res.json({ok:true,users:[]});
  try{const u=await db.collection('users').find({},{projection:{passwordHash:0}}).sort({createdAt:-1}).toArray();res.json({ok:true,users:u});}
  catch(e){res.status(500).json({ok:false,message:e.message});}
});

app.post('/api/admin/invite',requireAdmin,rateLimit({windowMs:3600000,max:20}),async(req,res)=>{
  if(!db)return res.status(503).json({ok:false,message:'Database required.'});
  const{email,role='editor'}=req.body||{};
  if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({ok:false,message:'Valid email required.'});
  if(!['admin','editor'].includes(role))return res.status(400).json({ok:false,message:'Role must be admin or editor.'});
  const ex=await db.collection('users').findOne({email:email.toLowerCase()});
  if(ex)return res.status(409).json({ok:false,message:'User already exists.'});
  const token=crypto.randomBytes(32).toString('hex');
  const expiresAt=new Date(Date.now()+172800000);
  await db.collection('invites').insertOne({token,email:email.toLowerCase(),role,createdAt:new Date(),expiresAt,used:false,invitedBy:req.session.email});
  const inviteUrl=`${SITE_URL}/dashboard-cms?invite=${token}`;
  const er=await sendEmail({to:email,subject:"You've been invited to manage Joshlee Solutions Africa",html:tplInvite(req.session.email,role,inviteUrl)});
  if(!RESEND_KEY)return res.json({ok:true,message:'Invite created. Share this link:',inviteUrl});
  if(!er.ok)return res.status(500).json({ok:false,message:'Failed to send invite: '+er.error});
  res.json({ok:true,message:`Invitation sent to ${email}.`});
});

app.post('/api/admin/invite/accept',async(req,res)=>{
  if(!db)return res.status(503).json({ok:false,message:'Database unavailable.'});
  const{token,password}=req.body||{};
  if(!token||!password||password.length<8)return res.status(400).json({ok:false,message:'Token and password (8+ chars) required.'});
  const inv=await db.collection('invites').findOne({token,used:false});
  if(!inv)return res.status(404).json({ok:false,message:'Invalid or expired invitation.'});
  if(new Date()>inv.expiresAt)return res.status(410).json({ok:false,message:'Invitation expired.'});
  const ph=crypto.createHmac('sha256',SESSION_SECRET).update(password).digest('hex');
  await db.collection('users').insertOne({email:inv.email,role:inv.role,passwordHash:ph,active:true,createdAt:new Date(),invitedBy:inv.invitedBy});
  await db.collection('invites').updateOne({token},{$set:{used:true,usedAt:new Date()}});
  const st=signToken({email:inv.email,role:inv.role});
  res.json({ok:true,token:st,role:inv.role,email:inv.email});
});

app.delete('/api/admin/users/:id',requireAdmin,async(req,res)=>{
  if(!db)return res.status(503).json({ok:false,message:'Database unavailable.'});
  try{await db.collection('users').deleteOne({_id:new ObjectId(req.params.id)});res.json({ok:true});}
  catch(e){res.status(500).json({ok:false,message:e.message});}
});

/* PAGES */
app.use(express.static(path.join(__dirname),{dotfiles:'deny'}));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/dashboard-cms',(req,res)=>res.sendFile(path.join(__dirname,'admin.html')));
app.get('/admin',(req,res)=>res.redirect(301,'/dashboard-cms'));
app.use((req,res)=>res.status(404).send('Not found'));
app.use((err,req,res,next)=>{console.error(err);res.status(500).json({ok:false,message:'Server error'});});

(async()=>{
  await connectDB();
  app.listen(PORT,()=>{
    console.log(`\n🚀 JLSA → http://localhost:${PORT}`);
    console.log(`   Admin: http://localhost:${PORT}/dashboard-cms`);
    console.log(`   Email: ${ADMIN.email}`);
    if(!ADMIN.password) console.error('   ⚠  ADMIN_PASS not set!');
    if(!RESEND_KEY) console.log('   ℹ  RESEND_API_KEY not set — emails skipped.');
    console.log('');
  });
})();