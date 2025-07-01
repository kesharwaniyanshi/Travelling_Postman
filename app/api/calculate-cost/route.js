import * as math from 'mathjs';

// Haversine formula to calculate distance between two lat-lon points
const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c; // Distance in kilometers
};

// Export POST handler function
export async function POST(request) {
    // Check if the method is POST
    if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Parse the request body
    const { weight, volume, lat1, lon1, lat2, lon2, serviceType } = await request.json();

    // Validate required fields and specify which are missing
    const missingFields = [];
    if (!weight) missingFields.push("weight");
    if (!volume) missingFields.push("volume");
    if (!lat1) missingFields.push("lat1");
    if (!lon1) missingFields.push("lon1");
    if (!lat2) missingFields.push("lat2");
    if (!lon2) missingFields.push("lon2");
    if (!serviceType) missingFields.push("serviceType");

    if (missingFields.length > 0) {
        return new Response(JSON.stringify({ error: `Missing required fields: ${missingFields.join(", ")}` }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Calculate distance using haversine formula
    const distance = haversine(lat1, lon1, lat2, lon2);

    let cost;
    if (serviceType === "Time") {
        if (weight <= 50) {
            cost = distance > 50 ? 35 : 15;
        } else if (weight <= 200) {
            cost = distance <= 200 ? 35 : 70;
        } else if (weight <= 500) {
            cost = distance <= 200 ? 50 : 90;
        } else {
            const extraWeight = Math.ceil((weight - 500) / 500);
            cost = 90 + extraWeight * (distance <= 200 ? 40 : 50);
        }
    } else if (serviceType === "Cost") {
        const baseCost = 19;
        const additionalCost = Math.ceil(weight / 50) * 15;
        cost = baseCost + additionalCost;
    } else {
        return new Response(JSON.stringify({ error: "Invalid service type" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // Add surcharge for oversized parcels
    // const maxDimension = Math.max(...volume);
    if (volume > 150 && volume <=250) {
        cost += 20; // Example surcharge
    }
    else if (volume > 250 && volume < 350) {
        cost += 30; // Example surcharge
    }
    else if (volume > 350) {
        cost += 50; // Example surcharge
    }

    // Return the calculated cost
    return new Response(JSON.stringify({ cost: Math.round(cost * 100) / 100 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
