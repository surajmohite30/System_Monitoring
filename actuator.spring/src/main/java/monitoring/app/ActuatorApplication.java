package monitoring.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@SpringBootApplication
public class ActuatorApplication {
	@CrossOrigin(origins="http://localhost:4200")
	public static void main(String[] args) {
		SpringApplication.run(ActuatorApplication.class, args);
		
	}
}
