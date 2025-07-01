import { query } from '@/lib/db';



export async function GET(req) {
    const url = new URL(req.url);
    const dispatcherId = url.searchParams.get('dispatcherId');

    if (!dispatcherId) {
        return new Response(JSON.stringify({ success: false, message: 'Dispatcher ID is required.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const result = await query(
            `SELECT
                a.current_address AS "currentAddress",
                r.source,
                r.destination,
                r.path
            FROM
                assignment a
            JOIN
                routes r
            ON
                a.dispatcher_id = r.dispatcher_id
            WHERE
                a.dispatcher_id = $1;`,
            [dispatcherId]
        );  
        console.log(result)

        if (result.rows.length > 0) {
            return new Response(JSON.stringify({ success: true, routeDetails: result.rows[0] }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            return new Response(JSON.stringify({ success: false, message: 'Route not found.' }), {
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
