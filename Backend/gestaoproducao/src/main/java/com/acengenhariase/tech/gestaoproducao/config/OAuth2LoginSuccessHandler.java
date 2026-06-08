package com.acengenhariase.tech.gestaoproducao.config;

import com.acengenhariase.tech.gestaoproducao.service.UsuarioService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UsuarioService usuarioService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        
        String email = oauthUser.getAttribute("email");
        String nome = oauthUser.getAttribute("name");
        String googleId = oauthUser.getAttribute("sub");
        String picture = oauthUser.getAttribute("picture");

        // Salva ou atualiza o usuário no banco de dados assim que o login é bem sucedido
        usuarioService.processOAuthPostLogin(email, nome, googleId, picture);

        // Redireciona para o frontend após o sucesso (ajuste a URL se necessário)
        response.sendRedirect("http://localhost:5173/dashboard");
    }
}
