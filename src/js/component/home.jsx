import React, { useState, useEffect } from "react";

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const user_name = "Pablo_Teran";

    const fetchUsers = async () => {
        const response = await fetch(`https://playground.4geeks.com/todo/users/${user_name}`);
        if (response.ok) {
            const data = await response.json();
            setTodos(data.todos || []); 
        } else {
            console.error("Error al cargar las tareas del usuario.");
        }
    };

    const syncTodosWithServer = async (todoText) => {
        const response = await fetch(`https://playground.4geeks.com/todo/todos/${user_name}`, {
            method: "POST",
            body: JSON.stringify({
                "label": todoText,
                "is_done": false
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data; 
        } else {
            console.error("Error al sincronizar la tarea.");
            return null;
        }
    };

    const createTodo = async () => {
        if (newTodo.trim() !== "") {
            const newTask = await syncTodosWithServer(newTodo);
            if (newTask) {
                const updatedTodos = [...todos, newTask];
                setTodos(updatedTodos);
                setNewTodo(""); 
                console.log("Tarea creada correctamente."); 
            }
        }
    };

    const deleteTodo = async (todoId) => {
        const response = await fetch(`https://playground.4geeks.com/todo/todos/${todoId}`, {
            method: "DELETE", 
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const updatedTodos = todos.filter(todo => todo.id !== todoId);
            setTodos(updatedTodos);
            console.log("Tarea eliminada correctamente.");
        } else {
            console.error("Error al eliminar la tarea.");
        }
    };

    const deleteAllTodos = async () => {
        setTodos([]);
        await fetch(`https://playground.4geeks.com/todo/users/${user_name}`, {
            method: "DELETE",
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json"
            }
        });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="todo-app">
            <h1 className="title">Todos</h1>
            <input
                type="text"
                placeholder="Añadir una tarea..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === "Enter") createTodo(); 
                }}
            />
            <ul>
                {todos.length > 0 ? (
                    todos.map((todo) => (
                        <li key={todo.id}>
                            {todo.label} {/* Mostrar la tarea usando 'label' que es la propiedad correcta */}
                            <span className="remove-btn" onClick={() => deleteTodo(todo.id)}>✖</span> {/* Ícono de eliminación */}
                        </li>
                    ))
                ) : (
                    <li>No hay tareas, añade tareas</li>
                )}
            </ul>
            <button className="clear-btn" onClick={deleteAllTodos}>Eliminar todas las tareas</button>
            <div className="footer">
                <p>{todos.length} tarea{todos.length !== 1 ? "s" : ""} disponible{todos.length !== 1 ? "s" : ""}</p>
            </div>
        </div>
    );
};

export default Home;
