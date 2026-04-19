-- ══════════════════════════════════════════════════════════════
-- Seed: 2025–2026 meeting schedule
-- Source: ACM Board of Directors Handbook
--
-- Full board:  bi-monthly, 11:30 AM – 1:00 PM, in person
-- Executive:   monthly, 4th Thursday, 12:00 PM – 1:00 PM, virtual
-- Finance:     monthly, 4th Monday,  12:00 PM – 1:00 PM, virtual
-- Governance:  bi-monthly (aligns with board months), virtual
-- ══════════════════════════════════════════════════════════════

insert into meetings (slug, title, meeting_type, meeting_date, start_time, end_time, location, committee) values

-- Full Board Meetings (2025–2026 cycle)
('full-board-2025-12', 'Full Board Meeting',  'full_board', '2025-12-01', '11:30', '13:00', 'Akron Children''s Museum – Community Room', null),
('full-board-2026-02', 'Full Board Meeting',  'full_board', '2026-02-02', '11:30', '13:00', 'Akron Children''s Museum – Community Room', null),
('full-board-2026-04', 'Full Board Meeting',  'full_board', '2026-04-06', '11:30', '13:00', 'Akron Children''s Museum – Community Room', null),
('full-board-2026-06', 'Full Board Meeting',  'full_board', '2026-06-01', '11:30', '13:00', 'Akron Children''s Museum – Community Room', null),
('full-board-2026-08', 'Full Board Meeting',  'full_board', '2026-08-03', '11:30', '13:00', 'Akron Children''s Museum – Community Room', null),
('full-board-2026-10', 'Full Board Meeting',  'full_board', '2026-10-05', '11:30', '13:00', 'Akron Children''s Museum – Community Room', null),
('full-board-2026-12', 'Full Board Meeting',  'full_board', '2026-12-07', '11:30', '13:00', 'Akron Children''s Museum – Community Room', null),

-- Executive Committee (monthly, 4th Thursday, virtual)
('exec-2026-01', 'Executive Committee',  'committee', '2026-01-22', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-02', 'Executive Committee',  'committee', '2026-02-26', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-03', 'Executive Committee',  'committee', '2026-03-26', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-04', 'Executive Committee',  'committee', '2026-04-23', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-05', 'Executive Committee',  'committee', '2026-05-28', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-06', 'Executive Committee',  'committee', '2026-06-25', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-07', 'Executive Committee',  'committee', '2026-07-23', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-08', 'Executive Committee',  'committee', '2026-08-27', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-09', 'Executive Committee',  'committee', '2026-09-24', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-10', 'Executive Committee',  'committee', '2026-10-22', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-11', 'Executive Committee',  'committee', '2026-11-19', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),
('exec-2026-12', 'Executive Committee',  'committee', '2026-12-17', '12:00', '13:00', 'Virtual (Zoom)', 'Executive'),

-- Finance Committee (monthly, 4th Monday, virtual)
('finance-2026-01', 'Finance Committee',  'committee', '2026-01-26', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-02', 'Finance Committee',  'committee', '2026-02-23', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-03', 'Finance Committee',  'committee', '2026-03-23', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-04', 'Finance Committee',  'committee', '2026-04-27', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-05', 'Finance Committee',  'committee', '2026-05-25', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-06', 'Finance Committee',  'committee', '2026-06-22', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-07', 'Finance Committee',  'committee', '2026-07-27', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-08', 'Finance Committee',  'committee', '2026-08-24', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-09', 'Finance Committee',  'committee', '2026-09-28', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-10', 'Finance Committee',  'committee', '2026-10-26', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-11', 'Finance Committee',  'committee', '2026-11-23', '12:00', '13:00', 'Virtual (Zoom)', 'Finance'),
('finance-2026-12', 'Finance Committee',  'committee', '2026-12-28', '12:00', '13:00', 'Virtual (Zoom)', 'Finance');
