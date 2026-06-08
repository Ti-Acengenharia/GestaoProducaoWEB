package com.acengenhariase.tech.gestaoproducao.controller;

import com.acengenhariase.tech.gestaoproducao.model.Usuario;
import com.acengenhariase.tech.gestaoproducao.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // Endpoint para registrar um usuário comum (email/senha)
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        return ResponseEntity.ok(usuarioService.cadastrarUsuarioComum(usuario));
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
