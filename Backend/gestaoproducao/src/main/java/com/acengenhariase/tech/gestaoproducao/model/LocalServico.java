package com.acengenhariase.tech.gestaoproducao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "locais_servico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocalServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "O nome do local é obrigatório")
    @Column(name = "nome_local", nullable = false)
    private String nomeLocal;

    @NotBlank(message = "O tipo do local é obrigatório")
    @Column(name = "tipo_local", nullable = false)
    private String tipoLocal;

    @Column(name = "detalhes_local")
    private String detalhesLocal;
}
