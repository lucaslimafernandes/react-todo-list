import { useNavigate } from "react-router-dom";
import { HealthCheckButton } from "./HealthyCheck"

export default function App() {
  const navigate = useNavigate();
  function newList() {
    const id = crypto.randomUUID();
    navigate(`/list/${id}`);
  }
  return (
    <div>
      <h1>Todo-List</h1>
      <div className="p-6">
        <HealthCheckButton url="http://localhost:8000/health" intervalMs={10000} timeoutMs={4000} />
      </div>

      <button onClick={newList}>Criar nova lista</button>
    </div>
  );
}
