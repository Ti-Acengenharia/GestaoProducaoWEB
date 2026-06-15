package com.acengenhariase.tech.gestaoproducao.controller;

import com.acengenhariase.tech.gestaoproducao.dto.LocalServicoDTO;
import com.acengenhariase.tech.gestaoproducao.service.LocalServicoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locais-servico")
@CrossOrigin(origins = "*")
public class LocalServicoController {

    @Autowired
    private LocalServicoService service;

    @GetMapping
    public ResponseEntity<List<LocalServicoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalServicoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<LocalServicoDTO> criar(@Valid @RequestBody LocalServicoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LocalServicoDTO> atualizar(@PathVariable Integer id, @Valid @RequestBody LocalServicoDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarTodos() {
        service.deletarTodos();
        return ResponseEntity.noContent().build();
    }
}
