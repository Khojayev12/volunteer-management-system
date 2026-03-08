export const stats = [
  { value: '3450+', label: 'Projects' },
  { value: '132,434', label: 'Volunteers' },
  { value: '132,434+', label: 'Hours Contributed' },
  { value: '1,342+', label: 'Organizations' },
];

const baseProject = {
  title: 'Labore dolore modi non voluptatem quisquam.',
  meta: 'Location | Organization name',
  description:
    'American whole magazine truth stop whose. On traditional measure example sense peace. Would mouth relate own chair.',
  duration: '6 Months (2015-07-28 to 2015-07-28)',
  volunteers: '129 Volunteers',
};

export const projects = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  ...baseProject,
}));
