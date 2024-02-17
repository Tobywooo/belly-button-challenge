// Fetch the dataset from the provided URL using d3's json method.
let dataset = d3.json('https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json');
console.log(dataset);

// Function to display demographic information for a selected sample.
function displayDemographics(sampleId) {
    console.log(sampleId);

    dataset.then((data) => {
        let metadataArray = data.metadata;        
        let selectedMetadata = metadataArray.filter(item => item.id == sampleId);      
        let demographicInfo = selectedMetadata[0];
        
        d3.select('#sample-metadata').html('');
        
        Object.entries(demographicInfo).forEach(([key, value]) => {
            d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
        });
    });
}

// Function to generate a bar chart for the selected sample.
function generateBarChart(sampleId) {
    dataset.then((data) => {
        let samplesArray = data.samples;

        // Filter to find the data for the selected sampleId.
        let selectedSampleData = samplesArray.filter(sample => sample.id == sampleId)[0];

        // Extract the data needed for the bar chart.
        let otuIds = selectedSampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
        let sampleValues = selectedSampleData.sample_values.slice(0, 10).reverse();
        let otuLabels = selectedSampleData.otu_labels.slice(0, 10).reverse();

        // Configuration for the bar chart.
        let barChartData = {
            y: otuIds,
            x: sampleValues,
            text: otuLabels,
            type: 'bar',
            orientation: 'h'
        };

        // Use Plotly to plot the bar chart.
        Plotly.newPlot('bar', [barChartData]);
    });
}

// Function to generate a bubble chart for the selected sample.
function generateBubbleChart(sampleId) {
    dataset.then((data) => {
        let samplesArray = data.samples;

        // Filter to find the data for the selected sampleId.
        let selectedSampleData = samplesArray.filter(sample => sample.id == sampleId)[0];

        // Configuration for the bubble chart.
        let bubbleChartData = {
            x: selectedSampleData.otu_ids,
            y: selectedSampleData.sample_values,
            text: selectedSampleData.otu_labels,
            mode: 'markers',
            marker: {
                size: selectedSampleData.sample_values,
                color: selectedSampleData.otu_ids,
                colorscale: 'Portland'
            }
        };

        let layout = {
            hovermode: 'closest',
            xaxis: {title: 'OTU ID'}
        };

        // Use Plotly to plot the bubble chart.
        Plotly.newPlot('bubble', [bubbleChartData], layout);
    });
}

// Initial setup function to prepare the dropdown and load initial charts.
function initializeDashboard() {
    let dropdown = d3.select('#selDataset');

    dataset.then((data) => {
        data.names.forEach((sampleId) => {
            dropdown.append('option').text(sampleId).property('value', sampleId);
        });

        // Load the initial visualizations for the first sample.
        let initialSample = data.names[0];
        displayDemographics(initialSample);
        generateBarChart(initialSample);
        generateBubbleChart(initialSample);
    });
}

// Call the initialization function to set everything up.
initializeDashboard();

// Function to update all visualizations based on the new sample selected.
function optionChanged(newSampleId) {
    // Update the dashboard with the new selection.
    displayDemographics(newSampleId);
    generateBarChart(newSampleId);
    generateBubbleChart(newSampleId);
}
