import { useForm } from "react-hook-form";
import { trpc } from "@/utils/trpcClient";
import { toast } from "react-hot-toast";

interface IAddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
}

interface ITaskFormInput {
    title: string;
    description: string;
}

const AddTaskModal = ({ isOpen, onClose, onSave }: IAddTaskModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ITaskFormInput>();

    const createTask = trpc.todo.create.useMutation({
        onSuccess: () => {
            toast.success("Task added!");
            reset();
            onClose();
            onSave();
        },
        onError: () => toast.error("Failed to add task"),
    });

    const onSubmit = (data: ITaskFormInput) => {
        createTask.mutate(data);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-lg font-bold mb-4">Add Task</h2>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Title"
                            {...register("title", {
                                required: "Title is required",
                            })}
                            className="p-2 rounded bg-gray-700 text-white"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm">
                                {errors.title.message}
                            </p>
                        )}

                        <textarea
                            placeholder="Description"
                            {...register("description", {
                                required: "Description is required",
                            })}
                            className="p-2 rounded bg-gray-700 text-white"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm">
                                {errors.description.message}
                            </p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-green-600 px-4 py-2 rounded"
                        >
                            Add Task
                        </button>
                    </form>
                </div>
            </div>
        )
    );
};

export default AddTaskModal;
