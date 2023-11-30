// Define the URL for fetching data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to fetch data using D3.json
function fetchData() {
  return d3.json(url);
}

// Initialization function
function init() {
  // Select the dropdown menu element
  const dropdownMenu = d3.select("#selDataset");

  // Fetch data and perform actions
  fetchData().then(data => {
    // Extract patient names from the data
    const nameLabels = data.names;

    // Populate the dropdown menu with patient names
    nameLabels.forEach(id => {
      dropdownMenu.append("option").text(id).property("value", id);
    });

    // Initialize charts with the first patient
    const initialPatient = nameLabels[0];
    buildCharts(initialPatient, data);
  });
}

// Function called when a new patient is selected in the dropdown menu
function optionChanged(patientid) {
  // Fetch data and update charts with the selected patient
  fetchData().then(data => {
    buildCharts(patientid, data);
  });
}

// Function to build all charts for a given patient
function buildCharts(patient, data) {
  // Get data specific to the selected patient
  const patientData = getPatientData(patient, data);

  // Build individual charts
  barPlot(patientData);
  bubblePlot(patientData);
  metaData(patient, data);
}

// Function to build the bar chart
function barPlot(patientData) {
  const { otu_ids, otu_labels, sample_values } = patientData;

  // Slice and format data for the top 10 OTUs
  const otuIDsTopTen = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
  const otuIDLabelsTopTen = otu_labels.slice(0, 10).reverse();
  const otuSampleValuesTopTen = sample_values.slice(0, 10).reverse();

  // Define trace for the bar chart
  const trace1 = {
    x: otuSampleValuesTopTen,
    y: otuIDsTopTen,
    text: otuIDLabelsTopTen,
    type: "bar",
    orientation: "h"
  };

  // Define layout for the bar chart
  const barLayout = {
    title: `Top 10 OTUs for Subject #${patientData.id}`,
    yaxis: { title: "OTU ID" },
    xaxis: { title: "sample_value" }
  };

  // Create the bar chart
  Plotly.newPlot("bar", [trace1], barLayout);
}

// Function to build the bubble chart
function bubblePlot(patientData) {
  const { otu_ids, otu_labels, sample_values } = patientData;

  // Define trace for the bubble chart
  const trace1 = {
    x: otu_ids,
    y: sample_values,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    },
    text: otu_labels,
    type: "bubble"
  };

  // Define layout for the bubble chart
  const bubbleLayout = {
    title: `Top 10 OTUs for Subject #${patientData.id}`,
    xaxis: { title: "sample_value" }
  };

  // Create the bubble chart
  Plotly.newPlot("bubble", [trace1], bubbleLayout);
}

// Function to build the metadata display
function metaData(patient, data) {
  // Get metadata for the selected patient
  const values = getPatientValues(patient, data);
  const metadataDiv = d3.select("#sample-metadata");

  // Clear previous content
  metadataDiv.html("");

  // Display each key-value pair in the metadata
  Object.entries(values).forEach(([key, value]) => {
    metadataDiv.append('p').text(`${key}: ${value}`);
  });
}

// Helper function to get data specific to the selected patient
function getPatientData(patient, data) {
  return data.samples.find(sample => sample.id === patient);
}

// Helper function to get metadata for the selected patient
function getPatientValues(patient, data) {
  return data.metadata.find(entry => entry.id == patient);
}

// Initialize the dashboard
init();
