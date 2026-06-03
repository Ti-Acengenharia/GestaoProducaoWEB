package com.acengenhariase.tech.gestaoproducao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AcordoDTO {

    private Integer id;

    @NotBlank(message = "O nome do serviço é obrigatório")
    private String nomeServico;

    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser positivo")
    private Float valor;

    @NotNull(message = "A indicação de permitir equipe é obrigatória")
    private Boolean permitirEquipe;

    @NotNull(message = "O ID da unidade é obrigatório")
    private Integer unidadeId;

    // Campo opcional para retorno na API (facilita o frontend)
    private String unidadeNome;
}
