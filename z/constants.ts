
export const WILAYAS = [
  "01 - Adrar", "02 - Chlef", "03 - Laghouat", "04 - Oum El Bouaghi", "05 - Batna",
  "06 - Béjaïa", "07 - Biskra", "08 - Béchar", "09 - Blida", "10 - Bouira",
  "11 - Tamanrasset", "12 - Tébessa", "13 - Tlemcen", "14 - Tiaret", "15 - Tizi Ouzou",
  "16 - Alger", "17 - Djelfa", "18 - Jijel", "19 - Sétif", "20 - Saïda",
  "21 - Skikda", "22 - Sidi Bel Abbès", "23 - Annaba", "24 - Guelma", "25 - Constantine",
  "26 - Médéa", "27 - Mostaganem", "28 - M'Sila", "29 - Mascara", "30 - Ouargla",
  "31 - Oran", "32 - El Bayadh", "33 - Illizi", "34 - Bordj Bou Arréridj", "35 - Boumerdès",
  "36 - El Tarf", "37 - Tindouf", "38 - Tissemsilt", "39 - El Oued", "40 - Khenchela",
  "41 - Souk Ahras", "42 - Tipaza", "43 - Mila", "44 - Aïn Defla", "45 - Naâma",
  "46 - Aïn Témouchent", "47 - Ghardaïa", "48 - Relizane", "49 - El M'Ghair", "50 - El Meniaa",
  "51 - Ouled Djellal", "52 - Bordj Baji Mokhtar", "53 - Béni Abbès", "54 - Timimoun", "55 - Touggourt",
  "56 - Djanet", "57 - In Salah", "58 - In Guezzam"
];

export const INITIAL_STATE: any = {
  products: [
    {
      id: '1',
      name: 'Sahara Twilight Oud',
      price: 18500,
      category: 'Perfumes',
      description: 'A rich, deep scent capturing the essence of an Algerian night in the desert. Notes of agarwood, smoke, and wild jasmine.',
      image: 'https://picsum.photos/seed/oud/600/800',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Royal Kabyle Tunic',
      price: 24000,
      category: 'Apparel',
      description: 'Hand-embroidered silk tunic inspired by traditional Berber patterns. Reimagined for the modern aesthetic.',
      image: 'https://picsum.photos/seed/tunic/600/800',
      createdAt: new Date().toISOString()
    }
  ],
  categories: [
    { id: '1', name: 'Perfumes' },
    { id: '2', name: 'Apparel' },
    { id: '3', name: 'Accessories' }
  ],
  theme: {
    primaryColor: '#b8860b',
    secondaryColor: '#1a1a1a',
    bannerText: 'THE GOLDEN ERA OF ALGERIAN LUXURY',
    heroImage: 'https://picsum.photos/seed/luxury/1920/1080',
    fontFamily: 'serif'
  },
  orders: []
};

export const ALGERIA_PHONE_REGEX = /^(05|06|07)[0-9]{8}$/;

// SQL Command for user reference
export const DB_INIT_SQL = `
CREATE TABLE IF NOT EXISTS store_config (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO store_config (id, data) VALUES (1, '{}') ON CONFLICT (id) DO NOTHING;
`;
