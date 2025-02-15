// main.js
document.addEventListener("DOMContentLoaded", function() {
    // Fetch network data from your API
    fetch("http://localhost:3000/api/network")
        .then(response => response.json())
        .then(data => {
            console.log(data); // Inspect the data in the console
            // Initialize D3 visualization here
            createVisualization(data.collaborations);
        })
        .catch(error => console.error("Error fetching data:", error));
    
    function createVisualization(collaborations) {
        // Define dimensions and SVG container
        const width = 800;
        const height = 600;
        const svg = d3.select("#network")
                      .append("svg")
                      .attr("width", width)
                      .attr("height", height);
        
        // Process your data to extract nodes and links
        // For now, this can be a simple implementation
        
        // Example: Render text for each collaboration (update this with your desired visualization)
        svg.selectAll("text")
           .data(collaborations)
           .enter()
           .append("text")
           .attr("x", (d, i) => 50)
           .attr("y", (d, i) => i * 20 + 50)
           .text(d => `${d.artistA.name} ↔ ${d.artistB.name}`);
    }
});
