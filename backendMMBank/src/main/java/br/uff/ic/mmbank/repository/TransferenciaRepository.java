package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Transacao;
import br.uff.ic.mmbank.model.Transferencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferenciaRepository extends JpaRepository<Transferencia, Long> {

    List<Transferencia> findByContaOrigem(Conta contaOrigem);

    List<Transferencia> findByContaDestino(Conta contaDestino);

    Transferencia findByTransacoesContains(Transacao transacao);
}