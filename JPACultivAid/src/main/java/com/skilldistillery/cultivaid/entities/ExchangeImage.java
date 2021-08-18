package com.skilldistillery.cultivaid.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table (name="exchange_image")
public class ExchangeImage {
	
//////////////////////////FIELDS //////////////////////////////
	
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column (name="image_url")
	private String imageUrl;
	
	
//////////////////////////CONSTRUCTORS //////////////////////////////

	public ExchangeImage() {
		super();
	}
	
	
//////////////////////////GETTERS SETTERS //////////////////////////////

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	
//////////////////////////TO STRING //////////////////////////////

	@Override
	public String toString() {
		return "ExchangeImage [id=" + id + ", imageUrl=" + imageUrl + "]";
	}

	
//////////////////////////HASHCODE EQUALS //////////////////////////////

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + id;
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ExchangeImage other = (ExchangeImage) obj;
		if (id != other.id)
			return false;
		return true;
	}
	
	

}