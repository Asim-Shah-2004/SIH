export const donationCampaigns = [
  {
    id: '1',
    title: 'Student Scholarship Fund 2024',
    description: 'Help underprivileged students pursue their dreams through education.',
    goal: 2500000,
    raised: 1500000,
    donors: 234,
    image: 'https://example.com/scholarship.jpg',
    deadline: '2024-12-31',
    impact: 'Will support 50 students',
    category: 'Education',
    updates: [
      {
        date: '2024-01-15',
        message: '25 students already selected for first phase',
        image: 'https://example.com/update1.jpg',
      },
    ],
    testimonials: [
      {
        name: 'Rahul Kumar',
        message: 'This scholarship changed my life...',
        image: 'https://example.com/testimonial1.jpg',
        year: '2023',
      },
    ],
    campaignManager: {
      name: 'Dr. Priya Singh',
      role: 'Education Committee Head',
      contact: 'priya.singh@edu.in',
    },
    taxBenefits: '80G tax exemption available',
    minimumDonation: 1000,
    suggestedDonations: [1000, 5000, 10000, 25000],
  },
  // ...more enhanced campaigns
];
