const fs = require('fs');

function extractTag(xml, tag) {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    if (!match) return '';
    return match[1]
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#8211;/g, '-')
        .replace(/&#8217;/g, "'")
        .trim();
}

async function fetchLowEndBoxDeals() {
    const items = [];
    try {
        console.log('Fetching live deals from LowEndBox RSS...');
        const res = await fetch('https://lowendbox.com/feed/', {
            headers: { 'User-Agent': 'HostScout-Bot/1.0' }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const xml = await res.text();
        const itemBlocks = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

        itemBlocks.slice(0, 12).forEach((block, index) => {
            const title = extractTag(block, 'title');
            const link = extractTag(block, 'link');
            const pubDate = extractTag(block, 'pubDate');
            const description = extractTag(block, 'description');

            if (!title || !link) return;

            items.push({
                id: `leb-${index + 1}`,
                provider: 'LowEndBox Community',
                title: title,
                category: 'Live Deal',
                price: 'See Offer',
                discount: 'Community Deal',
                coupon: null,
                specs: ['VPS / Hosting', 'Auto-Fetched'],
                summary: description.slice(0, 140) + (description.length > 140 ? '...' : ''),
                url: link,
                date: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
                verified: false
            });
        });
    } catch (err) {
        console.error('LowEndBox RSS fetch failed:', err.message);
    }
    return items;
}

async function buildDeals() {
    let curated = [];
    if (fs.existsSync('curated-deals.json')) {
        curated = JSON.parse(fs.readFileSync('curated-deals.json', 'utf8'));
    }

    const liveDeals = await fetchLowEndBoxDeals();

    const payload = {
        lastUpdated: new Date().toISOString(),
        totalCount: curated.length + liveDeals.length,
        items: [...curated, ...liveDeals]
    };

    fs.writeFileSync('deals.json', JSON.stringify(payload, null, 2));
    console.log(`Saved ${payload.totalCount} total deals (${curated.length} curated, ${liveDeals.length} live) to deals.json`);
}

buildDeals();