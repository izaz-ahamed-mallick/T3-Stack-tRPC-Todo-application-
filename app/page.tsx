import { trpcCaller } from "@/utils/trpcServer";
import SignupPage from "./auth/signup/page";
import Link from "next/link";

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
            <SignupPage />

            <Link href={"/auth/login"}>Login</Link>
        </div>
    );
};
export default Home;
