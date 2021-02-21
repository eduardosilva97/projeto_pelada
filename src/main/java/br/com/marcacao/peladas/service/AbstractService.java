package br.com.marcacao.peladas.service;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
@SuppressWarnings("hiding")
public abstract class AbstractService<T, Long extends Serializable> {


	protected abstract JpaRepository<T, Long> getRepository();

	public T findOne(Long id) {
		return getRepository().findOne(id);
	}

	public T save(T entity) {
		entity = getRepository().save(entity);

		return entity;
	}

	public List<T> save(List<T> entity) {
		return getRepository().save(entity);
	}

	public void delete(Long id) {
		getRepository().delete(id);
	}

	public List<T> findAll() {
		return getRepository().findAll();
	}

	public void deleteAll(List<T> iterator) {

		getRepository().delete(iterator);
	}
}
