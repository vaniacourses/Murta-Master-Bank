package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Emprestimo;
import br.uff.ic.mmbank.model.Parcela;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParcelaRepository extends JpaRepository<Parcela, Long> {
}
