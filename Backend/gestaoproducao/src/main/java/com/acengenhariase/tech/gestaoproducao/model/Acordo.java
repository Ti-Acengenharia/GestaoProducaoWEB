package com.acengenhariase.tech.gestaoproducao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "acordos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Acordo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "O nome do serviço é obrigatório")
    @Column(name = "nome_servico", nullable = false)
    private String nomeServico;

    @NotNull(message = "O valor é obrigatório")
    @Positive(message = "O valor deve ser positivo")
    @Column(nullable = false)
    private Float valor;

    @NotNull(message = "A indicação de permitir equipe é obrigatória")
    @Column(name = "permitir_equipe", nullable = false)
    private Boolean permitirEquipe;

    @NotNull(message = "A unidade é obrigatória")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "unidade_id", nullable = false)
    private Unidade unidade;
}
