export const posts = [
  {
    userId: '60fbbf8c61bcd043c4f9b431', // Example user ID
    text: '# h1 Heading\n## h2 Heading\n### h3 Heading\n#### h4 Heading\n##### h5 Heading\n###### h6 Heading\n\nSome text above\n___\n\nSome text in the middle\n\n---\n\nSome text below\n\n**This is bold text**\n\n__This is bold text__\n\n*This is italic text*\n\n_This is italic text_\n\n~~Strikethrough~~\n\n> Blockquotes can also be nested...\n>> ...by using additional greater-than signs right next to each other...\n> > > ...or with spaces between arrows.\n\nUnordered Lists\n+ Create a list by starting a line with +, -, or *\n+ Sub-lists are made by indenting 2 spaces:\n  - Marker character change forces new list start:\n    * Ac tristique libero volutpat at\n    + Facilisis in pretium nisl aliquet. This is a very long list item that will surely wrap onto the next line.\n    - Nulla volutpat aliquam velit\n+ Very easy!\n\nOrdered Lists\n1. Lorem ipsum dolor sit amet\n2. Consectetur adipiscing elit. This is a very long list item that will surely wrap onto the next line.\n3. Integer molestie lorem at massa\n\nStart numbering with offset:\n57. foo\n58. bar\n\nInline `code`\n\nIndented code\n    \/\/ Some comments\n    line 1 of code\n    line 2 of code\n    line 3 of code\n\nBlock code \"fences\"\n```\nSample text here...\n```\n\nSyntax highlighting\n```js\nvar foo = function (bar) {\n    return bar++;\n};\nconsole.log(foo(5));\n```\n\n| Option | Description |\n| ------ | ----------- |\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\nRight aligned columns\n| Option | Description |\n| ------:| -----------:|\n| data   | path to data files to supply the data that will be passed into templates. |\n| engine | engine to be used for processing templates. Handlebars is the default. |\n| ext    | extension to be used for dest files. |\n\n[link text](https:\/\/www.google.com)\n\n[link with title](https:\/\/www.google.com \"title text!\")\n\nAutoconverted link https:\/\/www.google.com (enable linkify to see)',
    media: [
      {
        type: 'image',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSihkidiHiRhlnlL4a9OusGoj7XMP-aY03-8g&s',
        description: 'Project Launch Image',
      },
    ],
    likes: [
      { userId: '60fbbf8c61bcd043c4f9b432' }, // User 1
      { userId: '60fbbf8c61bcd043c4f9b433' }, // User 2
    ],
    comments: [
      {
        userId: '60fbbf8c61bcd043c4f9b434', // User 3
        text: "Can't wait to see it!",
        likes: [
          { userId: '60fbbf8c61bcd043c4f9b433' }, // User 2 liked the comment
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: '60fbbf8c61bcd043c4f9b435', // User 4
        text: 'Awesome, keep up the great work!',
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    reactions: [
      { userId: '60fbbf8c61bcd043c4f9b432', type: 'like' }, // User 1 liked the post
      { userId: '60fbbf8c61bcd043c4f9b433', type: 'love' }, // User 2 loved the post
    ],
    shares: [
      { userId: '60fbbf8c61bcd043c4f9b436', sharedAt: new Date() }, // User 5 shared the post
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '60fbbf8c61bcd043c4f9b437', // Example user ID
    text: 'Just received an offer from XYZ Corp! Looking forward to this new chapter in my career.',
    media: [
      {
        type: 'image',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSihkidiHiRhlnlL4a9OusGoj7XMP-aY03-8g&s',
        description: 'Offer Letter',
      },
      {
        type: 'video',
        url: 'https://static.vecteezy.com/system/resources/previews/027/939/550/mp4/earphone-and-mobile-phone-3d-rendering-video.mp4',
        description: 'Celebration Video',
      },
    ],
    likes: [
      { userId: '60fbbf8c61bcd043c4f9b438' }, // User 6
      { userId: '60fbbf8c61bcd043c4f9b439' }, // User 7
    ],
    comments: [
      {
        userId: '60fbbf8c61bcd043c4f9b440', // User 8
        text: 'Congrats! Well deserved!',
        likes: [
          { userId: '60fbbf8c61bcd043c4f9b438' }, // User 6 liked the comment
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    reactions: [
      { userId: '60fbbf8c61bcd043c4f9b439', type: 'wow' }, // User 7 was wowed by the post
      { userId: '60fbbf8c61bcd043c4f9b438', type: 'like' }, // User 6 liked the post
    ],
    shares: [
      { userId: '60fbbf8c61bcd043c4f9b441', sharedAt: new Date() }, // User 9 shared the post
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    userId: '60fbbf8c61bcd043c4f9b442', // Example user ID
    text: 'Completed my first marathon today! A huge milestone in my fitness journey.',
    media: [
      {
        type: 'image',
        url: 'https://example.com/marathon-photo.jpg',
        description: 'Marathon Finish Line',
      },
    ],
    likes: [
      { userId: '60fbbf8c61bcd043c4f9b443' }, // User 10
      { userId: '60fbbf8c61bcd043c4f9b444' }, // User 11
    ],
    comments: [
      {
        userId: '60fbbf8c61bcd043c4f9b445', // User 12
        text: 'Incredible, well done!',
        likes: [
          { userId: '60fbbf8c61bcd043c4f9b444' }, // User 11 liked the comment
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: '60fbbf8c61bcd043c4f9b446', // User 13
        text: 'Such an inspiring accomplishment!',
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    reactions: [
      { userId: '60fbbf8c61bcd043c4f9b443', type: 'love' }, // User 10 loved the post
      { userId: '60fbbf8c61bcd043c4f9b444', type: 'like' }, // User 11 liked the post
    ],
    shares: [
      { userId: '60fbbf8c61bcd043c4f9b447', sharedAt: new Date() }, // User 14 shared the post
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
