import { useError } from "@/contexts/ErrorContext";
import '../styles/erroNotification.css'

/**
 * Componente que exibe notificações de erro globais
 */
const ErrorNotification = () => {
    const { errors, removeError } = useError();
    
    if (errors.length === 0) return null;
    
    return (
      <div className="error-container">
        {errors.map((error) => (
          <div 
            key={error.id} 
            className={`error-message ${error.tipo || 'error'}`}
            onClick={() => removeError(error)}
          >
            {error.menssagem}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                removeError(error);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  export default ErrorNotification;