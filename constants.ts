import { Term, TermCategory } from './types';

export const APP_ACCENT_COLOR = '#09BE82';
export const APP_NAME = 'Vine Lingo';

export const CATEGORIES = Object.values(TermCategory);

export const GLOSSARY_DATA: Term[] = [
  {
    id: 'etv',
    term: 'ETV',
    category: TermCategory.ACRONYM,
    definition: 'Estimated Tax Value. The fair market value of an item which is reported to the IRS on your 1099-NEC form. You pay income tax on this amount.',
    example: 'Be careful ordering that high ETV espresso machine; it will add to your taxable income.',
    tags: ['tax', 'finance']
  },
  {
    id: 'unicorn',
    term: 'Unicorn',
    category: TermCategory.SLANG,
    definition: 'A highly coveted, high-value item that rarely appears in RFY (e.g., name-brand TVs, gaming laptops, high-end appliances).',
    example: 'I finally caught a unicorn today: a 65-inch OLED TV!',
    tags: ['rare', 'high-value']
  },
  {
    id: 'rfy',
    term: 'RFY',
    category: TermCategory.QUEUE,
    definition: 'Recommended For You. A personalized queue of items that Amazon\'s algorithm thinks you specifically might want to review based on past orders.',
    example: 'My RFY was empty all morning, then populated with ghost items.',
    tags: ['queues', 'algorithm']
  },
  {
    id: 'afa',
    term: 'AFA',
    category: TermCategory.QUEUE,
    definition: 'Available For All. A queue visible to all Vine Voices, typically containing lower value items, books, or Sold by Amazon (SBA) items.',
    tags: ['queues']
  },
  {
    id: 'ai',
    term: 'AI',
    category: TermCategory.QUEUE,
    definition: 'Additional Items. The main catch-all queue where the majority of Vine items appear (often tens of thousands). Visible to all voices.',
    example: 'I spent an hour refreshing AI looking for $0 ETV skincare.',
    tags: ['queues']
  },
  {
    id: 'drop',
    term: 'The Drop',
    category: TermCategory.SLANG,
    definition: 'The time of day when Amazon releases new items into the queues. This can happen in waves or continuously over several hours.',
    example: 'The morning drop started around 3 AM PST.',
    tags: ['timing']
  },
  {
    id: 'drip',
    term: 'Drip',
    category: TermCategory.SLANG,
    definition: 'When items are added to the queues very slowly, one or two at a time, rather than in a large batch. The opposite of a flood or a big drop.',
    example: 'No big drop today, just a slow drip of cake toppers and phone cases.',
    tags: ['timing', 'queues']
  },
  {
    id: 'pause',
    term: 'Pause',
    category: TermCategory.SLANG,
    definition: 'A period, often lasting a day or more, where no new items are added to any queue. Common during holidays or before major site updates.',
    tags: ['timing']
  },
  {
    id: 'ultraviner',
    term: 'Ultraviner',
    category: TermCategory.GENERAL,
    definition: 'A third-party browser extension for Amazon Vine users. It provides enhanced features like improved styling, infinite scrolling, and keyword alerts.',
    example: 'I installed Ultraviner to help highlight 0 ETV items in the grid.',
    tags: ['tools', 'extension']
  },
  {
    id: '0etv',
    term: '0 ETV',
    category: TermCategory.SLANG,
    definition: 'Items with an Estimated Tax Value of $0.00. Typically includes food, beauty, health, and medical items. Highly competitive.',
    example: 'I scored a ton of 0 ETV supplements today.',
    tags: ['tax', 'popular']
  },
  {
    id: 'gold',
    term: 'Gold Status',
    category: TermCategory.STATUS,
    definition: 'The higher tier of Vine membership. Allows ordering of up to 8 items per day and items with any price value (no $100 limit). Requires 90% review rate.',
    tags: ['tiers']
  },
  {
    id: 'silver',
    term: 'Silver Status',
    category: TermCategory.STATUS,
    definition: 'The entry tier for Vine. Limited to 3 items per day and items valued under $100. New members start here.',
    tags: ['tiers']
  },
  {
    id: 'jail',
    term: 'Vine Jail',
    category: TermCategory.SLANG,
    definition: 'A restricted state where a reviewer falls below required review percentages (usually 60% of recent orders). Access to RFY/AI is blocked until metrics improve.',
    example: 'I need to catch up on reviews this weekend or I\'m headed to Vine Jail.',
    tags: ['trouble', 'metrics']
  },
  {
    id: 'ghost',
    term: 'Ghost Item',
    category: TermCategory.SLANG,
    definition: 'An item that appears in the list but gives an error (e.g., infinite spinner or red error box) when you try to request it, often because it is already out of stock.',
    tags: ['errors']
  },
  {
    id: 'pausable',
    term: 'Evaluation Period',
    category: TermCategory.GENERAL,
    definition: 'The 6-month cycle at the end of which your stats (items reviewed, % reviewed) are checked to determine if you stay in your current tier, move up, or get demoted.',
    tags: ['rules']
  },
  {
    id: 'variants',
    term: 'Variants',
    category: TermCategory.GENERAL,
    definition: 'Different versions (color, size) of the same product listing. Vine rules generally only allow you to review one variant of a product family.',
    tags: ['rules']
  },
  {
    id: 'merge',
    term: 'Variant Merge',
    category: TermCategory.GENERAL,
    definition: 'When a seller combines multiple separate product listings into one "Parent" listing. This can prevent you from reviewing multiple items you ordered from that group.',
    tags: ['rules', 'reviews']
  },
  {
    id: 'geo-lock',
    term: 'Geo-Locked',
    category: TermCategory.SLANG,
    definition: 'Items that cannot be shipped to your specific location due to shipping restrictions (common with large batteries, certain chemicals, or furniture).',
    tags: ['shipping']
  },
  {
    id: 'vine-helper',
    term: 'Vine Helper',
    category: TermCategory.GENERAL,
    definition: 'A popular browser extension used by the community to fix UI bugs and manage hidden items. Not an official Amazon tool.',
    tags: ['tools']
  },
  {
    id: 'fba',
    term: 'FBA',
    category: TermCategory.ACRONYM,
    definition: 'Fulfilled By Amazon. Items stored in Amazon warehouses. These usually ship faster than third-party seller items.',
    tags: ['shipping']
  },
  {
    id: 'six-month',
    term: '6-Month Rule',
    category: TermCategory.GENERAL,
    definition: 'The Terms of Service requirement stating that Vine Voices must keep possession of products for 6 months before transferring possession or disposing of them.',
    tags: ['rules', 'legal']
  },
  {
    id: 'sba',
    term: 'SBA',
    category: TermCategory.ACRONYM,
    definition: 'Sold By Amazon. Items where Amazon is the retailer, not a third-party seller. These often appear in the AFA queue.',
    tags: ['seller']
  },
  {
    id: '3p',
    term: '3P Seller',
    category: TermCategory.ACRONYM,
    definition: 'Third-Party Seller. An external merchant selling on Amazon. Most AI queue items are from 3P sellers.',
    tags: ['seller']
  },
  {
    id: 'cs',
    term: 'Vine CS',
    category: TermCategory.ACRONYM,
    definition: 'Vine Customer Support. A specialized support team separate from regular Amazon CS. They handle removals, order issues, and review glitches. Can be reached via the "Contact Us" link on the Vine portal.',
    example: 'I emailed Vine CS to remove that item that never arrived.',
    tags: ['support']
  },
  {
    id: 'removal',
    term: 'Item Removal',
    category: TermCategory.GENERAL,
    definition: 'The process of having an item removed from your "Awaiting Review" list and ETV total by support. Valid reasons include: item damaged, lost in transit, or merged variants.',
    tags: ['support', 'etv']
  },
  {
    id: 'spinner',
    term: 'Spinning Wheel',
    category: TermCategory.SLANG,
    definition: 'The loading animation that never ends when you click "See Details" on an item. Usually indicates the item is a "ghost" or the server is lagging.',
    tags: ['errors', 'ui']
  },
  {
    id: 'stats',
    term: 'Stats / Metrics',
    category: TermCategory.GENERAL,
    definition: 'The numbers on your Account page showing "Percentage of items reviewed" and "Total items reviewed". These determine your tier status.',
    tags: ['tiers']
  },
  {
    id: '90-percent',
    term: '90% Rule',
    category: TermCategory.STATUS,
    definition: 'The requirement to review at least 90% of your orders (and 80 items minimum) to achieve or maintain Gold status at evaluation.',
    tags: ['gold', 'rules']
  },
  {
    id: 'bot',
    term: 'Bot / Script',
    category: TermCategory.SLANG,
    definition: 'Automated software used by some (against TOS) to snatch high-value items instantly. A source of frustration for manual users.',
    tags: ['cheating']
  },
  {
    id: 'prop65',
    term: 'Prop 65',
    category: TermCategory.GENERAL,
    definition: 'California proposition regarding chemical warnings. Can cause "Geo-lock" errors for reviewers in other states if the seller has misconfigured shipping settings.',
    tags: ['shipping']
  },
  {
    id: 'hobby',
    term: 'Hobby vs Business',
    category: TermCategory.GENERAL,
    definition: 'The distinction US taxpayers must make when filing Vine income. "Hobby" income usually goes on Form 1040 Schedule 1, while "Business" goes on Schedule C.',
    tags: ['tax']
  },
  {
    id: 'red-box',
    term: 'Red Error Box',
    category: TermCategory.SLANG,
    definition: 'The red error message "Error handling request" that appears when you try to order an item that is broken, out of stock, or geo-locked.',
    tags: ['errors']
  }
];