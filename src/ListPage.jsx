import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";



export default function ListPage() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [listId, setListId] = useState(id)
    const STORAGE_KEY = `meus-todos:${id}`


    useEffect(() => {
        if (!id) {
            const newId = crypto.randomUUID()
            setListId(newId)
            navigate(`/list/${newId}`, { replace: true })
        } else {
            setListId(id)
        }
    }, [id, navigate])

    const [item, setItem] = useState("")
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }, [todos, STORAGE_KEY])

    function addBtn() {
        if (item.trim() === "") return;
        setTodos([...todos, { text: item, done: false }]);
        setItem("");
    }

    function changeStatus(index) {
        setTodos(todos.map((t, i) => (i === index ? { ...t, done: !t.done } : t)));
    }

    function deleteItem(index) {
        setTodos(todos.filter((_, i) => i !== index));
    }

    function clearStorage() {
        localStorage.removeItem(STORAGE_KEY);
        setTodos([]);
    }

    const shareUrl = `${location.origin}/list/${listId}`

    return (
        <div>
        <h1>Todo-List — {listId}</h1>

        <p>
            Compartilhe este link: <a href={shareUrl}>{shareUrl}</a>
        </p>
        <p><Link to="/">voltar</Link></p>

        <table id="todo" cellPadding="8">
            <thead>
            <tr>
                <th>Item</th>
                <th>Status</th>
                <th> </th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th>
                <input
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="Novo item"
                    name="item"
                />
                </th>
                <th><input type="checkbox" name="status" disabled /></th>
                <th><input type="button" value="adicionar" onClick={addBtn} /></th>
            </tr>
            {todos.map((todo, index) => (
                <tr key={index}>
                <td style={{ textDecoration: todo.done ? "line-through" : "none" }}>
                    {todo.text}
                </td>
                <td>
                    <input
                    type="checkbox"
                    name="done"
                    checked={todo.done}
                    onChange={() => changeStatus(index)}
                    />
                </td>
                <td>
                    <input type="button" value="excluir" onClick={() => deleteItem(index)} />
                </td>
                </tr>
            ))}
            </tbody>
        </table>

        <div style={{ marginTop: 12 }}>
            <input type="button" value="clear all" onClick={clearStorage} />
        </div>
        </div>
    )
}
