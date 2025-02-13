export type ITodoTask = {
    id: string;
    title: string;
    description: string;
    status: "todo" | "inProgress" | "completed";
    completed: boolean;
    tags: string; // ✅ Required
    deadline: Date; // ✅ Required
    reminder_time: Date; // ✅ Required
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};
