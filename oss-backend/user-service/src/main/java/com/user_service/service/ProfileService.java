package com.user_service.service;

import com.user_service.model.Address;
import com.user_service.model.PaymentMethod;
import com.user_service.model.Profile;
import com.user_service.model.WishlistItem;
import com.user_service.repository.AddressRepository;
import com.user_service.repository.PaymentMethodRepository;
import com.user_service.repository.ProfileRepository;
import com.user_service.repository.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {

    private final ProfileRepository profileRepo;
    private final AddressRepository addrRepo;
    private final PaymentMethodRepository payRepo;
    private final WishlistRepository wishRepo;

    public ProfileService(ProfileRepository profileRepo, AddressRepository addrRepo, PaymentMethodRepository payRepo, WishlistRepository wishRepo) {
        this.profileRepo = profileRepo;
        this.addrRepo = addrRepo;
        this.payRepo = payRepo;
        this.wishRepo = wishRepo;
    }
        public Profile upsertProfile(Long userId, String fullName, String avatarUrl){
            Profile p = profileRepo.findByUserId(userId).orElseGet(Profile::new);
            p.setUserId(userId); p.setFullName(fullName);
            p.setAvatarUrl(avatarUrl);
            return profileRepo.save(p);
        }
        public List<Address> addresses(Long userId){
            return addrRepo.findByUserId(userId);
        }
        public Address addAddress(Long userId, Address a){ 
            System.out.println("ProfileService.addAddress called with userId: " + userId + ", address: " + a);
            a.setUserId(userId); 
            
            // Validate required fields
            if (a.getLine1() == null || a.getLine1().trim().isEmpty()) {
                throw new IllegalArgumentException("Address line1 is required");
            }
            if (a.getCity() == null || a.getCity().trim().isEmpty()) {
                throw new IllegalArgumentException("City is required");
            }
            if (a.getState() == null || a.getState().trim().isEmpty()) {
                throw new IllegalArgumentException("State is required");
            }
            if (a.getPostalCode() == null || a.getPostalCode().trim().isEmpty()) {
                throw new IllegalArgumentException("Postal code is required");
            }
            if (a.getCountry() == null || a.getCountry().trim().isEmpty()) {
                throw new IllegalArgumentException("Country is required");
            }
            
            Address saved = addrRepo.save(a);
            System.out.println("Address saved successfully: " + saved);
            return saved;
        }
        public void deleteAddress(Long userId, Long id){ Address a = addrRepo.findByIdAndUserId(id, userId).orElseThrow(); addrRepo.delete(a); }
        public List<PaymentMethod> payments(Long userId){ return payRepo.findByUserId(userId); }
        public PaymentMethod addPayment(Long userId, String provider, String token){ PaymentMethod pm = new PaymentMethod(); pm.setUserId(userId); pm.setProvider(provider); pm.setToken(token); return payRepo.save(pm); }
        public void deletePayment(Long userId, Long id){ PaymentMethod pm = payRepo.findByIdAndUserId(id, userId).orElseThrow(); payRepo.delete(pm); }
        public List<WishlistItem> wishlist(Long userId){ return wishRepo.findByUserId(userId); }
        public WishlistItem addWishlist(Long userId, Long productId){ WishlistItem w = new WishlistItem(); w.setUserId(userId); w.setProductId(productId); return wishRepo.save(w); }
        
        public void removeWishlist(Long userId, Long productId){ 
            System.out.println("ProfileService.removeWishlist called with userId: " + userId + ", productId: " + productId);
            try {
                // Find all wishlist items for this user and product
                List<WishlistItem> items = wishRepo.findByUserId(userId);
                System.out.println("Found " + items.size() + " wishlist items for user " + userId);
                
                // Find the specific item to delete
                WishlistItem itemToDelete = null;
                for (WishlistItem item : items) {
                    System.out.println("Checking item: id=" + item.getId() + ", productId=" + item.getProductId());
                    if (item.getProductId().equals(productId)) {
                        itemToDelete = item;
                        System.out.println("Found matching item to delete: " + itemToDelete.getId());
                        break;
                    }
                }
                
                if (itemToDelete != null) {
                    System.out.println("Attempting to delete item with ID: " + itemToDelete.getId());
                    
                    // Try a different approach - use the repository's delete method with the entity
                    wishRepo.delete(itemToDelete);
                    System.out.println("Wishlist item deleted successfully using delete(entity)");
                } else {
                    System.out.println("No wishlist item found for userId: " + userId + ", productId: " + productId);
                }
            } catch (Exception e) {
                System.err.println("Error deleting wishlist item: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to delete wishlist item: " + e.getMessage(), e);
            }
        }
        
        // Simpler method to delete by wishlist item ID
        public void removeWishlistById(Long userId, Long itemId){ 
            System.out.println("ProfileService.removeWishlistById called with userId: " + userId + ", itemId: " + itemId);
            try {
                // Verify the item belongs to the user before deleting
                WishlistItem item = wishRepo.findById(itemId).orElse(null);
                if (item != null && item.getUserId().equals(userId)) {
                    wishRepo.deleteById(itemId);
                    System.out.println("Wishlist item deleted successfully by ID");
                } else {
                    System.out.println("Wishlist item not found or doesn't belong to user");
                    throw new RuntimeException("Wishlist item not found or access denied");
                }
            } catch (Exception e) {
                System.err.println("Error deleting wishlist item by ID: " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Failed to delete wishlist item by ID", e);
            }
        }
    }


