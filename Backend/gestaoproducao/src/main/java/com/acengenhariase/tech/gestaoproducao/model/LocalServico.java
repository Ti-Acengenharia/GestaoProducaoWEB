package com.acengenhariase.tech.gestaoproducao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "O nível 01 é obrigatório")
    @Column(name = "nivel_01", nullable = false)
    private String nivel01;

    @Column(name = "nivel_02")
    private String nivel02;

    @Column(name = "nivel_03")
    private String nivel03;

    @NotNull(message = "O centro de custo é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_centro_de_custo", nullable = false)
    private CentroDeCusto centroDeCusto;
}
