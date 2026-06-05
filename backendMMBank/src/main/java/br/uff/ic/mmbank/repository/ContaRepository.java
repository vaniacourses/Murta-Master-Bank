package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Emprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContaRepository extends JpaRepository<Conta, Long> {
}
