import mongoose from "mongoose";
import { SolarUnit } from "./entities/SolarUnit";
import { EnergyGenerationRecord } from "./entities/EnergyGenerationRecord";
import { User } from "./entities/User";
import dotenv from "dotenv";
import { connectDB } from "./db";

dotenv.config();

async function seed() {
  try {
    // Connect to DB
    await connectDB();

    // Clear existing data
    await EnergyGenerationRecord.deleteMany({});
    await SolarUnit.deleteMany({});
    await User.deleteMany({});

 
    // Create a new solar unit linked to the user
    const solarUnit = await SolarUnit.create({
     
      serialNumber: "SU-0001",
      installationDate: new Date("2025-10-01"),
      capacity: 5000,
      status: "ACTIVE",
    });

    // Create 10 sequential energy generation records every 2 hours
    const records = [];
    const baseDate = new Date("2025-10-01T00:00:00Z");
    const endDate = new Date("2025-12-09T20:00:00Z");

    let currentDate = new Date(baseDate);
    let recordCount = 0;

    while(currentDate <= endDate){
        // Generate realistic energy values based on time of day and season
        const month = currentDate.getUTCMonth();
        const hour = currentDate.getUTCHours();
        
        let baseEnergy = 200;
        //
        if(month >=2 && month <= 4){
            baseEnergy = 250;
        }
        else if (month >= 5 && month <= 7) {
            baseEnergy = 300;
        }
        else if (month >= 8 && month <= 10) {
            baseEnergy = 200;
        }
        else {
            baseEnergy = 150;
        }

        // Adjust based on time of day (solar panels generate more during daylight)
        let timeMultiplier = 1;
        if (hour >= 6 && hour <=18) {
            //daylight hours
            timeMultiplier = 1.2;
             
            if (hour >=10 && hour <= 14){
                // peak sunlight hours
                timeMultiplier = 1.5;
            }
        } else {
            // nighttime hours
            timeMultiplier = 0;
        }

       //add some variation 
       const variation = 0.8 + Math.random() * 0.4;
       const energyGenerated = Math.round(baseEnergy * timeMultiplier * variation);

       records.push({
           solarUnitId: solarUnit._id,
           timestamp: currentDate,
           energyGenerated : energyGenerated,
       });

        //move to next two hour interval
        currentDate = new Date(currentDate.setUTCHours(currentDate.getUTCHours() + 2));  
        recordCount++;
       
    }


    await EnergyGenerationRecord.insertMany(records);

    console.log("Database seeded successfully.");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();