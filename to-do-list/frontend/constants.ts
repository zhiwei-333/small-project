// constant.ts
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Learn React JS and Tailwind CSS',
    description:
      'Complete the React fundamentals course and practice building components with Tailwind CSS styling.',
    completed: true,
  },
  {
    id: '2',
    title: 'Build advanced project using React JS',
    description:
      'Create a full-stack application with React, including state management, API integration, and responsive design.',
    completed: true,
  },
  {
    id: '3',
    title: 'Add project link in Resume',
    description:
      'Update resume with links to GitHub repositories and live project demos.',
    completed: false,
  },
  {
    id: '4',
    title: 'Apply for Internship or Job',
    description:
      'Submit applications to at least 5 companies and prepare for technical interviews.',
    completed: false,
  },
];
