export const DEFAULT_ALUMNI_DATA = {
  name: "John Doe",
  username: "@johndoe",
  profilePicture: "https://ui-avatars.com/api/?name=John+Doe&background=random",
  coverPhoto: "https://picsum.photos/800/200",
  bio: "Passionate alumnus and tech enthusiast with over 5 years of experience in software development. Currently leading innovative projects at Tech Innovations Inc. Dedicated to mentoring young developers and contributing to open-source projects. Check out my work at github.com/johndoe",
  followers: 1234,
  following: 567,
  posts: 42,
  recentPosts: [
    { id: '1', image: "https://picsum.photos/150/150?random=1", likes: 234 },
    { id: '2', image: "https://picsum.photos/150/150?random=2", likes: 187 },
    { id: '3', image: "https://picsum.photos/150/150?random=3", likes: 342 }
  ],
  workExperience: [
    {
      company: "Tech Innovations Inc.",
      position: "Senior Software Engineer",
      duration: "2020 - Present",
      description: "Leading a team of 12 developers working on cutting-edge cloud solutions. Implemented microservices architecture that reduced deployment time by 60%. Mentoring junior developers and establishing best practices for code quality and testing."
    },
    {
      company: "Digital Solutions Ltd",
      position: "Software Developer",
      duration: "2018 - 2020",
      description: "Developed mobile applications and web services"
    }
  ],
  education: [
    {
      degree: "Master of Computer Science",
      graduationYear: 2021,
      university: "Tech University",
      gpa: "3.8/4.0"
    },
    {
      degree: "Bachelor of Engineering",
      graduationYear: 2019,
      university: "Alumni University",
      gpa: "3.9/4.0"
    }
  ],
  skills: ["React Native", "JavaScript", "Python", "AWS", "UI/UX Design"],
  certifications: [
    { name: "AWS Certified Developer", year: 2023 },
    { name: "Google Cloud Professional", year: 2022 }
  ],
  location: "San Francisco, CA",
  joinedYear: 2018,
  batch: "2019-2023",
  department: "Computer Science & Engineering",
  rollNumber: "CS19B023",
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Professional" },
    { name: "Mandarin", level: "Intermediate" }
  ],
  achievements: [
    {
      title: "Best Graduate Thesis",
      year: 2023,
      description: "Awarded for research in AI/ML applications"
    },
    {
      title: "Dean's List",
      year: "2020-2023",
      description: "Maintained top 5% academic standing"
    },
    {
      title: "Hackathon Winner",
      year: 2022,
      description: "First place in University Tech Challenge"
    }
  ],
  projects: [
    {
      name: "Smart Campus App",
      role: "Team Lead",
      year: 2023,
      technologies: ["React Native", "Node.js", "MongoDB"],
      description: "Led development of university's official mobile app",
      link: "github.com/project"
    },
    {
      name: "AI Research Assistant",
      role: "Developer",
      year: 2022,
      technologies: ["Python", "TensorFlow", "AWS"],
      description: "Built ML model for academic paper analysis",
      link: "github.com/project2"
    }
  ],
  socialLinks: {
    linkedin: "linkedin.com/johndoe",
    github: "github.com/johndoe",
    portfolio: "johndoe.dev",
    twitter: "twitter.com/johndoe"
  },
  interests: ["Machine Learning", "Open Source", "Tech Mentoring", "Robotics"],
  volunteerWork: [
    {
      organization: "Code for Good",
      role: "Technical Mentor",
      duration: "2021 - Present",
      description: "Mentoring undergrad students in web development"
    }
  ]
};