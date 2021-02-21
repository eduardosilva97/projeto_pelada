package br.com.marcacao.peladas.util;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.service.UsuarioService;

public class GetUsuarioAtivo extends SpringBeanAutowiringSupport {
	
	Usuario u = new Usuario();
	
	@Autowired
	private UsuarioService usuarioService;
	
	public Usuario getCurrentUser() {
		FacesContext fc = FacesContext.getCurrentInstance();
		ExternalContext externalContext = fc.getExternalContext();
		if (externalContext.getUserPrincipal() == null) {
			return new Usuario();

		} else {
			String login = externalContext.getUserPrincipal().getName();
			u = usuarioService.findByEmail(login);
		}
		return u;
	}
	
}
