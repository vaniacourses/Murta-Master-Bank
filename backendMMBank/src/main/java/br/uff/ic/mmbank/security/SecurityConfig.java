package br.uff.ic.mmbank.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())

                // API stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(authorize -> authorize
                        // libera os endpoints de usuarios por enquanto
                        .requestMatchers("/usuarios","/usuarios/**").permitAll()
                        .requestMatchers("/auth/login").permitAll()

                        .requestMatchers("/transferencias/**").permitAll()

                        // aualquer outra rota criada exige autenticacao
                        .anyRequest().authenticated()
                )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // define BCrypt como algoritmo de criptografia do MMBank
        return new BCryptPasswordEncoder();
    }
}