package br.com.marcacao.peladas.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

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
@Table(name = "usuario", schema = "public")
public class Usuario implements UserDetails {
	
	private static final long serialVersionUID = 1L;

	@Id	
	@SequenceGenerator(name = "USUARIO_ID_GENERATOR", sequenceName = "SEQ_ID_USUARIO", allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "USUARIO_ID_GENERATOR")
	@Column(name = "id_usuario")
	private Long id;

	@Column(name = "ds_email", unique = true)
	private String email;
	
	@Column(name = "ds_senha")
	private String senha;
	
	@Column(name = "ds_nome")
	private String nome;
	
	@Column(name = "ds_apelido")
	private String apelido;
	
	@Column(name = "dt_cadastro")
	private LocalDateTime dataCadastro;
	
	@Column(name = "dt_atualizacao")
	private LocalDateTime dataAtualizacao;
	
	@OneToMany(mappedBy = "usuario", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
	private List<UsuarioPelada> usuarioPeladas = new ArrayList<>();	
	
	@Override
	public String getPassword() {
		return senha;
	}

	
	@Override
	public String getUsername() {
		return email;
	}

	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public boolean isAccountNonLocked() {
		// TODO Auto-generated method stub
		return false;
	}

	
	@Override
	public boolean isCredentialsNonExpired() {
		// TODO Auto-generated method stub
		return false;
	}

	
	@Override
	public boolean isEnabled() {
		// TODO Auto-generated method stub
		return false;
	}

}