package com.acengenhariase.tech.gestaoproducao.service;

import com.acengenhariase.tech.gestaoproducao.dto.LocalServicoDTO;
import com.acengenhariase.tech.gestaoproducao.model.LocalServico;
import com.acengenhariase.tech.gestaoproducao.repository.LocalServicoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocalServicoService {

    @Autowired
    private LocalServicoRepository repository;

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

        BeanUtils.copyProperties(dto, localExistente, "id");
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
        BeanUtils.copyProperties(local, dto);
        return dto;
    }

    private LocalServico fromDTO(LocalServicoDTO dto) {
        LocalServico local = new LocalServico();
        BeanUtils.copyProperties(dto, local);
        return local;
    }
}
