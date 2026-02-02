
-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Allow public read of profiles (needed to check roles)
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Create terms table
create table if not exists public.terms (
  id uuid default gen_random_uuid() primary key,
  term text not null,
  definition text not null,
  category text not null,
  example text,
  tags text[],
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.terms enable row level security;

-- Terms policies
create policy "Approved terms are viewable by everyone."
  on public.terms for select
  using ( status = 'approved' );

create policy "Admins can view all terms."
  on public.terms for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Everyone can submit terms."
  on public.terms for insert
  with check ( true );

create policy "Admins can update terms."
  on public.terms for update
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
  
create policy "Admins can delete terms."
  on public.terms for delete
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

-- Drop trigger if exists to avoid error
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed data
insert into public.terms (term, definition, category, example, tags, status) values
('ETV', 'Estimated Tax Value. The fair market value of an item which is reported to the IRS on your 1099-NEC form. You pay income tax on this amount.', 'Acronym', 'Be careful ordering that high ETV espresso machine; it will add to your taxable income.', ARRAY['tax', 'finance'], 'approved'),
('Unicorn', 'A highly coveted, high-value item that rarely appears in RFY (e.g., name-brand TVs, gaming laptops, high-end appliances).', 'Slang', 'I finally caught a unicorn today: a 65-inch OLED TV!', ARRAY['rare', 'high-value'], 'approved'),
('RFY', 'Recommended For You. A personalized queue of items that Amazon''s algorithm thinks you specifically might want to review based on past orders.', 'Queues', 'My RFY was empty all morning, then populated with ghost items.', ARRAY['queues', 'algorithm'], 'approved'),
('AFA', 'Available For All. A queue visible to all Vine Voices, typically containing lower value items, books, or Sold by Amazon (SBA) items.', 'Queues', null, ARRAY['queues'], 'approved'),
('AI', 'Additional Items. The main catch-all queue where the majority of Vine items appear (often tens of thousands). Visible to all voices.', 'Queues', 'I spent an hour refreshing AI looking for $0 ETV skincare.', ARRAY['queues'], 'approved'),
('The Drop', 'The time of day when Amazon releases new items into the queues. This can happen in waves or continuously over several hours.', 'Slang', 'The morning drop started around 3 AM PST.', ARRAY['timing'], 'approved'),
('Drip', 'When items are added to the queues very slowly, one or two at a time, rather than in a large batch. The opposite of a flood or a big drop.', 'Slang', 'No big drop today, just a slow drip of cake toppers and phone cases.', ARRAY['timing', 'queues'], 'approved'),
('Pause', 'A period, often lasting a day or more, where no new items are added to any queue. Common during holidays or before major site updates.', 'Slang', null, ARRAY['timing'], 'approved'),
('Ultraviner', 'A third-party browser extension for Amazon Vine users. It provides enhanced features like improved styling, infinite scrolling, and keyword alerts.', 'General', 'I installed Ultraviner to help highlight 0 ETV items in the grid.', ARRAY['tools', 'extension'], 'approved'),
('0 ETV', 'Items with an Estimated Tax Value of $0.00. Typically includes food, beauty, health, and medical items. Highly competitive.', 'Slang', 'I scored a ton of 0 ETV supplements today.', ARRAY['tax', 'popular'], 'approved'),
('Gold Status', 'The higher tier of Vine membership. Allows ordering of up to 8 items per day and items with any price value (no $100 limit). Requires 90% review rate.', 'Status/Tiers', null, ARRAY['tiers'], 'approved'),
('Silver Status', 'The entry tier for Vine. Limited to 3 items per day and items valued under $100. New members start here.', 'Status/Tiers', null, ARRAY['tiers'], 'approved'),
('Vine Jail', 'A restricted state where a reviewer falls below required review percentages (usually 60% of recent orders). Access to RFY/AI is blocked until metrics improve.', 'Slang', 'I need to catch up on reviews this weekend or I''m headed to Vine Jail.', ARRAY['trouble', 'metrics'], 'approved'),
('Ghost Item', 'An item that appears in the list but gives an error (e.g., infinite spinner or red error box) when you try to request it, often because it is already out of stock.', 'Slang', null, ARRAY['errors'], 'approved'),
('Evaluation Period', 'The 6-month cycle at the end of which your stats (items reviewed, % reviewed) are checked to determine if you stay in your current tier, move up, or get demoted.', 'General', null, ARRAY['rules'], 'approved'),
('Variants', 'Different versions (color, size) of the same product listing. Vine rules generally only allow you to review one variant of a product family.', 'General', null, ARRAY['rules'], 'approved'),
('Variant Merge', 'When a seller combines multiple separate product listings into one "Parent" listing. This can prevent you from reviewing multiple items you ordered from that group.', 'General', null, ARRAY['rules', 'reviews'], 'approved'),
('Geo-Locked', 'Items that cannot be shipped to your specific location due to shipping restrictions (common with large batteries, certain chemicals, or furniture).', 'Slang', null, ARRAY['shipping'], 'approved'),
('Vine Helper', 'A popular browser extension used by the community to fix UI bugs and manage hidden items. Not an official Amazon tool.', 'General', null, ARRAY['tools'], 'approved'),
('FBA', 'Fulfilled By Amazon. Items stored in Amazon warehouses. These usually ship faster than third-party seller items.', 'Acronym', null, ARRAY['shipping'], 'approved'),
('6-Month Rule', 'The Terms of Service requirement stating that Vine Voices must keep possession of products for 6 months before transferring possession or disposing of them.', 'General', null, ARRAY['rules', 'legal'], 'approved'),
('SBA', 'Sold By Amazon. Items where Amazon is the retailer, not a third-party seller. These often appear in the AFA queue.', 'Acronym', null, ARRAY['seller'], 'approved'),
('3P Seller', 'Third-Party Seller. An external merchant selling on Amazon. Most AI queue items are from 3P sellers.', 'Acronym', null, ARRAY['seller'], 'approved'),
('Vine CS', 'Vine Customer Support. A specialized support team separate from regular Amazon CS. They handle removals, order issues, and review glitches. Can be reached via the "Contact Us" link on the Vine portal.', 'Acronym', 'I emailed Vine CS to remove that item that never arrived.', ARRAY['support'], 'approved'),
('Item Removal', 'The process of having an item removed from your "Awaiting Review" list and ETV total by support. Valid reasons include: item damaged, lost in transit, or merged variants.', 'General', null, ARRAY['support', 'etv'], 'approved'),
('Spinning Wheel', 'The loading animation that never ends when you click "See Details" on an item. Usually indicates the item is a "ghost" or the server is lagging.', 'Slang', null, ARRAY['errors', 'ui'], 'approved'),
('Stats / Metrics', 'The numbers on your Account page showing "Percentage of items reviewed" and "Total items reviewed". These determine your tier status.', 'General', null, ARRAY['tiers'], 'approved'),
('90% Rule', 'The requirement to review at least 90% of your orders (and 80 items minimum) to achieve or maintain Gold status at evaluation.', 'Status/Tiers', null, ARRAY['gold', 'rules'], 'approved'),
('Bot / Script', 'Automated software used by some (against TOS) to snatch high-value items instantly. A source of frustration for manual users.', 'Slang', null, ARRAY['cheating'], 'approved'),
('Prop 65', 'California proposition regarding chemical warnings. Can cause "Geo-lock" errors for reviewers in other states if the seller has misconfigured shipping settings.', 'General', null, ARRAY['shipping'], 'approved'),
('Hobby vs Business', 'The distinction US taxpayers must make when filing Vine income. "Hobby" income usually goes on Form 1040 Schedule 1, while "Business" goes on Schedule C.', 'General', null, ARRAY['tax'], 'approved'),
('Red Error Box', 'The red error message "Error handling request" that appears when you try to order an item that is broken, out of stock, or geo-locked.', 'Slang', null, ARRAY['errors'], 'approved');
