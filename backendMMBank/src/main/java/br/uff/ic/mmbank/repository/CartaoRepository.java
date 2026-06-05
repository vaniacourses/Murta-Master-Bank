package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Cartao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CartaoRepository extends JpaRepository<Cartao, Long> {

    @Query("SELECT c FROM Cartao c WHERE c.numeroCartao = :numeroCartao")
    Optional<Cartao> findByNumeroCartao(@Param("numeroCartao") String numeroCartao);

    @Query("SELECT c FROM Cartao c WHERE c.conta.cliente.id = :clientId")
    List<Cartao> findByClienteId(@Param("clientId") Long clientId);

    List<Cartao> findByContaId(Long contaId);

    boolean existsByNumeroCartao(String numeroCartao);
}
