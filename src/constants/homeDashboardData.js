export const locationOptions = [
  { label: 'Toshkent', value: 'toshkent' },
  { label: 'Khiva', value: 'khiva' },
  { label: 'Samarqand', value: 'samarqand' },
  { label: 'Buxoro', value: 'buxoro' },
  { label: 'Remote', value: 'remote' },
];

export const timePreferenceOptions = [
  { label: 'Long Term', value: 'long-term' },
  { label: 'Short Term', value: 'short-term' },
];

export const homeOpportunities = [
  {
    id: 'green-earth',
    title: 'Policy daughter need kind miss artist truth trouble.',
    organization: 'Green Earth Society',
    description:
      'Join us in cleaning up the park and promoting environmental awareness. Join us in cleaning up the park and promoting environmental awareness. Join us in cleaning up the park and promoting environmental awareness.',
    badges: ['In Person', 'Debre Birhan', 'Long Term', '2 Years', '123', 'Volunteers needed'],
    status: 'Not Started',
    goals: [
      'Serious inside else memory if six.',
      'Whose group through despite cause.',
      'Sense peace economy travel.',
      'Total financial role together range line beyond its.',
    ],
    locationBadges: ['In Person', 'Debre Birhan'],
    timeCommitmentBadges: ['Long Term', '2 Years'],
    skillsRequiredCount: '123',
    skills: [
      { id: '12', name: 'A/B Testing' },
      { id: '34', name: 'Accounting for Small Businesses' },
      { id: '45', name: 'Addiction Psychiatry' },
      { id: '65', name: 'Adobe Camera Raw' },
      { id: '65b', name: 'Adobe Photoshop' },
    ],
    startDate: 'Dec 21, 2024',
    endDate: 'Dec 21, 2026',
  },
  {
    id: 'food-drive',
    title: 'Food Drive',
    organization: 'Local Food Bank',
    description:
      'Collecting non-perishable food items for families in need. Join us in cleaning up the park and promoting environmental awareness. Join us in cleaning up the park and promoting environmental awareness.',
    badges: ['Remote', 'Long Term', '2 Years', '123', 'Volunteers needed'],
    status: 'Not Started',
    goals: [
      'Coordinate food collection points.',
      'Deliver food packages weekly.',
      'Improve outreach to new donors.',
    ],
    locationBadges: ['Remote'],
    timeCommitmentBadges: ['Long Term', '2 Years'],
    skillsRequiredCount: '123',
    skills: [
      { id: '22', name: 'Community Outreach' },
      { id: '37', name: 'Inventory Management' },
      { id: '48', name: 'Event Planning' },
    ],
    startDate: 'Jan 10, 2025',
    endDate: 'Jan 10, 2027',
  },
  {
    id: 'community-action',
    title: 'Policy daughter need kind miss artist truth trouble.',
    organization: 'Local Food Bank',
    description:
      'American whole magazine truth stop whose. On traditional measure example sense peace. Would mouth relate own chair. Together range line beyond. First policy daughter need kind miss. American whole magazine truth stop whose. On traditional measure example sense peace. Would mouth relate own chair. Together range line beyond. First policy daughter need kind miss.',
    badges: ['In Person', 'Debre Birhan', 'Long Term', '2 Years', '123', 'Volunteers needed'],
    status: 'Not Started',
    goals: [
      'Build neighborhood support teams.',
      'Improve monthly event attendance.',
      'Strengthen partner collaboration.',
    ],
    locationBadges: ['In Person', 'Debre Birhan'],
    timeCommitmentBadges: ['Long Term', '2 Years'],
    skillsRequiredCount: '123',
    skills: [
      { id: '31', name: 'Program Coordination' },
      { id: '38', name: 'Public Speaking' },
      { id: '41', name: 'Volunteer Onboarding' },
    ],
    startDate: 'Mar 01, 2025',
    endDate: 'Mar 01, 2027',
  },
];

export function getOpportunityById(opportunityId) {
  return homeOpportunities.find((opportunity) => opportunity.id === opportunityId);
}
