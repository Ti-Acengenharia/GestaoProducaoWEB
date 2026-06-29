package com.acengenhariase.tech.gestaoproducao;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.io.File;
import java.nio.file.Files;

@SpringBootApplication
public class GestaoproducaoApplication {

	public static void main(String[] args) {
		loadEnv();
		SpringApplication.run(GestaoproducaoApplication.class, args);
	}

	private static void loadEnv() {
		if (System.getenv("GOOGLE_CLIENT_ID") != null) {
			return; // Running in docker or environment is already configured
		}
		try {
			File envFile = new File(".env");
			if (!envFile.exists()) {
				envFile = new File("../.env");
			}
			if (!envFile.exists()) {
				envFile = new File("../../.env");
			}
			if (envFile.exists()) {
				Files.lines(envFile.toPath())
					.map(String::trim)
					.filter(line -> !line.isEmpty() && !line.startsWith("#") && line.contains("="))
					.forEach(line -> {
						int idx = line.indexOf('=');
						String key = line.substring(0, idx).trim();
						String value = line.substring(idx + 1).trim();
						if (value.startsWith("\"") && value.endsWith("\"")) {
							value = value.substring(1, value.length() - 1);
						} else if (value.startsWith("'") && value.endsWith("'")) {
							value = value.substring(1, value.length() - 1);
						}
						
						// Rewrite DB_HOST to localhost if running outside Docker on Windows host
						if ("DB_HOST".equals(key) && "mariadb".equals(value)) {
							value = "localhost";
						}
						
						if (System.getProperty(key) == null && System.getenv(key) == null) {
							System.setProperty(key, value);
						}
					});
			}
		} catch (Exception e) {
			System.err.println("Could not load environment variables from .env file: " + e.getMessage());
		}
	}

}
