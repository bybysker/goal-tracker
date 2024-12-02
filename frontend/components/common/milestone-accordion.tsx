import React from 'react';
import { Milestone, Task } from '@/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TaskCheckbox from './task-checkbox';

interface MilestoneAccordionProps {
  milestone: Milestone;
  tasks: Task[];
  updateTask: (task: Task, updatedTask: Partial<Task>) => void;
}

const MilestoneAccordion: React.FC<MilestoneAccordionProps> = ({ milestone, tasks, updateTask }) => {
  const allTasksCompleted = tasks.every(task => task.completed);

  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value={milestone.muid} className="border border-white/10 rounded-lg overflow-hidden">
        <AccordionTrigger className={`px-4 py-3 text-base text-start justify-between ${allTasksCompleted ? 'text-primary' : 'text-white'}`}>
          {milestone.name}
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 text-xs">
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCheckbox
                key={task.tuid}
                task={task}
                onComplete={(task) => {
                  task.completed = !task.completed;
                  updateTask(task, { completed: task.completed });
                }}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default MilestoneAccordion;