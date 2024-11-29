export const sampleMessages = [
  {
    id: 1,
    type: 'text',
    text: 'Hello! Welcome to Alumni Connect 👋',
    sender: 'them',
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
  },
  {
    id: 2,
    type: 'text',
    text: 'Hi! Thanks for connecting!',
    sender: 'me',
    timestamp: Date.now() - 86400000 * 2 + 60000, // 2 days ago + 1 minute
  },
  {
    id: 3,
    type: 'image',
    uri: 'https://picsum.photos/400/300',
    sender: 'them',
    timestamp: Date.now() - 86400000, // 1 day ago
  },
  {
    id: 4,
    type: 'document',
    fileName: 'Project_Proposal.pdf',
    fileSize: 1024 * 1024, // 1MB
    uri: 'dummy-uri',
    sender: 'me',
    timestamp: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: 5,
    type: 'audio',
    uri: 'dummy-audio-uri',
    sender: 'them',
    timestamp: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: 6,
    type: 'text',
    text: 'Check out this semester project details 📚',
    sender: 'them',
    timestamp: Date.now() - 300000, // 5 minutes ago
  },
];
