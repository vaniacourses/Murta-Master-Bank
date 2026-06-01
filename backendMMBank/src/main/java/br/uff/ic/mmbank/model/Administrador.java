package br.uff.ic.mmbank.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity
@Table(name = "admin")
public class Administrador extends Usuario{
}
