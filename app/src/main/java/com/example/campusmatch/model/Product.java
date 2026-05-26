package com.example.campusmatch.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 商品数据模型
 */
public class Product implements Serializable {
    private String id;
    private String title;
    private String category;
    private double originalPrice;
    private double currentPrice;
    private String condition;          // 全新/九成新/八成新/七成新/五成新及以下
    private String usageDuration;      // 使用时长
    private String location;           // 位置（如北区宿舍）
    private String locationDetail;     // 详细位置
    private List<String> tags;         // 卖点标签
    private List<Integer> imageResIds; // 图片资源ID（Demo用本地资源）
    private String imageEmoji;         // emoji占位图
    private Seller seller;
    private int viewCount;
    private int inquiryCount;
    private int favoriteCount;
    private String status;             // 在售/已售/下架
    private boolean isUrgent;          // 是否急售
    private boolean isRecommended;     // 是否推荐

    // AI匹配相关
    private int aiMatchScore;
    private double aiPriceMin;
    private double aiPriceMax;
    private String aiPriceEvaluation;  // 偏低/合理/偏高
    private List<MatchReason> aiMatchReasons;

    public Product() {
        this.tags = new ArrayList<>();
        this.imageResIds = new ArrayList<>();
        this.aiMatchReasons = new ArrayList<>();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getOriginalPrice() { return originalPrice; }
    public void setOriginalPrice(double originalPrice) { this.originalPrice = originalPrice; }

    public double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(double currentPrice) { this.currentPrice = currentPrice; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getUsageDuration() { return usageDuration; }
    public void setUsageDuration(String usageDuration) { this.usageDuration = usageDuration; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getLocationDetail() { return locationDetail; }
    public void setLocationDetail(String locationDetail) { this.locationDetail = locationDetail; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public List<Integer> getImageResIds() { return imageResIds; }
    public void setImageResIds(List<Integer> imageResIds) { this.imageResIds = imageResIds; }

    public String getImageEmoji() { return imageEmoji; }
    public void setImageEmoji(String imageEmoji) { this.imageEmoji = imageEmoji; }

    public Seller getSeller() { return seller; }
    public void setSeller(Seller seller) { this.seller = seller; }

    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }

    public int getInquiryCount() { return inquiryCount; }
    public void setInquiryCount(int inquiryCount) { this.inquiryCount = inquiryCount; }

    public int getFavoriteCount() { return favoriteCount; }
    public void setFavoriteCount(int favoriteCount) { this.favoriteCount = favoriteCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isUrgent() { return isUrgent; }
    public void setUrgent(boolean urgent) { isUrgent = urgent; }

    public boolean isRecommended() { return isRecommended; }
    public void setRecommended(boolean recommended) { isRecommended = recommended; }

    public int getAiMatchScore() { return aiMatchScore; }
    public void setAiMatchScore(int aiMatchScore) { this.aiMatchScore = aiMatchScore; }

    public double getAiPriceMin() { return aiPriceMin; }
    public void setAiPriceMin(double aiPriceMin) { this.aiPriceMin = aiPriceMin; }

    public double getAiPriceMax() { return aiPriceMax; }
    public void setAiPriceMax(double aiPriceMax) { this.aiPriceMax = aiPriceMax; }

    public String getAiPriceEvaluation() { return aiPriceEvaluation; }
    public void setAiPriceEvaluation(String aiPriceEvaluation) { this.aiPriceEvaluation = aiPriceEvaluation; }

    public List<MatchReason> getAiMatchReasons() { return aiMatchReasons; }
    public void setAiMatchReasons(List<MatchReason> aiMatchReasons) { this.aiMatchReasons = aiMatchReasons; }

    /**
     * 节省金额
     */
    public double getSavedAmount() {
        return originalPrice - currentPrice;
    }

    /**
     * AI匹配原因
     */
    public static class MatchReason implements Serializable {
        private String type;    // price/location/condition/seller
        private String text;
        private boolean matched;

        public MatchReason(String type, String text, boolean matched) {
            this.type = type;
            this.text = text;
            this.matched = matched;
        }

        public String getType() { return type; }
        public String getText() { return text; }
        public boolean isMatched() { return matched; }
    }

    /**
     * 卖家信息
     */
    public static class Seller implements Serializable {
        private String nickname;
        private double rating;
        private String avatarEmoji;
        private int salesCount;
        private int publishCount;

        public Seller(String nickname, double rating, String avatarEmoji, int salesCount, int publishCount) {
            this.nickname = nickname;
            this.rating = rating;
            this.avatarEmoji = avatarEmoji;
            this.salesCount = salesCount;
            this.publishCount = publishCount;
        }

        public String getNickname() { return nickname; }
        public double getRating() { return rating; }
        public String getAvatarEmoji() { return avatarEmoji; }
        public int getSalesCount() { return salesCount; }
        public int getPublishCount() { return publishCount; }
    }
}