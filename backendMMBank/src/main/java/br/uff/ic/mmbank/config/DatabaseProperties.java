package br.uff.ic.mmbank.config;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@ConfigurationProperties(prefix = "db")
@Validated // Ativa a validação estilo "Zod"
public record DatabaseProperties(
    
    @NotBlank(message = "A URL do banco não pode estar vazia no .env")
    String url,
    
    @NotBlank(message = "O usuário do banco é obrigatório")
    String username,
    
    @NotBlank(message = "A senha do banco é obrigatória")
    String password,
    
    @Min(value = 1024, message = "A porta deve ser maior que 1024")
    @Max(value = 65535, message = "A porta deve ser menor que 65535")
    int port
) {}