import db from '@/lib/db'; // Replace with your actual DB connection logic

// Named export for the DELETE HTTP method
export async function DELETE(req) {
  try {
    // Parse the request body
    const body = await req.json();
    const { orderId } = body;

    // Validate the input
    if (!orderId) {
      console.error('Order ID is missing in the request');
      return new Response(
        JSON.stringify({ error: 'Order ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Step 1: Fetch the order details from the `orders` table
    const orderQuery = `
      SELECT weight, current_sender_location, current_receiver_location
      FROM orders
      WHERE order_id = $1
    `;
    console.log('Executing query:', orderQuery, 'with params:', [orderId]);

    const orderResult = await db.query(orderQuery, [orderId]);

    // Check if the order exists
    if (!orderResult.rows || orderResult.rows.length === 0) {
      console.warn('Order not found for order_id:', orderId);
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { weight, source, destination } = orderResult.rows[0];

    // Step 2: Fetch the dispatcher_id from the `assignment` table
    const dispatcherQuery = `
      SELECT dispatcher_id
      FROM assignment
      WHERE order_id = $1
    `;
    console.log('Executing query:', dispatcherQuery, 'with params:', [orderId]);

    const dispatcherResult = await db.query(dispatcherQuery, [orderId]);

    // Check if a dispatcher is found
    if (!dispatcherResult.rows || dispatcherResult.rows.length === 0) {
      console.warn('Dispatcher not found for order_id:', orderId);
      return new Response(
        JSON.stringify({ error: 'Dispatcher not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const { dispatcher_id } = dispatcherResult.rows[0];

    // Debugging: Log the fetched details
    console.log(`Fetched details: Weight=${weight}, Source=${source}, Destination=${destination}, DispatcherID=${dispatcher_id}`);

    // Step 3: Delete the order from the `orders` table
    const deleteOrderQuery = `
      DELETE FROM orders
      WHERE order_id = $1
    `;
    console.log('Executing delete query for orders table:', deleteOrderQuery, 'with params:', [orderId]);

    await db.query(deleteOrderQuery, [orderId]);

    // Step 4: Delete the order from the `assignment` table
    const deleteAssignmentQuery = `
      DELETE FROM assignment
      WHERE order_id = $1
    `;
    console.log('Executing delete query for assignment table:', deleteAssignmentQuery, 'with params:', [orderId]);

    await db.query(deleteAssignmentQuery, [orderId]);

    // Step 5: Update the current capacity in the `routes` table
    const updateCapacityQuery = `
      UPDATE routes
      SET current_capacity = current_capacity - $1
      WHERE source = $2 AND destination = $3 AND dispatcher_id = $4
    `;
    console.log('Executing capacity update query:', updateCapacityQuery, 'with params:', [weight, source, destination, dispatcher_id]);

    const updateResult = await db.query(updateCapacityQuery, [weight, source, destination, dispatcher_id]);

    if (updateResult.rowCount === 0) {
      console.warn('No route entry updated. Check if the route exists with the specified details.');
    }

    // Step 6: Return a success response
    console.log(`Order ${orderId} deleted successfully, and route capacity updated`);
    return new Response(
      JSON.stringify({ message: 'Order deleted successfully and route capacity updated' }),
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
