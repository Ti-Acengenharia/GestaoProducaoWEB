package com.acengenhariase.tech.gestaoproducao.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalServicoDTO {

    private Integer id;

    @NotBlank(message = "O nome do local é obrigatório")
    private String nomeLocal;

    @NotBlank(message = "O tipo do local é obrigatório")
    private String tipoLocal;

    private String detalhesLocal;
}
