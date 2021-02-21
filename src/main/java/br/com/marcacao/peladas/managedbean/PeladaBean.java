package br.com.marcacao.peladas.managedbean;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.faces.view.ViewScoped;
import javax.inject.Named;

import org.springframework.beans.factory.annotation.Autowired;

import br.com.marcacao.peladas.entity.Pelada;
import br.com.marcacao.peladas.entity.UsuarioPelada;
import br.com.marcacao.peladas.service.PeladaService;
import br.com.marcacao.peladas.service.UsuarioPeladaService;
import br.com.marcacao.peladas.util.FacesMessageSeverity;
import br.com.marcacao.peladas.util.FacesUtils;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Named
@ViewScoped
public class PeladaBean extends AbstractBean implements Serializable  {

	private static final long serialVersionUID = 1L;

	@Autowired
	private PeladaService service;
	
	@Autowired
	private UsuarioPeladaService usuarioPeladaService;
	
	private Pelada item;
	
	private LocalDateTime dataInicio;
	
	private LocalDateTime dataFim;	
	
	private List<Pelada> items;
	
	private List<Pelada> peladasSelecionadas;
	
	private boolean flagEdit; 
	
	
	@PostConstruct
	private void postConstruct() {

		Optional<String> id = Optional.ofNullable(extractParamsUrl("id"));
		
		if (id.isPresent()) {
			this.flagEdit = true;
			this.item = service.findOne(Long.valueOf(id.get()));
		} else {
			limparFiltro();
		}
		
	}
	
	public void limparFiltro() {
		this.item = new Pelada();
		this.dataFim = null;
		this.dataInicio = null;
		this.filtrar();
	}
	
	
	public boolean isParticipante(List<UsuarioPelada> usuariosPelada) {
		if(usuariosPelada == null )
			return false;
		
		List<UsuarioPelada> isParticipante = usuariosPelada.stream().filter(up -> up.getUsuario().getId() == getUsuario().getId()).collect(Collectors.toList());
				
		return !isParticipante.isEmpty();		
	}
	
	public void vincularUsuario() {
		for (Pelada p : peladasSelecionadas) {
			UsuarioPelada up = new UsuarioPelada(p, getUsuario(), true, false);
			
			p.getUsuarios().add(up);			
		}
		
		service.save(peladasSelecionadas);
	}
	
	public void filtrar() {
		
		if(dataInicio!=null && dataFim == null)
			dataFim = LocalDateTime.now();
		
		if(dataInicio!=null && dataInicio.isAfter(dataFim)) {
			FacesUtils.addGlobalMessage(FacesMessageSeverity.ERROR, "Data de inicio deve ser anterior  a final");
		} else {
			items = service.filtrar(item, dataInicio, dataFim);
		}
	}
	


}