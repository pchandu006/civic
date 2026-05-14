// services/aiService.js

const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

const detectIssueFromImage = async (imagePath) => {
  try {

    const [result] = await client.labelDetection(imagePath);

    const labels = result.labelAnnotations.map(
      label => label.description.toLowerCase()
    );

    let department = "General Administration";
    let issueType = "General Issue";
    let priority = "Low";

    // ROAD
    if (labels.some(l => l.includes("road") || l.includes("pothole") || l.includes("asphalt"))) {
      department = "Roads & Infrastructure Department";
      issueType = "Road Damage";
      priority = "High";
    }

    // GARBAGE
    else if (labels.some(l => l.includes("garbage") || l.includes("trash") || l.includes("waste"))) {
      department = "Sanitation Department";
      issueType = "Garbage Issue";
      priority = "Medium";
    }

    // WATER
    else if (labels.some(l => l.includes("water") || l.includes("leak") || l.includes("pipe"))) {
      department = "Water Supply Department";
      issueType = "Water Issue";
      priority = "High";
    }

    // ELECTRICITY
    else if (labels.some(l => l.includes("electric") || l.includes("wire") || l.includes("pole"))) {
      department = "Electricity Department";
      issueType = "Electricity Issue";
      priority = "High";
    }

    const confidence = result.labelAnnotations.length > 0
      ? Math.round(result.labelAnnotations[0].score * 100)
      : 50;

    return {
      issueType,
      department,
      priority,
      confidence,
      labels
    };

  } catch (error) {
    console.error("Vision AI Error:", error);

    return {
      issueType: "General Issue",
      department: "General Administration",
      priority: "Low",
      confidence: 50,
      labels: []
    };
  }
};

module.exports = { detectIssueFromImage };