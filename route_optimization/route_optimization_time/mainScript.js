// const TransportMatrixGenerator = require('./transportMatrixGenerator');
const MultiModalRouteOptimizer = require('./multiModalRouteOptimizer');

const { TransportMatrixGenerator } = require('./transportMatrixGenerator');

const path = require('path');
console.log(typeof MultiModalRouteOptimizer); // Should log "function"

async function main() {
  try {
    // Configuration
    const CONFIG = {
      nNodes: 50,  // Number of cities
      citiesFile: 'Indian_cities.csv',  // Input cities file
      matricesOutputDir: 'matrices',  // Directory to save matrices
      routesOutputFile: 'multi_modal_top_5_routes_time.csv'  // Output routes file
    };

    // Step 1: Generate Transportation Matrices
    console.log('Generating Transportation Matrices...');
    const transportMatrices = TransportMatrixGenerator.generateTransportationMatrices(CONFIG.nNodes);

    
    // Save matrices to files
    TransportMatrixGenerator.saveMatricesToFiles(
      transportMatrices, 
      CONFIG.matricesOutputDir
    );

    // Step 2: Optimize Routes
    console.log('Optimizing Multi-Modal Routes...');
    const optimizer = new MultiModalRouteOptimizer(
      CONFIG.citiesFile, 
      transportMatrices
    );
    
    // Generate and save top routes
    optimizer.generateTopRoutesCSV(CONFIG.routesOutputFile);

    console.log('Route optimization completed successfully.');
  } catch (error) {
    console.error('Error in route optimization process:', error);
    console.error(error.stack);
  }
}

// Run the main function
main();