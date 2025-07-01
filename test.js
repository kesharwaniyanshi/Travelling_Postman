const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

class RouteOptimizer {
  constructor(cityFile, costMatrixFile) {
    this.cityFile = cityFile;
    this.costMatrixFile = costMatrixFile;
    this.cities = [];
    this.costMatrix = [];
  }

  // Load cities from CSV
  loadCities() {
    const cityData = fs.readFileSync(this.cityFile, 'utf-8');
    const records = parse(cityData, { columns: true, skip_empty_lines: true });
    this.cities = records.map(record => ({
      id: parseInt(record.City_ID),
      name: record.City,
      state: record.State,
      latitude: parseFloat(record.Latitude),
      longitude: parseFloat(record.Longitude)
    }));
  }

  // Generate synthetic cost matrix
  generateSyntheticCostMatrix() {
    const numCities = this.cities.length;
    const maxCost = 500; // Max cost between two cities
    this.costMatrix = Array.from({ length: numCities }, () => Array(numCities).fill(0));

    for (let i = 0; i < numCities; i++) {
      for (let j = i + 1; j < numCities; j++) {
        const cost = Math.random() * maxCost + 1; // Random cost
        this.costMatrix[i][j] = cost;
        this.costMatrix[j][i] = cost; // Symmetric
      }
    }

    // Save cost matrix to file
    const matrixContent = this.costMatrix.map(row => row.map(val => val.toFixed(2)).join(',')).join('\n');
    fs.writeFileSync(this.costMatrixFile, matrixContent);
    console.log(`Synthetic cost matrix saved to ${this.costMatrixFile}`);
  }

  // Load cost matrix from file
  loadCostMatrix() {
    const matrixData = fs.readFileSync(this.costMatrixFile, 'utf-8');
    this.costMatrix = matrixData.split('\n').map(row => row.split(',').map(parseFloat));
  }

  // Find all optimal paths
  findOptimalPaths() {
    const numCities = this.cities.length;
    const results = [];

    // Floyd-Warshall Algorithm for All-Pairs Shortest Path
    const dist = JSON.parse(JSON.stringify(this.costMatrix));
    const next = Array.from({ length: numCities }, (_, i) =>
      Array.from({ length: numCities }, (_, j) => (i === j ? null : j))
    );

    for (let k = 0; k < numCities; k++) {
      for (let i = 0; i < numCities; i++) {
        for (let j = 0; j < numCities; j++) {
          if (dist[i][j] > dist[i][k] + dist[k][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }

    // Reconstruct paths and store results
    for (let i = 0; i < numCities; i++) {
      for (let j = i + 1; j < numCities; j++) {
        const path = this.reconstructPath(i, j, next);
        const pathNames = path.map(index => this.cities[index].name);
        const source = this.cities[i].name;
        const destination = this.cities[j].name;
        const cost = dist[i][j].toFixed(2);

        results.push({
          source,
          destination,
          entire_path: pathNames.join(' → '),
          minimum_cost: cost
        });
      }
    }

    return results;
  }

  // Reconstruct path using next-hop matrix
  reconstructPath(start, end, next) {
    if (next[start][end] === null) return [];
    const path = [start];
    while (start !== end) {
      start = next[start][end];
      path.push(start);
    }
    return path;
  }

  // Save results to CSV
  saveResultsToCSV(results, outputFile) {
    const header = 'source,destination,entire_path,minimum_cost\n';
    const rows = results
      .map(row => `${row.source},${row.destination},"${row.entire_path}",${row.minimum_cost}`)
      .join('\n');

    fs.writeFileSync(outputFile, header + rows);
    console.log(`Results saved to ${outputFile}`);
  }

  // Run the entire process
  run(outputFile) {
    this.loadCities();
    this.generateSyntheticCostMatrix();
    this.loadCostMatrix();
    const results = this.findOptimalPaths();
    this.saveResultsToCSV(results, outputFile);
  }
}

// Configuration
const cityFile = path.join(__dirname, 'cities.csv'); // Path to cities file
const costMatrixFile = path.join(__dirname, 'cost_matrix.txt'); // Path to cost matrix file
const outputFile = path.join(__dirname, 'optimal_routes.csv'); // Path to output file

const optimizer = new RouteOptimizer(cityFile, costMatrixFile);
optimizer.run(outputFile);
