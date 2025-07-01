import db from '@/lib/db'; // Replace with your actual DB connection logic

// Named export for the GET HTTP method
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get('order_id');

  if (!order_id) {
    console.error('Order ID is missing in the request');
    return new Response(JSON.stringify({ error: 'Order ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Step 1: Query the assignment table for dispatcher_id, current_address, delay, and status
    const assignmentQuery = `
      SELECT dispatcher_id, current_address, delay, status 
      FROM assignment 
      WHERE order_id = $1
    `;
    console.log('Executing query:', assignmentQuery, 'with params:', [order_id]);
    
    const assignment = await db.query(assignmentQuery, [order_id]);

    if (!assignment.rows || assignment.rows.length === 0) {
      console.warn('No assignment found for order_id:', order_id);
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { dispatcher_id, current_address, delay, status } = assignment.rows[0];
    console.log('Assignment details fetched:', { dispatcher_id, current_address, delay, status });

    // Step 2: Query the route table for source and destination
    const routeQuery = 'SELECT source, destination FROM routes WHERE dispatcher_id = $1';
    console.log('Executing query:', routeQuery, 'with params:', [dispatcher_id]);
    
    const route = await db.query(routeQuery, [dispatcher_id]);

    if (!route.rows || route.rows.length === 0) {
      console.warn('No route found for dispatcher_id:', dispatcher_id);
      return new Response(JSON.stringify({ error: 'Route not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { source, destination } = route.rows[0];
    console.log('Route details fetched:', { source, destination });

    // Step 3: Return all the fetched details
    return new Response(
      JSON.stringify({
        source,
        destination,
        currentAddress: current_address,
        delay,
        status,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error occurred while processing the request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
