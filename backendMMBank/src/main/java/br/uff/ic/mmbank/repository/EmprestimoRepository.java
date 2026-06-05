package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.Conta;
import br.uff.ic.mmbank.model.Emprestimo;
import br.uff.ic.mmbank.model.enums.StatusEmprestimo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmprestimoRepository extends JpaRepository<Emprestimo, Long> {

    @Query("""
           SELECT e
           FROM Emprestimo e
           LEFT JOIN FETCH e.parcelas
           WHERE e.id = :id
           """)
    Optional<Emprestimo> buscarPorIdComParcelas(Long id);

    @Query("""
           SELECT DISTINCT e
           FROM Emprestimo e
           LEFT JOIN FETCH e.parcelas
           """)
    List<Emprestimo> listarComParcelas();

    @Query("""
            SELECT DISTINCT e
            FROM Emprestimo e
            LEFT JOIN FETCH e.parcelas
            WHERE e.conta.id = :contaId
            """)
    List<Emprestimo> buscarPorContaId(Long contaId);




}
