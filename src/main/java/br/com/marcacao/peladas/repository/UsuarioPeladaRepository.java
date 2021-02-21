package br.com.marcacao.peladas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.marcacao.peladas.entity.UsuarioPelada;
import br.com.marcacao.peladas.repository.custom.UsuarioPeladaRepositoryCustom;


@Repository
public interface UsuarioPeladaRepository extends JpaRepository<UsuarioPelada, Long>, UsuarioPeladaRepositoryCustom{
	
}

