package br.com.marcacao.peladas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import br.com.marcacao.peladas.entity.Pelada;
import br.com.marcacao.peladas.repository.PeladaRepository;

@Service
public class PeladaService extends AbstractService<Pelada, Long> {

	@Autowired
	private PeladaRepository repo;


	@Override
	protected JpaRepository<Pelada, Long> getRepository() {
		return repo;
	}


	public Pelada findOne(Long id) {
		// TODO Auto-generated method stub
		return repo.findOne(id);
	}


	public List<Pelada> filtrar(Pelada item, LocalDateTime dataInicio, LocalDateTime dataFim) {
		return repo.filtrar(item, dataInicio, dataFim);
	}
	
}