package br.uff.ic.mmbank.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; // <-- ADICIONADO
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <-- ADICIONADO
import org.springframework.web.cors.CorsConfiguration; // <-- ADICIONADO
import org.springframework.web.cors.CorsConfigurationSource; // <-- ADICIONADO
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // <-- ADICIONADO

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final SecurityFilter securityFilter;

    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // 1. ADICIONADO: Ativa a configuração de CORS que criamos ali embaixo
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                // API stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(authorize -> authorize
                        // 2. ADICIONADO: Libera a requisição de teste (Preflight OPTIONS) que o Chrome faz
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Seus endpoints mantidos exatamente iguais:
                        .requestMatchers("/usuarios", "/usuarios/**").permitAll()
                        .requestMatchers("/auth/login").permitAll()
                        .requestMatchers("/webhook/**").permitAll()
                        .requestMatchers("/transferencias/**").permitAll()
                        .requestMatchers("/emprestimos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cartoes/**").permitAll()
                        .requestMatchers("/transacoes/contas/**").permitAll()
                        .requestMatchers("/contas/**", "/transacoes/**").permitAll()
                        .requestMatchers("/contas", "/contas/**").permitAll()
                        .requestMatchers("/contas", "/contas/").permitAll()

                        // qualquer outra rota criada exige autenticacao (como /cartoes/**)
                        .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    // 3. ADICIONADO: Configuração explícita de quem pode acessar a API (o seu React)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // URL do seu Front
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // define BCrypt como algoritmo de criptografia do MMBank
        return new BCryptPasswordEncoder();
    }
}