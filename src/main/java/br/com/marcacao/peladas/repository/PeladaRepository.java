package br.com.marcacao.peladas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.marcacao.peladas.entity.Pelada;
import br.com.marcacao.peladas.repository.custom.PeladaRepositoryCustom;


@Repository
public interface PeladaRepository extends JpaRepository<Pelada, Long>, PeladaRepositoryCustom{
	
}

