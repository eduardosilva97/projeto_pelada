package br.com.marcacao.peladas.repository.implementation;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Service;

import br.com.marcacao.peladas.entity.Usuario;
import br.com.marcacao.peladas.repository.custom.UsuarioRepositoryCustom;

@Service
public class UsuarioRepositoryImpl implements UsuarioRepositoryCustom {
		
	@PersistenceContext
	EntityManager em;
	
	@SuppressWarnings("unchecked")
	public List<Usuario> findAll() {
		List<Usuario> usuarios = new ArrayList<>();
		Query query = null;
		StringBuilder sb = new StringBuilder();

		sb.append("SELECT usuario FROM Usuario usuario ")
				.append(" order by usuario.nome DESC ");

		query = em.createQuery(sb.toString());

		usuarios = query.getResultList();

		return usuarios;
	}

	public Usuario findByEmail(String email) {
		Usuario usuario = new Usuario();
		Query query = null;
		StringBuilder sb = new StringBuilder();

		sb.append("SELECT usuario FROM Usuario usuario ")
				.append(" where usuario.email = :email ");
				
		query = em.createQuery(sb.toString());
		
		query.setParameter("email", email);

		usuario = (Usuario) query.getSingleResult();

		return usuario;
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<Usuario> findAllByPelada(Long pelada){
		List<Usuario> usuarios = new ArrayList<>();
		Query query = null;
		StringBuilder sb = new StringBuilder();
		
		sb.append("SELECT DISTINCT usuario FROM Usuario usuario ")
		.append(" LEFT JOIN FETCH usuario.usuarioPeladas peladas")
		.append(" WHERE peladas.pelada.id=:id ");	
		
		query = em.createQuery(sb.toString());	

		query.setParameter("id", pelada);

		usuarios = query.getResultList();
		
		return usuarios;
	}
}