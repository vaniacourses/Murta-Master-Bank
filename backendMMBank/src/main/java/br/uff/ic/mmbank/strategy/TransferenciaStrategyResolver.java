package br.uff.ic.mmbank.strategy;

import br.uff.ic.mmbank.model.enums.TipoTransacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class TransferenciaStrategyResolver {

    private final Map<TipoTransacao, TransferenciaStrategy> strategies;

    @Autowired
    public TransferenciaStrategyResolver(List<TransferenciaStrategy> strategyList) {
        this.strategies = strategyList.stream()
                .collect(Collectors.toMap(TransferenciaStrategy::getTipo, Function.identity()));
    }

    public TransferenciaStrategy getStrategy(TipoTransacao tipo) {
        TransferenciaStrategy strategy = strategies.get(tipo);
        if (strategy == null) {
            throw new IllegalArgumentException("Nenhuma estratégia encontrada para o tipo: " + tipo);
        }
        return strategy;
    }
}