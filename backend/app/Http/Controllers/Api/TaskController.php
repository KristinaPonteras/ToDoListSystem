<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    // Display all tasks belonging to the logged-in user.
    public function index(Request $request)
    {
        $tasks = Task::with('category')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'tasks' => $tasks,
        ]);
    }

    // Create a new task.
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')
                    ->where('user_id', $request->user()->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'status' => ['sometimes', Rule::in(['pending', 'completed'])],
        ]);

        $validated['user_id'] = $request->user()->id;

        $validated['completed_at'] =
            ($validated['status'] ?? 'pending') === 'completed'
            ? now()
            : null;

        $task = Task::create($validated);

        return response()->json([
            'message' => 'Task created successfully.',
            'task' => $task->load('category'),
        ], 201);
    }

    // Display one task.
    public function show(Request $request, string $id)
    {
        $task = Task::with('category')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json([
            'task' => $task,
        ]);
    }

    // Update an existing task.
    public function update(Request $request, string $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $validated = $request->validate([
            'category_id' => [
                'sometimes',
                'nullable',
                Rule::exists('categories', 'id')
                    ->where('user_id', $request->user()->id),
            ],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'due_date' => ['sometimes', 'nullable', 'date'],
            'due_time' => ['sometimes', 'nullable', 'date_format:H:i'],
            'priority' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high'])],
            'status' => ['sometimes', 'required', Rule::in(['pending', 'completed'])],
        ]);

        if (isset($validated['status'])) {
            $validated['completed_at'] =
                $validated['status'] === 'completed'
                ? ($task->completed_at ?? now())
                : null;
        }

        $task->update($validated);

        return response()->json([
            'message' => 'Task updated successfully.',
            'task' => $task->fresh()->load('category'),
        ]);
    }

    // Delete a task.
    public function destroy(Request $request, string $id)
    {
        $task = Task::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully.',
        ]);
    }
}