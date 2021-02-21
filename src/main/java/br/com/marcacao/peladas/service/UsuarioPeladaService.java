package br.com.marcacao.peladas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import br.com.marcacao.peladas.entity.UsuarioPelada;
import br.com.marcacao.peladas.repository.UsuarioPeladaRepository;

@Service
public class UsuarioPeladaService extends AbstractService<UsuarioPelada, Long> {

	@Autowired
	private UsuarioPeladaRepository repo;


	@Override
	protected JpaRepository<UsuarioPelada, Long> getRepository() {
		return repo;
	}
	
	public List<UsuarioPelada> filtrar(UsuarioPelada item, LocalDateTime dataInicio, LocalDateTime dataFim){
		return repo.filtrar(item, dataInicio, dataFim);
	}

}