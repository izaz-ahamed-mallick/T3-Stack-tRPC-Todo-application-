export interface ITodoTask {
    id: string;
    title: string;
    description: string | null;

    createdAt: Date;
    updatedAt: Date;
    userId: string;
    status: "todo" | "inProgress" | "completed";
}
