package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Conta;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContaRepository extends JpaRepository<Conta, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Conta c WHERE c.numeroConta = :numeroConta")
    Optional<Conta> findByNumeroContaForUpdate(@Param("numeroConta") String numeroConta);
    boolean existsByNumeroConta(String numeroConta);

    // Oculta contas Encerradas
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Conta c WHERE c.id = :id AND c.statusConta != br.uff.ic.mmbank.model.enums.StatusConta.ENCERRADA")
    Optional<Conta> findByIdForUpdate(@Param("id") Long id);

    Optional<Conta> findByNumeroConta(String numeroConta);

    Optional<Conta> findByClienteId(Long clienteId);

    // Busca as contas do cliente ignorando as que estão com status ENCERRADA
    @Query("SELECT c FROM Conta c WHERE c.cliente.id = :clienteId AND c.statusConta != br.uff.ic.mmbank.model.enums.StatusConta.ENCERRADA")
    List<Conta> findAllByClienteId(@Param("clienteId") Long clienteId);
}