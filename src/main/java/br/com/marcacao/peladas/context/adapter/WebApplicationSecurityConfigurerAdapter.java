package br.com.marcacao.peladas.context.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import br.com.marcacao.peladas.managedbean.AutenticacaoBean;

@Configuration
@EnableWebSecurity(debug = false)
public class WebApplicationSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		http.authorizeRequests() //
		.antMatchers("/error/*").authenticated() //
		.antMatchers("/private/todasPeladas/listagem.xhtml").authenticated() //
		.antMatchers("/private/todasPeladas/cadastro.xhtml").authenticated() //
		.antMatchers("/private/minhasPeladas/listagem.xhtml").authenticated() //
		.antMatchers("/private/minhasPeladas/cadastro.xhtml").authenticated(); //
		
		http.authorizeRequests() //
		.antMatchers("/**").permitAll() //
		.anyRequest() //
		.authenticated() //
		
		.and()
		
		.formLogin() //
		.loginPage("/login.xhtml") //
		.usernameParameter("mainForm:loginForm:username")
		.passwordParameter("mainForm:loginForm:password")
		.loginProcessingUrl("/login.xhtml") //
		.defaultSuccessUrl("/private/minhasPeladas/listagem.xhtml") //
		.permitAll() //
		.failureUrl("/login.xhtml?error=true") //
		
		.and()
		
	    .exceptionHandling().accessDeniedPage("/error/acessoNegado.xhtml") //
	    
		.and()
		
		.logout().logoutUrl("/logout") //
		.logoutSuccessUrl("/login.xhtml?source=logout") //
		.deleteCookies("JSESSIONID") //
		.invalidateHttpSession(true)
		.clearAuthentication(true)
		.permitAll() //
		
		.and()			
		
		.sessionManagement()
//		.maximumSessions(1)
//		.maxSessionsPreventsLogin(true)
//		
//		.and()			
		
		.sessionAuthenticationErrorUrl("/login.xhtml")
		.invalidSessionUrl("/login.xhtml")	
		
		.and()
		
		.csrf() //
		.disable();
		
	}
	
	@Autowired
	private AutenticacaoBean users;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(users) //
		.passwordEncoder(new BCryptPasswordEncoder());
		
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		web //
		.ignoring() //
		.antMatchers("/public/**","/resources/**", "/javax.faces.resource/**", "/rest/**");
	}

}