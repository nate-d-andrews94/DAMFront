# Claude Agent Definitions

This directory contains specialized Claude agent definitions for the DAMFront project. Each agent has a specific focus area and persona to assist with different aspects of development.

## How to Use These Agents

When working with Claude on specific tasks, you can reference these agent definitions to help Claude adopt the appropriate persona and expertise. For example:

```
Claude, please act as the Asset Library Agent to help me design the search interface for our DAM system.
```

Or you can use the scripts to automatically invoke a specific agent:

```bash
npm run claude:agent asset-library
```

## Available Agents

- **Admin Upload Agent**: Expert in file upload systems and metadata management
- **Asset Library Agent**: Specialist in browsing and discovery interfaces
- **Asset Detail & Sharing Agent**: Focused on preview and sharing functionality
- **API Development Agent**: Expert in RESTful API design and implementation
- **Filter Management Agent**: Specialist in taxonomy and filtering systems
- **UI Component Agent**: Focused on reusable component library development
- **State Management Agent**: Expert in frontend data flow and state architecture
- **Testing Agent**: Specialist in comprehensive frontend testing strategies
- **Architecture Agent**: Senior architect for overall application design

## Customizing Agents

Feel free to modify these agent definitions as the project evolves. Each agent definition includes:

- **Persona**: The overall role and expertise area
- **Responsibilities**: Specific areas of focus
- **Technical Focus**: Key technologies and implementation details
- **Interaction Style**: How the agent should approach problems
- **Context Knowledge**: Background information the agent should leverage
