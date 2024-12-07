'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronDown, Clock, CheckCircle, Search, Filter, Flag } from 'lucide-react'
import Confetti from 'react-confetti'
import { db } from '@/db/configFirebase'
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { User as FirebaseUser } from 'firebase/auth';

interface Task {
  id: string
  name: string
  priority: string
  guid: string
  goalName: string
  muid: string
  duration: string
  completed: boolean
  simplicity: number
  urgency: number
  importance: number
  description: string
}

const priorityIcons = {
  High: { icon: Flag, color: 'text-red-500' },
  Medium: { icon: Flag, color: 'text-yellow-500' },
  Low: { icon: Flag, color: 'text-green-500' },
}

function Task({ task, onComplete }: { task: Task, onComplete: (taskId: string) => void }) {
  const PriorityIcon = priorityIcons[task.priority as keyof typeof priorityIcons].icon
  const priorityColor = priorityIcons[task.priority as keyof typeof priorityIcons].color

  return (
    <Collapsible className="mb-2">
      <div className="flex items-center justify-between p-2 bg-[#449DD1]/20 backdrop-blur-lg shadow-lg rounded-md">
        <div className="flex items-center space-x-3 ml-1">
          <PriorityIcon className={`h-4 w-4 shrink-0 ${priorityColor}`} />
          <span className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>{task.name}</span>
        </div>
        <div className="flex items-center">
          {!task.completed && (
            <Button variant="ghost" size="sm" onClick={() => onComplete(task.id)}>
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent className="p-2">
        <div className="text-sm space-y-2">
          <p>{task.description}</p>
          <p className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="font-medium">{task.duration} hours</span>
          </p>
          <p><strong>Goal:</strong> {task.goalName}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export function TaskList( { user }: { user: FirebaseUser | null }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPriority, setFilterPriority] = useState('All')

  useEffect(() => {
    fetchAllNonCompletedTasks();
  }, [user]);

  const fetchAllNonCompletedTasks = async () => {
    if (!user) return [];
    
    try {
      // Get all goals for the user
      const goalsSnapshot = await getDocs(collection(db, "users", user.uid, "goals"));
      
      // Array to store all tasks
      const allTasks: Task[] = [];
      
      // Iterate through each goal
      for (const goalDoc of goalsSnapshot.docs) {
        const goalId = goalDoc.id;
        const goalData = goalDoc.data(); 
        
        // Get all milestones for current goal
        const milestonesSnapshot = await getDocs(
          collection(db, "users", user.uid, "goals", goalId, "milestones")
        );
        
        // Iterate through each milestone
        for (const milestoneDoc of milestonesSnapshot.docs) {
          const milestoneId = milestoneDoc.id;
          
          // Get all tasks for current milestone
          const tasksSnapshot = await getDocs(
            collection(db, "users", user.uid, "goals", goalId, "milestones", milestoneId, "tasks")
          );
          
          // Process each task
          const milestoneTasks: Task[] = tasksSnapshot.docs
            .map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name,
                priority: computePriority(data.simplicity, data.urgency, data.importance),
                guid: goalId,
                goalName: goalData.name || 'Unnamed Goal',
                muid: milestoneId,
                duration: data.duration_hours,
                completed: data.completed,
                simplicity: data.simplicity,
                urgency: data.urgency,
                importance: data.importance,
                description: data.description || '',
              };
            })
            .filter(task => !task.completed); // Filter out completed tasks
            
          allTasks.push(...milestoneTasks);
        }
      }
      
      // Sort tasks by priority (High -> Medium -> Low)
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      allTasks.sort((a, b) => priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]);
      
      setTasks(allTasks);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  const computePriority = (simplicity: number, urgency: number, importance: number): string => {
    const score = simplicity * urgency * importance
    if (score >= 75) return 'High'
    if (score >= 50) return 'Medium'
    return 'Low'
  }

  const handleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ))
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 5000) // Hide confetti after 5 seconds
  }

  const filteredTasks = tasks.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPriority === 'All' || task.priority === filterPriority)
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tasks 📋</CardTitle>
      </CardHeader>
      <CardContent>
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        <ScrollArea className="h-[400px]">
          {filteredTasks.slice(0, 5).map((task) => (
            <Task key={task.id} task={task} onComplete={handleTaskCompletion} />
          ))}
        </ScrollArea>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button className="w-full mt-4 bg-[#78C0E0]/40 shadow-xl hover:bg-blue-700 text-white">
              View All Tasks
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] sm:h-[90vh]">
            <SheetHeader>
              <SheetTitle>All Tasks</SheetTitle>
            </SheetHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[120px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[calc(80vh-150px)] sm:h-[calc(90vh-150px)]">
                {filteredTasks.map((task) => (
                  <Task key={task.id} task={task} onComplete={handleTaskCompletion} />
                ))}
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

