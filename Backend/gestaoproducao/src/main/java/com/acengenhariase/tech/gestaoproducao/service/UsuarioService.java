package com.acengenhariase.tech.gestaoproducao.service;

import com.acengenhariase.tech.gestaoproducao.model.Usuario;
import com.acengenhariase.tech.gestaoproducao.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario salvar(Usuario usuario) {
        if (usuario.getSenha() != null && !usuario.getSenha().startsWith("$2a$")) {
            usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        }
        if (usuario.getRoles() == null || usuario.getRoles().isEmpty()) {
            usuario.setRoles(Collections.singleton("USER"));
        }
        return usuarioRepository.save(usuario);
    }

    public void deletar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario processOAuthPostLogin(String email, String nome, String googleId, String picture) {
        Optional<Usuario> exist = usuarioRepository.findByEmail(email);

        if (exist.isPresent()) {
            Usuario user = exist.get();
            user.setGoogleId(googleId);
            user.setProfilePicture(picture);
            return usuarioRepository.save(user);
        }

        Usuario newUser = new Usuario();
        newUser.setEmail(email);
        newUser.setNome(nome);
        newUser.setGoogleId(googleId);
        newUser.setProfilePicture(picture);
        newUser.setRoles(Collections.singleton("USER"));
        return usuarioRepository.save(newUser);
    }

    public Usuario cadastrarUsuarioComum(Usuario usuario) {
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        if (usuario.getRoles() == null || usuario.getRoles().isEmpty()) {
            usuario.setRoles(Collections.singleton("USER"));
        }
        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
}
