export type ITodoTask = {
    id: string;
    title: string;
    description: string;
    status: "todo" | "inProgress" | "completed";
    completed: boolean;
    tags: string;
    deadline: Date;
    reminder_time: Date;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};
