package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.enums.StatusConta;
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

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Conta c WHERE c.id = :id")
    Optional<Conta> findByIdForUpdate(@Param("id") Long id);

    // Oculta contas Encerradas
    @Query("SELECT c FROM Conta c WHERE c.statusConta != br.uff.ic.mmbank.model.enums.StatusConta.ENCERRADA")
    List<Conta> findAll();
}