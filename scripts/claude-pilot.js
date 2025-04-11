const fs = require('fs');
const path = require('path');

// Team members
const team = [
  'alice',
  'bob',
  'charlie',
  'diana'
];

// Determine today's pilot based on date
const today = new Date();
const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
const pilotIndex = dayOfYear % team.length;
const coPilotIndex = (pilotIndex + 1) % team.length;

const pilotInfo = {
  date: today.toISOString().split('T')[0],
  pilot: team[pilotIndex],
  coPilot: team[coPilotIndex]
};

// Save to file
fs.writeFileSync(
  path.join(__dirname, '../.claude/today-pilot.json'), 
  JSON.stringify(pilotInfo, null, 2)
);

console.log(`Today's Claude Pilot: ${pilotInfo.pilot}`);
console.log(`Today's Human Co-Pilot: ${pilotInfo.coPilot}`);