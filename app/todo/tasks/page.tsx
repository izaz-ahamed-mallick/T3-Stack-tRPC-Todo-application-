"use client";

import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
    DroppableProvided,
    DroppableStateSnapshot,
} from "@hello-pangea/dnd";

import TaskItem from "@/app/components/todo/TaskItems";
import AddTaskModal from "@/app/components/todo/AddTaskModal";
import { trpc } from "@/utils/trpcClient";
import ShimmerLoader from "@/utils/ShimmerLoader";
import { ITodoTask } from "@/types/todoItem";

export interface ItaskGroups {
    todo: ITodoTask[];
    inProgress: ITodoTask[];
    completed: ITodoTask[];
}

const MyTask = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {
        data: tasks = [],
        refetch,
        isLoading,
    } = trpc.todo.getAll.useQuery<ITodoTask[]>();
    const updateStatus = trpc.todo.updateStatus.useMutation({
        onSuccess: () => refetch(),
    });

    const [taskGroups, setTaskGroups] = useState<ItaskGroups>({
        todo: [],
        inProgress: [],
        completed: [],
    });

    useEffect(() => {
        if (!tasks.length) return;

        const uniqueTasks = Array.from(
            new Map(tasks.map((task) => [task.id, task])).values()
        );

        const groupedTasks: ItaskGroups = {
            todo: uniqueTasks.filter((task) => task.status === "todo"),
            inProgress: uniqueTasks.filter(
                (task) => task.status === "inProgress"
            ),
            completed: uniqueTasks.filter(
                (task) => task.status === "completed"
            ),
        };

        setTaskGroups(groupedTasks);
    }, [tasks]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }

        setTaskGroups((prev) => {
            const sourceList = [
                ...prev[source.droppableId as keyof ItaskGroups],
            ];
            const destinationList =
                source.droppableId === destination.droppableId
                    ? sourceList
                    : [...prev[destination.droppableId as keyof ItaskGroups]];

            // Extract the moved task
            const [movedTask] = sourceList.splice(source.index, 1);

            // If moving to a different column, update task status
            if (source.droppableId !== destination.droppableId) {
                movedTask.status = destination.droppableId as
                    | "todo"
                    | "inProgress"
                    | "completed";
            }

            // Insert task at new position in the destination column
            destinationList.splice(destination.index, 0, movedTask);

            return {
                ...prev,
                [source.droppableId]: sourceList,
                [destination.droppableId]: destinationList,
            };
        });

        // Optimistically update the backend after state update
        updateStatus.mutate({
            id: result.draggableId,
            status: destination.droppableId as
                | "todo"
                | "inProgress"
                | "completed",
        });
    };

    return (
        <div className="min-h-screen p-6 flex flex-col overflow-hidden  bg-gradient-to-t from-gray-200 via-gray-300 to-white text-black dark:bg-gradient-to-t dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:text-white transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Tasks</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 mr-10 rounded-lg"
                >
                    <FiPlus /> Add Task
                </button>
            </div>

            {isLoading ? (
                <ShimmerLoader />
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.entries(taskGroups).map(
                            ([status, taskList]) => (
                                <Droppable key={status} droppableId={status}>
                                    {(
                                        provided: DroppableProvided,
                                        snapshot: DroppableStateSnapshot
                                    ) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`p-4 rounded-lg min-h-[300px] transition-all ${
                                                snapshot.isDraggingOver
                                                    ? "bg-gray-300 dark:bg-gray-700"
                                                    : "bg-gray-500 dark:bg-gray-800"
                                            }`}
                                        >
                                            <h2 className="text-xl font-semibold mb-3 capitalize">
                                                {status.replace(
                                                    /([A-Z])/g,
                                                    " $1"
                                                )}
                                            </h2>
                                            {taskList.length === 0 ? (
                                                <p className="text-gray-400 text-center">
                                                    No tasks available
                                                </p>
                                            ) : (
                                                taskList.map(
                                                    (
                                                        task: ITodoTask,
                                                        index: number
                                                    ) => (
                                                        <Draggable
                                                            key={task.id}
                                                            draggableId={
                                                                task.id
                                                            }
                                                            index={index}
                                                        >
                                                            {(
                                                                provided,
                                                                snapshot
                                                            ) => (
                                                                <div
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={`mb-2 transition-all ${
                                                                        snapshot.isDragging
                                                                            ? "scale-105 shadow-xl"
                                                                            : ""
                                                                    }  `}
                                                                    style={{
                                                                        ...provided
                                                                            .draggableProps
                                                                            .style,
                                                                        maxWidth:
                                                                            "100%",
                                                                    }}
                                                                >
                                                                    <TaskItem
                                                                        task={
                                                                            task
                                                                        }
                                                                        setTaskGroups={
                                                                            setTaskGroups
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    )
                                                )
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            )
                        )}
                    </div>
                </DragDropContext>
            )}

            {/* Add Task Modal */}
            {isModalOpen && (
                <AddTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={refetch}
                />
            )}
        </div>
    );
};

export default MyTask;
