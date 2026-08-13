const pptxgen = require('pptxgenjs');
const path = require('path');

async function buildPresentation() {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
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

  // Standard Header Helper for Slides 2-9
  function addHeader(slide, title, category = 'ADUANEPA FIE • GHANAIAN UNIVERSITIES NETWORK') {
    // Category label
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.4,
      w: 8.5,
      h: 0.25,
      fontSize: 10,
      bold: true,
      color: C_BRAND,
      fontFace: 'Arial'
    });

    // Main Slide Title
    slide.addText(title, {
      x: 0.8,
      y: 0.68,
      w: 11.5,
      h: 0.65,
      fontSize: 26,
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
    slide.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.1, w: 0.35, h: 0.1, fill: { color: 'CE1126' }, line: { color: 'CE1126' } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.2, y: 1.1, w: 0.35, h: 0.1, fill: { color: 'FFD100' }, line: { color: 'FFD100' } });
    slide.addShape(pres.shapes.RECTANGLE, { x: 1.6, y: 1.1, w: 0.35, h: 0.1, fill: { color: '006B3F' }, line: { color: '006B3F' } });

    // Category
    slide.addText('GHANAIAN UNIVERSITY FOOD DELIVERY PLATFORM', {
      x: 2.1,
      y: 1.05,
      w: 8.0,
      h: 0.3,
      fontSize: 11,
      bold: true,
      color: C_GOLD,
      fontFace: 'Arial'
    });

    // Main Title
    slide.addText('AduanePa Fie', {
      x: 0.8,
      y: 1.6,
      w: 11.0,
      h: 1.2,
      fontSize: 52,
      bold: true,
      color: C_WHITE,
      fontFace: 'Arial'
    });

    // Subtitle & Tagline
    slide.addText('Connecting University Students with Verified Campus Chop Bars & Fast Delivery Riders', {
      x: 0.8,
      y: 2.9,
      w: 10.5,
      h: 0.7,
      fontSize: 18,
      color: 'D6D3D1',
      fontFace: 'Arial'
    });

    slide.addText('"Enjoy the Taste in Every Bite"', {
      x: 0.8,
      y: 3.7,
      w: 8.0,
      h: 0.5,
      fontSize: 16,
      italic: true,
      bold: true,
      color: C_GOLD,
      fontFace: 'Arial'
    });

    // 3 Feature Highlight Cards at Bottom
    const highlights = [
      { title: 'Campus-Scoped Ordering', desc: 'UG Legon, KNUST, UCC, UPSA & Ashesi' },
      { title: 'Strict Pay on Delivery', desc: 'Cash / MoMo + 4-Digit OTP Code' },
      { title: 'Multi-Portal Ecosystem', desc: 'Student, Vendor, Rider & Admin Ops' }
    ];

    highlights.forEach((h, idx) => {
      const xPos = 0.8 + idx * 3.8;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 4.6,
        w: 3.5,
        h: 1.7,
        fill: { color: C_CARD_DARK },
        line: { color: '44403C', width: 1 },
        rectRadius: 0.15
      });

      slide.addText(h.title, {
        x: xPos + 0.25,
        y: 4.8,
        w: 3.0,
        h: 0.4,
        fontSize: 14,
        bold: true,
        color: C_GOLD,
        fontFace: 'Arial'
      });

      slide.addText(h.desc, {
        x: xPos + 0.25,
        y: 5.25,
        w: 3.0,
        h: 0.7,
        fontSize: 11,
        color: 'A8A29E',
        fontFace: 'Arial'
      });
    });
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
        impact: 'High search friction, reliance on scattered WhatsApp flyers.'
      },
      {
        tag: 'LACK OF VISIBILITY',
        title: 'No Transparent Order Tracking',
        desc: 'No real-time preparation or courier tracking exists. Students have zero clarity on whether food is being packaged or dispatched.',
        impact: 'Uncertain wait times, missed meal schedules between lectures.'
      },
      {
        tag: 'OPERATIONAL BOTTLENECK',
        title: 'Manual Phone & Call Operations',
        desc: 'Chop bar vendors rely entirely on incoming phone calls and physical queues, causing missed orders and kitchen chaos during peak campus hours.',
        impact: 'Lost vendor revenue and high order error rates.'
      }
    ];

    problems.forEach((p, idx) => {
      const xPos = 0.8 + idx * 3.8;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.5,
        w: 3.5,
        h: 4.9,
        fill: { color: C_CARD_BG },
        line: { color: 'FCA5A5', width: 1.5 },
        rectRadius: 0.2
      });

      // Problem badge
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos + 0.3,
        y: 1.75,
        w: 2.9,
        h: 0.35,
        fill: { color: 'FEE2E2' },
        line: { color: 'EF4444', width: 1 },
        rectRadius: 0.08
      });
      slide.addText(p.tag, {
        x: xPos + 0.3,
        y: 1.8,
        w: 2.9,
        h: 0.25,
        fontSize: 9,
        bold: true,
        color: 'B91C1C',
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(p.title, {
        x: xPos + 0.3,
        y: 2.3,
        w: 2.9,
        h: 0.75,
        fontSize: 16,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(p.desc, {
        x: xPos + 0.3,
        y: 3.1,
        w: 2.9,
        h: 1.6,
        fontSize: 12,
        color: '44403C',
        fontFace: 'Arial'
      });

      // Impact box
      slide.addShape(pres.shapes.RECTANGLE, {
        x: xPos + 0.3,
        y: 4.85,
        w: 2.9,
        h: 1.25,
        fill: { color: 'FFF1F2' },
        line: { color: 'FECDD3', width: 1 }
      });
      slide.addText(`Impact: ${p.impact}`, {
        x: xPos + 0.4,
        y: 4.95,
        w: 2.7,
        h: 1.05,
        fontSize: 10.5,
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
      const xPos = 0.8 + col * 5.8;
      const yPos = 1.5 + row * 2.5;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 5.5,
        h: 2.25,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1 },
        rectRadius: 0.15
      });

      // Number badge
      slide.addShape(pres.shapes.OVAL, {
        x: xPos + 0.3,
        y: yPos + 0.3,
        w: 0.65,
        h: 0.65,
        fill: { color: 'FEF3C7' },
        line: { color: C_GOLD, width: 1.5 }
      });
      slide.addText(s.num, {
        x: xPos + 0.3,
        y: yPos + 0.42,
        w: 0.65,
        h: 0.4,
        fontSize: 12,
        bold: true,
        color: C_BRAND_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(s.title, {
        x: xPos + 1.1,
        y: yPos + 0.3,
        w: 4.1,
        h: 0.5,
        fontSize: 15,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(s.desc, {
        x: xPos + 1.1,
        y: yPos + 0.8,
        w: 4.1,
        h: 1.2,
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
        role: 'CUSTOMER / STUDENT',
        icon: '🎓',
        color: 'EA580C',
        bgColor: 'FFF7ED',
        duties: [
          'Browse campus-scoped menus',
          'Single-vendor cart isolation',
          'Select hostel/landmark pin',
          'Verify 4-digit code on arrival',
          'Pay with Cash / MoMo at door'
        ]
      },
      {
        role: 'CHOP BAR VENDOR',
        icon: '🏪',
        color: 'D97706',
        bgColor: 'FFFBEB',
        duties: [
          'Manage dish catalog & pricing',
          'Set kitchen prep times & deals',
          'Kitchen queue (Accept -> Ready)',
          'Toggle store Open/Closed state',
          'Upload food hygiene permits'
        ]
      },
      {
        role: 'DELIVERY RIDER',
        icon: '🛵',
        color: '059669',
        bgColor: 'ECFDF5',
        duties: [
          'Bike, Motorbike, or Car modes',
          'Accept available campus jobs',
          'Navigate to campus landmarks',
          'Validate customer 4-digit OTP',
          'Instant delivery fee collection'
        ]
      },
      {
        role: 'SUPER ADMIN OPS',
        icon: '🛡️',
        color: '1C1917',
        bgColor: 'F5F5F4',
        duties: [
          'Approve/reject vendors & riders',
          'Manage university taxonomy',
          'Real-time order oversight',
          'Monitor active sessions & IPs',
          'Security audit trail & CSV logs'
        ]
      }
    ];

    actors.forEach((a, idx) => {
      const xPos = 0.8 + idx * 2.85;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.5,
        w: 2.65,
        h: 5.0,
        fill: { color: a.bgColor },
        line: { color: a.color, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(a.icon, {
        x: xPos + 0.2,
        y: 1.7,
        w: 2.25,
        h: 0.45,
        fontSize: 22,
        align: 'center'
      });

      slide.addText(a.role, {
        x: xPos + 0.1,
        y: 2.2,
        w: 2.45,
        h: 0.5,
        fontSize: 11,
        bold: true,
        color: a.color,
        align: 'center',
        fontFace: 'Arial'
      });

      a.duties.forEach((d, dIdx) => {
        slide.addText(`• ${d}`, {
          x: xPos + 0.2,
          y: 2.8 + dIdx * 0.72,
          w: 2.25,
          h: 0.65,
          fontSize: 10.5,
          color: C_DARK,
          fontFace: 'Arial'
        });
      });
    });
  }

  // ==========================================
  // SLIDE 5: Customer Experience Flow
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Customer Experience: 5-Step Frictionless Flow');

    const steps = [
      { step: 'STEP 1', title: 'Campus Scoping', desc: 'Select university (UG Legon, KNUST, UCC) & browse verified chop bars and trending delicacies.' },
      { step: 'STEP 2', title: 'Single-Vendor Cart', desc: 'Select meals & drinks from one certified joint, ensuring zero mixed-vendor delivery delays.' },
      { step: 'STEP 3', title: 'Landmark Drop-off', desc: 'Choose precise hostel or hall landmark (e.g. Pentagon Block B) with contact phone.' },
      { step: 'STEP 4', title: 'Live Kitchen Tracking', desc: 'Monitor progress: Order Placed -> Preparing -> Ready for Pickup -> Out for Delivery.' },
      { step: 'STEP 5', title: 'OTP Code & Payment', desc: 'Verify 4-digit secret code with rider and pay exact order amount via Cash or MoMo.' }
    ];

    steps.forEach((st, idx) => {
      const xPos = 0.8 + idx * 2.28;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.7,
        w: 2.15,
        h: 4.3,
        fill: { color: C_CARD_BG },
        line: { color: C_BORDER, width: 1.5 },
        rectRadius: 0.12
      });

      // Top step banner
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos + 0.2,
        y: 1.9,
        w: 1.75,
        h: 0.35,
        fill: { color: 'FEF3C7' },
        line: { color: C_GOLD, width: 1 },
        rectRadius: 0.08
      });
      slide.addText(st.step, {
        x: xPos + 0.2,
        y: 1.95,
        w: 1.75,
        h: 0.25,
        fontSize: 10,
        bold: true,
        color: C_BRAND_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(st.title, {
        x: xPos + 0.15,
        y: 2.45,
        w: 1.85,
        h: 0.7,
        fontSize: 13,
        bold: true,
        color: C_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(st.desc, {
        x: xPos + 0.15,
        y: 3.25,
        w: 1.85,
        h: 2.4,
        fontSize: 11,
        color: '57534E',
        fontFace: 'Arial'
      });
    });

    slide.addText('Guaranteed Pay on Delivery • No credit card or upfront deduction required at launch', {
      x: 0.8,
      y: 6.25,
      w: 11.4,
      h: 0.4,
      fontSize: 12,
      bold: true,
      italic: true,
      color: C_BRAND_DARK,
      align: 'center',
      fontFace: 'Arial'
    });
  }

  // ==========================================
  // SLIDE 6: Vendor Portal Hub
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Vendor Hub: Empowering Local Campus Chop Bars');

    const vendorFeatures = [
      {
        title: 'Menu & Deal Management',
        desc: 'Create, update, and manage Ghanaian dishes, pricing, preparation time estimates, and promotional discounts.'
      },
      {
        title: 'Live Kitchen Order Queue',
        desc: 'Accept incoming orders and advance them step-by-step through preparation stages to Ready for Pickup.'
      },
      {
        title: 'Real-Time Store Status',
        desc: 'Set automatic daily operating hours and toggle instant Open/Closed status when kitchen capacity changes.'
      },
      {
        title: 'Permit & License Uploads',
        desc: 'Upload Food Board certificates and Ghanaian Registrar business documents directly for Admin accreditation.'
      }
    ];

    vendorFeatures.forEach((vf, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.8 + col * 5.8;
      const yPos = 1.6 + row * 2.3;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 5.5,
        h: 2.1,
        fill: { color: C_CARD_BG },
        line: { color: 'FDE68A', width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(`• ${vf.title}`, {
        x: xPos + 0.3,
        y: yPos + 0.25,
        w: 4.9,
        h: 0.45,
        fontSize: 15,
        bold: true,
        color: C_BRAND_DARK,
        fontFace: 'Arial'
      });

      slide.addText(vf.desc, {
        x: xPos + 0.3,
        y: yPos + 0.75,
        w: 4.9,
        h: 1.15,
        fontSize: 12,
        color: '44403C',
        fontFace: 'Arial'
      });
    });

    slide.addText('Includes Bush Canteen, Auntie Muni, Night Market Grills, Conti Chop Bar, and Cape Coast Delights', {
      x: 0.8,
      y: 6.25,
      w: 11.4,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: C_MUTED,
      align: 'center',
      fontFace: 'Arial'
    });
  }

  // ==========================================
  // SLIDE 7: Rider Fleet Operations
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Rider Fleet: Trusted Campus Couriers');

    const riderSteps = [
      { num: '01', title: 'Sign Up & Verification', desc: 'Submit Ghana Card/DVLA license, vehicle registration (Bike/Motorbike/Car) for review.' },
      { num: '02', title: 'Campus Job Board', desc: 'View ready-to-deliver food orders across campus chop bars and cafeterias.' },
      { num: '03', title: 'Accept & Pick Up', desc: 'Claim delivery jobs with instant vendor pickup instructions and student landmark.' },
      { num: '04', title: 'Handoff & OTP Code', desc: 'Deliver to student hall/hostel and enter the customer 4-digit code to finalize order.' },
      { num: '05', title: 'Earn Delivery Fees', desc: 'Collect instant cash/MoMo delivery fees upon verified delivery completion.' }
    ];

    riderSteps.forEach((rs, idx) => {
      const xPos = 0.8 + idx * 2.28;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.7,
        w: 2.15,
        h: 4.3,
        fill: { color: 'F0FDF4' },
        line: { color: '86EFAC', width: 1.5 },
        rectRadius: 0.12
      });

      // Number badge
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos + 0.2,
        y: 1.9,
        w: 1.75,
        h: 0.35,
        fill: { color: 'DCFCE7' },
        line: { color: C_EMERALD, width: 1 },
        rectRadius: 0.08
      });
      slide.addText(`STAGE ${rs.num}`, {
        x: xPos + 0.2,
        y: 1.95,
        w: 1.75,
        h: 0.25,
        fontSize: 10,
        bold: true,
        color: '166534',
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(rs.title, {
        x: xPos + 0.15,
        y: 2.45,
        w: 1.85,
        h: 0.7,
        fontSize: 13,
        bold: true,
        color: C_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(rs.desc, {
        x: xPos + 0.15,
        y: 3.25,
        w: 1.85,
        h: 2.4,
        fontSize: 11,
        color: '374151',
        fontFace: 'Arial'
      });
    });

    slide.addText('100% Delivery Security: Couriers cannot close an order without verifying the customer 4-digit secret code', {
      x: 0.8,
      y: 6.25,
      w: 11.4,
      h: 0.4,
      fontSize: 12,
      bold: true,
      color: '15803D',
      align: 'center',
      fontFace: 'Arial'
    });
  }

  // ==========================================
  // SLIDE 8: Super Admin Operations & Security
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Admin Operations: Platform Trust & Security');

    const adminPillars = [
      {
        title: 'Vendor & Rider Accreditation',
        desc: 'Review submitted FDA hygiene permits and DVLA driver licenses before publishing storefronts live.'
      },
      {
        title: 'Ghanaian Universities Taxonomy',
        desc: 'Manage campus profiles, short codes, and verified drop-off landmarks (Pentagon, Sarbah, Conti, Casford).'
      },
      {
        title: 'Master Order & Dispute Resolution',
        desc: 'End-to-end order oversight with transaction confirmation codes and dispute mediation tools.'
      },
      {
        title: 'Live Sessions & Audit Logs',
        desc: 'Real-time monitoring of client IPs, active sessions, security event logs, and CSV compliance export.'
      }
    ];

    adminPillars.forEach((ap, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const xPos = 0.8 + col * 5.8;
      const yPos = 1.6 + row * 2.3;

      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: yPos,
        w: 5.5,
        h: 2.1,
        fill: { color: C_CARD_BG },
        line: { color: 'D6D3D1', width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(ap.title, {
        x: xPos + 0.3,
        y: yPos + 0.25,
        w: 4.9,
        h: 0.45,
        fontSize: 15,
        bold: true,
        color: C_DARK,
        fontFace: 'Arial'
      });

      slide.addText(ap.desc, {
        x: xPos + 0.3,
        y: yPos + 0.75,
        w: 4.9,
        h: 1.15,
        fontSize: 12,
        color: '57534E',
        fontFace: 'Arial'
      });
    });

    slide.addText('Integrated with Neon Serverless PostgreSQL database & Vercel edge deployment infrastructure', {
      x: 0.8,
      y: 6.25,
      w: 11.4,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: C_MUTED,
      align: 'center',
      fontFace: 'Arial'
    });
  }

  // ==========================================
  // SLIDE 9: Success Metrics & Growth KPIs
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C_BG_LIGHT };
    addHeader(slide, 'Success Metrics & Performance KPIs');

    const metrics = [
      {
        num: '5%+',
        label: 'Student Activation Rate',
        desc: 'New signups completing their first food order within 7 days.'
      },
      {
        num: '< 25m',
        label: 'Average Fulfillment Time',
        desc: 'Order placed to hot food delivered at campus hostel door.'
      },
      {
        num: '< 24h',
        label: 'Vendor Onboarding Speed',
        desc: 'Verification turnaround time for new campus food joints.'
      },
      {
        num: '98%+',
        label: 'Order Completion Rate',
        desc: 'Delivered orders verified with customer 4-digit OTP codes.'
      },
      {
        num: '65%+',
        label: '30-Day Retention Rate',
        desc: 'Active students ordering multiple times per academic month.'
      }
    ];

    metrics.forEach((m, idx) => {
      const xPos = 0.8 + idx * 2.28;
      slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
        x: xPos,
        y: 1.7,
        w: 2.15,
        h: 4.3,
        fill: { color: C_CARD_BG },
        line: { color: C_GOLD, width: 1.5 },
        rectRadius: 0.15
      });

      slide.addText(m.num, {
        x: xPos + 0.1,
        y: 2.0,
        w: 1.95,
        h: 0.75,
        fontSize: 30,
        bold: true,
        color: C_BRAND_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(m.label, {
        x: xPos + 0.1,
        y: 2.85,
        w: 1.95,
        h: 0.6,
        fontSize: 13,
        bold: true,
        color: C_DARK,
        align: 'center',
        fontFace: 'Arial'
      });

      slide.addText(m.desc, {
        x: xPos + 0.15,
        y: 3.5,
        w: 1.85,
        h: 2.2,
        fontSize: 11,
        color: '57534E',
        align: 'center',
        fontFace: 'Arial'
      });
    });

    slide.addText('AduanePa Fie • "Enjoy the Taste in Every Bite" • Live at aduanepa-fie.vercel.app', {
      x: 0.8,
      y: 6.25,
      w: 11.4,
      h: 0.35,
      fontSize: 11,
      bold: true,
      color: C_BRAND,
      align: 'center',
      fontFace: 'Arial'
    });
  }

  // Save Presentation
  const outputPath = path.join(__dirname, '..', 'AduanePa-Fie Project.pptx');
  console.log('Generating pristine PowerPoint presentation at:', outputPath);
  await pres.writeFile({ fileName: outputPath });
  console.log('PowerPoint presentation generated successfully with 0 watermarks!');
}

buildPresentation().catch(err => {
  console.error('Error creating presentation:', err);
  process.exit(1);
});
