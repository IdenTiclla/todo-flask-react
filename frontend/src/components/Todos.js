import React, {useState, useEffect} from 'react';

const API = process.env.REACT_APP_API
function Todos(props) {
    const [todos, setTodos] = useState([])
    const [description, setDescription] = useState('')

    const [editing, setEditing] = useState(false)
    const [id, setId] = useState('')

    const get_todos = async() => {
        const response = await fetch(`${API}/todos`)
        const data = await response.json()
        setTodos(data)
    }

    useEffect(() => {
        get_todos()
    },[])

    const onSubmitForm = async (e) => {
        e.preventDefault()
        if (!editing) {
            const response = await fetch(`${API}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: description
                })
            })
            const data = await response.json()
            console.log(data)
        }
        else {
            const response = await fetch(`${API}/todos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: description
                })
            })
            const data = await response.json()
            console.log(data)
            setEditing(false)
            setId('')
        }

        await get_todos()
        setDescription('')
    }

    const deleteTodo = async (id) => {
        const userResponse = window.confirm("Are you sure you want to delete it?")
        if (userResponse) {
            const response = await fetch(`${API}/todos/${id}`,{
            method: 'DELETE'
            })
            
            const data = await response.json()
            console.log(data)
            await get_todos()
        }
    }

    const checkUncked = async(todo) => {
        const response = await fetch(`${API}/todos/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: !todo.completed
            })
        })
        const data = await response.json()
        console.log(data)

        await get_todos()
    }

    const editTodo = async(id) => {
        const response = await fetch(`${API}/todos/${id}`)
        const data = await response.json()
        console.log(data)

        
        setDescription(data.description)
        setEditing(true)
        setId(id)
    }

    return (
        <div className="row">
            <h1>Todo App</h1>
            <div className="col-md-8">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>id</td>
                            <td>description</td>
                            <td>completed</td>
                            <td>Options</td>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map(todo => (
                            <tr key={todo.id}>
                                <td>{todo.id}</td>
                                <td style={{
                                    textDecoration: todo.completed ? 'line-through': 'none'
                                }}>
                                    {todo.description}
                                </td>
                                <td>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={todo.completed} onChange={() => checkUncked(todo)}/>
                                    </div>
                                </td>

                                <td>
                                    <button type="button" className="btn btn-success" onClick={() => editTodo(todo.id)}>
                                        Editar
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={() => deleteTodo(todo.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="col-md-4">
                <h1>Add Todo</h1>
                <form onSubmit={onSubmitForm}>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    <input 
                        type="submit" 
                        value={ editing ? 'Update': 'Create'}
                    />
                </form>
            </div>
        </div>
    );
}

export default Todos;