import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [item, setItem] = useState("")
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("meus-todos")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("meus-todos", JSON.stringify(todos))
  }, [todos])

  function addBtn() {
    if (item.trim() == "") { return }

    setTodos([...todos, { text: item, done: false}])
    setItem("")

  }

  function changeStatus(index) {

    setTodos(
      todos.map((todo, i) =>
      i === index ? { ...todo, done: !todo.done } : todo
      )
    )

  }

  function deleteItem(index) {
    setTodos(todos.filter((_, i) => i !== index))
  }


  return (
    <div>
      <h1>Todo-List</h1>
      <div>
        <table id='todo'>
          <thead>
            <tr>
              <th>Item</th>
              <th>Status</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th><input type="text" value={ item } onChange={ (e) => setItem(e.target.value) } placeholder='Novo item' name='item'/></th>
              <th><input type="checkbox" name="status" disabled/></th>
              <th><input type="button" value="adicionar" name='adicionar' onClick={addBtn}/></th>
            </tr>
            { todos.map((todo, index) => (
              <tr key={index}>
                <td>{ todo.text }</td>
                <td><input type="checkbox" name="done" id="" checked={ todo.done } onChange={() => changeStatus(index)}/> </td>
                <td><input type="button" value="excluir" onClick={() => deleteItem(index)}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}



export default App
