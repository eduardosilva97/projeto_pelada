package br.com.marcacao.peladas.repository.custom;

import java.time.LocalDateTime;
import java.util.List;

import br.com.marcacao.peladas.entity.Pelada;

public interface PeladaRepositoryCustom {
	List<Pelada> filtrar(Pelada item, LocalDateTime dataInicio, LocalDateTime dataFim);
}
