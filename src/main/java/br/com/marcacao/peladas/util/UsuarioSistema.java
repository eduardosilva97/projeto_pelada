package br.com.marcacao.peladas.util;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class UsuarioSistema extends User{

	private static final long serialVersionUID = 1L;

	private String username;
	
	public UsuarioSistema(String username, String password,Collection<? extends GrantedAuthority> authorities) {
		super(username, password, authorities);
		this.username = username;
	}

	public String getUsername() {
		return username;
	}
	
}
