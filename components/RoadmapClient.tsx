'use client';
import { useState, useEffect } from 'react';
import { Goal, Skill, Task } from '@/lib/types';
import { 
  Target, Plus, Clock, Calendar, CheckSquare, Square, ArrowRight, Edit, Trash2, 
  ChevronDown, ChevronRight, Filter, Search, Star, TrendingUp, Award, Zap,
  Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Circle, Timer,
  BookOpen, Users, MessageSquare, BarChart3, PieChart, Activity, 
  Brain, Trophy, Flame, Eye, EyeOff
} from 'lucide-react';

// --- Task Item Component ---
const TaskItem = ({ 
  task, 
  onToggleComplete, 
  onUpdatePriority, 
  onSetDueDate,
  onStartPomodoro,
  showDetails = false 
}: {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onUpdatePriority: (taskId: string, priority: number) => void;
  onSetDueDate: (taskId: string, date: string) => void;
  onStartPomodoro: (task: Task) => void;
  showDetails?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dueDate, setDueDate] = useState(task.due_date || '');

  const priorityColors = {
    1: 'border-green-200 bg-green-50 text-green-800',
    2: 'border-yellow-200 bg-yellow-50 text-yellow-800', 
    3: 'border-red-200 bg-red-50 text-red-800'
  };

  const priorityLabels = { 1: 'Low', 2: 'Medium', 3: 'High' };

  const getDaysUntilDue = () => {
    if (!task.due_date) return null;
    const today = new Date();
    const due = new Date(task.due_date);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: `${Math.abs(diffDays)}d overdue`, color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Due today', color: 'text-red-600' };
    if (diffDays <= 3) return { text: `${diffDays}d left`, color: 'text-orange-600' };
    if (diffDays <= 7) return { text: `${diffDays}d left`, color: 'text-yellow-600' };
    return { text: `${diffDays}d left`, color: 'text-gray-600' };
  };

  const dueDateInfo = getDaysUntilDue();

  return (
    <div className={`group border rounded-lg p-4 transition-all hover:shadow-md ${
      task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            task.completed 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {task.completed && <CheckCircle2 className="w-3 h-3" />}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h4 className={`font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h4>
              {showDetails && task.description && (
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              )}
            </div>

            {/* Task Actions */}
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {!task.completed && (
                <button
                  onClick={() => onStartPomodoro(task)}
                  className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-2 py-1 rounded-md flex items-center gap-1"
                  title="Start focused work session"
                >
                  <Timer className="w-3 h-3" />
                  Focus
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Task Meta Info */}
          <div className="flex items-center gap-4 mt-2 text-xs">
            {/* Priority */}
            <select
              value={task.priority}
              onChange={(e) => onUpdatePriority(task.id, parseInt(e.target.value))}
              className={`px-2 py-1 rounded-md border text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}
            >
              <option value={1}>Low</option>
              <option value={2}>Medium</option>
              <option value={3}>High</option>
            </select>

            {/* Due Date */}
            {isEditing ? (
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={() => {
                  if (dueDate !== task.due_date) {
                    onSetDueDate(task.id, dueDate);
                  }
                  setIsEditing(false);
                }}
                className="px-2 py-1 border border-gray-300 rounded text-xs"
                autoFocus
              />
            ) : (
              <>
                {dueDateInfo ? (
                  <span className={`${dueDateInfo.color} font-medium flex items-center gap-1`}>
                    <Calendar className="w-3 h-3" />
                    {dueDateInfo.text}
                  </span>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-gray-600 flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3" />
                    Set due date
                  </button>
                )}
              </>
            )}

            {/* Subject */}
            {task.subject && (
              <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                {task.subject}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Enhanced Skill Card ---
const EnhancedSkillCard = ({ 
  skill, 
  tasks, 
  goalTitle, 
  onGenerateTasks, 
  onDeleteSkill,
  onTaskUpdate,
  onStartPomodoro,
  isGenerating 
}: {
  skill: Skill;
  tasks: Task[];
  goalTitle: string;
  onGenerateTasks: () => void;
  onDeleteSkill: () => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onStartPomodoro: (task: Task) => void;
  isGenerating: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showDetails, setShowDetails] = useState(false);

  const skillTasks = tasks.filter(t => t.skill_id === skill.id);
  const completedTasks = skillTasks.filter(t => t.completed);
  const pendingTasks = skillTasks.filter(t => !t.completed);
  const overdueTasks = skillTasks.filter(t => {
    if (!t.due_date || t.completed) return false;
    return new Date(t.due_date) < new Date();
  });

  const progress = skillTasks.length > 0 ? (completedTasks.length / skillTasks.length) * 100 : 0;

  const filteredTasks = skillTasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleToggleComplete = async (taskId: string) => {
    const task = skillTasks.find(t => t.id === taskId);
    if (task) {
      onTaskUpdate(taskId, { completed: !task.completed });
    }
  };

  const getSkillInsight = () => {
    if (skillTasks.length === 0) return "Ready to start learning";
    if (progress === 100) return "🎉 Skill mastered!";
    if (overdueTasks.length > 0) return `⚠️ ${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`;
    if (progress < 25) return "🌱 Just getting started";
    if (progress < 50) return "📈 Making good progress";
    if (progress < 75) return "🚀 Well on your way";
    return "🏆 Almost there!";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">{skill.name}</h3>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-600">{getSkillInsight()}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-gray-400 hover:text-gray-600 p-1"
              title={showDetails ? "Hide details" : "Show details"}
            >
              {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={onDeleteSkill}
              className="text-gray-400 hover:text-red-500 p-1"
              title="Delete skill"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 ease-out shadow-sm" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-lg font-bold text-blue-600">{Math.round(progress)}%</div>
            <div className="text-xs text-blue-600">Complete</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-xs text-green-600">Done</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3">
            <div className="text-lg font-bold text-orange-600">{pendingTasks.length}</div>
            <div className="text-xs text-orange-600">Remaining</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {skillTasks.length === 0 ? (
            <button
              onClick={onGenerateTasks}
              disabled={isGenerating}
              className="col-span-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-medium flex items-center justify-center gap-2"
            >
              <Brain className="w-4 h-4" />
              {isGenerating ? 'Creating Plan...' : 'Generate Learning Plan'}
            </button>
          ) : (
            <>
              <button
                onClick={onGenerateTasks}
                disabled={isGenerating}
                className="bg-purple-100 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-200 text-sm font-medium flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add More Tasks
              </button>
              <button
                onClick={() => {
                  const nextTask = pendingTasks[0];
                  if (nextTask) onStartPomodoro(nextTask);
                }}
                disabled={pendingTasks.length === 0}
                className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-sm font-medium flex items-center justify-center gap-1"
              >
                <Play className="w-3 h-3" />
                Focus Session
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && skillTasks.length > 0 && (
        <div className="p-6">
          {/* Filters */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="all">All Tasks ({skillTasks.length})</option>
                <option value="pending">Pending ({pendingTasks.length})</option>
                <option value="completed">Completed ({completedTasks.length})</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-500">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-3">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onUpdatePriority={(taskId, priority) => onTaskUpdate(taskId, { priority })}
                onSetDueDate={(taskId, due_date) => onTaskUpdate(taskId, { due_date })}
                onStartPomodoro={onStartPomodoro}
                showDetails={showDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Smart Dashboard ---
const SmartDashboard = ({ 
  goals, 
  skills, 
  tasks, 
  selectedGoalId 
}: {
  goals: Goal[];
  skills: Skill[];
  tasks: Task[];
  selectedGoalId: string | null;
}) => {
  const selectedGoal = goals.find(g => g.id === selectedGoalId);
  const goalSkills = skills.filter(s => s.goal_id === selectedGoalId);
  const goalTasks = tasks.filter(t => goalSkills.some(s => s.id === t.skill_id));
  
  const completedTasks = goalTasks.filter(t => t.completed).length;
  const totalTasks = goalTasks.length;
  const overdueTasks = goalTasks.filter(t => {
    if (!t.due_date || t.completed) return false;
    return new Date(t.due_date) < new Date();
  }).length;

  const todayTasks = goalTasks.filter(t => {
    if (!t.due_date) return false;
    const today = new Date().toDateString();
    const taskDate = new Date(t.due_date).toDateString();
    return today === taskDate;
  });

  const getTimeToDeadline = () => {
    if (!selectedGoal?.deadline) return null;
    const now = new Date();
    const deadline = new Date(selectedGoal.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (diffDays <= 30) return { text: `${diffDays} days left`, color: 'text-red-600', bgColor: 'bg-red-50' };
    if (diffDays <= 90) return { text: `${Math.ceil(diffDays/30)} months left`, color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { text: `${Math.ceil(diffDays/365)} years left`, color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  const deadlineInfo = getTimeToDeadline();

  if (!selectedGoal) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
        <Target className="w-12 h-12 text-blue-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Achieve Something Great?</h3>
        <p className="text-gray-600">Create your first goal to get started on your journey!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Goal Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
        <div className="w-16 h-16 mx-auto mb-3 relative">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-500"
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-gray-900">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </span>
          </div>
        </div>
        <h3 className="font-semibold text-gray-900">Overall Progress</h3>
        <p className="text-sm text-gray-600">{completedTasks} of {totalTasks} tasks</p>
      </div>

      {/* Skills Count */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <BookOpen className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{goalSkills.length}</h3>
        <p className="text-sm text-gray-600">Skills Learning</p>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6 text-orange-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{todayTasks.length}</h3>
        <p className="text-sm text-gray-600">Due Today</p>
        {overdueTasks > 0 && (
          <p className="text-xs text-red-600 mt-1">{overdueTasks} overdue</p>
        )}
      </div>

      {/* Deadline */}
      <div className={`border rounded-xl p-4 text-center ${deadlineInfo ? deadlineInfo.bgColor : 'bg-gray-50'} ${deadlineInfo ? 'border-current' : 'border-gray-200'}`}>
        <div className="w-12 h-12 bg-white bg-opacity-60 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className={`w-6 h-6 ${deadlineInfo ? deadlineInfo.color : 'text-gray-400'}`} />
        </div>
        <h3 className={`font-semibold ${deadlineInfo ? deadlineInfo.color : 'text-gray-900'}`}>
          {deadlineInfo ? deadlineInfo.text : 'No Deadline'}
        </h3>
        <p className="text-sm text-gray-600">Goal Deadline</p>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function RoadmapClient({ 
  initialGoals, 
  initialSkills, 
  tasks 
}: { 
  initialGoals: Goal[];
  initialSkills: Skill[];
  tasks: Partial<Task>[];
}) {
  const [goals, setGoals] = useState(initialGoals);
  const [skills, setSkills] = useState(initialSkills);
  const [allTasks, setAllTasks] = useState(tasks as Task[]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
    initialGoals.find(g => g.is_primary)?.id || initialGoals[0]?.id || null
  );
  const [pomodoroTask, setPomodoroTask] = useState<Task | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedGoal = goals.find(g => g.id === selectedGoalId);
  const selectedSkills = skills.filter(s => s.goal_id === selectedGoalId);

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        setAllTasks(prev => prev.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        ));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleGenerateTasks = async (skill: Skill) => {
    if (!selectedGoal) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/plan-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          skillName: skill.name, 
          goalTitle: selectedGoal.title 
        }),
      });

      const { tasks: taskTitles } = await response.json();

      const newTasks = taskTitles.map((title: string, index: number) => ({
        title,
        subject: skill.name,
        skill_id: skill.id,
        priority: index < 2 ? 3 : Math.floor(Math.random() * 2) + 1,
        completed: false,
      }));

      const tasksResponse = await fetch('/api/tasks/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: newTasks }),
      });

      if (tasksResponse.ok) {
        const { tasks: createdTasks } = await tasksResponse.json();
        setAllTasks(prev => [...prev, ...createdTasks]);
      }
    } catch (error) {
      console.error('Failed to generate tasks:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Goal Achievement System</h1>
          <p className="text-gray-600 text-lg">Transform your dreams into actionable plans with AI-powered task generation</p>
        </div>

        {/* Goal Selector */}
        {goals.length > 1 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-medium text-gray-900">Working on:</span>
              {goals.map(goal => (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedGoalId === goal.id
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                  }`}
                >
                  {goal.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Smart Dashboard */}
        <SmartDashboard 
          goals={goals}
          skills={skills}
          tasks={allTasks}
          selectedGoalId={selectedGoalId}
        />

        {/* Skills Grid */}
        {selectedSkills.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedSkills.map(skill => (
              <EnhancedSkillCard
                key={skill.id}
                skill={skill}
                tasks={allTasks}
                goalTitle={selectedGoal?.title || ''}
                onGenerateTasks={() => handleGenerateTasks(skill)}
                onDeleteSkill={() => {}} // Implement if needed
                onTaskUpdate={handleTaskUpdate}
                onStartPomodoro={(task) => setPomodoroTask(task)}
                isGenerating={isGenerating}
              />
            ))}
          </div>
        )}

        {/* Add first goal CTA */}
        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Achieve Something Great?</h2>
            <p className="text-gray-600 mb-6">Start by creating your first life goal</p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
              Create Your First Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}