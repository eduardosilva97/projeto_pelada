package br.com.marcacao.peladas.managedbean;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.faces.event.ActionEvent;
import javax.faces.view.ViewScoped;
import javax.inject.Named;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.service.UsuarioService;
import br.com.marcacao.peladas.util.FacesMessageSeverity;
import br.com.marcacao.peladas.util.FacesUtils;
import br.com.marcacao.peladas.util.Validador;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Named
@ViewScoped
public class UsuarioBean extends AbstractBean implements Serializable  {

	private static final long serialVersionUID = 1L;

	@Autowired
	private UsuarioService service;

	private BCryptPasswordEncoder pe;

	// Entity Handlers
	private List<Usuario> items;

	private Usuario item;

	private LocalDateTime dataAtual;

	// Flag utilizada para diferenciar modo de visualizaÃ§Ã£o do modo de ediÃ§Ã£o
	private Boolean flagView;

	// Flag utilizada para diferenciar modo de edicao do modo de cadastro
	private Boolean flagEdit;

	private Boolean ativo;
	
	private String senha;
	
	private String confirmaSenha;

	@PostConstruct
	private void postConstruct() {
		
		this.item = new Usuario();
	}

	public void cadastrar(ActionEvent event) {

		try {

			if (Validador.validarEmail(this.item.getEmail())) {	
				if (Validador.validarSenha(senha)) {
					if(this.confirmaSenha.equals(senha)) {
			
					pe = new BCryptPasswordEncoder();					
//					// Gera senha randomicamente
					//senha = RandomString.generate(12);
					// Seta a senha codificada
					this.item.setSenha(pe.encode(senha));;
					// Gera a data cadastro
					this.item.setDataCadastro(LocalDateTime.now());
			

				this.item.setDataAtualizacao(LocalDateTime.now());

				item = this.service.save(item);

				
				FacesUtils.redirect("/login.xhtml");
					} else {
						FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR,"Senhas não conferem, por favor verifique!");
					}
				} else {
					FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR,"A senha deve conter de 6 a 12 caracteres!");
				}
			} else {
				FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR,"Endereço de e-mail inválido, por favor verifique!");
			}
			
		} catch (DataIntegrityViolationException e) {			
			FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, "Já existe usuario cadastrado com este e-mail");
				
		} catch (Exception e) {
			FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, "Ocorreu um erro ao tentar se cadastrar", e.getMessage());
		}

	}


}