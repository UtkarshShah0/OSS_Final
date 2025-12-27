package com.oss.productcatalog.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "product_images")
@Data
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imageData;

    @Column(name = "content_type")
    private String contentType;

    @Column(name = "image_url")
    private String imageUrl;

    private String altText;

    private Integer sortOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
    
    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getImageUrl() {
        return this.imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    
    public String getContentType() {
        return this.contentType;
    }

    public byte[] getImageData() {
        return this.imageData;
    }

    public Long getId() {
        return this.id;
    }
}
