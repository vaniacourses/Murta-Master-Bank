package br.uff.ic.mmbank.dto;

public record ConfirmVerificationRequestDto(
        Long verificationId,
        String code
) {}
