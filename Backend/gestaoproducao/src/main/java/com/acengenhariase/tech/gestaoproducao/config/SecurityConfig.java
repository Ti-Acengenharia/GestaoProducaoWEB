package com.acengenhariase.tech.gestaoproducao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private OAuth2LoginSuccessHandler oauth2LoginSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilita CSRF para facilitar testes iniciais
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/usuarios/registro", "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll() // Libera Registro e Swagger
                .anyRequest().authenticated() // Exige autenticação para o resto
            )
            .formLogin(withDefaults())
            .oauth2Login(oauth2 -> oauth2
                .successHandler(oauth2LoginSuccessHandler)
            );

        return http.build();
    }
}
