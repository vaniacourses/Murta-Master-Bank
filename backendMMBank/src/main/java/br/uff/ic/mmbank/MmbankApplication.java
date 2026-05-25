package br.uff.ic.mmbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class MmbankApplication {

	public static void main(String[] args) {
		SpringApplication.run(MmbankApplication.class, args);
	}

}
