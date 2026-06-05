package br.uff.ic.mmbank.exception;

/**
 * Exceção lançada quando uma regra de negócio é violada.
 * Mapeada para HTTP 422 (Unprocessable Entity) no {@link GlobalExceptionHandler}.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String mensagem) {
        super(mensagem);
    }
}
