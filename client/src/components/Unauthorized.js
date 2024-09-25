import { useNavigate } from "react-router-dom"
import './Unauthorized.css'

//TODO: CSS
function Unauthorized() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  };

  return (
    <section className="unathourized-page">
      <h1 className="header-center">Unauthorized</h1>
      <p className="left-p">You do not have access to the requested page.</p>
      <button className="classic-button" onClick={goBack}>Go Back</button>
    </section>
  )
}

export default Unauthorized
