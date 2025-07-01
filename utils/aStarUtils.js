export const euclideanDistance = (a, b) => {
    return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lon - b.lon, 2));
  };
  
  export const aStar = (graph, start, end) => {
    const openSet = [];
    const closedSet = [];
    const startNode = { ...start, g: 0, h: euclideanDistance(start, end), parent: null };
    openSet.push(startNode);
  
    while (openSet.length > 0) {
      const currentNode = openSet.reduce((prev, curr) => (prev.g + prev.h < curr.g + curr.h ? prev : curr));
      if (currentNode.name === end.City) {
        const path = [];
        let temp = currentNode;
        while (temp) {
          path.push(temp);
          temp = temp.parent;
        }
        return path.reverse();
      }
  
      openSet.splice(openSet.indexOf(currentNode), 1);
      closedSet.push(currentNode);
  
      const neighbors = graph.filter((node) => node.name !== currentNode.name); 
      for (const neighbor of neighbors) {
        if (closedSet.some((n) => n.name === neighbor.name)) continue;
  
        const gScore = currentNode.g + euclideanDistance(currentNode, neighbor);
        const hScore = euclideanDistance(neighbor, end);
        const existingNode = openSet.find((n) => n.name === neighbor.name);
  
        if (!existingNode || gScore < existingNode.g) {
          const neighborNode = { ...neighbor, g: gScore, h: hScore, parent: currentNode };
          if (!existingNode) openSet.push(neighborNode);
        }
      }
    }
  
    return [];
  };
  