package com.oss.productcatalog.controller;

import java.io.IOException;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.oss.productcatalog.dto.ProductRequest;
import com.oss.productcatalog.dto.ProductResponse;
import com.oss.productcatalog.model.Product;
import com.oss.productcatalog.model.ProductImage;
import com.oss.productcatalog.repository.ProductImageRepository;
import com.oss.productcatalog.repository.ProductRepository;
import com.oss.productcatalog.service.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {

	private final ProductService productService;
	private final ProductImageRepository imageRepository;
	private final ProductRepository productRepository;

	public ProductController(ProductService productService,
							 ProductImageRepository imageRepository,
							 ProductRepository productRepository) {
		this.productService = productService;
		this.imageRepository = imageRepository;
		this.productRepository = productRepository;
	}

	@PostMapping
	public ResponseEntity<ProductResponse> createProduct(@RequestBody @Valid ProductRequest request) {
		return ResponseEntity.ok(productService.createProduct(request));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
		return ResponseEntity.ok(productService.getProductById(id));
	}

	@GetMapping
	public ResponseEntity<List<ProductResponse>> getAllProducts() {
		return ResponseEntity.ok(productService.getAllProducts());
	}

	@PostMapping("/{id}/image")
	public ResponseEntity<String> uploadImage(@PathVariable Long id, @RequestParam MultipartFile file)
			throws IOException {

		Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

		ProductImage image = new ProductImage();
		image.setImageData(file.getBytes());
		image.setContentType(file.getContentType());
		image.setProduct(product);

		imageRepository.save(image);

		return ResponseEntity.ok("Image uploaded successfully");
	}

	@GetMapping("/image/{imageId}")
	public ResponseEntity<byte[]> getImage(@PathVariable Long imageId) {

		ProductImage image = imageRepository.findById(imageId)
				.orElseThrow(() -> new RuntimeException("Image not found"));

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_TYPE, image.getContentType()).body(image.getImageData());
	}
}
