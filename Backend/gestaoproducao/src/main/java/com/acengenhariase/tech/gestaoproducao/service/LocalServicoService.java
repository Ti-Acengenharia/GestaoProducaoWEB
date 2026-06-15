package com.acengenhariase.tech.gestaoproducao.service;

import com.acengenhariase.tech.gestaoproducao.dto.LocalServicoDTO;
import com.acengenhariase.tech.gestaoproducao.model.LocalServico;
import com.acengenhariase.tech.gestaoproducao.model.CentroDeCusto;
import com.acengenhariase.tech.gestaoproducao.repository.LocalServicoRepository;
import com.acengenhariase.tech.gestaoproducao.repository.CentroDeCustoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocalServicoService {

    @Autowired
    private LocalServicoRepository repository;

    @Autowired
    private CentroDeCustoRepository centroDeCustoRepository;

    @Transactional(readOnly = true)
    public List<LocalServicoDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public LocalServicoDTO buscarPorId(Integer id) {
        LocalServico local = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local de serviço não encontrado com o ID: " + id));
        return toDTO(local);
    }

    @Transactional
    public LocalServicoDTO criar(LocalServicoDTO dto) {
        LocalServico local = fromDTO(dto);
        local.setId(null);
        return toDTO(repository.save(local));
    }

    @Transactional
    public LocalServicoDTO atualizar(Integer id, LocalServicoDTO dto) {
        LocalServico localExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local de serviço não encontrado com o ID: " + id));

        localExistente.setNivel01(dto.getNivel01());
        localExistente.setNivel02(dto.getNivel02());
        localExistente.setNivel03(dto.getNivel03());
        
        if (dto.getCentroDeCustoId() != null) {
            CentroDeCusto cc = centroDeCustoRepository.findById(dto.getCentroDeCustoId())
                    .orElseThrow(() -> new RuntimeException("Centro de custo não encontrado com o ID: " + dto.getCentroDeCustoId()));
            localExistente.setCentroDeCusto(cc);
        } else {
            throw new RuntimeException("O centro de custo é obrigatório");
        }

        return toDTO(repository.save(localExistente));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Não é possível deletar. Local de serviço não encontrado com o ID: " + id);
        }
        repository.deleteById(id);
    }

    private LocalServicoDTO toDTO(LocalServico local) {
        LocalServicoDTO dto = new LocalServicoDTO();
        dto.setId(local.getId());
        dto.setNivel01(local.getNivel01());
        dto.setNivel02(local.getNivel02());
        dto.setNivel03(local.getNivel03());
        if (local.getCentroDeCusto() != null) {
            dto.setCentroDeCustoId(local.getCentroDeCusto().getId());
            dto.setCentroDeCustoNome(local.getCentroDeCusto().getNome());
        }
        return dto;
    }

    private LocalServico fromDTO(LocalServicoDTO dto) {
        LocalServico local = new LocalServico();
        local.setId(dto.getId());
        local.setNivel01(dto.getNivel01());
        local.setNivel02(dto.getNivel02());
        local.setNivel03(dto.getNivel03());
        if (dto.getCentroDeCustoId() != null) {
            CentroDeCusto cc = centroDeCustoRepository.findById(dto.getCentroDeCustoId())
                    .orElseThrow(() -> new RuntimeException("Centro de custo não encontrado com o ID: " + dto.getCentroDeCustoId()));
            local.setCentroDeCusto(cc);
        } else {
            throw new RuntimeException("O centro de custo é obrigatório");
        }
        return local;
    }
}
