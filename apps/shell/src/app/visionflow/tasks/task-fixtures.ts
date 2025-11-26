export const demoTasks = [
  {
    id: 'demo-task-onboarding',
    title: 'Draft VisionFlow onboarding plan',
    description: 'Outline milestones and dependencies for the first customer rollout.',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    due_date: new Date().toISOString(),
    project: {
      id: 'demo-project-customer-success',
      title: 'Customer Success Pilot',
    },
    assignments: [
      {
        id: 'demo-assignment-1',
        user_id: 'demo-user-alex',
        role: 'OWNER',
        user: {
          name: 'Alex Johnson',
          email: 'alex@example.com',
          avatar_url: undefined,
        },
      },
    ],
    comments: [
      {
        id: 'demo-comment-1',
        content: 'We need to confirm timelines with the CS team.',
        created_at: new Date().toISOString(),
        user: {
          id: 'demo-user-alex',
          name: 'Alex Johnson',
          email: 'alex@example.com',
        },
      },
    ],
    activity: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-task-vision-ai',
    title: 'Enable Vision AI assist for workflows',
    description: 'Hook the workflow builder into Vision AI prompts for suggestions.',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    project: {
      id: 'demo-project-workflow',
      title: 'Workflow Acceleration',
    },
    assignments: [],
    comments: [],
    activity: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function getDemoTaskById(id: string) {
  return demoTasks.find((task) => task.id === id) || null;
}
