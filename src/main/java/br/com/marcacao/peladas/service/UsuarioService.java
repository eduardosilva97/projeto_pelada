package br.com.marcacao.peladas.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import br.com.marcacao.peladas.entity.Pelada;
import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.repository.UsuarioRepository;

@Service
public class UsuarioService extends AbstractService<Usuario, Long> {

	@Autowired
	private UsuarioRepository repo;

	public Usuario findByEmail(String email) {
		return repo.findByEmail(email);
	}

	@Override
	protected JpaRepository<Usuario, Long> getRepository() {
		return repo;
	}

	public List<Usuario> findAllByPelada(Long id) {
		// TODO Auto-generated method stub
		return repo.findAllByPelada(id);
	}
}