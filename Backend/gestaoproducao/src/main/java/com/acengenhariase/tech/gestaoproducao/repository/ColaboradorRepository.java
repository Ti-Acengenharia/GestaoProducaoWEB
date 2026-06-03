package com.acengenhariase.tech.gestaoproducao.repository;

import com.acengenhariase.tech.gestaoproducao.model.Colaborador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColaboradorRepository extends JpaRepository<Colaborador, Integer> {
    
    // Método adicional útil para verificar se já existe um CPF cadastrado
    Optional<Colaborador> findByCpf(String cpf);
    
    // O JpaRepository já fornece:
    // save(colaborador) -> Create e Update
    // findAll()         -> Read (Lista todos)
    // findById(id)      -> Read (Busca por ID)
    // deleteById(id)    -> Delete
}
