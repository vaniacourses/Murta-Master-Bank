package br.uff.ic.mmbank.repository;

import br.uff.ic.mmbank.model.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
    Optional<VerificationCode> findByIdAndUsedFalse(Long id);
}
