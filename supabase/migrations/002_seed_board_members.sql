-- ══════════════════════════════════════════════════════════════
-- Seed: 18 active board members (2025–2026 roster)
-- Source: ACM Board of Directors Handbook
-- ══════════════════════════════════════════════════════════════

insert into board_members (slug, first_name, preferred_name, last_name, title, organization, phone, email, committees, committee_roles, term_start, term_end) values

-- Officers
('angie-rogers', 'Angelique', 'Angie', 'Rogers', 'President', '415 Group', '330.697.1306', 'angie.rogers.cpa@gmail.com', '{"Executive","Finance"}', '{"Executive":"Current President"}', '2021-01-01', '2027-01-01'),

('allyson-boyd', 'Allyson', null, 'Boyd', 'Vice President', 'Akron Zoo', '330.715.7646', 'allysonlboyd@gmail.com', '{"Executive","Donor Relations"}', '{"Executive":"Incoming President","Donor Relations":"Lead"}', '2022-04-01', '2028-04-01'),

('susan-burnoski', 'Susan', null, 'Burnoski', 'Treasurer', 'Eide Bailly LLP', '216.650.6538', 'sburnoski@eidebailly.com', '{"Executive","Finance"}', '{"Executive":"Treasurer","Finance":"Chair"}', '2021-01-01', '2027-01-01'),

('ciera-preer', 'Ciera', null, 'Preer', 'Secretary', 'Vapotherm', '330.620.6247', 'cpreer@vtherm.com', '{"Executive","Donor Relations"}', '{"Executive":"Secretary"}', '2022-04-01', '2028-04-01'),

-- Lifetime Trustees
('betsy-hartschuh', 'Betsy', null, 'Hartschuh', 'Lifetime Trustee', 'Witschey, Witschey & Firestone', '330.329.3942', 'betsylbh@gmail.com', '{"Executive","Governance","Signature Fundraiser"}', '{"Governance":"Chair","Signature Fundraiser":"Lead"}', '2012-01-01', null),

('ryan-hartschuh', 'Ryan', null, 'Hartschuh', 'Lifetime Trustee', 'Goodyear', '330.714.1636', 'schuh32@gmail.com', '{}', '{}', '2012-01-01', null),

('benjamin-tegel', 'Benjamin', null, 'Tegel', 'Lifetime Trustee', 'Auxin Group – Wealth Mgmt', '312.498.7084', 'benjamin.tegel@farther.com', '{}', '{}', '2012-01-01', null),

-- Board Members
('amber-barkoukis', 'Amber', null, 'Barkoukis', null, 'Embracing Futures', '330.620.6964', 'AmberGenet@gmail.com', '{"Governance","Signature Fundraiser"}', '{}', '2023-12-01', '2026-12-01'),

('stephanie-bencin', 'Stephanie', null, 'Bencin', null, 'FirstEnergy Corp', '330.730.4148', 'Sjbencin@yahoo.com', '{"Governance","Signature Fundraiser"}', '{}', '2024-07-01', '2027-07-01'),

('zachary-berger', 'Zachary', 'Zach', 'Berger', null, 'SeibertKeck Insurance Partners', '330.606.3824', 'zberger@seibertkeck.com', '{}', '{}', '2025-04-01', '2028-04-01'),

('sean-blasko', 'Sean', null, 'Blasko', null, 'Oatey Co.', '330.958.4868', 'sblasko4868@gmail.com', '{"Finance","Strategy & Tracking"}', '{}', '2025-04-01', '2028-04-01'),

('sarah-dave', 'Sarah', null, 'Dave', null, 'Parisleaf', '417.343.3775', 'sarahnicoledave@gmail.com', '{}', '{}', '2025-04-01', '2028-04-01'),

('byron-delpinal', 'Byron', null, 'Delpinal', null, 'Branding Brand', '330.993.9543', 'byronddelpinal@gmail.com', '{"Governance","Web Planning"}', '{}', '2025-04-01', '2028-04-01'),

('april-marx', 'April', null, 'Marx', null, 'FirstEnergy Service Company', '440.478.0699', 'marxa@firstenergycorp.com', '{"Finance"}', '{}', '2024-04-01', '2027-04-01'),

('travis-monty-bromer', 'Travis', null, 'Monty-Bromer', null, 'Stan Hywet Hall & Gardens', '330.701.7510', 'bromertravis@gmail.com', '{"Signature Fundraiser","Donor Relations"}', '{}', '2025-04-01', '2028-04-01'),

('trista-powers', 'Trista', null, 'Powers', null, 'Cuyahoga Community College', '330.310.7153', 'tristalpowers@gmail.com', '{"Strategy & Tracking"}', '{}', '2022-04-01', '2028-04-01'),

('diontae-smith', 'Diontae', null, 'Smith', null, 'PNC Bank', '313.693.5138', 'diontae101@gmail.com', '{"Strategy & Tracking","Web Planning"}', '{}', '2025-04-01', '2028-04-01'),

('kerri-stephen', 'Kerri', null, 'Stephen', null, 'Cleveland Clinic Foundation', '440.571.0985', 'kerriastephen@gmail.com', '{"Strategy & Tracking"}', '{"Strategy & Tracking":"Lead"}', '2024-04-01', '2027-04-01');
