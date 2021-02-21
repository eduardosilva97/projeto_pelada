package br.com.marcacao.peladas.repository.custom;

import java.time.LocalDateTime;
import java.util.List;

import br.com.marcacao.peladas.entity.UsuarioPelada;

public interface UsuarioPeladaRepositoryCustom {
	List<UsuarioPelada> filtrar(UsuarioPelada item, LocalDateTime dataInicio, LocalDateTime dataFim);
}
