package br.com.marcacao.peladas.repository.implementation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Service;

import br.com.marcacao.peladas.entity.UsuarioPelada;
import br.com.marcacao.peladas.repository.custom.UsuarioPeladaRepositoryCustom;

@Service
public class UsuarioPeladaRepositoryImpl implements UsuarioPeladaRepositoryCustom {
		
	@PersistenceContext
	EntityManager em;
	
	@SuppressWarnings("unchecked")
	public List<UsuarioPelada> filtrar(UsuarioPelada item, LocalDateTime dataInicio, LocalDateTime dataFim) {

		List<UsuarioPelada> peladas = new ArrayList<>();
		
		if(item.getUsuario() != null) {
					
			Query query = null;
			StringBuilder sb = new StringBuilder();
	
			sb.append("SELECT usuarioPelada FROM UsuarioPelada usuarioPelada "
					+ " LEFT JOIN FETCH usuarioPelada.pelada pelada "
					+ " LEFT JOIN FETCH usuarioPelada.usuario usuario ");
	
			sb.append(" WHERE usuario.id=:id ");
			
			if (item.getPelada().getNome() != null) {
				sb.append(" and pelada.nome = :nome ");
			}
			
			if (item.getPelada().getLocal() != null) {
				sb.append(" and pelada.local like :local ");
			}		
	
			if (dataInicio != null) {
				sb.append(" and pelada.data between :dataInicio and :dataFim");
			}
			
			query = em.createQuery(sb.toString());
	
			if (item.getPelada().getNome() != null) {
				query.setParameter("nome", item.getPelada().getNome());
			}
						
			if (dataInicio != null) {
				query.setParameter("dataInicio", dataInicio);
			}
		
			if (dataFim != null) {
				query.setParameter("dataFim", dataFim);
			} 
			
	
			if (item.getPelada().getLocal() != null)  {
				query.setParameter("local", "%" + item.getPelada().getLocal() + "%");
			}		
	
			query.setParameter("id", item.getUsuario().getId());
	
			peladas = query.getResultList();
		}
		
		return peladas;
		
	}

}