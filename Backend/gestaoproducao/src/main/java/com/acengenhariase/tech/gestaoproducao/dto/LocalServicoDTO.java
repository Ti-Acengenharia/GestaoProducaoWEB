package com.acengenhariase.tech.gestaoproducao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalServicoDTO {

    private Integer id;

    @NotBlank(message = "O nível 01 é obrigatório")
    private String nivel01;

    private String nivel02;

    private String nivel03;

    @NotNull(message = "O centro de custo é obrigatório")
    private Integer centroDeCustoId;

    private String centroDeCustoNome;
}
