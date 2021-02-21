package br.com.marcacao.peladas.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * The persistent class for the nt_arquivo database table.
 * 
 */
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@Entity
@Table(name = "pelada", schema = "public")
public class Pelada {

	@Id	
	@SequenceGenerator(name = "PELADA_ID_GENERATOR", sequenceName = "SEQ_ID_PELADA", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PELADA_ID_GENERATOR")
	@Column(name = "id_pelada")
	private Long id;
	
	@Column(name = "ds_nome")
	private String nome;	
	
	@Column(name = "dt_hora")
	private LocalDateTime data;
	
	@Column(name = "ds_local")
	private String local;	
	
	@Column(name = "dt_cadastro")
	private LocalDateTime dataCadastro;
	
	@Column(name = "dt_atualizacao")
	private LocalDateTime dataAtualizacao;	
	
	@OneToMany(mappedBy = "pelada", fetch=FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
	private List<UsuarioPelada> usuarios = new ArrayList<>();	

}