"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

// Define the Task type
interface Task {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Learn React", completed: true },
    { id: 2, text: "Build a todo app", completed: false },
    { id: 3, text: "Deploy to production", completed: false },
  ])
  const [newTaskText, setNewTaskText] = useState("")
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editingTaskText, setEditingTaskText] = useState("")

  // Add a new task
  const addTask = () => {
    if (newTaskText.trim() === "") return

    const newTask: Task = {
      id: Date.now(),
      text: newTaskText,
      completed: false,
    }

    setTasks([...tasks, newTask])
    setNewTaskText("")
  }

  // Delete a task
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
    if (editingTaskId === id) {
      setEditingTaskId(null)
    }
  }

  // Toggle task completion
  const toggleTaskComplete = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  // Start editing a task
  const startEditingTask = (id: number) => {
    const taskToEdit = tasks.find((task) => task.id === id)
    if (taskToEdit) {
      setEditingTaskId(id)
      setEditingTaskText(taskToEdit.text)
    }
  }

  // Save edited task
  const saveEditedTask = () => {
    if (editingTaskId === null) return

    setTasks(tasks.map((task) => (task.id === editingTaskId ? { ...task, text: editingTaskText } : task)))

    setEditingTaskId(null)
    setEditingTaskText("")
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingTaskId(null)
    setEditingTaskText("")
  }

  // Header Component
  const Header = () => {
    return (
      <header className="bg-slate-800 text-white py-4 px-6 mb-6 rounded-t-lg">
        <h1 className="text-2xl font-bold text-center">My Todo List</h1>
      </header>
    )
  }

  // Footer Component
  const Footer = () => {
    return (
      <footer className="bg-slate-800 text-white py-3 px-6 mt-6 rounded-b-lg text-center text-sm">
        <p>© {new Date().getFullYear()} Todo List App | Made with React</p>
      </footer>
    )
  }

  // Task Item Component
  const TaskItem = ({
    task,
    onDelete,
    onToggleComplete,
    onEdit,
  }: {
    task: Task
    onDelete: (id: number) => void
    onToggleComplete: (id: number) => void
    onEdit: (id: number) => void
  }) => {
    return (
      <div className={`flex items-center justify-between p-3 border-b ${task.completed ? "bg-slate-50" : ""}`}>
        <div className="flex items-center gap-3 flex-1">
          <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} id={`task-${task.id}`} />
          <label
            htmlFor={`task-${task.id}`}
            className={`flex-1 ${task.completed ? "line-through text-slate-500" : ""}`}
          >
            {task.text}
          </label>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(task.id)} disabled={task.completed}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto my-8 shadow-lg rounded-lg overflow-hidden">
      <Header />

      <div className="p-6">
        {/* Add Task Form */}
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask()
            }}
          />
          <Button onClick={addTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Task List */}
        <Card>
          <CardContent className="p-0">
            {tasks.length === 0 ? (
              <p className="text-center py-6 text-slate-500">No tasks yet. Add one above!</p>
            ) : (
              <div>
                {tasks.map((task) =>
                  editingTaskId === task.id ? (
                    <div key={task.id} className="flex items-center gap-2 p-3 border-b bg-slate-50">
                      <Input
                        value={editingTaskText}
                        onChange={(e) => setEditingTaskText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditedTask()
                          if (e.key === "Escape") cancelEditing()
                        }}
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" onClick={saveEditedTask}>
                        <Check className="h-4 w-4" />
                        <span className="sr-only">Save</span>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={cancelEditing}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                    </div>
                  ) : (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onDelete={deleteTask}
                      onToggleComplete={toggleTaskComplete}
                      onEdit={startEditingTask}
                    />
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Task Summary */}
        <div className="mt-4 text-sm text-slate-500">
          <p>
            {tasks.filter((t) => t.completed).length} of {tasks.length} tasks completed
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
