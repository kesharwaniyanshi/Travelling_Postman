const fs = require('fs');
const { parse } = require('csv-parse/sync');

class MultiModalRouteOptimizer {
  constructor(citiesFile, transportMatrices) {
    this.cities = this.loadCitiesFromCSV(citiesFile);
    
    // Validate transport matrices with enhanced checks
    if (!transportMatrices || typeof transportMatrices !== 'object') {
      throw new Error('Invalid transport matrices provided');
    }
  
    // Ensure all required modes exist and have valid entries
    const requiredModes = ['road', 'rail', 'air'];
    requiredModes.forEach(mode => {
      if (!transportMatrices[mode]) {
        throw new Error(`Transport matrix for ${mode} mode is missing`);
      }
    });
  
    // Constants for route filtering
    this.MAX_COST_THRESHOLD = 5000;  // Maximum acceptable route cost
    this.MAX_TIME_THRESHOLD = 500;   // Maximum acceptable route time
    this.INFRASTRUCTURE_COST_PENALTY = 10000;  // High cost for routes without infrastructure

    this.transportMatrices = transportMatrices;
  }

  loadCitiesFromCSV(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const cities = parse(fileContent, { columns: true });
    return cities.map(city => ({
      id: parseInt(city.City_ID),
      name: city.City,
      state: city.State,
      infrastructure: {
        air: city.Airport === 'Yes',
        road: true,
        rail: true
      }
    }));
  }

  // Enhanced cost and time calculation with infrastructure checks
  calculatePathDetails(path, transportModes) {
    let totalCost = 0;
    let totalTime = 0;
  
    if (!path || path.length < 2) {
      console.error('Invalid path provided');
      return { totalCost: Infinity, totalTime: Infinity };
    }
  
    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];
      const mode = transportModes[i];
  
      // Check city infrastructure for the mode
      const sourceCity = this.cities[current];
      const destCity = this.cities[next];
  
      // Penalize or eliminate routes without infrastructure
      if (!sourceCity.infrastructure[mode] || !destCity.infrastructure[mode]) {
        return { totalCost: Infinity, totalTime: Infinity };
      }
  
      const costMatrix = this.transportMatrices[mode];
  
      if (!costMatrix[current] || !costMatrix[current][next]) {
        console.error(`Invalid matrix access: mode=${mode}, from=${current}, to=${next}`);
        return { totalCost: Infinity, totalTime: Infinity };
      }
  
      const [cost, time] = costMatrix[current][next];
  
      // Apply additional filtering
      if (cost > this.MAX_COST_THRESHOLD || time > this.MAX_TIME_THRESHOLD) {
        return { totalCost: Infinity, totalTime: Infinity };
      }
  
      totalCost += cost;
      totalTime += time;
    }
  
    return { totalCost, totalTime };
  }

  // Dijkstra's algorithm optimized for time and infrastructure
  dijkstraShortestPath(source, destination) {
    const n = this.cities.length;
    const distances = new Array(n).fill(Infinity);
    const previous = new Array(n).fill(null);
    const visited = new Array(n).fill(false);
    const pathModes = new Array(n).fill(null);

    distances[source] = 0;

    for (let count = 0; count < n; count++) {
      let minDistance = Infinity;
      let current = -1;

      for (let v = 0; v < n; v++) {
        if (!visited[v] && distances[v] <= minDistance) {
          minDistance = distances[v];
          current = v;
        }
      }

      if (current === -1) break;
      visited[current] = true;

      // Explore adjacent vertices
      for (let next = 0; next < n; next++) {
        if (visited[next]) continue;

        const transportModes = ['road', 'rail', 'air'];
        const validRoutes = transportModes
          .map(mode => {
            // Extract time and check infrastructure
            const sourceCity = this.cities[current];
            const destCity = this.cities[next];
            const routeExists = sourceCity.infrastructure[mode] && 
                                destCity.infrastructure[mode];
            
            const [cost, time] = this.transportMatrices[mode][current][next];
            
            return {
              mode,
              time: routeExists && time < this.MAX_TIME_THRESHOLD ? time : Infinity,
              cost: routeExists ? cost : Infinity
            };
          })
          .filter(route => route.time !== Infinity);

        if (validRoutes.length === 0) continue;

        // Optimize for time instead of cost
        const bestRoute = validRoutes.reduce((min, route) => 
          route.time < min.time ? route : min
        );

        const newDistance = distances[current] + bestRoute.time;
        if (newDistance < distances[next]) {
          distances[next] = newDistance;
          previous[next] = current;
          pathModes[next] = bestRoute.mode;
        }
      }
    }

    // Reconstruct path
    const path = [];
    const modes = [];
    let current = destination;

    while (current !== null) {
      path.unshift(current);
      if (previous[current] !== null) {
        modes.unshift(pathModes[current]);
      }
      current = previous[current];
    }

    return { path, modes };
  }

  // Yen's K-Shortest Paths Algorithm with time optimization
  findTopMultiModalRoutes(source, destination, topK = 5) {
    const candidatePaths = [];
    const shortestPaths = [];

    // Find the shortest path first using Dijkstra
    const shortestPath = this.dijkstraShortestPath(source, destination);
    const shortestPathDetails = this.calculatePathDetails(
      shortestPath.path, 
      shortestPath.modes
    );

    // Only add valid paths
    if (shortestPathDetails.totalTime !== Infinity) {
      shortestPaths.push({
        path: shortestPath.path,
        pathModes: shortestPath.modes,
        cost: shortestPathDetails.totalCost,
        time: shortestPathDetails.totalTime
      });
    }

    // Generate alternative paths
    for (let k = 1; k < topK; k++) {
      if (shortestPaths.length === 0) break;

      for (let i = 0; i < shortestPaths[k-1].path.length - 1; i++) {
        const spurNode = shortestPaths[k-1].path[i];
        const rootPath = shortestPaths[k-1].path.slice(0, i + 1);

        // Remove edges used in previous k-1 paths
        const removedEdges = new Set();
        shortestPaths.forEach(path => {
          if (this.pathsSharePrefix(path.path, rootPath)) {
            const edgeToRemove = {
              from: path.path[i],
              to: path.path[i + 1]
            };
            removedEdges.add(JSON.stringify(edgeToRemove));
          }
        });

        // Try to find an alternative path from spur node
        const spurPath = this.findAlternativePath(
          spurNode, 
          destination, 
          removedEdges
        );

        if (spurPath) {
          const fullPath = [...rootPath, ...spurPath.path.slice(1)];
          const fullModes = [
            ...rootPath.slice(0, i).map(() => null), 
            ...spurPath.modes
          ];

          const pathDetails = this.calculatePathDetails(fullPath, fullModes);

          // Only add valid paths with reasonable time and cost
          if (pathDetails.totalTime !== Infinity) {
            candidatePaths.push({
              path: fullPath,
              pathModes: fullModes,
              cost: pathDetails.totalCost,
              time: pathDetails.totalTime
            });
          }
        }
      }

      // Break if no more alternative paths
      if (candidatePaths.length === 0) break;

      // Sort and select next shortest path based on time
      candidatePaths.sort((a, b) => a.time - b.time);
      shortestPaths.push(candidatePaths.shift());
    }

    // Convert to required output format
    return shortestPaths.map(route => ({
      path: route.path.map(idx => this.cities[idx].name),
      pathModes: route.pathModes,
      cost: route.cost.toFixed(2),
      time: route.time.toFixed(2)
    }));
  }

  // Helper to check path prefix
  pathsSharePrefix(path1, path2) {
    for (let i = 0; i < Math.min(path1.length, path2.length); i++) {
      if (path1[i] !== path2[i]) return false;
    }
    return true;
  }

  // Find alternative path avoiding specific edges
  findAlternativePath(source, destination, removedEdges) {
    const n = this.cities.length;
    const distances = new Array(n).fill(Infinity);
    const previous = new Array(n).fill(null);
    const visited = new Array(n).fill(false);
    const pathModes = new Array(n).fill(null);

    distances[source] = 0;

    for (let count = 0; count < n; count++) {
      let minDistance = Infinity;
      let current = -1;

      for (let v = 0; v < n; v++) {
        if (!visited[v] && distances[v] <= minDistance) {
          minDistance = distances[v];
          current = v;
        }
      }

      if (current === -1 || current === destination) break;
      visited[current] = true;

      for (let next = 0; next < n; next++) {
        if (visited[next]) continue;

        // Check if this edge is in removed edges
        const edgeKey = JSON.stringify({ from: current, to: next });
        if (removedEdges.has(edgeKey)) continue;

        const transportModes = ['road', 'rail', 'air'];
        const validRoutes = transportModes
          .map(mode => ({
            mode,
            cost: this.transportMatrices[mode][current][next][0]
          }))
          .filter(route => route.cost > 0);

        if (validRoutes.length === 0) continue;

        const bestRoute = validRoutes.reduce((min, route) => 
          route.cost < min.cost ? route : min
        );

        const newDistance = distances[current] + bestRoute.cost;
        if (newDistance < distances[next]) {
          distances[next] = newDistance;
          previous[next] = current;
          pathModes[next] = bestRoute.mode;
        }
      }
    }

    // Reconstruct path
    if (distances[destination] === Infinity) return null;

    const path = [];
    const modes = [];
    let current = destination;

    while (current !== null) {
      path.unshift(current);
      if (previous[current] !== null) {
        modes.unshift(pathModes[current]);
      }
      current = previous[current];
    }

    return { path, modes };
  }

  // Existing CSV generation method remains unchanged
  generateTopRoutesCSV(outputFile) {
    const fileStream = fs.createWriteStream(outputFile);

    // Write CSV header
    const header = [
      'Start City', 'End City', 
      'Route 1', 'Cost 1', 'Time 1',
      'Route 2', 'Cost 2', 'Time 2',
      'Route 3', 'Cost 3', 'Time 3',
      'Route 4', 'Cost 4', 'Time 4',
      'Route 5', 'Cost 5', 'Time 5'
    ];
    fileStream.write(header.join(',') + '\n');

    // Find top routes for each source-destination pair
    for (let i = 0; i < this.cities.length; i++) {
      for (let j = 0; j < this.cities.length; j++) {
        if (i !== j) {
          // Find top 5 routes
          const topRoutes = this.findTopMultiModalRoutes(i, j);

          // Prepare CSV row
          const row = [
            this.cities[i].name, 
            this.cities[j].name
          ];

          // Add top 5 routes (or fewer if less than 5 exist)
          for (let k = 0; k < 5; k++) {
            const route = topRoutes[k] || { 
              path: ['N/A'], 
              pathModes: ['N/A'], 
              cost: 'N/A', 
              time: 'N/A' 
            };

            // Create route string with modes
            const routeWithModes = route.path.map((city, index) => 
              index > 0 ? `(${route.pathModes[index-1]})${city}` : city
            ).join('');

            row.push(routeWithModes, route.cost, route.time);
          }

          // Write row to file
          fileStream.write(row.join(',') + '\n');
        }
      }
    }

    fileStream.end();
    console.log(`Top routes saved to ${outputFile}`);
  }
}

module.exports = MultiModalRouteOptimizer;
