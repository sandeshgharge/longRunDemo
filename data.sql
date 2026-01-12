/*
create extension if not exists pg_trgm;


create table if not exists public.products (
id uuid primary key default gen_random_uuid(),
name text not null,
category text not null,
price numeric(10,2) not null check (price >= 0),
stock_quantity integer not null check (stock_quantity >= 0),
created_at timestamptz not null default now()
);


create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_created_at on public.products(created_at desc);
create index if not exists idx_products_name_trgm on public.products using gin (name gin_trgm_ops);


insert into public.products (name, category, price, stock_quantity) values
('Aurora Lamp','Home',29.99,120),
('Nimbus Mug','Home',12.50,0),
('TrailRunner 2.0','Sports',89.00,45),
('PixelPad Mini','Electronics',199.00,12),
('Bonsai Kit','Garden',34.90,80),
('Terra Planter','Garden',22.00,60),
('Summit Backpack','Sports',74.99,25),
('Echo Headphones','Electronics',129.00,30),
('Drift Keyboard','Electronics',79.00,18),
('Ember Kettle','Kitchen',59.99,50),
('Atlas Water Bottle','Sports',19.99,200),
('Comet Flashlight','Outdoor',24.50,95),
('Glacier Cooler','Outdoor',149.00,10),
('Poppy Throw Pillow','Home',17.99,0),
('Cedar Cutting Board','Kitchen',26.00,140),
('Orbit Mouse','Electronics',39.90,75),
('Saffron Spice Set','Kitchen',21.50,33),
('Meadow Picnic Blanket','Outdoor',28.00,8),
('Quill Journal','Books',14.99,110),
('Luna Table Lamp','Home',32.00,41),
('Vapor Sneakers','Fashion',99.00,22),
('Nova Smartwatch','Electronics',229.00,7),
('Harbor Shelf','Home',54.00,6),
('Prism Monitor 24','Electronics',159.00,9),
('Frost Thermos','Outdoor',27.50,120),
('Cascade Shower Head','Home',36.00,0),
('Orbit USB-C Hub','Electronics',29.00,70),
('Forge Skillet 10in','Kitchen',44.00,55),
('Alpine Trek Poles','Sports',49.90,65),
('Grove Plant Stand','Home',31.00,14),
('Aero Yoga Mat','Sports',24.99,130),
('Beacon Desk Lamp','Home',27.00,0),
('Velvet Throw','Home',24.00,42),
('PixelPad Cover','Electronics',19.00,150),
('Aurora Floor Lamp','Home',89.99,5),
('Nimbus Tea Set','Home',38.00,16),
('Summit Trail Shoes','Sports',119.00,11),
('Echo Earbuds','Electronics',79.99,48),
('Drift Mechanical Keyboard','Electronics',109.00,13),
('Ember Toaster','Kitchen',69.00,20),
('Atlas Gym Towel','Sports',12.00,160),
('Comet Lantern','Outdoor',34.00,23),
('Glacier Ice Pack','Outdoor',9.99,300),
('Poppy Duvet Cover','Home',59.00,4),
('Cedar Knife Block','Kitchen',52.00,17),
('Orbit Webcam','Electronics',59.00,27),
('Saffron Apron','Kitchen',18.00,80),
('Meadow Hammock','Outdoor',49.00,19),
('Quill Bookmark Set','Books',6.99,500),
('Luna Wall Clock','Home',22.00,90);

*/
select * from public.products where name LIKE 'Aur%';

select count(*) from public.products;

select * from public.products where category='Garden';