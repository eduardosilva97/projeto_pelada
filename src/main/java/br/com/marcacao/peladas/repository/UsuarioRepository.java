package br.com.marcacao.peladas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.repository.custom.UsuarioRepositoryCustom;


@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long>, UsuarioRepositoryCustom{
	
}
