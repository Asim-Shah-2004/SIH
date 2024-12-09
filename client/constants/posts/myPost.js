export const myPost = [
  {
    userId: '60fbbf8c61bcd043c4f9b448',
    text: 'Had an amazing time at the tech conference today! Learned a lot about the future of AI and met some incredible people.',
    media: [
      {
        type: 'image',
        url: 'https://example.com/tech-conference.jpg',
        description: 'Tech Conference Highlights',
      },
    ],
    likes: [{ userId: '60fbbf8c61bcd043c4f9b449' }, { userId: '60fbbf8c61bcd043c4f9b450' }],
    comments: [
      {
        userId: '60fbbf8c61bcd043c4f9b451',
        text: "That sounds amazing! Can't wait to attend next year.",
        likes: [{ userId: '60fbbf8c61bcd043c4f9b450' }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: '60fbbf8c61bcd043c4f9b452',
        text: 'AI is definitely the future! Glad you enjoyed it.',
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    reactions: [
      { userId: '60fbbf8c61bcd043c4f9b449', type: 'like' },
      { userId: '60fbbf8c61bcd043c4f9b450', type: 'love' },
    ],
    shares: [{ userId: '60fbbf8c61bcd043c4f9b453', sharedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '60fbbf8c61bcd043c4f9b454',
    text: 'Just finished reading a great book on machine learning. Highly recommend it to anyone interested in AI.',
    media: [
      {
        type: 'image',
        url: 'https://example.com/machine-learning-book.jpg',
        description: 'Machine Learning Book',
      },
    ],
    likes: [{ userId: '60fbbf8c61bcd043c4f9b455' }, { userId: '60fbbf8c61bcd043c4f9b456' }],
    comments: [
      {
        userId: '60fbbf8c61bcd043c4f9b457',
        text: "I have this book! It's amazing.",
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    reactions: [
      { userId: '60fbbf8c61bcd043c4f9b455', type: 'like' },
      { userId: '60fbbf8c61bcd043c4f9b456', type: 'love' },
    ],
    shares: [{ userId: '60fbbf8c61bcd043c4f9b458', sharedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '60fbbf8c61bcd043c4f9b459',
    text: "Excited to start a new project on AI-powered chatbots. Can't wait to see how it turns out!",
    media: [
      {
        type: 'image',
        url: 'https://example.com/ai-chatbot.jpg',
        description: 'AI Chatbot Project',
      },
    ],
    likes: [{ userId: '60fbbf8c61bcd043c4f9b460' }, { userId: '60fbbf8c61bcd043c4f9b461' }],
    comments: [
      {
        userId: '60fbbf8c61bcd043c4f9b462',
        text: 'Sounds like a great project! Good luck!',
        likes: [{ userId: '60fbbf8c61bcd043c4f9b461' }],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    reactions: [
      { userId: '60fbbf8c61bcd043c4f9b460', type: 'like' },
      { userId: '60fbbf8c61bcd043c4f9b461', type: 'love' },
    ],
    shares: [{ userId: '60fbbf8c61bcd043c4f9b463', sharedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '60fbbf8c61bcd043c4f9b464',
    text: 'Just published my latest blog post on the role of AI in healthcare. Check it out!',
    media: [
      {
        type: 'image',
        url: 'https://example.com/ai-healthcare.jpg',
        description: 'AI in Healthcare Blog Post',
      },
    ],
    likes: [{ userId: '60fbbf8c61bcd043c4f9b465' }, { userId: '60fbbf8c61bcd043c4f9b466' }],
    comments: [
      {
        userId: '60fbbf8c61bcd043c4f9b467',
        text: "I'll definitely check it out. I'm interested in how AI is being used in healthcare.",
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    reactions: [
      { userId: '60fbbf8c61bcd043c4f9b465', type: 'like' },
      { userId: '60fbbf8c61bcd043c4f9b466', type: 'love' },
    ],
    shares: [{ userId: '60fbbf8c61bcd043c4f9b468', sharedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
