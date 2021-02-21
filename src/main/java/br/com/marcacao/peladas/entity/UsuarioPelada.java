package br.com.marcacao.peladas.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
@Table(name = "usuario_pelada", schema = "public")
public class UsuarioPelada {

	@Id
	@Column(name = "id_usuario_pelada")
	@SequenceGenerator(name = "USUARIO_PELADA_ID_GENERATOR", sequenceName = "SEQ_ID_USUARIO_PELADA", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USUARIO_PELADA_ID_GENERATOR")
	private Long id;

	@ManyToOne
	@JoinColumn(name = "id_pelada")
	private Pelada pelada;

	@ManyToOne
	@JoinColumn(name = "id_usuario")
	private Usuario usuario;

	@Column(name = "is_confirmacao_convite")
	private Boolean confirmacaoConvite;
	

	@Column(name = "is_criador")
	private Boolean isCriador;
	

	public UsuarioPelada(Pelada pelada, Usuario usuario, Boolean confirmacaoConvite, Boolean isCriador) {
		this.pelada = pelada;
		this.usuario = usuario;
		this.confirmacaoConvite = confirmacaoConvite;
		this.isCriador = isCriador;
	}


	public UsuarioPelada(Pelada pelada, Usuario usuario) {
		this.pelada = pelada;
		this.usuario = usuario;
	}

}