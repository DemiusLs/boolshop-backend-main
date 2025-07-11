INSERT INTO prints (
  id, id_artist, slug, name, creation_year, id_genre,
  price, original_price, description, stock,
  img_url, created_at, updated_at
) VALUES
(1, 1, 'starry-night-reboot', 'Starry Night Reboot', 2023, 1, 150.00, 180.00, 'A vibrant reimagining of the classic.', 8, 'the-musee-paul-dini-2659437_1280.jpg', NOW(), NOW()),
(2, 2, 'cubist-reflections', 'Cubist Reflections', 2022, 6, 170.00, 210.00, 'Modern interpretation of cubist principles.', 5, 'museum-2669315_1280.jpg', NOW(), NOW()),
(3, 3, 'frida-modern-tears', 'Modern Tears', 2021, 9, 130.00, 150.00, 'Emotive self-expression in vivid color.', 10, 'museum-2659409_1280.jpg', NOW(), NOW()),
(4, 4, 'graffiti-skyline', 'Graffiti Skyline', 2024, 5, 95.00, 120.00, 'City and rebellion captured in ink.', 15, 'museum-2659415_1280.jpg', NOW(), NOW()),
(5, 5, 'dot-cosmos', 'Dot Cosmos', 2023, 8, 145.00, 160.00, 'Immersive polka dot universe.', 12, 'museum-2659425_1280.jpg', NOW(), NOW()),
(6, 6, 'neon-buddha', 'Neon Buddha', 2022, 3, 160.00, 200.00, 'East meets West in fluorescent harmony.', 6, 'museum-2659433_1280.jpg', NOW(), NOW()),
(7, 7, 'urban-crown', 'Urban Crown', 2021, 4, 110.00, 140.00, 'Expressionist tribute to kings and chaos.', 9, 'museum-2659438_1280.jpg', NOW(), NOW()),
(8, 8, 'liquid-time', 'Liquid Time', 1931, 2, 180.00, 220.00, 'Clocks melting into consciousness.', 7, 'child-2029072_1280.jpg', NOW(), NOW()),
(9, 9, 'desert-bloom', 'Desert Bloom', 1945, 1, 120.00, 150.00, 'Floral abstraction on sand-toned canvas.', 10, 'museum-2659416_1280.jpg', NOW(), NOW()),
(10, 10, 'power-portrait', 'Power Portrait', 2023, 7, 190.00, 230.00, 'A bold modern figure in royal garb.', 4, 'museum-2669323_1280.jpg', NOW(), NOW()),
(11, 1, 'sun-vortex', 'Sun Vortex', 2024, 3, 140.00, 175.00, 'Spiraling yellows and blues.', 6, 'museum-2659414_1280.jpg', NOW(), NOW()),
(12, 2, 'chaos-blueprint', 'Chaos Blueprint', 2021, 6, 130.00, 160.00, 'Mechanized madness in shades of gray.', 5, 'museum-2659426_1280.jpg', NOW(), NOW()),
(13, 3, 'mirror-pain', 'Mirror of Pain', 1944, 9, 115.00, 140.00, 'Symbolic self-reflection and struggle.', 11, 'museum-2659429_1280.jpg', NOW(), NOW()),
(14, 4, 'brick-rebellion', 'Brick Rebellion', 2022, 5, 100.00, 130.00, 'Street story told in crimson.', 8, 'museum-2659421_1280.jpg', NOW(), NOW()),
(15, 5, 'infinity-net', 'Infinity Net', 2020, 8, 170.00, 200.00, 'Kusama\s dot universe in gold.', 6, 'vietnam-782962_1280.jpg', NOW(), NOW()),
(16, 6, 'anime-blast', 'Anime Blast', 2024, 10, 150.00, 180.00, 'Murakami fusion of culture and color.', 13, 'starry-night-1093721_1280.jpg', NOW(), NOW()),
(17, 7, 'raw-royalty', 'Raw Royalty', 1983, 4, 135.00, 160.00, 'Crowned chaos in line and color.', 9, 'the-musee-paul-dini-2659437_1280.jpg', NOW(), NOW()),
(18, 8, 'surreal-mirror', 'Surreal Mirror', 1936, 2, 160.00, 190.00, 'Distorted reflections in dream-space.', 7, 'museum-2669315_1280.jpg', NOW(), NOW()),
(19, 9, 'petal-geometry', 'Petal Geometry', 1930, 1, 120.00, 150.00, 'Flowers reassembled into abstract form.', 10, 'museum-2659409_1280.jpg', NOW(), NOW()),
(20, 10, 'glitch-throne', 'Glitch Throne', 2023, 7, 200.00, 240.00, 'Baroque meets digital distortion.', 3, 'museum-2659415_1280.jpg', NOW(), NOW()),
(21, 1, 'iris-blur', 'Iris Blur', 2023, 1, 130.00, 160.00, 'Soft and dreamy petals.', 7, 'museum-2659425_1280.jpg', NOW(), NOW()),
(22, 2, 'shattered-grid', 'Shattered Grid', 2022, 10, 140.00, 180.00, 'Fractured space and shape.', 6, 'museum-2659433_1280.jpg', NOW(), NOW()),
(23, 3, 'pain-reflected', 'Pain Reflected', 2021, 9, 110.00, 130.00, 'Layers of personal history.', 12, 'museum-2659438_1280.jpg', NOW(), NOW()),
(24, 4, 'neon-tag', 'Neon Tag', 2022, 5, 90.00, 120.00, 'Bright symbols of resistance.', 14, 'child-2029072_1280.jpg', NOW(), NOW()),
(25, 5, 'cosmic-drip', 'Cosmic Drip', 2020, 8, 155.00, 190.00, 'Stars melting into canvas.', 6, 'museum-2659416_1280.jpg', NOW(), NOW()),
(26, 6, 'electric-lotus', 'Electric Lotus', 2021, 3, 140.00, 170.00, 'Zen energy in digital brushstrokes.', 8, 'museum-2669323_1280.jpg', NOW(), NOW()),
(27, 7, 'riot-lines', 'Riot Lines', 1984, 4, 130.00, 160.00, 'Angry lines full of voice.', 9, 'museum-2659414_1280.jpg', NOW(), NOW()),
(28, 8, 'time-fracture', 'Time Fracture', 1932, 2, 170.00, 210.00, 'Dreamscape invasion of clocks.', 5, 'museum-2659426_1280.jpg', NOW(), NOW()),
(29, 9, 'cactus-mind', 'Cactus Mind', 1935, 1, 110.00, 140.00, 'Nature and thought intersect.', 10, 'museum-2659429_1280.jpg', NOW(), NOW()),
(30, 10, 'pixel-prince', 'Pixel Prince', 2023, 7, 190.00, 220.00, 'Glitch royalty in 8-bit.', 4, 'museum-2659421_1280.jpg', NOW(), NOW()),
(31, 1, 'ghost-silhouette', 'Ghost Silhouette', 2022, 1, 125.00, 150.00, 'Fading outlines in a misty backdrop.', 6, 'vietnam-782962_1280.jpg', NOW(), NOW()),
(32, 2, 'cyber-baroque', 'Cyber Baroque', 2023, 7, 200.00, 240.00, 'Classic patterns with digital noise.', 4, 'starry-night-1093721_1280.jpg', NOW(), NOW()),
(33, 3, 'inner-roots', 'Inner Roots', 2021, 9, 115.00, 140.00, 'A journey into identity and growth.', 9, 'the-musee-paul-dini-2659437_1280.jpg', NOW(), NOW()),
(34, 4, 'spray-nation', 'Spray Nation', 2022, 5, 105.00, 130.00, 'Symbols of protest in neon and grime.', 11, 'museum-2669315_1280.jpg', NOW(), NOW()),
(35, 5, 'obsession-field', 'Obsession Field', 2020, 8, 165.00, 190.00, 'Dots multiplying in hypnotic rhythm.', 7, 'museum-2659409_1280.jpg', NOW(), NOW()),
(36, 6, 'techno-mandala', 'Techno Mandala', 2023, 3, 150.00, 180.00, 'Sacred geometry in synthetic tones.', 5, 'museum-2659415_1280.jpg', NOW(), NOW()),
(37, 7, 'wild-visions', 'Wild Visions', 1982, 4, 140.00, 170.00, 'Primal expressions in vivid graffiti.', 8, 'museum-2659425_1280.jpg', NOW(), NOW()),
(38, 8, 'echo-of-memory', 'Echo of Memory', 1938, 2, 175.00, 200.00, 'Surreal landscape of the subconscious.', 6, 'museum-2659433_1280.jpg', NOW(), NOW()),
(39, 9, 'botanic-harmony', 'Botanic Harmony', 1933, 1, 120.00, 150.00, 'Organic shapes in balance.', 10, 'museum-2659438_1280.jpg', NOW(), NOW()),
(40, 10, 'digital-diva', 'Digital Diva', 2024, 7, 195.00, 230.00, 'Futuristic portrait with pixel flare.', 3, 'child-2029072_1280.jpg', NOW(), NOW()),
(41, 1, 'dream-bleed', 'Dream Bleed', 2022, 1, 125.00, 160.00, 'Soft bleeding tones of dusk.', 6, 'museum-2659416_1280.jpg', NOW(), NOW()),
(42, 2, 'matrix-roses', 'Matrix Roses', 2021, 10, 145.00, 180.00, 'Roses rendered in simulation glitch.', 5, 'museum-2669323_1280.jpg', NOW(), NOW()),
(43, 3, 'sorrow-cascade', 'Sorrow Cascade', 2021, 9, 115.00, 140.00, 'Tears forming abstract cascades.', 9, 'museum-2659414_1280.jpg', NOW(), NOW()),
(44, 4, 'riot-brush', 'Riot Brush', 2023, 5, 95.00, 120.00, 'Bold splashes and aggressive strokes.', 13, 'museum-2659426_1280.jpg', NOW(), NOW()),
(45, 5, 'mirror-net', 'Mirror Net', 2020, 8, 165.00, 190.00, 'Polka dots over reflective void.', 6, 'museum-2659429_1280.jpg', NOW(), NOW()),
(46, 6, 'zen-circuit', 'Zen Circuit', 2022, 3, 155.00, 180.00, 'Minimal lines with AI-style aesthetics.', 5, 'museum-2659421_1280.jpg', NOW(), NOW()),
(47, 7, 'royal-static', 'Royal Static', 1985, 4, 135.00, 160.00, 'Electric blue crowns on crimson.', 8, 'vietnam-782962_1280.jpg', NOW(), NOW()),
(48, 8, 'melting-horizon', 'Melting Horizon', 1937, 2, 170.00, 210.00, 'Surreal boundaries between sky and land.', 6, 'starry-night-1093721_1280.jpg', NOW(), NOW()),
(49, 9, 'orchid-realm', 'Orchid Realm', 1932, 1, 110.00, 140.00, 'Fantasy flora in abstract form.', 9, 'the-musee-paul-dini-2659437_1280.jpg', NOW(), NOW()),
(50, 10, 'augmented-icon', 'Augmented Icon', 2024, 7, 200.00, 240.00, 'Tech and tradition merge in portrait.', 4, 'museum-2669315_1280.jpg', NOW(), NOW());
