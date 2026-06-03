package com.acengenhariase.tech.gestaoproducao.controller;

import com.acengenhariase.tech.gestaoproducao.dto.AcordoDTO;
import com.acengenhariase.tech.gestaoproducao.service.AcordoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/acordos")
@CrossOrigin(origins = "*")
public class AcordoController {

    @Autowired
    private AcordoService service;

    @GetMapping
    public ResponseEntity<List<AcordoDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcordoDTO> buscarPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<AcordoDTO> criar(@Valid @RequestBody AcordoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcordoDTO> atualizar(@PathVariable Integer id, @Valid @RequestBody AcordoDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
