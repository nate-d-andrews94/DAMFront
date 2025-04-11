/**
 * Script to invoke specific Claude agents for specialized tasks
 * 
 * This script loads an agent definition from .claude/agents/
 * and passes it to Claude when initiating a conversation.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const invokeAgent = () => {
  // Get agent name from command line arguments
  const agentName = process.argv[2];
  
  if (!agentName) {
    console.error('Error: Please specify an agent name');
    console.log('Available agents:');
    const agents = fs.readdirSync(path.join(__dirname, '../.claude/agents'))
      .filter(file => file.endsWith('.md') && file !== 'README.md')
      .map(file => file.replace('.md', ''));
    console.log(agents.join('\n'));
    process.exit(1);
  }
  
  // Construct path to agent definition
  const agentPath = path.join(__dirname, `../.claude/agents/${agentName}.md`);
  
  // Check if agent exists
  if (!fs.existsSync(agentPath)) {
    console.error(`Error: Agent "${agentName}" not found`);
    process.exit(1);
  }
  
  // Read agent definition
  const agentDefinition = fs.readFileSync(agentPath, 'utf8');
  
  // Print agent info
  console.log(`Invoking Claude as the ${agentName} agent...`);
  console.log('-------------------------');
  console.log(`Agent persona: ${agentDefinition.split('\n')[0]}`);
  console.log('-------------------------');
  
  // Execute claude-cli with agent definition as initial prompt
  // Note: This is a placeholder for the actual Claude CLI invocation
  console.log('Starting Claude with the agent definition...');
  console.log('To use with claude-cli, you would run something like:');
  console.log(`claude-cli "${agentDefinition}. Now help me with the following task: "`);
  
  // In a real implementation, you might use:
  // execSync(`claude-cli < ${agentPath}`, { stdio: 'inherit' });
};

invokeAgent();