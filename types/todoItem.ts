export interface ITodoTask {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: "todo" | "inProgress" | "completed";
}
