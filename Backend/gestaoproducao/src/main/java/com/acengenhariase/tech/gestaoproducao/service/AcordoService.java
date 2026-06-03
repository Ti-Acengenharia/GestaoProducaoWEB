package com.acengenhariase.tech.gestaoproducao.service;

import com.acengenhariase.tech.gestaoproducao.dto.AcordoDTO;
import com.acengenhariase.tech.gestaoproducao.model.Acordo;
import com.acengenhariase.tech.gestaoproducao.model.Unidade;
import com.acengenhariase.tech.gestaoproducao.repository.AcordoRepository;
import com.acengenhariase.tech.gestaoproducao.repository.UnidadeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcordoService {

    @Autowired
    private AcordoRepository repository;

    @Autowired
    private UnidadeRepository unidadeRepository;

    @Transactional(readOnly = true)
    public List<AcordoDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AcordoDTO buscarPorId(Integer id) {
        Acordo acordo = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acordo não encontrado com o ID: " + id));
        return toDTO(acordo);
    }

    @Transactional
    public AcordoDTO criar(AcordoDTO dto) {
        Unidade unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada com o ID: " + dto.getUnidadeId()));
        
        Acordo acordo = fromDTO(dto);
        acordo.setId(null);
        acordo.setUnidade(unidade);
        
        return toDTO(repository.save(acordo));
    }

    @Transactional
    public AcordoDTO atualizar(Integer id, AcordoDTO dto) {
        Acordo acordoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acordo não encontrado com o ID: " + id));

        Unidade unidade = unidadeRepository.findById(dto.getUnidadeId())
                .orElseThrow(() -> new RuntimeException("Unidade não encontrada com o ID: " + dto.getUnidadeId()));

        BeanUtils.copyProperties(dto, acordoExistente, "id");
        acordoExistente.setUnidade(unidade);

        return toDTO(repository.save(acordoExistente));
    }

    @Transactional
    public void deletar(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Não é possível deletar. Acordo não encontrado com o ID: " + id);
        }
        repository.deleteById(id);
    }

    private AcordoDTO toDTO(Acordo acordo) {
        AcordoDTO dto = new AcordoDTO();
        BeanUtils.copyProperties(acordo, dto);
        if (acordo.getUnidade() != null) {
            dto.setUnidadeId(acordo.getUnidade().getId());
            dto.setUnidadeNome(acordo.getUnidade().getNome());
        }
        return dto;
    }

    private Acordo fromDTO(AcordoDTO dto) {
        Acordo acordo = new Acordo();
        BeanUtils.copyProperties(dto, acordo);
        return acordo;
    }
}
