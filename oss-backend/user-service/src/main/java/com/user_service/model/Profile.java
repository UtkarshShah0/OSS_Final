package com.user_service.model;

import jakarta.persistence.*;

@Entity
@Table(name="profiles")
public class Profile {

        @Id
        @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
        @Column(nullable=false) private Long userId;
        private String fullName; private String avatarUrl;

        public Profile() {}

        public Profile(Long id, Long userId, String fullName, String avatarUrl) {
            this.id = id;
            this.userId = userId;
            this.fullName = fullName;
            this.avatarUrl = avatarUrl;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

}
