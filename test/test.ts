import { getCountry } from "../src/hooks/useTodays";

// Assuming you have already imported or defined DateTime, getCountry, countriesWithImage, etc.
import { DateTime } from "luxon";

function testGetCountry(startDate, endDate) {
  const results = {};

  // Loop through each day from startDate to endDate
  let currentDate = DateTime.fromFormat(startDate, "yyyy-MM-dd");
  const finalDate = DateTime.fromFormat(endDate, "yyyy-MM-dd");

  while (currentDate <= finalDate) {
    const dayString = currentDate.toFormat("yyyy-MM-dd");
    const country = getCountry(dayString);

    // Log or store results for analysis
    if (!results[country.code]) {
      results[country.code] = 0;
    }
    results[country.code]++;

    currentDate = currentDate.plus({ days: 1 });
  }

  // Print results
  console.log("Country Selection Results:");
  for (const [country, count] of Object.entries(results)) {
    console.log(`${country}: ${count}`);
  }
}

// Define the range
const startDate = "2024-11-01";
const endDate = DateTime.now().toFormat("yyyy-MM-dd");

// Run the test
testGetCountry(startDate, endDate);
