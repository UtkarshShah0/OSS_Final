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
        public Address addAddress(Long userId, Address a){ a.setUserId(userId); return addrRepo.save(a); }
        public void deleteAddress(Long userId, Long id){ Address a = addrRepo.findByIdAndUserId(id, userId).orElseThrow(); addrRepo.delete(a); }
        public List<PaymentMethod> payments(Long userId){ return payRepo.findByUserId(userId); }
        public PaymentMethod addPayment(Long userId, String provider, String token){ PaymentMethod pm = new PaymentMethod(); pm.setUserId(userId); pm.setProvider(provider); pm.setToken(token); return payRepo.save(pm); }
        public List<WishlistItem> wishlist(Long userId){ return wishRepo.findByUserId(userId); }
        public WishlistItem addWishlist(Long userId, Long productId){ WishlistItem w = new WishlistItem(); w.setUserId(userId); w.setProductId(productId); return wishRepo.save(w); }
        public void removeWishlist(Long userId, Long productId){ wishRepo.deleteByUserIdAndProductId(userId, productId); }
    }


