import { trpcCaller } from "@/utils/trpcServer";

const Home = async () => {
    const data = await trpcCaller.todo.getAllTodos();

    return (
        <div>
            <h1>Todo List</h1>
            <ul>
                {data?.map((todo) => (
                    <li key={todo.id}>{todo.title}</li>
                ))}
            </ul>
        </div>
    );
};
export default Home;
