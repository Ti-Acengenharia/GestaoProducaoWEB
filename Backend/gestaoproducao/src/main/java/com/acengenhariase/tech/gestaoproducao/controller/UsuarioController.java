package com.acengenhariase.tech.gestaoproducao.controller;

import com.acengenhariase.tech.gestaoproducao.model.Usuario;
import com.acengenhariase.tech.gestaoproducao.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<Usuario>> listar() {
        return ResponseEntity.ok(usuarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscarPorId(@PathVariable Long id) {
        return usuarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Usuario> criar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.salvar(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.buscarPorId(id)
                .map(existente -> {
                    usuario.setId(id);
                    if (usuario.getSenha() == null || usuario.getSenha().isEmpty()) {
                        usuario.setSenha(existente.getSenha());
                    }
                    return ResponseEntity.ok(usuarioService.salvar(usuario));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        usuarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // Endpoint para registrar um usuário comum (email/senha)
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.salvar(usuario));
    }

    // Endpoint para obter dados do usuário logado (Google ou Comum)
    @GetMapping("/me")
    public ResponseEntity<?> getMe(@AuthenticationPrincipal Object principal) {
        if (principal instanceof OAuth2User oauthUser) {
            String email = oauthUser.getAttribute("email");
            String nome = oauthUser.getAttribute("name");
            String googleId = oauthUser.getAttribute("sub");
            String picture = oauthUser.getAttribute("picture");

            Usuario user = usuarioService.processOAuthPostLogin(email, nome, googleId, picture);
            return ResponseEntity.ok(user);
        }
        
        // Se for login via formulário comum, o principal será o email (String) ou UserDetails
        return ResponseEntity.ok(principal);
    }
}
