import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

export async function GET(req) {
    const url = new URL(req.url);
    const source = url.searchParams.get('source');
    const destination = url.searchParams.get('destination');

    if (!source || !destination) {
        return new Response(JSON.stringify({ success: false, message: 'Source and Destination are required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Correct the file path using path.join to ensure proper format
    const csvFilePath = path.join('public', 'data', 'multi_modal_top_5_routes_cost.csv'); // Make sure the file is located correctly in the public/data folder

    try {
        const routes = await new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(csvFilePath)
                .pipe(csv())
                .on('data', (row) => {
                    if (row.startcity === source && row.endcity === destination) {
                        // Collect all paths, costs, and times
                        for (let i = 1; i <= 5; i++) {
                            if (row[`Route ${i}`]) {
                                results.push({
                                    path: row[`Route ${i}`],
                                    cost: parseFloat(row[`Cost ${i}`]),
                                    duration: parseFloat(row[`Time ${i}`]),
                                });
                            }
                        }
                    }
                })
                .on('end', () => resolve(results))
                .on('error', (err) => reject(err));
        });

        if (routes.length > 0) {
            return new Response(JSON.stringify({ success: true, routes }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'No alternate routes found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: 'Internal Server Error.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
