package com.acengenhariase.tech.gestaoproducao.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
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
            )
            .logout(logout -> logout
                .logoutUrl("/api/logout")
                .logoutSuccessHandler((request, response, authentication) -> {
                    response.setStatus(HttpServletResponse.SC_OK);
                })
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );
        return http.build();

}

    @Bean
    public org.springframework.security.oauth2.client.registration.ClientRegistrationRepository clientRegistrationRepository() {
        org.springframework.security.oauth2.core.AuthorizationGrantType authorizationGrantType = org.springframework.security.oauth2.core.AuthorizationGrantType.AUTHORIZATION_CODE;
        org.springframework.security.oauth2.core.ClientAuthenticationMethod clientAuthMethod = org.springframework.security.oauth2.core.ClientAuthenticationMethod.CLIENT_SECRET_BASIC;
        org.springframework.security.oauth2.client.registration.ClientRegistration registration = org.springframework.security.oauth2.client.registration.ClientRegistration
                .withRegistrationId("google")
                .clientId(System.getenv("GOOGLE_CLIENT_ID"))
                .clientSecret(System.getenv("GOOGLE_CLIENT_SECRET"))
                .clientAuthenticationMethod(clientAuthMethod)
                .authorizationGrantType(authorizationGrantType)
                .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
                .scope("profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://oauth2.googleapis.com/token")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName("sub")
                .clientName("Google")
                .build();
        return new org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository(registration);
    }
}

