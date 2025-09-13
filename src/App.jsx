import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  function newList() {
    const id = crypto.randomUUID();
    navigate(`/list/${id}`);
  }
  return (
    <div>
      <h1>Todo-List</h1>
      <button onClick={newList}>Criar nova lista</button>
    </div>
  );
}
