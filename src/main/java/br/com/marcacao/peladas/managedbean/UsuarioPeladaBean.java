package br.com.marcacao.peladas.managedbean;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.faces.event.ActionEvent;
import javax.faces.view.ViewScoped;
import javax.inject.Named;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.marcacao.peladas.entity.Pelada;
import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.entity.UsuarioPelada;
import br.com.marcacao.peladas.service.PeladaService;
import br.com.marcacao.peladas.service.UsuarioPeladaService;
import br.com.marcacao.peladas.service.UsuarioService;
import br.com.marcacao.peladas.util.FacesMessageSeverity;
import br.com.marcacao.peladas.util.FacesUtils;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Named
@ViewScoped
public class UsuarioPeladaBean extends AbstractBean implements Serializable  {

	private static final long serialVersionUID = 1L;

	@Autowired
	private PeladaService peladaService;
	
	@Autowired
	private UsuarioPeladaService service;
	
	@Autowired
	private UsuarioService usuarioService;
	
	private Pelada pelada;	

	private UsuarioPelada item;
	
	private LocalDateTime dataInicio;
	
	private LocalDateTime dataFim;	
	
	private boolean flagEdit = false;
	
	private List<UsuarioPelada> items;
	
	private List<Usuario> usuarios = new ArrayList<>();
	
	private List<Usuario> usuariosSelecionados = new ArrayList<>();
	
	@PostConstruct
	private void postConstruct() {

		Optional<String> id = Optional.ofNullable(extractParamsUrl("id"));
		usuariosSelecionados.add(getUsuario());
		
		if (id.isPresent()) {
			this.flagEdit = true;
			this.pelada = peladaService.findOne(Long.valueOf(id.get()));
		} else {
			limparFiltro();
		}
		
		this.carregaUsuarios();

		
	}
	

	public void cadastrar(ActionEvent event) {
		try {
		if(!flagEdit) {
			pelada.setDataCadastro(LocalDateTime.now());
		}
		
		pelada.setDataAtualizacao(LocalDateTime.now());
		
		
		peladaService.save(pelada);
		
		FacesUtils.addGlobalMessage(FacesMessageSeverity.INFO, "Pelada cadastrada com sucesso");
		FacesUtils.redirect("/private/minhasPeladas/listagem.xhtml");
		} catch (Exception e) {
			FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, "Houve um erro ao excluir a pelada");
		}
	}
	
	public void listar() {
		
	}
	
	public void limparFiltro() {
		this.pelada = new Pelada();
		this.dataFim = null;
		this.dataInicio = null;
		this.filtrar();
	}
	
	
	public void filtrar() {
		
		UsuarioPelada up = new UsuarioPelada(pelada, getUsuario());
		
		if(dataInicio!=null && dataFim == null)
			dataFim = LocalDateTime.now();
		
		if(dataInicio!=null && dataInicio.isAfter(dataFim)) {
			FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, "Data de inicio deve ser anterior a final");
		} else {
			items = service.filtrar(up, dataInicio, dataFim);
		}
		
	
	}
	
	public void remover(ActionEvent event) {
		try {
			
			items.remove(item);
			
			peladaService.delete(item.getPelada().getId());			
			
			FacesUtils.addGlobalMessage(FacesMessageSeverity.INFO, "Pelada excluída com sucesso");
		} catch (Exception e) {
			FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, "Houve um erro ao excluir a pelada");
		}
	}
	
	public void aceitarConvite(UsuarioPelada up) {
		up.setConfirmacaoConvite(true);
		service.save(up);
	}
	
	public void recusarConvite(UsuarioPelada up) {
		up.setConfirmacaoConvite(false);
		service.save(up);
	}
	
	
	public void adicionarUsuarios() {
		for (Usuario u : usuariosSelecionados) {
			UsuarioPelada up;
			
			up = new UsuarioPelada(pelada, u, null, false);
			
			pelada.getUsuarios().add(up);
			usuarios.removeAll(usuariosSelecionados);
		}
	}
	
	public void removeAssociacao(UsuarioPelada item) {
		try {
			pelada.getUsuarios().remove(item);
			usuarios.add(item.getUsuario());
		} catch (Exception e) {
			FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, "Houve um erro ao desassociar o usuário", e.getMessage());
		}
	}
	
	public void carregaUsuarios() {// Comparator para ornder por nome
		if (getUsuario().getId() != null) {
			Comparator<Usuario> porNome = (u1, u2) -> u1.getNome().compareTo(u2.getNome());

			usuarios = usuarioService.findAll().stream().sorted(porNome).collect(Collectors.toList());
			
			if(!flagEdit)
				this.adicionaCriador();
			
			if (pelada.getUsuarios().size() != 0) {				
				List<Usuario> usuariosSelecionados = usuarioService.findAllByPelada(pelada.getId()).stream()
						.sorted(porNome).collect(Collectors.toList());
				
				usuarios.removeAll(usuariosSelecionados);
			}
		}
	}
	
	public void adicionaCriador() {		
		UsuarioPelada up = new UsuarioPelada(pelada, getUsuario(), true, true);
		
		pelada.getUsuarios().add(up);
		
		usuarios.remove(this.getUsuario());
	}


}