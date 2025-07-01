const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class TransportMatrixGenerator {
  /**
   * Convert degrees to radians
   * @param {number} degrees 
   * @returns {number} Radians
   */
  static toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Calculate Haversine distance between two geographic points
   * @param {number} lat1 - Latitude of first point
   * @param {number} lon1 - Longitude of first point
   * @param {number} lat2 - Latitude of second point
   * @param {number} lon2 - Longitude of second point
   * @returns {number} Distance in kilometers
   */
  static haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Read cities from CSV with infrastructure details
   * @param {string} filePath - Path to the CSV file
   * @returns {Promise<Object>} Promise resolving to cities data
   */
  static readCitiesFromCSV(filePath) {
    return new Promise((resolve, reject) => {
      const cities = [];
      const cityDetails = [];

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          // Validate latitude and longitude
          const lat = parseFloat(row.Latitude);
          const lon = parseFloat(row.Longitude);
          
          if (!isNaN(lat) && !isNaN(lon)) {
            cities.push([lat, lon]);
            
            cityDetails.push({
              id: row.City_ID,
              name: row.City,
              state: row.State,
              latitude: lat,
              longitude: lon,
              infrastructure: {
                air: row.Air_Infrastructure === 'Yes',
                road: true,
                rail: true
              }
            });
          } else {
            console.warn(`Invalid coordinates for city: ${row.City}`);
          }
        })
        .on('end', () => {
          resolve({ 
            coordinates: cities, 
            cityDetails 
          });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  /**
   * Generate transportation matrices for different modes
   * @param {number} nNodes - Number of nodes (cities)
   * @param {Object} options - Configuration options
   * @param {Array} coordinates - City coordinates
   * @param {Array} cityDetails - City infrastructure details
   * @returns {Object} Generated transportation matrices
   */
  static generateTransportationMatrices(nNodes, options = {}, coordinates = null, cityDetails = null) {
    const modes = ['road', 'rail', 'air'];
    const matrices = {};

    // Extremely high cost and time to discourage routes without infrastructure
    const PROHIBITIVE_COST = 10000;
    const PROHIBITIVE_TIME = 1000;

    // Default cost and time multipliers for each transport mode
    const defaultMultipliers = {
      'road': { 
        costMin: 50, 
        costMax: 200, 
        timeMin: 2, 
        timeMax: 6,
        speedMin: 50,
        speedMax: 80
      },
      'rail': { 
        costMin: 40, 
        costMax: 180, 
        timeMin: 2.5, 
        timeMax: 7,
        speedMin: 80,
        speedMax: 120
      },
      'air': { 
        costMin: 100, 
        costMax: 500, 
        timeMin: 1, 
        timeMax: 4,
        speedMin: 600,
        speedMax: 900
      }
    };

    modes.forEach(mode => {
      const matrix = Array.from({ length: nNodes }, () => 
        Array(nNodes).fill([0, 0])
      );

      const multipliers = { ...defaultMultipliers[mode], ...options[mode] };

      for (let i = 0; i < nNodes; i++) {
        for (let j = 0; j < nNodes; j++) {
          if (i !== j) {
            const { 
              costMin, costMax, 
              timeMin, timeMax, 
              speedMin, speedMax 
            } = multipliers;
            
            // Check infrastructure availability
            let routeAvailable = true;
            if (cityDetails) {
              routeAvailable = cityDetails[i].infrastructure[mode] && 
                               cityDetails[j].infrastructure[mode];
            }

            if (routeAvailable) {
              const cost = Math.floor(Math.random() * (costMax - costMin + 1)) + costMin;
              
              // Calculate time based on distance if coordinates are provided
              if (coordinates && coordinates[i] && coordinates[j]) {
                const [lat1, lon1] = coordinates[i];
                const [lat2, lon2] = coordinates[j];
                
                const distance = this.haversineDistance(lat1, lon1, lat2, lon2);
                const speed = Math.random() * (speedMax - speedMin) + speedMin;
                const time = Number((distance / speed).toFixed(2));
                
                matrix[i][j] = [cost, time];
              } else {
                // Fallback to random time generation
                const time = Number((Math.random() * (timeMax - timeMin) + timeMin).toFixed(2));
                matrix[i][j] = [cost, time];
              }
            } else {
              // No infrastructure, set prohibitive cost and time
              matrix[i][j] = [PROHIBITIVE_COST, PROHIBITIVE_TIME];
            }
          }
        }
      }
      
      matrices[mode] = matrix;
    });

    return matrices;
  }

  /**
   * Save matrices to JSON files
   * @param {Object} matrices - Transportation matrices
   * @param {Object} cityDetails - City information
   * @param {string} outputDir - Directory to save matrices
   */
  static saveMatricesToFiles(matrices, cityDetails, outputDir = 'matrices') {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save each matrix to a separate JSON file
    Object.keys(matrices).forEach(mode => {
      const matrixFilePath = path.join(outputDir, `${mode}_matrix.json`);
      fs.writeFileSync(matrixFilePath, JSON.stringify(matrices[mode], null, 2));
      console.log(`Saved ${mode} matrix to ${matrixFilePath}`);
    });

    // Save city details
    const cityDetailsPath = path.join(outputDir, 'city_details.json');
    fs.writeFileSync(cityDetailsPath, JSON.stringify(cityDetails, null, 2));
    console.log(`Saved city details to ${cityDetailsPath}`);
  }

  /**
   * Load matrices from JSON files
   * @param {string} inputDir - Directory containing matrix files
   * @returns {Object} Loaded transportation matrices
   */
  static loadMatricesFromFiles(inputDir = 'matrices') {
    const matrices = {};
    const modes = ['road', 'rail', 'air'];

    modes.forEach(mode => {
      const filePath = path.join(inputDir, `${mode}_matrix.json`);
      
      if (fs.existsSync(filePath)) {
        const matrixData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        matrices[mode] = matrixData;
      }
    });

    const cityDetailsPath = path.join(inputDir, 'city_details.json');
    const cityDetails = fs.existsSync(cityDetailsPath) 
      ? JSON.parse(fs.readFileSync(cityDetailsPath, 'utf8'))
      : null;

    return { matrices, cityDetails };
  }
}

/**
 * Main function to generate transportation matrices
 * @param {string} csvFilePath - Path to the CSV file with city data
 */
async function generateTransportMatrices(csvFilePath = 'Indian_cities.csv') {
  try {
    // Read cities from CSV
    const { coordinates, cityDetails } = await TransportMatrixGenerator.readCitiesFromCSV(csvFilePath);
    
    // Use the number of cities from the CSV
    const nNodes = coordinates.length;

    console.log(`Processing ${nNodes} cities...`);

    // Generate matrices with coordinates and city details
    const matrices = TransportMatrixGenerator.generateTransportationMatrices(
      nNodes, 
      {}, 
      coordinates,
      cityDetails
    );
    
    // Save matrices and city details
    TransportMatrixGenerator.saveMatricesToFiles(matrices, cityDetails);

    console.log('Transportation matrices generated successfully!');
  } catch (error) {
    console.error('Error generating matrices:', error);
  }
}

// Export the class and main function
module.exports = {
  TransportMatrixGenerator,
  generateTransportMatrices
};

// Run the main function if script is executed directly
if (require.main === module) {
  generateTransportMatrices();
}