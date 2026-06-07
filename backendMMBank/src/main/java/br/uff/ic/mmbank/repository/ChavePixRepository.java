package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.ChavePix;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChavePixRepository extends JpaRepository<ChavePix, Long> {
    Optional<ChavePix> findByChave(String chave);
    List<ChavePix> findByContaId(Long contaId);
    boolean existsByChave(String chave);
}
