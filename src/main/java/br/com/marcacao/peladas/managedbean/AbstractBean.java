package br.com.marcacao.peladas.managedbean;

import java.io.Serializable;
import java.util.Map;
import java.util.Optional;

import javax.faces.context.ExternalContext;
import javax.faces.context.FacesContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.context.support.SpringBeanAutowiringSupport;

import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.service.UsuarioService;
import br.com.marcacao.peladas.util.GetUsuarioAtivo;

public class AbstractBean extends SpringBeanAutowiringSupport implements Serializable {

	private static final long serialVersionUID = 1L;

	@Autowired
	private UsuarioService usuarioService;
	
	private Usuario usuario;

	private String caminho;

	public UsuarioService getUsuarioService() {
		return usuarioService;
	}

	public void setUsuarioService(UsuarioService usuarioService) {
		this.usuarioService = usuarioService;
	}

	public Usuario getUsuario() {
		if(usuario == null)
			usuario = new GetUsuarioAtivo().getCurrentUser();
		return usuario ;
	}
	
	public String extractParamsUrl(String any) {
		FacesContext fc = FacesContext.getCurrentInstance();
		ExternalContext ec = fc.getExternalContext();
		Map<String, String> rp = ec.getRequestParameterMap();

		Optional<String> optional = Optional.ofNullable(rp.get(any));

		return optional.map(opt -> {
			return opt;

		}).orElse(null);

	}

	public String getCaminho() {

		// Desenvolvimento
//		caminho = "C://temp//";

//		Homologação
//		caminho = "/opt/arquivos/";

//		Produção
		 caminho = "/var/www/html/files/";

		return caminho;
	}

	public void setCaminho(String caminho) {
		this.caminho = caminho;
	}

}