package br.uff.ic.mmbank.exception;

/**
 * Exceção lançada quando um recurso solicitado não é encontrado no banco de dados.
 * Mapeada para HTTP 404 no {@link GlobalExceptionHandler}.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String mensagem) {
        super(mensagem);
    }

    public ResourceNotFoundException(String recurso, Long id) {
        super(String.format("%s com ID %d não encontrado(a).", recurso, id));
    }
}
