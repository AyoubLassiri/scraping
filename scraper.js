const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://howatpress.net/competition/%d8%a7%d9%84%d9%82%d8%b3%d9%85-%d8%a7%d9%84%d9%88%d8%b7%d9%86%d9%8a-%d9%87%d9%88%d8%a7%d8%a9-2026-2027/';

const teamLogosMap = {
    "Esp-RSB": "https://howatpress.net/wp-content/uploads/2023/11/RSB.jpg",
    "أمل نهضة بركان Esp-RSB": "https://howatpress.net/wp-content/uploads/2023/11/RSB.jpg",
    "أولمبيك اليوسفية OCY": "https://howatpress.net/wp-content/uploads/2021/04/%D8%A3%D9%88%D9%84%D9%85%D8%A8%D9%8A%D9%83-%D8%A7%D9%84%D9%8A%D9%88%D8%B3%D9%81%D9%8A%D8%A9-OCY.jpg",
    "أولمبيك مراكش OM": "https://howatpress.net/wp-content/uploads/2021/04/%D8%A3%D9%88%D9%84%D9%85%D8%A8%D9%8A%D9%83-%D9%85%D8%B1%D8%A7%D9%83%D8%B4-OM.jpg",
    "اتحاد آيت ملول USMAM": "https://howatpress.net/wp-content/uploads/2021/04/%D8%A7%D8%AA%D8%AD%D8%A7%D8%AF-%D8%A2%D9%8A%D8%AA-%D9%85%D9%84%D9%88%D9%84-USMAM.jpg",
    "نادي إفسي زيتونة  FC ZAYTOUNA": "https://howatpress.net/wp-content/uploads/2023/04/IMG-20260901-WA0057.jpg",
    "الراسينغ الرياضي RAC": "https://howatpress.net/wp-content/uploads/2023/04/rac-128x128-1.png",
    "الوداد الرياضي السرغيني WASK": "https://howatpress.net/wp-content/uploads/2025/10/412994444_122107631876149937_4793359632436082238_n.jpg",
    "جمعية الشباب الرياضي AJS": "https://howatpress.net/wp-content/uploads/2021/09/AJS.png",
    "جمعية المنصورية ASM": "https://howatpress.net/wp-content/uploads/2021/04/asm.svg.png",
    "رجاء بني ملال RBM": "https://howatpress.net/wp-content/uploads/2023/04/rbm-128x128-1.png",
    "سريع وادي زم  RCOZ": "https://howatpress.net/wp-content/uploads/2023/04/rcoz-128x128-1.png",
    "شباب الفتح البيضاوي CCFAC": "https://howatpress.net/wp-content/uploads/2021/04/%D8%B4%D8%A8%D8%A7%D8%A8-%D8%A7%D9%84%D9%81%D8%AA%D8%AD-%D8%A7%D9%84%D8%A8%D9%8A%D8%B6%D8%A7%D9%88%D9%8A-CCFAC.jpg",
    "شباب هوارة CCH": "https://howatpress.net/wp-content/uploads/2021/04/cch.png",
    "مولودية آسا AMSA": "https://howatpress.net/wp-content/uploads/2021/04/%D9%85%D9%88%D9%84%D9%88%D8%AF%D9%8A%D8%A9-%D8%A2%D8%B3%D8%A7-AMSA.jpg",
    "نادي مستقبل المرسى CMM": "https://cdn.phototourl.com/free/2026-09-02-c36c80af-e062-4b96-aee3-a09761dbe977.png"
};

async function scrapeData() {
    try {
        console.log('Fetching standings and match data...');
        const { data } = await axios.get(TARGET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'ar,en-US;q=0.7,en;q=0.3'
            }
        });

        const $ = cheerio.load(data);
        const standingsData = [];
        const teamKeywords = Object.keys(teamLogosMap).sort((a, b) => b.length - a.length);

        // 1. Scrape Standings Table
        $('table tr, tbody tr').each((index, element) => {
            const rowText = $(element).text().trim();

            for (let keyword of teamKeywords) {
                if (rowText.includes(keyword)) {
                    const teamName = $(element).find('td').eq(1).text().trim() || keyword;
                    const logoUrl = teamLogosMap[keyword] || "";

                    const logoAlreadyExists = standingsData.some(t => t.logo === logoUrl && logoUrl !== "");
                    const nameAlreadyExists = standingsData.some(t => t.team_name === teamName);

                    if (!nameAlreadyExists && !logoAlreadyExists && standingsData.length < 16) {
                        standingsData.push({
                            position: standingsData.length + 1,
                            team_name: teamName,
                            logo: logoUrl
                        });
                        break;
                    }
                }
            }
        });

        fs.writeFileSync(
            path.join(__dirname, 'public', 'standings.json'), 
            JSON.stringify(standingsData, null, 4), 
            'utf-8'
        );

        // 2. Scrape Matches
        const matchLines = [];
        $('tr, div, li, p').each((i, el) => {
            const text = $(el).text().trim();
            if (text.includes('مستقبل المرسى') || text.includes('CMM')) {
                matchLines.push(text);
            }
        });

        let lastScore = "قريباً";
        let lastOpponent = "خصم الجولة";
        let nextOpponent = "المنافس القادم";

        for (let line of matchLines) {
            const scoreMatch = line.match(/\b([0-9])\s*[–-]\s*([0-9])\b/);
            if (scoreMatch && lastScore === "قريباً") {
                lastScore = `${scoreMatch[1]} - ${scoreMatch[2]}`;
            }
        }

        // Leave opponentLogo empty ("") if it's a placeholder
        const formattedMatches = [{
            lastMatch: {
                opponent: lastOpponent,
                opponentLogo: "", 
                opponentInitials: "OPP",
                score: lastScore,
                date: "البطولة الوطنية هواة"
            },
            nextMatch: {
                opponent: nextOpponent,
                opponentLogo: "",
                opponentInitials: "OPP",
                date: "قريباً"
            }
        }];

        fs.writeFileSync(
            path.join(__dirname, 'public', 'matches.json'), 
            JSON.stringify(formattedMatches, null, 4), 
            'utf-8'
        );

        console.log(`Success! Saved ${standingsData.length} unique teams cleanly.`);
    } catch (error) {
        console.error('Error during scraping:', error.message);
    }
}

scrapeData();