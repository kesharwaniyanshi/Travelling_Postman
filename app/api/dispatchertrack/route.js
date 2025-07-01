import db from "@/lib/db"; // Replace with your actual DB connection logic

// Named export for the GET HTTP method
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const dispatcher_id = searchParams.get("dispatcherId");

  // Check if the dispatcherId is missing
  if (!dispatcher_id) {
    console.error("Dispatcher ID is missing in the request");
    return new Response(JSON.stringify({ error: "Dispatcher ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Step 1: Fetch source and destination from the routes table
    const routeQuery = `
      SELECT source, destination
      FROM routes
      WHERE dispatcher_id = $1
    `;
    console.log("Executing route query with dispatcher_id:", dispatcher_id);
    const routeResult = await db.query(routeQuery, [dispatcher_id]);
    const routeData = routeResult.rows[0]; // Assuming one route per dispatcher
    const { source, destination } = routeData || {};

    // Check if no route data is found
    if (!routeData) {
      console.warn("No route data found for dispatcher_id:", dispatcher_id);
      return new Response(
        JSON.stringify({ error: "No route found for this dispatcher" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log("Fetched route data:", routeData);

    // Step 2: Query the assignment table for orders related to the dispatcher
    const assignmentQuery = `
      SELECT order_id, drop_time, status, current_address
      FROM assignment
      WHERE dispatcher_id = $1
    `;
    console.log("Executing assignment query with dispatcher_id:", dispatcher_id);
    const assignmentResult = await db.query(assignmentQuery, [dispatcher_id]);

    // Check if no orders are found for the dispatcher
    if (!assignmentResult.rows || assignmentResult.rows.length === 0) {
      console.warn("No orders found for dispatcher_id:", dispatcher_id);
      return new Response(
        JSON.stringify({ error: "No orders found for this dispatcher" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log("Fetched assignment data:", assignmentResult.rows);

    // Step 3: Process the orders, calculate delays, and update the table
    const updatedOrders = await Promise.all(
      assignmentResult.rows.map(async (order) => {
        const { order_id, drop_time, status, current_address } = order;
        console.log(`Processing order ${order_id} with drop_time:`, drop_time);

        // Handle invalid drop_time
        if (!drop_time) {
          console.warn(`Invalid drop time for order ${order_id}`);
          return {
            orderId: order_id,
            status: "Unknown",
            delay: 0,
            source,
            destination,
            currentAddress: current_address,
            canDelete: false,
          };
        }

        const expectedDropTime = new Date(drop_time);
        const currentTime = new Date();

        // Check for valid date
        if (isNaN(expectedDropTime)) {
          console.warn(`Invalid expected drop time for order ${order_id}`);
          return {
            orderId: order_id,
            status: "Invalid Drop Time",
            delay: 0,
            source,
            destination,
            currentAddress: current_address,
            canDelete: false,
          };
        }


        
        // Calculate delay (in days)
        let delay = Math.max(
          (currentTime - expectedDropTime) / (1000 * 60 * 60 * 24),
          0
        ); // Delay in days
        delay = Math.round(delay); // Round to nearest whole day
        console.log(`Calculated delay for order ${order_id}: ${delay} days`);

        // Update status based on delay
        const updatedStatus = delay > 0 ? "Delayed" : status;
        console.log(`Updated status for order ${order_id}: ${updatedStatus}`);

        // Check if current address matches destination
        const canDelete = current_address === destination;
        console.log(`Order ${order_id} canDelete: ${canDelete}`);

        // Step 4: Update delay and status in the database
        const updateQuery = `
          UPDATE assignment 
          SET delay = $1, status = $2
          WHERE dispatcher_id = $3 AND order_id = $4
        `;
        try {
          console.log(`Executing update for order ${order_id}`);
          await db.query(updateQuery, [
            delay,
            updatedStatus,
            dispatcher_id,
            order_id,
          ]);
          console.log(`Updated order ${order_id} successfully.`);
        } catch (err) {
          console.error(`Failed to update order ${order_id}:`, err);
        }

        return {
          orderId: order_id,
          status: updatedStatus,
          delay,
          source,
          destination,
          currentAddress: current_address,
          canDelete,
        };
      })
    );

    // Step 5: Return the updated orders with the canDelete flag
    console.log("Returning updated orders:", updatedOrders);
    return new Response(JSON.stringify(updatedOrders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error occurred while processing the request:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
