import React, {useState, useEffect} from 'react';

const API = process.env.REACT_APP_API
function Todos(props) {
    const [todos, setTodos] = useState([])
    const [description, setDescription] = useState('')

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

        await get_todos()
        setDescription('')
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
                                <td>{todo.description}</td>
                                <td>{todo.completed}</td>

                                <td>
                                    <button type="button" className="btn btn-success">Editar</button>
                                    <button type="button" className="btn btn-danger">Eliminar</button>
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
                    <input  type="submit" value="Create"/>
                </form>
            </div>
        </div>
    );
}

export default Todos;