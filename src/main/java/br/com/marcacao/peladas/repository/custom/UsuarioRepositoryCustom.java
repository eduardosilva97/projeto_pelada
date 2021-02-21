package br.com.marcacao.peladas.repository.custom;

import java.util.List;

import org.springframework.stereotype.Repository;

import br.com.marcacao.peladas.entity.Usuario;


@Repository
public interface UsuarioRepositoryCustom {
	
	Usuario findByEmail(String email);
	
	List<Usuario> findAllByPelada(Long id);
}
