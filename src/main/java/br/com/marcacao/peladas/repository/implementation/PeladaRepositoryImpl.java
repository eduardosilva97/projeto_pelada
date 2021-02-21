package br.com.marcacao.peladas.repository.implementation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Service;

import br.com.marcacao.peladas.entity.Pelada;
import br.com.marcacao.peladas.repository.custom.PeladaRepositoryCustom;

@Service
public class PeladaRepositoryImpl implements PeladaRepositoryCustom {
		
	@PersistenceContext
	EntityManager em;
	
	@SuppressWarnings("unchecked")
	public List<Pelada> filtrar(Pelada item, LocalDateTime dataInicio, LocalDateTime dataFim) {

		Set<Pelada> peladas = new HashSet<>();
		
					
			Query query = null;
			StringBuilder sb = new StringBuilder();
	
			sb.append("SELECT pelada FROM Pelada pelada "
					+ " LEFT JOIN FETCH pelada.usuarios usuarioPelada  WHERE 1=1 ");	
			
			if (item.getNome() != null) {
				sb.append(" and pelada.nome = :nome ");
			}
		
			
			if (item.getLocal() != null) {
				sb.append(" and pelada.local like :local ");
			}		
	
			
			if (item.getData() != null) {
				sb.append(" and pelada.data between :dataInicio and :dataFim");
			}
			
			query = em.createQuery(sb.toString());
	
			
			if (item.getNome() != null) {
				query.setParameter("nome", item.getNome());
			}
			
				
			if (dataInicio != null) {
				query.setParameter("dataInicio", dataInicio);
			}
		
			if (dataFim != null) {
				query.setParameter("dataFim", dataFim);
			} 
			
	
			if (item.getLocal() != null)  {
				query.setParameter("local", "%" + item.getLocal() + "%");
			}		
	
	
			peladas = new HashSet<Pelada> (query.getResultList());
			
		return new ArrayList<Pelada>(peladas);
		
	}


}