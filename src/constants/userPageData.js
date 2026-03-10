export const users = [
  {
    id: 'john-doe',
    displayName: 'John Doe',
    username: '@john_doe',
    joinedAt: 'September 2023',
    fullName: 'Ashenafi Debella',
    age: '32',
    gender: 'Male',
    email: 'john.doe@test.com',
    location: 'Addis Ababa',
    bio: 'Velit est quiquia tempora quiquia est quisquam. Ipsum consectetur quaerat non consectetur non amet. Velit dolorem ut consectetur ut ipsum dolore. Est quisquam etincidunt modi. Consectetur porro modi quaerat quisquam velit voluptatem velit. Sed etincidunt amet velit. Sit etincidunt ut dolorem tempora amet. Sed magnam ut est. Consectetur adipisci tempora labore etincidunt. Ipsum tempora neque modi quaerat numquam dolorem. Quiquia sit dolore quiquia numqua...',
    socialLinks: [
      { id: 'dribbble', label: 'Dribbble', value: 'https://dribbble.com/johndoe' },
      { id: 'linkedin', label: 'LinkedIn', value: 'https://linkedin.com/in/john_doe' },
      { id: 'github', label: 'GitHub', value: 'https://github.com/john_doe' },
    ],
    skills: [
      {
        id: 'web-dev',
        title: 'Web Development',
        description:
          'Experience in building websites and web applications using HTML, CSS, and JavaScript frameworks like React or Angular.',
      },
      {
        id: 'ui-ux',
        title: 'UI/UX Design',
        description:
          'Ability to design intuitive and user-friendly interfaces for websites and applications, including skills in wire framing, prototyping.',
      },
      {
        id: 'mobile-dev',
        title: 'Mobile App Development',
        description:
          'Skills in developing mobile applications for iOS or Android platforms using languages like Swift, Kotlin, or React Native.',
      },
    ],
    contributions: [
      {
        id: 'john-contrib-1',
        title: 'Dolor voluptatem dolor adipisci numquam porro amet tempora.',
        period: 'Jan 2024 - Jan 2025',
        description:
          'Neque numquam aliquam etincidunt est numquam velit tempora. Eius dolore ipsum adipisci non quaerat dolore labore. Quisquam etincidunt magnam magnam dolorem. Magnam dolorem porro voluptatem sed modi sit.',
      },
      {
        id: 'john-contrib-2',
        title: 'Est modi etincidunt velit neque.',
        period: 'Jan 2024 - Jan 2025',
        description:
          'Neque numquam aliquam etincidunt est numquam velit tempora. Eius dolore ipsum adipisci non quaerat dolore labore. Quisquam etincidunt magnam magnam dolorem. Magnam dolorem porro voluptatem sed modi sit.',
      },
    ],
  },
  {
    id: 'jane-smith',
    displayName: 'Jane Smith',
    username: '@jane_smith',
    joinedAt: 'March 2024',
    fullName: 'Jane Smith',
    age: '28',
    gender: 'Female',
    email: 'jane.smith@test.com',
    location: 'Toshkent',
    bio: 'Jane is a volunteer applicant focused on education and youth mentoring programs. She has contributed to multiple local initiatives and regularly supports community learning events.',
    socialLinks: [
      { id: 'dribbble-jane', label: 'Dribbble', value: 'https://dribbble.com/janesmith' },
      { id: 'linkedin-jane', label: 'LinkedIn', value: 'https://linkedin.com/in/jane_smith' },
      { id: 'github-jane', label: 'GitHub', value: 'https://github.com/jane_smith' },
    ],
    skills: [
      {
        id: 'public-speaking',
        title: 'Public Speaking',
        description: 'Comfortable facilitating sessions and presenting ideas to diverse audiences.',
      },
      {
        id: 'content-writing',
        title: 'Content Writing',
        description: 'Creates clear educational and outreach content for social initiatives.',
      },
      {
        id: 'event-support',
        title: 'Event Support',
        description: 'Helps coordinate small community events and volunteer onboarding tasks.',
      },
    ],
    contributions: [
      {
        id: 'jane-contrib-1',
        title: 'Community tutoring program coordination.',
        period: 'Feb 2024 - Present',
        description:
          'Led weekly volunteer scheduling and learning support sessions for students, helping improve participation and retention.',
      },
      {
        id: 'jane-contrib-2',
        title: 'Neighborhood outreach campaign.',
        period: 'May 2024 - Dec 2025',
        description:
          'Worked with local teams to plan outreach events, onboard volunteers, and document impact stories for partners.',
      },
    ],
  },
];

export function getUserById(userId) {
  return users.find((user) => user.id === userId);
}
