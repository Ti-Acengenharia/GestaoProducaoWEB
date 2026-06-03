package com.acengenhariase.tech.gestaoproducao.repository;

import com.acengenhariase.tech.gestaoproducao.model.Acordo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AcordoRepository extends JpaRepository<Acordo, Integer> {
    List<Acordo> findByUnidadeId(Integer unidadeId);
}
