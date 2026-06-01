package br.uff.ic.mmbank.security;

import br.uff.ic.mmbank.model.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Em produção, isso viria do application.properties / .env
    private static final String SECRET_KEY = "MMBANK_SUPER_SECRETO_2026";
    private static final String ISSUER = "MMBank API";

    public String gerarToken(Usuario usuario) {
        Algorithm algoritmo = Algorithm.HMAC256(SECRET_KEY);

        return JWT.create()
                .withIssuer(ISSUER)
                .withSubject(usuario.getEmail())
                .withClaim("role", usuario.getRole().name())
                .withExpiresAt(gerarDataExpiracao())
                .sign(algoritmo);
    }

    private Instant gerarDataExpiracao() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}