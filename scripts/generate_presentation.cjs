const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function buildPresentation() {
  const pres = new pptxgen();
  // Standard 4:3 ratio (Non-widescreen, 10 x 7.5 inches)
  pres.layout = 'LAYOUT_4x3';
  pres.author = 'AduanePa Fie Technologies Ltd';
  pres.company = 'AduanePa Fie GH';
  pres.title = 'AduanePa Fie - University Food Delivery Marketplace';

  // Palette Constants
  const C_DARK = '1C1917';        // Stone 900
  const C_BRAND = 'D97706';       // Warm Amber
  const C_BRAND_DARK = '9A3412';  // Terracotta
  const C_GOLD = 'F59E0B';        // Amber Gold
  const C_BG_LIGHT = 'FDFBF7';    // Clean Off-white
  const C_WHITE = 'FFFFFF';
  const C_MUTED = '78716C';       // Stone 500
  const C_CARD_BG = 'FFFFFF';
  const C_BORDER = 'E7E5E4';      // Stone 200
  const C_EMERALD = '059669';     // Emerald green
  const C_CARD_DARK = '292524';   // Stone 800

  const screenshotHomepage = path.join(__dirname, '..', 'screenshots', 'homepage.png');
  const screenshotVendor = path.join(__dirname, '..', 'screenshots', 'vendor.png');
  const screenshotRider = path.join(__dirname, '..', 'screenshots', 'rider.png');
  const screenshotAdmin = path.join(__dirname, '..', 'screenshots', 'admin.png');

  // Standard Header Helper for Slides 2-9
  function addHeader(slide, title, category = 'ADUANEPA FIE • GHANAIAN UNIVERSITIES NETWORK') {
    slide.addText(category.toUpperCase(), {
      x: 0.6,
      y: 0.35,
      w: 8.8,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: C_BRAND,
      fontFace: 'Arial'
    });

    slide.addText(title, {
      x: 0.6,
      y: 0.62,
      w: 8.8,
      h: 0.65,
      fontSize: 22,
      bold: true,
      color: C_DARK,
      fontFace: 'Arial'
    });
  }

  // ==========================================
  // SLIDE 1: Title & Cover
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_DARK };

    // Decorative Ghana Flag Stripes
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 0.8, w: 0.3, h: 0.08, fill: { color: 'CE1126' }, line: { color: 'CE1126' } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.95, y: 0.8, w: 0.3, h: 0.08, fill: { color: 'FFD100' }, line: { color: 'FFD100' } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.3, y: 0.8, w: 0.3, h: 0.08, fill: { color: '006B3F' }, line: { color: '006B3F' } });

    slide.addText('GHANAIAN UNIVERSITY FOOD DELIVERY PLATFORM', {
      x: 1.75,
      y: 0.75,
      w: 7.5,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: C_GOLD,
      fontFace: 'Arial'
    });

    // Main Title
    slide.addText('AduanePa Fie', {
      x: 0.6,
      y: 1.15,
      w: 8.8,
      h: 1.1,
      fontSize: 46,
      bold: true,
      color: C_WHITE,
      fontFace: 'Arial'
    });

    // Subtitle & Tagline
    slide.addText('Connecting University Students with Verified Campus Chop Bars & Fast Delivery Riders', {
      x: 0.6,
      y: 2.25,
      w: 8.8,
      h: 0.7,
      fontSize: 16,
      color: 'D6D3D1',
      fontFace: 'Arial'
    });

    slide.addText('"Enjoy the Taste in Every Bite"', {
      x: 0.6,
      y: 3.0,
      w: 8.8,
      h: 0.45,
      fontSize: 15,
      italic: true,
      bold: true,
      color: C_GOLD,
      fontFace: 'Arial'
    });

    // 3 Feature Highlight Cards at Bottom
    const highlights = [
      { title: 'Campus-Scoped', desc: 'UG Legon, KNUST, UCC, UPSA' },
      { title: 'Pay on Delivery', desc: 'Cash / MoMo + 4-Digit OTP Code' },
      { title: '4-Actor Platform', desc: 'Student, Vendor, Rider & Admin' }
    ];

    highlights.forEach((h, idx) => {
      const xPos = 0.6 + idx * 2.95;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 3.65,
        w: 2.8,
        h: 1.35,
        fill: { color: C_CARD_DARK },
        line: { color: '44403C', width: 1 },
        rectRadius: 0.12
      });

      slide.addText(h.title, {
        x: xPos + 0.2,
        y: 3.8,
        w: 2.4,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: C_GOLD,
        fontFace: 'Arial'
      });

      slide.addText(h.desc, {
        x: xPos + 0.2,
        y: 4.15,
        w: 2.4,
        h: 0.65,
        fontSize: 10.5,
        color: 'A8A29E',
        fontFace: 'Arial'
      });
    });

    // App screenshot preview on cover
    if (fs.existsSync(screenshotHomepage)) {
      slide.addImage({
        path: screenshotHomepage,
        x: 0.6,
        y: 5.15,
        w: 8.8,
        h: 1.95,
        rounding: true
      });
    }
  }

  // ==========================================
  // SLIDE 2: The Problem
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'The Problem: Campus Food Friction in Ghana');

    const problems = [
      {
        tag: 'FRAGMENTATION',
        title: 'No Centralized Discovery',
        desc: 'Students lack a single unified digital catalog to browse certified chop bars, waakye spots, and food joints across their campus landmarks.',
        impact: 'High search friction, scattered WhatsApp flyers.'
      },
      {
        tag: 'LACK OF VISIBILITY',
        title: 'No Transparent Order Tracking',
        desc: 'No real-time preparation or courier tracking exists. Students have zero clarity on whether food is being packaged or dispatched.',
        impact: 'Uncertain wait times, missed lecture schedules.'
      },
      {
        tag: 'OPERATIONAL BOTTLENECK',
        title: 'Manual Phone Operations',
        desc: 'Chop bar vendors rely entirely on incoming phone calls and physical queues, causing missed orders and kitchen chaos during peak hours.',
        impact: 'Lost vendor revenue & high error rates.'
      }
    ];

    problems.forEach((p, idx) => {
      const xPos = 0.6 + idx * 2.95;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.4,
        w: 2.8,
        h: 5.6,
        fill: { color: C_CARD_BG },
        line: { color: 'FCA5A5', width: 1.5 },
        rectRadius: 0.15
      });

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos + 0.2,
        y: 1.6,
        w: 2.4,
        h: 0.32,
        fill: { color: 'FEE2E2' },
        line: { color: 'EF4444', width: 1 },
        rectRadius: 0.08
      });
      slide.addText(p.tag, {
        x: xPos + 0.2,
        y: 1.65,
        w: 2.4,
        h: 0.22,
        fontSize: 9,
        bold: true,
        color: 'B91C1C',
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(p.title, {
        x: xPos + 0.2,
        y: 2.1,
        w: 2.4,
        h: 0.8,
        fontSize: 16,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(p.desc, {
        x: xPos + 0.2,
        y: 2.95,
        w: 2.4,
        h: 2.2,
        fontSize: 12,
        color: '44403C',
        fontFace: 'Arial'
      });

      slide.addShape(pres.shapes.RECTANGLE, {
        x: xPos + 0.2,
        y: 5.4,
        w: 2.4,
        h: 1.3,
        fill: { color: 'FFF1F2' },
        line: { color: 'FECDD3', width: 1 }
      });
      slide.addText(`Impact: ${p.impact}`, {
        x: xPos + 0.3,
        y: 5.5,
        w: 2.2,
        h: 1.1,
        fontSize: 11,
        italic: true,
        color: '9F1239',
        fontFace: 'Arial'
      });
    });
  }

  // ==========================================
  // SLIDE 3: The Solution
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'The Solution: Purpose-Built for Universities');

    const solutions = [
      {
        num: '01',
        title: 'Multi-Sided Campus Marketplace',
        desc: 'Connects students, verified chop bars, and independent campus couriers in one synchronized platform.'
      },
      {
        num: '02',
        title: 'Admin-Governed Ecosystem',
        desc: 'Mandatory Food Board hygiene and DVLA permit verification before vendors or riders go live.'
      },
      {
        num: '03',
        title: 'Pay on Delivery with 4-Digit OTP',
        desc: 'Guaranteed financial trust: Students pay cash/MoMo upon physical handoff after verifying a unique 4-digit code.'
      },
      {
        num: '04',
        title: 'University-Scoped Landmark Logistics',
        desc: 'Scoping by Ghanaian university (UG, KNUST, UCC) & hall drop-offs (Pentagon, Conti, Casford) rather than GPS.'
      }
    ];

    solutions.forEach((s, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.6 + col * 4.45;
      const yPos = 1.45 + row * 2.75;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 4.3,
        h: 2.5,
        fill: { color: C_CARD_BG },
        line: { color: 'FDE68A', width: 1.5 },
        rectRadius: 0.15
      });

      slide.addShape(pres.shapes.OVAL, {
        x: xPos + 0.25,
        y: yPos + 0.3,
        w: 0.6,
        h: 0.6,
        fill: { color: 'FEF3C7' },
        line: { color: C_GOLD, width: 1.5 }
      });
      slide.addText(s.num, {
        x: xPos + 0.25,
        y: yPos + 0.42,
        w: 0.6,
        h: 0.35,
        fontSize: 12,
        bold: true,
        color: C_BRAND_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(s.title, {
        x: xPos + 1.0,
        y: yPos + 0.3,
        w: 3.1,
        h: 0.55,
        fontSize: 15,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(s.desc, {
        x: xPos + 1.0,
        y: yPos + 0.9,
        w: 3.1,
        h: 1.4,
        fontSize: 12,
        color: '57534E',
        fontFace: 'Arial'
      });
    });
  }

  // ==========================================
  // SLIDE 4: The 4 Platform Actors
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Platform Actors: 4 Unified Stakeholders');

    const actors = [
      {
        role: 'STUDENT',
        icon: '🎓',
        color: 'EA580C',
        bgColor: 'FFF7ED',
        duties: [
          'Browse campus chop bars',
          'Single-vendor cart order',
          'Select hostel drop-off pin',
          'Pay Cash / MoMo on delivery'
        ]
      },
      {
        role: 'VENDOR',
        icon: '🏪',
        color: 'D97706',
        bgColor: 'FFFBEB',
        duties: [
          'Manage menu & meal prices',
          'Kitchen prep queue workflow',
          'Toggle Open / Closed status',
          'Food Board permit upload'
        ]
      },
      {
        role: 'RIDER',
        icon: '🛵',
        color: '059669',
        bgColor: 'ECFDF5',
        duties: [
          'Bike, Motorbike & Car modes',
          'Claim campus delivery jobs',
          'Validate 4-digit customer OTP',
          'Instant delivery fee collection'
        ]
      },
      {
        role: 'ADMIN',
        icon: '🛡️',
        color: '1C1917',
        bgColor: 'F5F5F4',
        duties: [
          'Accredit vendors & riders',
          'University taxonomy manager',
          'Live sessions & audit logs',
          'Dispute resolution & safety'
        ]
      }
    ];

    actors.forEach((a, idx) => {
      const xPos = 0.6 + idx * 2.22;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.45,
        w: 2.1,
        h: 5.6,
        fill: { color: a.bgColor },
        line: { color: a.color, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(a.icon, {
        x: xPos + 0.1,
        y: 1.65,
        w: 1.9,
        h: 0.45,
        fontSize: 22,
        align: 'center'
      });

      slide.addText(a.role, {
        x: xPos + 0.1,
        y: 2.15,
        w: 1.9,
        h: 0.45,
        fontSize: 12,
        bold: true,
        color: a.color,
        align: 'center',
        fontFace: 'Arial'
      });

      a.duties.forEach((d, dIdx) => {
        slide.addText(`• ${d}`, {
          x: xPos + 0.15,
          y: 2.75 + dIdx * 0.85,
          w: 1.8,
          h: 0.8,
          fontSize: 11,
          color: C_DARK,
          fontFace: 'Arial'
        });
      });
    });
  }

  // ==========================================
  // SLIDE 5: Customer Experience (With Live App Screenshot)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Customer Experience: 5-Step Frictionless Flow');

    // Left side: Process steps
    const steps = [
      { step: '01', title: 'Campus Scoping', desc: 'Browse verified chop bars & trending meals scoped to student university.' },
      { step: '02', title: 'Single-Vendor Cart', desc: 'Select authentic dishes from one joint with zero multi-vendor delays.' },
      { step: '03', title: 'Hostel Landmark', desc: 'Choose precise hall/block drop-off pin (e.g. Pentagon Block B).' },
      { step: '04', title: 'Live Kitchen Tracking', desc: 'Monitor status: Placed -> Preparing -> Out for Delivery.' },
      { step: '05', title: 'OTP Code & Payment', desc: 'Verify 4-digit code and hand over Cash / MoMo on delivery.' }
    ];

    steps.forEach((st, idx) => {
      const yPos = 1.4 + idx * 1.1;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.6,
        y: yPos,
        w: 4.2,
        h: 1.0,
        fill: { color: C_CARD_BG },
        line: { color: 'FDE68A', width: 1 },
        rectRadius: 0.1
      });

      slide.addText(st.step, {
        x: 0.75,
        y: yPos + 0.15,
        w: 0.45,
        h: 0.35,
        fontSize: 11,
        bold: true,
        color: C_BRAND,
        fontFace: 'Arial'
      });

      slide.addText(st.title, {
        x: 1.25,
        y: yPos + 0.12,
        w: 3.4,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(st.desc, {
        x: 1.25,
        y: yPos + 0.45,
        w: 3.4,
        h: 0.5,
        fontSize: 10,
        color: '57534E',
        fontFace: 'Arial'
      });
    });

    // Right side: Live App Screenshot
    if (fs.existsSync(screenshotHomepage)) {
      slide.addImage({
        path: screenshotHomepage,
        x: 5.0,
        y: 1.4,
        w: 4.4,
        h: 5.6,
        rounding: true
      });
    }
  }

  // ==========================================
  // SLIDE 6: Vendor Portal Hub (With Live App Screenshot)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Vendor Hub: Empowering Local Campus Chop Bars');

    const vendorFeatures = [
      { title: 'Menu & Deal Management', desc: 'Create, update dishes, pricing, prep times, and promotional discounts.' },
      { title: 'Live Kitchen Order Queue', desc: 'Advance orders step-by-step from Accept to Ready for Pickup.' },
      { title: 'Real-Time Store Status', desc: 'Set daily operating hours and toggle instant Open/Closed status.' },
      { title: 'Permit & License Uploads', desc: 'Upload Food Board certificates directly for Admin accreditation.' }
    ];

    vendorFeatures.forEach((vf, idx) => {
      const yPos = 1.4 + idx * 1.38;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.6,
        y: yPos,
        w: 4.2,
        h: 1.25,
        fill: { color: C_CARD_BG },
        line: { color: 'FDE68A', width: 1.5 },
        rectRadius: 0.12
      });

      slide.addText(`• ${vf.title}`, {
        x: 0.8,
        y: yPos + 0.15,
        w: 3.8,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: C_BRAND_DARK,
        fontFace: 'Arial'
      });

      slide.addText(vf.desc, {
        x: 0.8,
        y: yPos + 0.52,
        w: 3.8,
        h: 0.65,
        fontSize: 11,
        color: '44403C',
        fontFace: 'Arial'
      });
    });

    if (fs.existsSync(screenshotVendor)) {
      slide.addImage({
        path: screenshotVendor,
        x: 5.0,
        y: 1.4,
        w: 4.4,
        h: 5.6,
        rounding: true
      });
    }
  }

  // ==========================================
  // SLIDE 7: Rider Fleet Operations (With Live App Screenshot)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Rider Fleet: Trusted Campus Couriers');

    const riderSteps = [
      { num: '01', title: 'Sign Up & Verification', desc: 'Submit Ghana Card/DVLA license & vehicle registration.' },
      { num: '02', title: 'Campus Job Board', desc: 'View ready-to-deliver food orders across chop bars.' },
      { num: '03', title: 'Accept & Pick Up', desc: 'Claim delivery jobs with instant vendor pickup notes.' },
      { num: '04', title: 'Handoff & OTP Code', desc: 'Deliver to student hall and enter customer 4-digit code.' },
      { num: '05', title: 'Earn Delivery Fees', desc: 'Collect instant cash/MoMo delivery fees on completion.' }
    ];

    riderSteps.forEach((rs, idx) => {
      const yPos = 1.4 + idx * 1.1;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.6,
        y: yPos,
        w: 4.2,
        h: 1.0,
        fill: { color: 'F0FDF4' },
        line: { color: '86EFAC', width: 1 },
        rectRadius: 0.1
      });

      slide.addText(`STAGE ${rs.num}`, {
        x: 0.75,
        y: yPos + 0.15,
        w: 1.0,
        h: 0.3,
        fontSize: 9.5,
        bold: true,
        color: '166534',
        fontFace: 'Arial'
      });

      slide.addText(rs.title, {
        x: 1.7,
        y: yPos + 0.12,
        w: 3.0,
        h: 0.35,
        fontSize: 12.5,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(rs.desc, {
        x: 0.75,
        y: yPos + 0.45,
        w: 3.9,
        h: 0.5,
        fontSize: 10,
        color: '374151',
        fontFace: 'Arial'
      });
    });

    if (fs.existsSync(screenshotRider)) {
      slide.addImage({
        path: screenshotRider,
        x: 5.0,
        y: 1.4,
        w: 4.4,
        h: 5.6,
        rounding: true
      });
    }
  }

  // ==========================================
  // SLIDE 8: Super Admin Operations & Security (With Live App Screenshot)
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Admin Operations: Platform Trust & Security');

    const adminPillars = [
      { title: 'Vendor & Rider Accreditation', desc: 'Review FDA hygiene permits and DVLA driver licenses.' },
      { title: 'Universities Taxonomy', desc: 'Manage campus profiles and verified drop-off landmarks.' },
      { title: 'Master Order Oversight', desc: 'End-to-end order oversight with OTP transaction verification.' },
      { title: 'Live Sessions & Audit Logs', desc: 'Real-time monitoring of client IPs, active sessions, and logs.' }
    ];

    adminPillars.forEach((ap, idx) => {
      const yPos = 1.4 + idx * 1.38;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: 0.6,
        y: yPos,
        w: 4.2,
        h: 1.25,
        fill: { color: C_CARD_BG },
        line: { color: 'D6D3D1', width: 1.5 },
        rectRadius: 0.12
      });

      slide.addText(ap.title, {
        x: 0.8,
        y: yPos + 0.15,
        w: 3.8,
        h: 0.35,
        fontSize: 13,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(ap.desc, {
        x: 0.8,
        y: yPos + 0.52,
        w: 3.8,
        h: 0.65,
        fontSize: 11,
        color: '57534E',
        fontFace: 'Arial'
      });
    });

    if (fs.existsSync(screenshotAdmin)) {
      slide.addImage({
        path: screenshotAdmin,
        x: 5.0,
        y: 1.4,
        w: 4.4,
        h: 5.6,
        rounding: true
      });
    }
  }

  // ==========================================
  // SLIDE 9: Success Metrics & Growth KPIs
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Success Metrics & Performance KPIs');

    const metrics = [
      { num: '5%+', label: 'Student Activation', desc: 'New signups completing first order within 7 days.' },
      { num: '< 25m', label: 'Fulfillment Time', desc: 'Order placed to hot food delivered at campus hostel door.' },
      { num: '< 24h', label: 'Onboarding Speed', desc: 'Verification turnaround time for new campus chop bars.' },
      { num: '98%+', label: 'Completion Rate', desc: 'Delivered orders verified with customer 4-digit OTP codes.' },
      { num: '65%+', label: '30-Day Retention', desc: 'Active students ordering multiple times per academic month.' }
    ];

    metrics.forEach((m, idx) => {
      const xPos = 0.6 + idx * 1.77;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.5,
        w: 1.68,
        h: 5.5,
        fill: { color: C_CARD_BG },
        line: { color: C_GOLD, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(m.num, {
        x: xPos + 0.05,
        y: 1.8,
        w: 1.58,
        h: 0.7,
        fontSize: 26,
        bold: true,
        color: C_BRAND_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(m.label, {
        x: xPos + 0.05,
        y: 2.6,
        w: 1.58,
        h: 0.6,
        fontSize: 12.5,
        bold: true,
        color: C_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(m.desc, {
        x: xPos + 0.1,
        y: 3.3,
        w: 1.48,
        h: 3.4,
        fontSize: 11,
        color: '57534E',
        align: 'center',
        fontFace: 'Arial'
      });
    });
  }

  // Save PPTX Files
  const outputPath1 = path.join(__dirname, '..', 'AduanePa-Fie Project.pptx');
  
  console.log('Writing PowerPoint presentation to:', outputPath1);
  await pres.writeFile({ fileName: outputPath1 });
  console.log('PowerPoint presentation successfully saved at:', outputPath1);
  
  try {
    const outputPath2 = path.join(__dirname, '..', 'AduanePa-Fie Project 2026.pptx');
    await pres.writeFile({ fileName: outputPath2 });
    console.log('Also updated copy at:', outputPath2);
  } catch (e) {
    console.log('Note: AduanePa-Fie Project 2026.pptx is currently open in PowerPoint.');
  }
}

buildPresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
