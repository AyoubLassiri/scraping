const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://howatpress.net/competition/%d8%a7%d9%84%d9%82%d8%b3%d9%85-%d8%a7%d9%84%d9%88%d8%b7%d9%86%d9%8a-%d9%87%d9%88%d8%a7%d8%a9-2026-2027/';

async function scrapeData() {
    try {
        console.log('Fetching 2026-2027 standings and match data...');
        const { data } = await axios.get(TARGET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const $ = cheerio.load(data);
        const standingsData = [];

        // 1. Scrape Standings Table in correct ranking order
        $('table tr, tbody tr').each((index, element) => {
            const rowText = $(element).text().trim();
            
            const teamKeywords = [
                'Esp-RSB', 'OCY', 'OM', 'USMAM', 'FC ZAYTOUNA', 'RAC', 'WASK', 
                'AJS', 'ASM', 'RBM', 'RCOZ', 'CCFAC', 'CCH', 'AMSA', 'CMM', 'CWW',
                'IZK', 'OCK', 'FRN', 'HLO', 'RB', 'CAYB', 'مستقبل المرسى'
            ];

            for (let keyword of teamKeywords) {
                if (rowText.includes(keyword)) {
                    const teamName = $(element).find('td').eq(1).text().trim() || keyword;
                    
                    if (!standingsData.some(t => t.team_name === teamName) && standingsData.length < 16) {
                        standingsData.push({
                            position: standingsData.length + 1,
                            team_name: teamName
                        });
                    }
                    break;
                }
            }
        });

        fs.writeFileSync(
            path.join(__dirname, 'public', 'standings.json'), 
            JSON.stringify(standingsData, null, 4), 
            'utf-8'
        );

        // 2. Scrape Matches (Last match results & next match fixtures)
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

        const formattedMatches = [{
            lastMatch: {
                opponent: lastOpponent,
                opponentInitials: "OPP",
                score: lastScore,
                date: "البطولة الوطنية هواة"
            },
            nextMatch: {
                opponent: nextOpponent,
                opponentInitials: "OPP",
                date: "قريباً"
            }
        }];

        fs.writeFileSync(
            path.join(__dirname, 'public', 'matches.json'), 
            JSON.stringify(formattedMatches, null, 4), 
            'utf-8'
        );

        console.log(`Success! Saved ${standingsData.length} standings and match data updated.`);
    } catch (error) {
        console.error('Error during scraping:', error.message);
    }
}

scrapeData();