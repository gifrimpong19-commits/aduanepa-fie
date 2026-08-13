const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_eHypNmvT4PZ8@ep-green-firefly-avgv1znc.c-11.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function seedData() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database for Seeding...');

    // 1. Seed Universities
    console.log('Seeding Universities...');
    const universities = [
      {
        id: 'ug-legon',
        name: 'University of Ghana',
        short_name: 'UG (Legon)',
        region: 'Greater Accra Region',
        city: 'Accra',
        campus_name: 'Main Campus - Legon',
        popular_landmarks: JSON.stringify([
          'Pentagon Hostels (Block A, B, C)',
          'Night Market / Sarbah Field',
          'Bush Canteen Lane',
          'Jean Nelson Aka Hall',
          'Alexander Kwapong Hall',
          'Commonwealth Hall (Vandals)',
          'Volta Hall'
        ]),
        banner_image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'knust-kumasi',
        name: 'Kwame Nkrumah University of Science and Technology',
        short_name: 'KNUST (Tech)',
        region: 'Ashanti Region',
        city: 'Kumasi',
        campus_name: 'Main Campus - Ayeduase',
        popular_landmarks: JSON.stringify([
          'Unity Hall (Conti)',
          'University Hall (Katanga)',
          'Africa Hall',
          'Queens Hall',
          'Independence Hall'
        ]),
        banner_image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80'
      },
      {
        id: 'ucc-capecoast',
        name: 'University of Cape Coast',
        short_name: 'UCC (Cape Coast)',
        region: 'Central Region',
        city: 'Cape Coast',
        campus_name: 'Main Campus & Science',
        popular_landmarks: JSON.stringify([
          'Casely Hayford Hall (Casford)',
          'Atlantic Hall (Marinates)',
          'Valco Hall',
          'Science Market Hub'
        ]),
        banner_image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
      }
    ];

    for (const u of universities) {
      await client.query(`
        INSERT INTO universities (id, name, short_name, region, city, campus_name, popular_landmarks, banner_image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          popular_landmarks = EXCLUDED.popular_landmarks;
      `, [u.id, u.name, u.short_name, u.region, u.city, u.campus_name, u.popular_landmarks, u.banner_image]);
    }

    // 2. Seed Users
    console.log('Seeding User Profiles...');
    const users = [
      {
        id: '00000000-0000-0000-0000-000000000001',
        unique_id_code: 'ADP-CUST-1001',
        full_name: 'Ama Osei',
        email: 'ama.osei@st.ug.edu.gh',
        phone: '054 586 9725',
        role: 'customer',
        status: 'approved',
        avatar_url: 'https://api.dicebear.com/7.x/micah/svg?seed=AmaOsei&skinColor=8d5524,763900&hairColor=000000',
        university_id: 'ug-legon',
        region: 'Greater Accra',
        city: 'Accra',
        default_landmark: 'Pentagon Block B, Room 314, Legon'
      },
      {
        id: '00000000-0000-0000-0000-000000000002',
        unique_id_code: 'ADP-VND-8101',
        full_name: 'Kofi Mensah',
        email: 'kofi.mensah@bushcanteen.com',
        phone: '054 586 9725',
        role: 'vendor',
        status: 'approved',
        avatar_url: 'https://api.dicebear.com/7.x/micah/svg?seed=KofiMensah&skinColor=763900,614335&hairColor=000000',
        university_id: 'ug-legon',
        region: 'Greater Accra',
        city: 'Accra',
        default_landmark: 'Bush Canteen Legon'
      },
      {
        id: '00000000-0000-0000-0000-000000000003',
        unique_id_code: 'ADP-ADM-0001',
        full_name: 'AduanePa Operations Master',
        email: 'admin@aduanepa.gh',
        phone: '054 586 9725',
        role: 'admin',
        status: 'approved',
        avatar_url: 'https://api.dicebear.com/7.x/micah/svg?seed=AdminGhana&skinColor=763900,614335&hairColor=000000',
        university_id: 'ug-legon',
        region: 'Greater Accra',
        city: 'Accra',
        default_landmark: 'AduanePa HQ'
      }
    ];

    for (const usr of users) {
      await client.query(`
        INSERT INTO user_profiles (id, unique_id_code, full_name, email, phone, role, status, avatar_url, university_id, region, city, default_landmark)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING;
      `, [usr.id, usr.unique_id_code, usr.full_name, usr.email, usr.phone, usr.role, usr.status, usr.avatar_url, usr.university_id, usr.region, usr.city, usr.default_landmark]);
    }

    // 3. Seed Vendors
    console.log('Seeding Vendors...');
    const vendors = [
      {
        id: 'vnd-bush-canteen',
        owner_id: '00000000-0000-0000-0000-000000000002',
        unique_id_code: 'ADP-VND-8101',
        business_name: 'Bush Canteen Special',
        owner_name: 'Kofi Mensah',
        tagline: 'Authentic Ghanaian Jollof, Waakye & Local Soups',
        logo_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&h=200&q=80',
        banner_image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
        university_id: 'ug-legon',
        region: 'Greater Accra',
        city: 'Accra',
        location_details: 'Opposite Fire Station, Bush Canteen Lane, Legon Campus',
        operating_hours: JSON.stringify({ open: '08:00', close: '21:30', daysOpen: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] }),
        is_manually_open: true,
        status: 'approved',
        certificate_doc_name: 'gh_registrar_bush_canteen_2025.pdf',
        categories: JSON.stringify(['Waakye', 'Jollof & Rice', 'Local Soups', 'Drinks']),
        rating: 4.8,
        delivery_time_estimate: '20-30 mins',
        min_order: 25,
        delivery_fee: 10
      }
    ];

    for (const v of vendors) {
      await client.query(`
        INSERT INTO vendors (id, owner_id, unique_id_code, business_name, owner_name, tagline, logo_url, banner_image, university_id, region, city, location_details, operating_hours, is_manually_open, status, certificate_doc_name, categories, rating, delivery_time_estimate, min_order, delivery_fee)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        ON CONFLICT (id) DO UPDATE SET business_name = EXCLUDED.business_name;
      `, [v.id, v.owner_id, v.unique_id_code, v.business_name, v.owner_name, v.tagline, v.logo_url, v.banner_image, v.university_id, v.region, v.city, v.location_details, v.operating_hours, v.is_manually_open, v.status, v.certificate_doc_name, v.categories, v.rating, v.delivery_time_estimate, v.min_order, v.delivery_fee]);
    }

    // 4. Seed Products
    console.log('Seeding Dishes...');
    const products = [
      {
        id: 'prod-bc-01',
        vendor_id: 'vnd-bush-canteen',
        name: 'Bush Canteen Royal Waakye Pack',
        description: 'Hot Ghanaian Waakye served with dark shito, rich stew, boiled egg, spaghetti (talia), seasoned gari foto, fried plantain, tender wele, and beef.',
        category: 'Waakye',
        price: 45.00,
        discount_percentage: 10,
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        is_available: true,
        preparation_time_minutes: 10,
        dietary_tags: JSON.stringify(['Popular', 'Local Special', 'Spicy'])
      },
      {
        id: 'prod-bc-02',
        vendor_id: 'vnd-bush-canteen',
        name: 'Ghana Smoky Jollof with Quarter Spiced Chicken',
        description: 'Authentic party smoky Ghanaian Jollof rice served with spiced quarter chicken, coleslaw, and homemade hot shito.',
        category: 'Jollof & Rice',
        price: 50.00,
        discount_percentage: 0,
        image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
        is_available: true,
        preparation_time_minutes: 15,
        dietary_tags: JSON.stringify(['Bestseller', 'Campus Favorite'])
      }
    ];

    for (const p of products) {
      await client.query(`
        INSERT INTO products (id, vendor_id, name, description, category, price, discount_percentage, image_url, is_available, preparation_time_minutes, dietary_tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING;
      `, [p.id, p.vendor_id, p.name, p.description, p.category, p.price, p.discount_percentage, p.image_url, p.is_available, p.preparation_time_minutes, p.dietary_tags]);
    }

    console.log('Database Seeding Completed Successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.end();
  }
}

seedData();
